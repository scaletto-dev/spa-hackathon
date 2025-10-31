/**
 * Payment Service
 * 
 * Handles business logic for payment operations including:
 * - Creating payments
 * - Updating payment status
 * - Getting payment details
 * - Payment reconciliation
 */

import prisma from '../config/database';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../config/logger';

interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  paymentType: PaymentType;
  notes?: string;
}

interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
  transactionId?: string;
}

interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(
    createPaymentDto: CreatePaymentRequest
  ): Promise<PaymentResponse> {
    try {
      const { bookingId, amount, paymentType, notes } = createPaymentDto;

      // Validate booking exists
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new NotFoundError(`Booking not found: ${bookingId}`);
      }

      // Validate amount
      if (amount <= 0) {
        throw new ValidationError('Payment amount must be greater than 0');
      }

      // Create payment
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: 'VND',
          paymentType,
          status: 'PENDING' as PaymentStatus,
          notes: notes || null,
        },
      });

      logger.info(`Payment created: ${payment.id} for booking ${bookingId}`);

      return this.mapPaymentToResponse(payment);
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<PaymentResponse> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new NotFoundError(`Payment not found: ${paymentId}`);
      }

      return this.mapPaymentToResponse(payment);
    } catch (error) {
      logger.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Get payments by booking ID
   */
  async getPaymentsByBookingId(bookingId: string): Promise<PaymentResponse[]> {
    try {
      const payments = await prisma.payment.findMany({
        where: { bookingId },
        orderBy: { createdAt: 'desc' },
      });

      return payments.map((p) => this.mapPaymentToResponse(p));
    } catch (error) {
      logger.error('Error getting payments:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    paymentId: string,
    updatePaymentDto: UpdatePaymentStatusRequest
  ): Promise<PaymentResponse> {
    try {
      const { status, transactionId } = updatePaymentDto;

      // Validate payment exists
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new NotFoundError(`Payment not found: ${paymentId}`);
      }

      // Update payment
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: status as PaymentStatus,
          ...(transactionId && { transactionId }),
        },
      });

      logger.info(`Payment ${paymentId} status updated to ${status}`);

      return this.mapPaymentToResponse(updatedPayment);
    } catch (error) {
      logger.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    try {
      const stats = await prisma.payment.groupBy({
        by: ['status', 'paymentType'],
        _count: true,
        _sum: {
          amount: true,
        },
      });

      return stats;
    } catch (error) {
      logger.error('Error getting payment stats:', error);
      throw error;
    }
  }

  /**
   * Map payment to response format
   */
  private mapPaymentToResponse(payment: any): PaymentResponse {
    return {
      id: payment.id,
      bookingId: payment.bookingId,
      amount: Number(payment.amount),
      currency: payment.currency,
      paymentType: payment.paymentType,
      status: payment.status,
      transactionId: payment.transactionId || undefined,
      notes: payment.notes || undefined,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}

export default new PaymentService();
