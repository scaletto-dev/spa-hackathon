/**
 * VNPay Controller
 *
 * Handles HTTP requests for VNPay payment operations
 */

import { Request, Response, NextFunction } from 'express';
import vnpayService from '../services/vnpay.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import logger from '../config/logger';

interface CreatePaymentUrlRequest {
    bookingId: string;
    bankCode?: string;
    locale?: 'vn' | 'en';
}

class VNPayController {
    /**
     * POST /api/v1/payments/vnpay/create-payment-url
     * Create VNPay payment URL for a booking
     */
    async createPaymentUrl(
        req: Request<{}, {}, CreatePaymentUrlRequest>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { bookingId, bankCode, locale } = req.body;

            if (!bookingId) {
                throw new ValidationError('Booking ID is required');
            }

            // Get client IP address
            const ipAddr =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';

            // Get payment status first to get amount
            const paymentStatus = await vnpayService.getPaymentStatus(bookingId);
            const pendingPayment = paymentStatus.payments.find((p: any) => p.status === 'PENDING');

            if (!pendingPayment) {
                throw new ValidationError('No pending payment found for this booking');
            }

            const amount = Number(pendingPayment.amount);
            const orderInfo = `Thanh toan don hang ${paymentStatus.referenceNumber}`;

            // Create payment URL
            const paymentUrl = await vnpayService.createPaymentUrl({
                bookingId,
                amount,
                orderInfo,
                ipAddr,
                ...(locale && { locale }),
                ...(bankCode && { bankCode }),
            });

            const response: SuccessResponse<{ paymentUrl: string }> = {
                success: true,
                data: { paymentUrl },
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            logger.error('Error in createPaymentUrl:', error);
            next(error);
        }
    }

    /**
     * GET /api/v1/payments/vnpay/return
     * Handle return from VNPay after payment
     */
    async handleReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as any;

            const result = await vnpayService.verifyReturnUrl(query);

            const response: SuccessResponse<typeof result> = {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            logger.error('Error in handleReturn:', error);
            next(error);
        }
    }

    /**
     * GET /api/v1/payments/vnpay/ipn
     * Handle IPN (Instant Payment Notification) from VNPay
     */
    async handleIPN(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as any;

            const result = await vnpayService.verifyIPN(query);

            // VNPay expects a specific response format
            res.status(200).json(result);
        } catch (error) {
            logger.error('Error in handleIPN:', error);
            res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
        }
    }

    /**
     * GET /api/v1/payments/vnpay/status/:bookingId
     * Get payment status for a booking
     */
    async getPaymentStatus(req: Request<{ bookingId: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new ValidationError('Booking ID is required');
            }

            const status = await vnpayService.getPaymentStatus(bookingId);

            const response: SuccessResponse<typeof status> = {
                success: true,
                data: status,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            logger.error('Error in getPaymentStatus:', error);
            next(error);
        }
    }
}

export default new VNPayController();
