/**
 * Voucher Service
 *
 * Handles business logic for voucher management
 */

import prisma from '../lib/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { Decimal } from '@prisma/client/runtime/library';

class VoucherService {
    /**
     * Get all active vouchers
     * Filters by current date validity
     */
    async getActiveVouchers() {
        try {
            const now = new Date();

            const vouchers = await prisma.voucher.findMany({
                where: {
                    isActive: true,
                    validFrom: {
                        lte: now,
                    },
                    validUntil: {
                        gte: now,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return vouchers;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get voucher by code
     */
    async getVoucherByCode(code: string) {
        try {
            const voucher = await prisma.voucher.findUnique({
                where: { code: code.toUpperCase() },
            });

            if (!voucher) {
                throw new NotFoundError('Voucher not found');
            }

            return voucher;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate voucher and calculate discount
     */
    async validateVoucher(code: string, purchaseAmount: number) {
        try {
            const voucher = await prisma.voucher.findUnique({
                where: { code: code.toUpperCase() },
            });

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

            return {
                valid: true,
                discount,
                message: 'Voucher is valid',
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all vouchers with pagination (admin)
     */
    async getAllVouchers(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const [vouchers, total] = await Promise.all([
                prisma.voucher.findMany({
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.voucher.count(),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: vouchers,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new voucher (admin)
     */
    async createVoucher(data: any) {
        try {
            // Validate input
            if (!data.code || !data.title || !data.discountType || data.discountValue === undefined) {
                throw new ValidationError('Missing required fields');
            }

            const voucher = await prisma.voucher.create({
                data: {
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
                },
            });

            return voucher;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update voucher (admin)
     */
    async updateVoucher(id: string, data: any) {
        try {
            const voucher = await prisma.voucher.findUnique({
                where: { id },
            });

            if (!voucher) {
                throw new NotFoundError('Voucher not found');
            }

            const updated = await prisma.voucher.update({
                where: { id },
                data: {
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
                },
            });

            return updated;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete voucher (admin)
     */
    async deleteVoucher(id: string) {
        try {
            const voucher = await prisma.voucher.findUnique({
                where: { id },
            });

            if (!voucher) {
                throw new NotFoundError('Voucher not found');
            }

            await prisma.voucher.delete({
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new VoucherService();
