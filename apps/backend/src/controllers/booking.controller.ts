/**
 * Booking Controller
 * 
 * Handles HTTP requests for booking endpoints.
 * Validates input, calls service layer, and formats responses.
 */

import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/booking.service';
import emailService from '../services/email.service';
import prisma from '../config/database';
import { SuccessResponse, ErrorResponse } from '../types/api';
import { ValidationError, NotFoundError } from '../utils/errors';
import {
  CreateBookingRequest,
  BookingResponse,
  UpdateBookingStatusRequest,
  ListBookingsQueryParams,
} from '../types/booking';
import logger from '../config/logger';

/**
 * Booking Controller
 * Manages all booking-related HTTP operations
 */
export class BookingController {
  /**
   * POST /api/v1/bookings
   * Create a new booking (guest or member)
   * Now supports multiple services
   */
  async createBooking(
    req: Request<{}, {}, CreateBookingRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { serviceIds, branchId, appointmentDate, appointmentTime, notes, language, guestName, guestEmail, guestPhone } = req.body;

      // Validate required fields
      if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
        throw new ValidationError(
          'Missing required field: serviceIds (must be a non-empty array)'
        );
      }
      if (!branchId || !appointmentDate || !appointmentTime) {
        throw new ValidationError(
          'Missing required fields: branchId, appointmentDate, appointmentTime'
        );
      }

      // Extract userId from JWT token if authenticated (member booking)
      const userId = req.user?.id;

      // Create booking
      const booking = await bookingService.createBooking(
        {
          serviceIds,
          branchId,
          appointmentDate,
          appointmentTime,
          ...(notes && { notes }),
          ...(language && { language }),
          ...(guestName && { guestName }),
          ...(guestEmail && { guestEmail }),
          ...(guestPhone && { guestPhone }),
        },
        userId
      );

      const response: SuccessResponse<BookingResponse> = {
        success: true,
        data: booking,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error in createBooking:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/:referenceNumber
   * Get booking details by reference number
   */
  async getBookingByReference(
    req: Request<{ referenceNumber: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { referenceNumber } = req.params;
      const userId = req.user?.id;

      if (!referenceNumber) {
        throw new ValidationError('Reference number is required');
      }

      const booking = await bookingService.getBookingByReference(referenceNumber, userId);

      const response: SuccessResponse<BookingResponse> = {
        success: true,
        data: booking,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getBookingByReference:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings
   * List user's bookings (members only)
   */
  async listUserBookings(
    req: Request<{}, {}, {}, ListBookingsQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // This endpoint requires authentication
      if (!req.user?.id) {
        throw new ValidationError('Authentication required. Please login to view your bookings.');
      }

      const userId = req.user.id;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const status = req.query.status;

      // Validation
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await bookingService.listUserBookings(
        userId,
        page,
        limit,
        status as any
      );

      const response: SuccessResponse<BookingResponse[]> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in listUserBookings:', error);
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/cancel
   * Cancel a booking
   */
  async cancelBooking(
    req: Request<{ id: string }, {}, { cancellationReason: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;
      const userId = req.user?.id;

      if (!id) {
        throw new ValidationError('Booking ID is required');
      }

      if (!cancellationReason) {
        throw new ValidationError('Cancellation reason is required');
      }

      const booking = await bookingService.cancelBooking(id, cancellationReason, userId);

      const response: SuccessResponse<BookingResponse> = {
        success: true,
        data: booking,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in cancelBooking:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/stats
   * Get booking statistics (admin only)
   */
  async getBookingStats(
    req: Request<{}, {}, {}, { startDate?: string; endDate?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;

      // Validate dates
      if (startDate && isNaN(startDate.getTime())) {
        throw new ValidationError('Invalid startDate format');
      }
      if (endDate && isNaN(endDate.getTime())) {
        throw new ValidationError('Invalid endDate format');
      }

      const stats = await bookingService.getBookingStats(startDate, endDate);

      const response: SuccessResponse<typeof stats> = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getBookingStats:', error);
      next(error);
    }
  }

  /**
   * POST /api/v1/bookings/:bookingId/send-confirmation
   * Send booking confirmation email
   */
  async sendConfirmationEmail(
    req: Request<{ bookingId: string }, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      const { email } = req.body;

      if (!bookingId || !email) {
        throw new ValidationError('Booking ID and email are required');
      }

      // Fetch booking details from database
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

      // Fetch service details
      const services = await prisma.service.findMany({
        where: { id: { in: booking.serviceIds } },
        select: { id: true, name: true },
      });

      const serviceNames = services.map((s) => s.name);

      // Calculate total price - fetch services with pricing
      const servicesWithPrice = await prisma.service.findMany({
        where: { id: { in: booking.serviceIds } },
        select: { id: true, price: true },
      });

      const totalPrice = servicesWithPrice.reduce((sum, service) => {
        const priceValue = typeof service.price === 'number' ? service.price : service.price?.toNumber?.() || 0;
        return sum + priceValue;
      }, 0);

      // Format appointment date
      const formattedDate = new Date(booking.appointmentDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Send confirmation email
      const appointmentDateStr = new Date(booking.appointmentDate as Date).toISOString().split('T')[0] || '0000-00-00';
      await emailService.sendBookingConfirmation(
        email,
        booking.guestName || 'Quý khách',
        booking.guestPhone || '',
        booking.referenceNumber,
        appointmentDateStr,
        booking.appointmentTime,
        booking.branch.name,
        booking.branch.address,
        booking.branch.phone,
        serviceNames,
        totalPrice,
        booking.notes || undefined
      );

      logger.info(`Booking confirmation email sent to ${email} for booking ${bookingId}`);

      const response: SuccessResponse<{ message: string }> = {
        success: true,
        data: {
          message: `Confirmation email sent to ${email}`,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in sendConfirmationEmail:', error);
      next(error);
    }
  }
}

export default new BookingController();
