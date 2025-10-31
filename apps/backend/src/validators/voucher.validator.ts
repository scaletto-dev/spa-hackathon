import { z } from 'zod';

/**
 * Voucher Validators
 * Zod schemas for voucher endpoints
 */

/**
 * Schema for GET /vouchers/code/:code
 */
export const getVoucherByCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Voucher code is required')
    .max(50, 'Voucher code must not exceed 50 characters')
    .toUpperCase(),
});

export type GetVoucherByCodeParams = z.infer<typeof getVoucherByCodeSchema>;

/**
 * Schema for POST /vouchers/validate
 */
export const validateVoucherSchema = z.object({
  code: z
    .string()
    .min(1, 'Voucher code is required')
    .max(50, 'Voucher code must not exceed 50 characters')
    .toUpperCase(),
  purchaseAmount: z
    .number()
    .min(0, 'Purchase amount must be greater than or equal to 0')
    .max(999999999, 'Purchase amount exceeds maximum allowed'),
});

export type ValidateVoucherRequest = z.infer<typeof validateVoucherSchema>;
