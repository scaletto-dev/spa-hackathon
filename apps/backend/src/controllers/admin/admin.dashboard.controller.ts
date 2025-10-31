/**
 * Admin Dashboard Controller
 *
 * Provides statistics and analytics for the admin dashboard
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";

class AdminDashboardController {
   /**
    * GET /api/v1/admin/dashboard/stats
    * Get dashboard statistics
    * Query params:
    *   - from: ISO date string (default: 7 days ago)
    *   - to: ISO date string (default: today)
    *   - period: 'today' | 'week' | 'month' | 'year' | 'custom' (default: 'week')
    */
   async getStats(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { from, to, period = 'week' } = req.query;

         const now = new Date();
         let startDate: Date;
         let endDate: Date = new Date(now);
         endDate.setHours(23, 59, 59, 999);

         // Parse date range based on period or custom dates
         if (from && to) {
            // Custom date range
            startDate = new Date(from as string);
            endDate = new Date(to as string);
            endDate.setHours(23, 59, 59, 999);
         } else {
            // Predefined periods
            switch (period) {
               case 'today':
                  startDate = new Date(
                     now.getFullYear(),
                     now.getMonth(),
                     now.getDate()
                  );
                  break;
               case 'month':
                  startDate = new Date(
                     now.getFullYear(),
                     now.getMonth(),
                     1
                  );
                  break;
               case 'year':
                  startDate = new Date(now.getFullYear(), 0, 1);
                  break;
               case 'week':
               default:
                  startDate = new Date(now);
                  startDate.setDate(now.getDate() - 7);
                  break;
            }
         }

         // Get all counts in parallel
         const [
            bookingsInPeriod,
            totalBookings,
            totalUsers,
            totalReviews,
            approvedReviews,
            pendingReviews,
         ] = await Promise.all([
            // Bookings in selected period
            prisma.booking.count({
               where: {
                  appointmentDate: { 
                     gte: startDate,
                     lte: endDate 
                  },
               },
            }),

            // Total bookings all time
            prisma.booking.count(),

            // Total active members
            prisma.user.count({
               where: { role: "MEMBER" },
            }),

            // Total reviews
            prisma.review.count(),

            // Approved reviews
            prisma.review.count({
               where: { approved: true },
            }),

            // Pending reviews
            prisma.review.count({
               where: { approved: false },
            }),
         ]);

         // Get recent bookings for chart (in selected period)
         const recentBookingsRaw = await prisma.booking.findMany({
            where: {
               appointmentDate: { 
                  gte: startDate,
                  lte: endDate 
               },
            },
            select: {
               appointmentDate: true,
            },
         });

         // Get all services for top services
         const topServicesRaw = await prisma.service.findMany({
            select: {
               id: true,
               name: true,
            },
         });

         // Calculate average rating
         const avgRatingResult = await prisma.review.aggregate({
            _avg: { rating: true },
         });
         const avgRating = avgRatingResult._avg.rating || 0;

         // Calculate revenue and top services from bookings in period
         const bookingsWithServiceIds = await prisma.booking.findMany({
            where: {
               appointmentDate: { 
                  gte: startDate,
                  lte: endDate 
               },
               status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            select: {
               appointmentDate: true,
               serviceIds: true,
            },
         });

         // Get all services to map prices
         const allServices = await prisma.service.findMany({
            select: {
               id: true,
               price: true,
               name: true,
            },
         });

         const serviceMap = new Map(
            allServices.map((s) => [s.id, { price: Number(s.price) || 0, name: s.name }])
         );

         // Calculate total revenue and service counts
         const totalRevenue = bookingsWithServiceIds.reduce((sum, booking) => {
            const bookingRevenue = (booking.serviceIds || []).reduce(
               (serviceSum, serviceId) => serviceSum + (serviceMap.get(serviceId)?.price || 0),
               0
            );
            return sum + bookingRevenue;
         }, 0);

         // Count bookings per service
         const serviceBookingCounts = new Map<string, number>();
         bookingsWithServiceIds.forEach((booking) => {
            (booking.serviceIds || []).forEach((serviceId) => {
               serviceBookingCounts.set(
                  serviceId,
                  (serviceBookingCounts.get(serviceId) || 0) + 1
               );
            });
         });

         // Format top services
         const topServices = Array.from(serviceBookingCounts.entries())
            .map(([serviceId, count]) => ({
               id: serviceId,
               name: serviceMap.get(serviceId)?.name || "Unknown Service",
               booking_count: count,
            }))
            .sort((a, b) => b.booking_count - a.booking_count)
            .slice(0, 5);

         // Calculate percentage changes
         const bookingChangePercent =
            bookingsInPeriod > 0
               ? Math.round(((bookingsInPeriod - totalBookings / 4) / (totalBookings / 4)) * 100)
               : 0;
         const bookingChange =
            bookingChangePercent > 0 ? `+${bookingChangePercent}%` : `${bookingChangePercent}%`;
         const memberChange = "+8%"; // This would need historical data
         const revenueChange = "+15%"; // This would need historical data

         // Format booking data for chart (last 7 days) - group by date
         const bookingsByDate = new Map<string, number>();
         recentBookingsRaw.forEach((booking) => {
            const date = new Date(booking.appointmentDate).toLocaleDateString("en-US", {
               weekday: "short",
            });
            bookingsByDate.set(date, (bookingsByDate.get(date) || 0) + 1);
         });

         const bookingChartData = Array.from(bookingsByDate.entries()).map(([name, count]) => ({
            name,
            bookings: count,
         }));

         // Format service data for pie chart
         const serviceChartData = topServices
            .slice(0, 5)
            .map((item: any) => ({
               name: item.name,
               value: Number(item.booking_count),
            }));

         // Revenue trend (daily revenue for last 7 days)
         const revenueTrendData = bookingsWithServiceIds.reduce(
            (acc: any[], booking) => {
               const date = new Date(booking.appointmentDate).toLocaleDateString("en-US", {
                  weekday: "short",
               });
               const bookingRevenue = (booking.serviceIds || []).reduce(
                  (sum, serviceId) => sum + (serviceMap.get(serviceId)?.price || 0),
                  0
               );

               const existingDay = acc.find((d) => d.name === date);
               if (existingDay) {
                  existingDay.revenue += bookingRevenue;
               } else {
                  acc.push({
                     name: date,
                     revenue: bookingRevenue,
                  });
               }
               return acc;
            },
            []
         );

         res.status(200).json({
            success: true,
            data: {
               metrics: {
                  totalBookingsToday: {
                     value: bookingsInPeriod,
                     change: bookingChange,
                  },
                  activeMembers: {
                     value: totalUsers,
                     change: memberChange,
                  },
                  revenue: {
                     value: `$${(totalRevenue / 1000).toFixed(1)}K`,
                     rawValue: totalRevenue,
                     change: revenueChange,
                  },
                  satisfaction: {
                     value: Math.round(avgRating * 10) / 10,
                     totalReviews,
                     approved: approvedReviews,
                     pending: pendingReviews,
                  },
               },
               charts: {
                  bookings: bookingChartData,
                  services: serviceChartData,
                  revenue: revenueTrendData,
               },
            },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AdminDashboardController();
