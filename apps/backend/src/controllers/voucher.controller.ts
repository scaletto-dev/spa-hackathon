/**
 * Voucher Controller
 *
 * Handles HTTP requests for voucher endpoints.
 * Validates input, calls service layer, and formats responses.
 */

import { Request, Response, NextFunction } from 'express';
import voucherService from '../services/voucher.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';

interface ValidateVoucherQuery {
    code: string;
    purchaseAmount: number;
}

export class VoucherController {
    /**
     * GET /api/v1/vouchers/active
     * Get all active vouchers
     */
    async getActiveVouchers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const vouchers = await voucherService.getActiveVouchers();

            const response: SuccessResponse<typeof vouchers> = {
                success: true,
                data: vouchers,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/vouchers/code/:code
     * Get voucher details by code
     */
    async getVoucherByCode(
        req: Request<{ code: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { code } = req.params;

            const voucher = await voucherService.getVoucherByCode(code);

            const response: SuccessResponse<typeof voucher> = {
                success: true,
                data: voucher,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/vouchers/validate
     * Validate voucher code and calculate discount
     */
    async validateVoucher(
        req: Request<{}, {}, ValidateVoucherQuery>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { code, purchaseAmount } = req.body;

            if (!code || !purchaseAmount) {
                throw new ValidationError('Code and purchase amount are required');
            }

            const result = await voucherService.validateVoucher(code, purchaseAmount);

            const response: any = {
                success: result.valid,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new VoucherController();
