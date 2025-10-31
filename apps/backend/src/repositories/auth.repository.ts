import prisma from '@/config/database';
import { BaseRepository } from '@/repositories/base.repository';
import { UserRole } from '@prisma/client';

/**
 * Auth Repository
 * Handles user data persistence (Prisma operations only)
 * Supabase Auth operations remain in service layer
 */
class AuthRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.user;

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create new user
   */
  async create(data: {
    email: string;
    fullName: string;
    phone?: string;
    supabaseAuthId: string;
    emailVerified?: boolean;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || '',
        supabaseAuthId: data.supabaseAuthId,
        emailVerified: data.emailVerified || false,
        role: data.role || UserRole.MEMBER,
      },
    });
  }

  /**
   * Update user email verification status and Supabase ID
   */
  async updateEmailVerified(email: string, supabaseAuthId: string) {
    return prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        supabaseAuthId,
      },
    });
  }

  /**
   * Update user by ID
   */
  async updateById(id: string, data: Partial<{
    email: string;
    fullName: string;
    phone: string;
    emailVerified: boolean;
    supabaseAuthId: string;
  }>) {
    const updateData: any = {};

    if (data.email) updateData.email = data.email.toLowerCase().trim();
    if (data.fullName) updateData.fullName = data.fullName.trim();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || '';
    if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
    if (data.supabaseAuthId) updateData.supabaseAuthId = data.supabaseAuthId;

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}

export const authRepository = new AuthRepository();
