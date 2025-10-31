/**
 * Member Service
 *
 * Handles business logic for member-related operations including:
 * - Dashboard overview (stats, upcoming bookings, special offers)
 * - Booking history with pagination and filters
 * - Member profile management
 */

import prisma from '../config/database';
import { BookingStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../config/logger';

export interface BookingSummary {
  id: string;
  referenceNumber: string;
  serviceName: string;
  branchName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  serviceImage?: string;
}

export interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}

export interface MemberDashboardData {
  stats: DashboardStats;
  upcomingBookings: BookingSummary[];
}

export interface BookingHistoryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BookingHistoryResponse {
  data: BookingSummary[];
  meta: PaginationMeta;
}

class MemberService {
  /**
   * Get member dashboard overview
   */
  async getMemberDashboard(userId: string): Promise<MemberDashboardData> {
    try {
      // Get member info
      const member = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, fullName: true },
      });

      if (!member) {
        throw new NotFoundError('Member not found');
      }

      const now = new Date();

      // Helper: Combine date + time to get full appointment datetime
      const getAppointmentDateTime = (booking: any): Date => {
        const [hours, minutes] = booking.appointmentTime.split(':').map(Number);
        const appointmentDate = new Date(booking.appointmentDate);
        appointmentDate.setHours(hours, minutes, 0, 0);
        return appointmentDate;
      };

      // Get all bookings for this member
      const allBookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          branch: { select: { id: true, name: true } },
        },
      });

      // Calculate stats
      const totalBookings = allBookings.length;
      const upcomingBookings = allBookings.filter(
        (b) => b.status === 'CONFIRMED' && getAppointmentDateTime(b) > now
      ).length;
      const completedBookings = allBookings.filter((b) => b.status === 'COMPLETED').length;

      // Get upcoming bookings (next 5)
      const upcomingBookingsData = allBookings
        .filter((b) => b.status === 'CONFIRMED' && getAppointmentDateTime(b) > now)
        .sort((a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime())
        .slice(0, 5);

      // Fetch service details for upcoming bookings
      const upcomingBookingsSummary: BookingSummary[] = await Promise.all(
        upcomingBookingsData.map(async (booking) => {
          const services = await prisma.service.findMany({
            where: { id: { in: booking.serviceIds } },
            select: { name: true, images: true },
          });

          const result: BookingSummary = {
            id: booking.id,
            referenceNumber: booking.referenceNumber,
            serviceName: services[0]?.name || 'Service',
            branchName: booking.branch?.name || 'Branch',
            appointmentDate: booking.appointmentDate.toISOString(),
            appointmentTime: booking.appointmentTime,
            status: this.mapBookingStatus(booking.status),
          };

          if (services[0]?.images?.[0]) {
            result.serviceImage = services[0].images[0];
          }

          return result;
        })
      );

      logger.info(`Dashboard fetched for user: ${userId}`);

      return {
        stats: {
          totalBookings,
          upcomingBookings,
          completedBookings,
        },
        upcomingBookings: upcomingBookingsSummary,
      };
    } catch (error) {
      logger.error('Error fetching member dashboard:', error);
      throw error;
    }
  }

  /**
   * Get member booking history with pagination and filters
   */
  async getMemberBookings(
    userId: string,
    params: BookingHistoryParams = {}
  ): Promise<BookingHistoryResponse> {
    try {
      const { page = 1, limit = 10, status = 'all', dateFrom, dateTo } = params;

      // Validate pagination params
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      // Build where clause
      const where: any = { userId };

      if (status && status !== 'all') {
        // Map status string to database enum value
        const statusMap: Record<string, BookingStatus> = {
          confirmed: 'CONFIRMED',
          completed: 'COMPLETED',
          cancelled: 'CANCELLED',
          no_show: 'NO_SHOW',
        };
        const mappedStatus = statusMap[status.toLowerCase()];
        if (mappedStatus) {
          where.status = mappedStatus;
        }
      }

      if (dateFrom || dateTo) {
        where.appointmentDate = {};
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          where.appointmentDate.gte = fromDate;
        }
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          where.appointmentDate.lte = toDate;
        }
      }

      // Get total count
      const total = await prisma.booking.count({ where });

      // Get paginated bookings
      const bookings = await prisma.booking.findMany({
        where,
        include: {
          branch: { select: { id: true, name: true } },
        },
        orderBy: { appointmentDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Fetch service details for each booking
      const bookingSummaries: BookingSummary[] = await Promise.all(
        bookings.map(async (booking) => {
          const services = await prisma.service.findMany({
            where: { id: { in: booking.serviceIds } },
            select: { name: true, images: true },
          });

          const result: BookingSummary = {
            id: booking.id,
            referenceNumber: booking.referenceNumber,
            serviceName: services[0]?.name || 'Service',
            branchName: booking.branch?.name || 'Branch',
            appointmentDate: booking.appointmentDate.toISOString(),
            appointmentTime: booking.appointmentTime,
            status: this.mapBookingStatus(booking.status),
          };

          if (services[0]?.images?.[0]) {
            result.serviceImage = services[0].images[0];
          }

          return result;
        })
      );

      const totalPages = Math.ceil(total / limit);

      logger.info(`Booking history fetched for user: ${userId}, page: ${page}, limit: ${limit}`);

      return {
        data: bookingSummaries,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching member booking history:', error);
      throw error;
    }
  }

  /**
   * Map database booking status to API status
   */
  private mapBookingStatus(
    dbStatus: BookingStatus
  ): 'confirmed' | 'completed' | 'cancelled' | 'no_show' {
    const statusMap: Record<BookingStatus, 'confirmed' | 'completed' | 'cancelled' | 'no_show'> = {
      CONFIRMED: 'confirmed',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      NO_SHOW: 'no_show',
      PENDING: 'confirmed', // Map PENDING to confirmed for display
    };
    return statusMap[dbStatus] || 'confirmed';
  }

  /**
   * Get member profile
   */
  async getMemberProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatar: true,
          language: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('Member not found');
      }

      logger.info(`Member profile fetched for user: ${userId}`);
      return user;
    } catch (error) {
      logger.error('Error fetching member profile:', error);
      throw error;
    }
  }

  /**
   * Update member profile
   */
  async updateMemberProfile(userId: string, updateData: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(updateData.fullName && { fullName: updateData.fullName }),
          ...(updateData.phone && { phone: updateData.phone }),
          ...(updateData.avatar && { avatar: updateData.avatar }),
          ...(updateData.language && { language: updateData.language }),
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatar: true,
          language: true,
        },
      });

      logger.info(`Member profile updated for user: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error('Error updating member profile:', error);
      throw error;
    }
  }
}

export default new MemberService();
