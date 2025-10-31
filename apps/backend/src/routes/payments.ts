/**
 * Payment Routes
 *
 * Defines all payment API endpoints
 */

import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import vnpayRoutes from './vnpay.routes';

const router = Router();

/**
 * VNPay payment routes
 * All VNPay routes are prefixed with /vnpay
 */
router.use('/vnpay', vnpayRoutes);

/**
 * POST /api/v1/payments
 * Create a new payment
 */
router.post('/', (req, res, next) => {
    paymentController.createPayment(req, res, next);
});

/**
 * GET /api/v1/payments/:id
 * Get payment by ID
 */
router.get('/:id', (req, res, next) => {
    paymentController.getPayment(req, res, next);
});

/**
 * PATCH /api/v1/payments/:id/status
 * Update payment status
 */
router.patch('/:id/status', (req, res, next) => {
    paymentController.updatePaymentStatus(req, res, next);
});

/**
 * GET /api/v1/bookings/:bookingId/payments
 * Get all payments for a booking
 * Note: This is mounted at /api/v1/payments/bookings/:bookingId
 */
router.get('/bookings/:bookingId', (req, res, next) => {
    paymentController.getPaymentsByBooking(req, res, next);
});

/**
 * GET /api/v1/payments/stats
 * Get payment statistics
 */
router.get('/admin/stats', (req, res, next) => {
    paymentController.getPaymentStats(req, res, next);
});

export default router;
