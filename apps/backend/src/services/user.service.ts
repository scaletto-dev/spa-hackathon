/**
 * User Service
 * 
 * Business logic for user profile management
 */

import prisma from '../config/database';
import { UserProfileDTO, UpdateProfileRequest } from '../types/user';
import { NotFoundError, ValidationError } from '../utils/errors';

class UserService {
  /**
   * Get user profile by ID
   * 
   * @param userId - User ID from authenticated session
   * @returns User profile data
   * @throws NotFoundError if user not found
   */
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    return this.mapUserToDTO(user);
  }

  /**
   * Update user profile
   * 
   * @param userId - User ID from authenticated session
   * @param data - Fields to update
   * @returns Updated user profile
   * @throws NotFoundError if user not found
   * @throws ValidationError if validation fails
   */
  async updateUserProfile(
    userId: string,
    data: UpdateProfileRequest
  ): Promise<UserProfileDTO> {
    // Validate input
    if (data.fullName !== undefined) {
      if (data.fullName.trim().length < 2) {
        throw new ValidationError('Full name must be at least 2 characters');
      }
      if (data.fullName.length > 100) {
        throw new ValidationError('Full name must not exceed 100 characters');
      }
    }

    if (data.phone !== undefined) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(data.phone)) {
        throw new ValidationError('Invalid phone format');
      }
      if (data.phone.length < 8 || data.phone.length > 20) {
        throw new ValidationError('Phone number must be between 8 and 20 characters');
      }
    }

    if (data.language !== undefined) {
      const validLanguages = ['vi', 'en', 'ja', 'zh'];
      if (!validLanguages.includes(data.language)) {
        throw new ValidationError('Language must be one of: vi, en, ja, zh');
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    // Build update data object with only provided fields
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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
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

    return this.mapUserToDTO(updatedUser);
  }

  /**
   * Map Prisma User model to UserProfileDTO
   * 
   * @param user - Prisma user object
   * @returns UserProfileDTO
   */
  private mapUserToDTO(user: any): UserProfileDTO {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export default new UserService();

