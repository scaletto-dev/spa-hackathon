/**
 * Admin Voucher Routes
 *
 * RESTful API endpoints for admin voucher management
 * All routes are protected by authentication and admin role (enforced in admin router)
 */

import { Router } from 'express';
import adminVoucherController from '../../controllers/admin/admin.voucher.controller';

const router = Router();

/**
 * GET /api/v1/admin/vouchers
 * Get all vouchers with pagination
 * Query params: page, limit
 */
router.get('/', adminVoucherController.getAllVouchers.bind(adminVoucherController));

/**
 * POST /api/v1/admin/vouchers
 * Create a new voucher
 * Body: { code, title, description?, discountType, discountValue, minPurchaseAmount?, maxDiscountAmount?, usageLimit?, validFrom, validUntil, isActive? }
 */
router.post('/', adminVoucherController.createVoucher.bind(adminVoucherController));

/**
 * GET /api/v1/admin/vouchers/:id
 * Get voucher details by ID
 */
router.get('/:id', adminVoucherController.getVoucherById.bind(adminVoucherController));

/**
 * PUT /api/v1/admin/vouchers/:id
 * Update voucher details
 * Body: Partial voucher data
 */
router.put('/:id', adminVoucherController.updateVoucher.bind(adminVoucherController));

/**
 * DELETE /api/v1/admin/vouchers/:id
 * Delete a voucher
 */
router.delete('/:id', adminVoucherController.deleteVoucher.bind(adminVoucherController));

export default router;

