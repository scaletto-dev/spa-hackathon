import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { registrationRateLimiter, authRateLimiter } from '../config/rateLimits';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Auth Routes
 * 
 * Handles user authentication endpoints:
 * - POST /register - Register new user with email OTP (rate limited: 3/hour)
 * - POST /verify-otp - Verify OTP code and get session (rate limited: 5/min)
 * - POST /login - Send login OTP to email (rate limited: 5/min)
 */

/**
 * POST /api/v1/auth/register
 * Register a new user with email OTP verification
 * 
 * Body: { email, fullName, phone }
 * Response: { success: true, message: "Please check your email for verification code" }
 * 
 * Rate limit: 3 requests per hour per IP
 */
router.post('/register', registrationRateLimiter, authController.register.bind(authController));

/**
 * POST /api/v1/auth/verify-otp
 * Verify OTP code and complete registration/login
 * 
 * Body: { email, otp }
 * Response: { success: true, user: {...}, session: {...} }
 * 
 * Rate limit: 5 requests per minute per IP
 */
router.post('/verify-otp', authRateLimiter, authController.verifyOtp.bind(authController));

/**
 * POST /api/v1/auth/login
 * Send login OTP to user's email
 * 
 * Body: { email }
 * Response: { success: true, message: "Please check your email for login code" }
 * 
 * Rate limit: 5 requests per minute per IP
 */
router.post('/login', authRateLimiter, authController.login.bind(authController));

/**
 * POST /api/v1/auth/change-password
 * Change password for authenticated user
 * 
 * Body: { currentPassword, newPassword }
 * Response: { success: true, message: "Password changed successfully" }
 * 
 * Requires: Authentication
 */
router.post('/change-password', authenticate, authController.changePassword.bind(authController));

/**
 * POST /api/v1/auth/forgot-password
 * Send password reset email
 * 
 * Body: { email }
 * Response: { success: true, message: "If an account exists with this email, a password reset link has been sent" }
 * 
 * Rate limit: 5 requests per minute per IP
 */
router.post('/forgot-password', authRateLimiter, authController.forgotPassword.bind(authController));

/**
 * POST /api/v1/auth/reset-password
 * Reset password using token from email
 * 
 * Body: { token, newPassword }
 * Response: { success: true, message: "Password reset successfully" }
 * 
 * Rate limit: 5 requests per minute per IP
 */
router.post('/reset-password', authRateLimiter, authController.resetPassword.bind(authController));

export default router;
