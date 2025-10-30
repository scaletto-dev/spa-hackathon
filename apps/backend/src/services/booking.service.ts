/**
 * Booking Service
 * 
 * Handles business logic for booking operations including:
 * - Creating bookings (member and guest)
 * - Retrieving booking details
 * - Listing user bookings
 * - Cancelling bookings
 * - Generating reference numbers
 */

import prisma from '../config/database';
import { BookingStatus } from '@prisma/client';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import logger from '../config/logger';
import {
  CreateBookingRequest,
  BookingResponse,
  UpdateBookingStatusRequest,
  BookingStats,
} from '../types/booking';

class BookingService {
  /**
   * Generate unique reference number
   * Format: SPAbooking-YYYYMMDD-XXXXXX
   * Example: SPAbooking-20251030-a1b2c3
   */
  private generateReferenceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `SPAbooking-${year}${month}${day}-${randomPart}`;
  }

  /**
   * Validate appointment date and time
   */
  private validateAppointmentDateTime(date: string, time: string): void {
    try {
      const appointmentDate = new Date(date);
      const now = new Date();

      // Check if date is in the past
      if (appointmentDate < now) {
        throw new ValidationError('Appointment date must be in the future');
      }

      // Check if time is valid (HH:mm format)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        throw new ValidationError('Time must be in HH:mm format (e.g., 14:30)');
      }

      // Check if appointment is within business hours (8:00 - 18:00)
      const timeParts = time.split(':');
      const hours = parseInt(timeParts[0]!, 10);
      const minutes = parseInt(timeParts[1]!, 10);
      if (hours < 8 || hours >= 18) {
        throw new ValidationError('Appointments must be between 08:00 and 18:00');
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Invalid date or time format');
    }
  }

  /**
   * Validate services and branch exist
   */
  private async validateServicesAndBranch(
    serviceIds: string[],
    branchId: string
  ): Promise<void> {
    if (!serviceIds || serviceIds.length === 0) {
      throw new ValidationError('At least one service is required');
    }

    const [services, branch] = await Promise.all([
      prisma.service.findMany({ where: { id: { in: serviceIds } } }),
      prisma.branch.findUnique({ where: { id: branchId } }),
    ]);

    if (services.length !== serviceIds.length) {
      throw new NotFoundError('One or more services not found');
    }

    if (!branch) {
      throw new NotFoundError(`Branch not found: ${branchId}`);
    }
  }

  /**
   * Create a new booking
   * Supports both member (with userId) and guest bookings
   * Can book multiple services at once
   */
  async createBooking(
    createBookingDto: CreateBookingRequest,
    userId?: string
  ): Promise<BookingResponse> {
    try {
      const {
        serviceIds,
        branchId,
        appointmentDate,
        appointmentTime,
        notes,
        language = 'vi',
        guestName,
        guestEmail,
        guestPhone,
      } = createBookingDto;

      // Validate appointment date and time
      this.validateAppointmentDateTime(appointmentDate, appointmentTime);

      // Validate services and branch exist
      await this.validateServicesAndBranch(serviceIds, branchId);

      // For guest bookings, validate guest information
      if (!userId) {
        if (!guestName || !guestEmail || !guestPhone) {
          throw new ValidationError(
            'Guest bookings require guestName, guestEmail, and guestPhone'
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
          throw new ValidationError('Invalid email format');
        }

        // Validate phone format (basic validation - adjust as needed)
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(guestPhone)) {
          throw new ValidationError('Invalid phone format');
        }
      }

      // Generate unique reference number
      const referenceNumber = this.generateReferenceNumber();

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          referenceNumber,
          userId: userId || null,
          serviceIds,
          branchId,
          appointmentDate: new Date(appointmentDate),
          appointmentTime,
          status: 'CONFIRMED' as BookingStatus,
          guestName: guestName || null,
          guestEmail: guestEmail || null,
          guestPhone: guestPhone || null,
          notes: notes || null,
          language,
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      // Fetch service details for response
      const services = await prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: {
          id: true,
          name: true,
          duration: true,
          price: true,
        },
      });

      logger.info(`Booking created: ${referenceNumber} by ${userId || guestEmail}`);

      return this.mapBookingToResponse(booking, services);
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Get booking by reference number
   */
  async getBookingByReference(
    referenceNumber: string,
    userId?: string
  ): Promise<BookingResponse> {
    try {
      const booking = await prisma.booking.findUnique({
        where: { referenceNumber },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundError(`Booking not found: ${referenceNumber}`);
      }

      // If userId is provided, verify ownership (members can only view their own bookings)
      if (userId && booking.userId !== userId) {
        throw new ValidationError('You do not have permission to view this booking');
      }

      // Fetch service details
      const services = await prisma.service.findMany({
        where: { id: { in: booking.serviceIds } },
        select: {
          id: true,
          name: true,
          duration: true,
          price: true,
        },
      });

      return this.mapBookingToResponse(booking, services);
    } catch (error) {
      logger.error('Error retrieving booking:', error);
      throw error;
    }
  }

  /**
   * List bookings for a user
   */
  async listUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: BookingStatus
  ): Promise<{
    data: BookingResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter
      const where: any = { userId };
      if (status) {
        where.status = status;
      }

      // Get total count
      const total = await prisma.booking.count({ where });

      // Get paginated bookings
      const bookings = await prisma.booking.findMany({
        where,
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
        orderBy: { appointmentDate: 'desc' },
        skip,
        take: limit,
      });

      // Fetch all services for all bookings
      const allServiceIds = bookings.flatMap(b => b.serviceIds);
      const uniqueServiceIds = [...new Set(allServiceIds)];
      const servicesMap = new Map();
      
      if (uniqueServiceIds.length > 0) {
        const services = await prisma.service.findMany({
          where: { id: { in: uniqueServiceIds } },
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        });
        services.forEach(s => servicesMap.set(s.id, s));
      }

      const totalPages = Math.ceil(total / limit);

      return {
        data: bookings.map((b) => {
          const bookingServices = b.serviceIds
            .map(id => servicesMap.get(id))
            .filter(s => s !== undefined);
          return this.mapBookingToResponse(b, bookingServices);
        }),
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Error listing user bookings:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(
    bookingId: string,
    cancellationReason: string,
    userId?: string
  ): Promise<BookingResponse> {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundError(`Booking not found: ${bookingId}`);
      }

      // Verify ownership if userId provided
      if (userId && booking.userId !== userId) {
        throw new ValidationError('You do not have permission to cancel this booking');
      }

      // Check if booking can be cancelled
      if (booking.status === 'CANCELLED') {
        throw new ConflictError('Booking is already cancelled');
      }

      if (booking.status === 'COMPLETED') {
        throw new ConflictError('Cannot cancel a completed booking');
      }

      // Check if appointment is in the future
      if (booking.appointmentDate < new Date()) {
        throw new ConflictError('Cannot cancel past appointments');
      }

      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED' as BookingStatus,
          cancellationReason,
          updatedAt: new Date(),
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      // Fetch service details
      const services = await prisma.service.findMany({
        where: { id: { in: updatedBooking.serviceIds } },
        select: {
          id: true,
          name: true,
          duration: true,
          price: true,
        },
      });

      logger.info(`Booking cancelled: ${bookingId} - Reason: ${cancellationReason}`);

      return this.mapBookingToResponse(updatedBooking, services);
    } catch (error) {
      logger.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(startDate?: Date, endDate?: Date): Promise<BookingStats> {
    try {
      const where: any = {};

      if (startDate || endDate) {
        where.appointmentDate = {};
        if (startDate) where.appointmentDate.gte = startDate;
        if (endDate) where.appointmentDate.lte = endDate;
      }

      const [total, confirmed, cancelled, completed, noShow, pending] =
        await Promise.all([
          prisma.booking.count({ where }),
          prisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
          prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
          prisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
          prisma.booking.count({ where: { ...where, status: 'NO_SHOW' } }),
          prisma.booking.count({ where: { ...where, status: 'PENDING' } }),
        ]);

      return {
        total,
        confirmed,
        cancelled,
        completed,
        noShow,
        pending,
      };
    } catch (error) {
      logger.error('Error getting booking stats:', error);
      throw error;
    }
  }

  /**
   * Helper: Map Prisma booking to API response
   */
  private mapBookingToResponse(
    booking: any,
    services?: Array<{ id: string; name: string; duration: number; price: any }>
  ): BookingResponse {
    return {
      id: booking.id,
      referenceNumber: booking.referenceNumber,
      userId: booking.userId || undefined,
      serviceIds: booking.serviceIds,
      branchId: booking.branchId,
      appointmentDate: booking.appointmentDate.toISOString().split('T')[0],
      appointmentTime: booking.appointmentTime,
      status: booking.status as BookingStatus,
      guestName: booking.guestName || undefined,
      guestEmail: booking.guestEmail || undefined,
      guestPhone: booking.guestPhone || undefined,
      notes: booking.notes || undefined,
      language: booking.language,
      cancellationReason: booking.cancellationReason || undefined,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      services: services?.map(s => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        price: typeof s.price === 'number' ? s.price : parseFloat(s.price.toString()),
      })),
      branch: booking.branch,
    };
  }
}

export default new BookingService();
