/**
 * User Routes
 * 
 * Routes for user profile management
 * All routes require authentication
 */

import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all user routes
router.use(authenticate);

/**
 * GET /api/v1/user/profile
 * Get current user's profile
 * 
 * Requires: Authentication
 * Response: { success, data: UserProfileDTO, timestamp }
 */
router.get('/profile', userController.getProfile.bind(userController));

/**
 * PUT /api/v1/user/profile
 * Update current user's profile
 * 
 * Requires: Authentication
 * Body: { fullName?, phone?, language? }
 * Response: { success, data: UserProfileDTO, message, timestamp }
 */
router.put('/profile', userController.updateProfile.bind(userController));

export default router;

