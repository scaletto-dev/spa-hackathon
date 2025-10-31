/**
 * VNPay Payment Routes
 *
 * Defines all VNPay payment API endpoints
 */

import { Router } from 'express';
import vnpayController from '../controllers/vnpay.controller';

const router = Router();

/**
 * POST /api/v1/payments/vnpay/create-payment-url
 * Create VNPay payment URL for a booking
 *
 * Request body:
 * - bookingId (required)
 * - bankCode (optional) - Bank code for direct payment
 * - locale (optional) - 'vn' or 'en', default 'vn'
 */
router.post('/create-payment-url', (req, res, next) => {
  vnpayController.createPaymentUrl(req, res, next);
});

/**
 * GET /api/v1/payments/vnpay/return
 * Handle customer return from VNPay after payment
 * This endpoint is called when customer is redirected back from VNPay
 */
router.get('/return', (req, res, next) => {
  vnpayController.handleReturn(req, res, next);
});

/**
 * GET /api/v1/payments/vnpay/ipn
 * Handle IPN (Instant Payment Notification) from VNPay
 * This endpoint is called by VNPay server to confirm payment
 */
router.get('/ipn', (req, res, next) => {
  vnpayController.handleIPN(req, res, next);
});

/**
 * GET /api/v1/payments/vnpay/status/:bookingId
 * Get payment status for a booking
 */
router.get('/status/:bookingId', (req, res, next) => {
  vnpayController.getPaymentStatus(req, res, next);
});

export default router;
