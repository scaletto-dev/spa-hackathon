/**
 * User Controller
 * Handles HTTP requests for user profile endpoints
 */

import { Request, Response, NextFunction } from 'express';
import userService from '@/services/user.service';
import { SuccessResponse } from '@/types/api';
import { UserProfileDTO } from '@/types/user';
import { ValidationError } from '@/utils/errors';

class UserController {
  /**
   * GET /api/v1/user/profile
   * Get current user's profile
   * Requires authentication
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User ID should be set by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID not found in request. Authentication required.');
      }

      const userProfile = await userService.getUserProfile(userId);

      const response: SuccessResponse<UserProfileDTO> = {
        success: true,
        data: userProfile,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/user/profile
   * Update current user's profile
   * Requires authentication
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User ID should be set by auth middleware
      const userId = req.user?.id;

      if (!userId) {
        throw new ValidationError('User ID not found in request. Authentication required.');
      }

      // Validated data from middleware
      const updateData = req.body;

      const updatedProfile = await userService.updateUserProfile(userId, updateData);

      const response: SuccessResponse<UserProfileDTO & { message: string }> = {
        success: true,
        data: { ...updatedProfile, message: 'Profile updated successfully' },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
