import { NotFoundError } from '@/utils/errors';
import { Decimal } from '@prisma/client/runtime/library';
import { voucherRepository } from '@/repositories/voucher.repository';
import { VoucherDTO } from '@/types/voucher';

class VoucherService {
    /**
     * Get all active vouchers
     * Filters by current date validity
     */
    async getActiveVouchers() {
        const vouchers = await voucherRepository.findActive();
        return vouchers.map(toVoucherDTO);
    }

    /**
     * Get voucher by code
     */
    async getVoucherByCode(code: string) {
        const voucher = await voucherRepository.findByCode(code.toUpperCase());

        if (!voucher) {
            throw new NotFoundError('Voucher not found');
        }

        return toVoucherDTO(voucher);
    }

    /**
     * Validate voucher and calculate discount
     */
    async validateVoucher(code: string, purchaseAmount: number) {
        const voucher = await voucherRepository.findByCode(code.toUpperCase());

        if (!voucher) {
            return {
                valid: false,
                message: 'Voucher not found',
            };
        }

        // Check if voucher is active
        if (!voucher.isActive) {
            return {
                valid: false,
                message: 'Voucher is not active',
            };
        }

        // Check expiration
        const now = new Date();
        if (now < new Date(voucher.validFrom) || now > new Date(voucher.validUntil)) {
            return {
                valid: false,
                message: 'Voucher is expired or not yet valid',
            };
        }

        // Check usage limit
        if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
            return {
                valid: false,
                message: 'Voucher usage limit reached',
            };
        }

        // Check minimum purchase amount
        if (voucher.minPurchaseAmount && new Decimal(purchaseAmount).lt(new Decimal(voucher.minPurchaseAmount))) {
            return {
                valid: false,
                message: `Minimum purchase amount is ${voucher.minPurchaseAmount}`,
            };
        }

        // Calculate discount
        let discount: number;
        if (voucher.discountType === 'PERCENTAGE') {
            discount = (purchaseAmount * Number(voucher.discountValue)) / 100;
        } else {
            discount = Number(voucher.discountValue);
        }

        // Apply max discount limit
        if (voucher.maxDiscountAmount && discount > Number(voucher.maxDiscountAmount)) {
            discount = Number(voucher.maxDiscountAmount);
        }

        // Increment usage count
        await voucherRepository.incrementUsageCount(voucher.id);

        return {
            valid: true,
            discount,
            message: 'Voucher is valid',
        };
    }

    /**
     * Get all vouchers with pagination (admin)
     */
    async getAllVouchers(page: number = 1, limit: number = 10) {
        const result = await voucherRepository.findAllWithPagination(page, limit);

        return {
            data: result.vouchers.map(toVoucherDTO),
            meta: {
                total: result.total,
                page,
                limit,
                totalPages: result.totalPages,
            },
        };
    }

    /**
     * Create new voucher (admin)
     */
    async createVoucher(data: any) {
        // Note: Validation happens at route level via Zod schema
        const voucher = await voucherRepository.create({
            code: data.code.toUpperCase(),
            title: data.title,
            description: data.description,
            discountType: data.discountType,
            discountValue: data.discountValue,
            minPurchaseAmount: data.minPurchaseAmount || 0,
            maxDiscountAmount: data.maxDiscountAmount,
            usageLimit: data.usageLimit,
            validFrom: new Date(data.validFrom),
            validUntil: new Date(data.validUntil),
            isActive: data.isActive !== false,
        });

        return toVoucherDTO(voucher);
    }

    /**
     * Update voucher (admin)
     */
    async updateVoucher(id: string, data: any) {
        const voucher = await voucherRepository.findById(id);

        if (!voucher) {
            throw new NotFoundError('Voucher not found');
        }

        const updated = await voucherRepository.update(id, {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.discountType && { discountType: data.discountType }),
            ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
            ...(data.minPurchaseAmount !== undefined && { minPurchaseAmount: data.minPurchaseAmount }),
            ...(data.maxDiscountAmount !== undefined && { maxDiscountAmount: data.maxDiscountAmount }),
            ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
            ...(data.validFrom && { validFrom: new Date(data.validFrom) }),
            ...(data.validUntil && { validUntil: new Date(data.validUntil) }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
        });

        return toVoucherDTO(updated);
    }

    /**
     * Delete voucher (admin)
     */
    async deleteVoucher(id: string) {
        const voucher = await voucherRepository.findById(id);

        if (!voucher) {
            throw new NotFoundError('Voucher not found');
        }

        await voucherRepository.delete(id);
    }
}

/**
 * Maps Prisma Voucher to VoucherDTO
 */
const toVoucherDTO = (voucher: any): VoucherDTO => ({
    id: voucher.id,
    code: voucher.code,
    title: voucher.title,
    description: voucher.description,
    discountType: voucher.discountType,
    discountValue: String(voucher.discountValue),
    minPurchaseAmount: voucher.minPurchaseAmount ? String(voucher.minPurchaseAmount) : null,
    maxDiscountAmount: voucher.maxDiscountAmount ? String(voucher.maxDiscountAmount) : null,
    usageLimit: voucher.usageLimit,
    usageCount: voucher.usageCount,
    isActive: voucher.isActive,
    validFrom: new Date(voucher.validFrom),
    validUntil: new Date(voucher.validUntil),
    createdAt: new Date(voucher.createdAt),
    updatedAt: new Date(voucher.updatedAt),
});

export default new VoucherService();
