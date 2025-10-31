import prisma from '@/config/database';
import { BaseRepository } from '@/repositories/base.repository';

/**
 * Voucher Repository
 * Handles voucher data persistence (Prisma operations)
 */
class VoucherRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.voucher;

  /**
   * Find all active vouchers with date validity check
   */
  async findActive() {
    const now = new Date();

    return prisma.voucher.findMany({
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
  }

  /**
   * Find voucher by code (case-insensitive)
   */
  async findByCode(code: string) {
    return prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Find all vouchers with pagination (admin)
   */
  async findAllWithPagination(page: number = 1, limit: number = 10) {
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
      vouchers,
      total,
      totalPages,
    };
  }

  /**
   * Increment usage count for a voucher
   */
  async incrementUsageCount(voucherId: string) {
    return prisma.voucher.update({
      where: { id: voucherId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}

export const voucherRepository = new VoucherRepository();
