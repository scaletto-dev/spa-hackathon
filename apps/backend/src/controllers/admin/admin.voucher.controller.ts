/**
 * Admin Voucher Controller
 *
 * Handles HTTP requests for admin voucher management
 * Includes create, read, update, delete, and list operations
 */

import { Request, Response, NextFunction } from 'express';
import voucherService from '../../services/voucher.service';
import { SuccessResponse } from '../../types/api';
import { ValidationError, NotFoundError } from '../../utils/errors';

export class AdminVoucherController {
  /**
   * GET /api/v1/admin/vouchers
   * Get all vouchers with pagination
   */
  async getAllVouchers(
    req: Request<{}, {}, {}, { page?: string; limit?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);

      // Validation
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await voucherService.getAllVouchers(page, limit);

      const response: SuccessResponse<typeof result.data> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/vouchers/:id
   * Get voucher details by ID
   */
  async getVoucherById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Voucher ID is required');
      }

      const voucher = await voucherService.getVoucherByCode(id);

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
   * POST /api/v1/admin/vouchers
   * Create a new voucher
   */
  async createVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        code,
        title,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        validFrom,
        validUntil,
        isActive,
      } = req.body;

      // Validation
      if (!code || !title || !discountType || discountValue === undefined) {
        throw new ValidationError(
          'Missing required fields: code, title, discountType, discountValue'
        );
      }

      if (!validFrom || !validUntil) {
        throw new ValidationError('Valid dates are required');
      }

      const voucherData = {
        code,
        title,
        description,
        discountType,
        discountValue: Number(discountValue),
        minPurchaseAmount: minPurchaseAmount ? Number(minPurchaseAmount) : 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        validFrom,
        validUntil,
        isActive: isActive !== false,
      };

      const voucher = await voucherService.createVoucher(voucherData);

      const response: SuccessResponse<typeof voucher> = {
        success: true,
        data: voucher,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/vouchers/:id
   * Update voucher details
   */
  async updateVoucher(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        throw new ValidationError('Voucher ID is required');
      }

      // Validate update data
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No update data provided');
      }

      // Convert numeric fields
      const processedData: any = { ...updateData };
      if (processedData.discountValue !== undefined) {
        processedData.discountValue = Number(processedData.discountValue);
      }
      if (processedData.minPurchaseAmount !== undefined) {
        processedData.minPurchaseAmount = Number(processedData.minPurchaseAmount);
      }
      if (processedData.maxDiscountAmount !== undefined) {
        processedData.maxDiscountAmount = processedData.maxDiscountAmount
          ? Number(processedData.maxDiscountAmount)
          : null;
      }
      if (processedData.usageLimit !== undefined) {
        processedData.usageLimit = processedData.usageLimit
          ? Number(processedData.usageLimit)
          : null;
      }

      const voucher = await voucherService.updateVoucher(id, processedData);

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
   * DELETE /api/v1/admin/vouchers/:id
   * Delete a voucher
   */
  async deleteVoucher(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Voucher ID is required');
      }

      await voucherService.deleteVoucher(id);

      const response: SuccessResponse<{ message: string }> = {
        success: true,
        data: { message: 'Voucher deleted successfully' },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminVoucherController();
