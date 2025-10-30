/**
 * User Controller
 * 
 * Handles HTTP requests for user profile endpoints
 */

import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { UpdateProfileRequest, GetProfileResponse, UpdateProfileResponse } from '../types/user';
import { ValidationError } from '../utils/errors';

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

      const response: GetProfileResponse = {
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

      const { fullName, phone, language } = req.body;

      // Validate at least one field is provided
      if (fullName === undefined && phone === undefined && language === undefined) {
        throw new ValidationError('At least one field must be provided for update');
      }

      const updateData: UpdateProfileRequest = {
        fullName,
        phone,
        language,
      };

      const updatedProfile = await userService.updateUserProfile(userId, updateData);

      const response: UpdateProfileResponse = {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

