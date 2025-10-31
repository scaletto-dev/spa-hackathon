/**
 * Payment Service
 * 
 * Handles business logic for payment operations including:
 * - Creating payments
 * - Updating payment status
 * - Getting payment details
 * - Payment reconciliation
 */

import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import logger from '../config/logger';

interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  paymentType: 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER';
  notes?: string;
}

interface UpdatePaymentStatusRequest {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  transactionId?: string;
}

/**
 * Payment Controller
 * Manages all payment-related HTTP operations
 */
export class PaymentController {
  /**
   * POST /api/v1/payments
   * Create a new payment for a booking
   */
  async createPayment(
    req: Request<{}, {}, CreatePaymentRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId, amount, paymentType, notes } = req.body;

      // Validate required fields
      if (!bookingId || !amount || !paymentType) {
        throw new ValidationError(
          'Missing required fields: bookingId, amount, paymentType'
        );
      }

      if (amount <= 0) {
        throw new ValidationError('Amount must be greater than 0');
      }

      const payment = await paymentService.createPayment({
        bookingId,
        amount,
        paymentType: paymentType as any,
        ...(notes && { notes }),
      });

      const response: SuccessResponse<any> = {
        success: true,
        data: payment,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error in createPayment:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/payments/:id
   * Get payment by ID
   */
  async getPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Payment ID is required');
      }

      const payment = await paymentService.getPaymentById(id);

      const response: SuccessResponse<any> = {
        success: true,
        data: payment,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getPayment:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/:bookingId/payments
   * Get all payments for a booking
   */
  async getPaymentsByBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        throw new ValidationError('Booking ID is required');
      }

      const payments = await paymentService.getPaymentsByBookingId(bookingId);

      const response: SuccessResponse<any> = {
        success: true,
        data: payments,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getPaymentsByBooking:', error);
      next(error);
    }
  }

  /**
   * PATCH /api/v1/payments/:id/status
   * Update payment status (for payment gateway callbacks)
   */
  async updatePaymentStatus(
    req: Request<{ id: string }, {}, UpdatePaymentStatusRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      if (!id) {
        throw new ValidationError('Payment ID is required');
      }

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const payment = await paymentService.updatePaymentStatus(id, {
        status: status as any,
        ...(transactionId && { transactionId }),
      });

      const response: SuccessResponse<any> = {
        success: true,
        data: payment,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in updatePaymentStatus:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/payments/stats
   * Get payment statistics
   */
  async getPaymentStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await paymentService.getPaymentStats();

      const response: SuccessResponse<any> = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getPaymentStats:', error);
      next(error);
    }
  }
}

export default new PaymentController();
