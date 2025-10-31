/**
 * User Service
 * Business logic for user profile management
 */

import { userRepository } from '@/repositories/user.repository';
import { UserProfileDTO, UpdateProfileRequestDTO } from '@/types/user';
import { NotFoundError } from '@/utils/errors';

class UserService {
  /**
   * Get user profile by ID
   *
   * @param userId - User ID from authenticated session
   * @returns User profile data
   * @throws NotFoundError if user not found
   */
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    return this.toUserProfileDTO(user);
  }

  /**
   * Update user profile
   *
   * @param userId - User ID from authenticated session
   * @param data - Fields to update (pre-validated by Zod)
   * @returns Updated user profile
   * @throws NotFoundError if user not found
   */
  async updateUserProfile(
    userId: string,
    data: UpdateProfileRequestDTO
  ): Promise<UserProfileDTO> {
    // Check if user exists
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      throw new NotFoundError(`User with ID '${userId}' not found`);
    }

    // Update user (validation already done by Zod)
    const updatedUser = await userRepository.updateById(userId, data);

    return this.toUserProfileDTO(updatedUser);
  }

  /**
   * Map user data to UserProfileDTO
   *
   * @param user - User data from database
   * @returns UserProfileDTO
   */
  private toUserProfileDTO(user: any): UserProfileDTO {
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

