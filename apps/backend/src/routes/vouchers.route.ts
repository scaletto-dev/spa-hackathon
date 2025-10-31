/**
 * Voucher Routes - Public endpoints
 * Handles voucher validation and retrieval
 */

import { Router } from 'express';
import voucherController from '@/controllers/voucher.controller';
import { validate } from '@/middleware/validate';
import { getVoucherByCodeSchema, validateVoucherSchema } from '@/validators/voucher.validator';

const router = Router();

/**
 * GET /api/v1/vouchers/active
 * Get all active vouchers
 *
 * Response: { success, data: Voucher[], timestamp }
 */
router.get('/active', voucherController.getActiveVouchers.bind(voucherController));

/**
 * GET /api/v1/vouchers/code/:code
 * Get voucher details by code
 *
 * Response: { success, data: Voucher, timestamp }
 */
router.get(
  '/code/:code',
  validate(getVoucherByCodeSchema, 'params'),
  voucherController.getVoucherByCode.bind(voucherController)
);

/**
 * POST /api/v1/vouchers/validate
 * Validate voucher code and calculate discount
 *
 * Request: { code, purchaseAmount }
 * Response: { success, data: { valid, discount, message }, timestamp }
 */
router.post(
  '/validate',
  validate(validateVoucherSchema, 'body'),
  voucherController.validateVoucher.bind(voucherController)
);

export default router;
