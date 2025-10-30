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
    */
   async getStats(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const now = new Date();
         const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
         );
         const startOfWeek = new Date(now);
         startOfWeek.setDate(now.getDate() - 7);

         // Get all counts in parallel
         const [
            totalBookingsToday,
            totalBookings,
            totalUsers,
            totalReviews,
            approvedReviews,
            pendingReviews,
            bookingsThisWeek,
            recentBookings,
            topServices,
         ] = await Promise.all([
            // Total bookings today
            prisma.booking.count({
               where: {
                  appointmentDate: { gte: startOfToday },
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

            // Bookings this week
            prisma.booking.count({
               where: {
                  createdAt: { gte: startOfWeek },
               },
            }),

            // Recent bookings for chart (last 7 days)
            prisma.$queryRaw`
          SELECT 
            DATE(appointment_date) as date,
            COUNT(*) as count
          FROM "Booking"
          WHERE appointment_date >= ${startOfWeek}
          GROUP BY DATE(appointment_date)
          ORDER BY date ASC
        `,

            // Top services by booking count
            prisma.$queryRaw`
          SELECT 
            s.id,
            s.name,
            COUNT(b.id) as booking_count
          FROM "Service" s
          LEFT JOIN "Booking" b ON b.service_ids @> ARRAY[s.id]
          GROUP BY s.id, s.name
          ORDER BY booking_count DESC
          LIMIT 4
        `,
         ]);

         // Calculate average rating
         const avgRatingResult = await prisma.review.aggregate({
            _avg: { rating: true },
         });
         const avgRating = avgRatingResult._avg.rating || 0;

         // Calculate percentage changes (mock for now, need historical data)
         const bookingChange = bookingsThisWeek > 0 ? "+12%" : "0%";
         const memberChange = "+8%";
         const revenueChange = "+15%";

         // Format booking data for chart
         const bookingChartData = (recentBookings as any[]).map(
            (item: any) => ({
               name: new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "short",
               }),
               bookings: Number(item.count),
            })
         );

         // Format service data for pie chart
         const serviceChartData = (topServices as any[]).map((item: any) => ({
            name: item.name,
            value: Number(item.booking_count),
         }));

         res.status(200).json({
            success: true,
            data: {
               metrics: {
                  totalBookingsToday: {
                     value: totalBookingsToday,
                     change: bookingChange,
                  },
                  activeMembers: {
                     value: totalUsers,
                     change: memberChange,
                  },
                  revenue: {
                     value: "$12,450", // TODO: Calculate from actual bookings
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
