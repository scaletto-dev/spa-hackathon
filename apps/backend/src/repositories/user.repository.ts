import prisma from '@/config/database';
import { BaseRepository } from '@/repositories/base.repository';

/**
 * User Repository
 * Handles user data persistence (Prisma operations)
 */
class UserRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.user;

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        emailVerified: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update user by ID
   */
  async updateById(
    id: string,
    data: {
      fullName?: string;
      phone?: string;
      language?: string;
    }
  ) {
    const updateData: any = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName.trim();
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone.trim();
    }
    if (data.language !== undefined) {
      updateData.language = data.language;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        emailVerified: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
