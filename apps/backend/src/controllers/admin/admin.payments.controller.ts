/**
 * Admin Payments Controller
 *
 * Handles HTTP requests for admin payment management
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/database';
import { ValidationError, NotFoundError } from '../../utils/errors';

class AdminPaymentsController {
  /**
   * GET /api/v1/admin/payments
   * Get all payments with pagination and filtering
   */
  async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const paymentType = req.query.paymentType as string;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) where.status = status;
      if (paymentType) where.paymentType = paymentType;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          include: {
            booking: {
              include: {
                branch: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.payment.count({ where }),
      ]);

      res.status(200).json({
        data: payments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/payments/:id
   * Get payment by ID
   */
  async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const payment = await prisma.payment.findUnique({
        where: { id } as { id: string },
        include: {
          booking: {
            include: {
              branch: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment not found');
      }

      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/payments/:id/status
   * Update payment status
   */
  async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const payment = await prisma.payment.update({
        where: { id } as { id: string },
        data: { status },
        include: {
          booking: {
            include: {
              branch: true,
              user: true,
            },
          },
        },
      });

      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/payments
   * Create a new payment
   */
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookingId, amount, currency, paymentType, status, transactionId, notes } = req.body;

      if (!bookingId || !amount) {
        throw new ValidationError('Booking ID and amount are required');
      }

      // Verify booking exists
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          currency: currency || 'VND',
          paymentType: paymentType || 'ATM',
          status: status || 'PENDING',
          transactionId,
          notes,
        },
        include: {
          booking: {
            include: {
              branch: true,
              user: true,
            },
          },
        },
      });

      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/payments/:id
   * Delete a payment
   */
  async deletePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.payment.delete({
        where: { id } as { id: string },
      });

      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/payments/stats
   * Get payment statistics
   */
  async getPaymentStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalPayments, completedPayments, pendingPayments, failedPayments, totalRevenue] =
        await Promise.all([
          prisma.payment.count(),
          prisma.payment.count({ where: { status: 'COMPLETED' } }),
          prisma.payment.count({ where: { status: 'PENDING' } }),
          prisma.payment.count({ where: { status: 'FAILED' } }),
          prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
          }),
        ]);

      res.status(200).json({
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminPaymentsController();
