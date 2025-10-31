import { Router } from 'express';
import authController from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate';
import { authenticate } from '@/middleware/auth.middleware';
import { registrationRateLimiter, authRateLimiter } from '@/config/rateLimits';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/validators/auth.validator';

const router = Router();

/**
 * Auth Routes
 *
 * Handles user authentication endpoints:
 * - POST /register - Register new user with email OTP (rate limited: 3/hour)
 * - POST /verify-otp - Verify OTP code and get session (rate limited: 5/min)
 * - POST /login - Send login OTP to email (rate limited: 5/min)
 * - POST /change-password - Change password (authenticated, rate limited: 5/min)
 * - POST /forgot-password - Send password reset email (rate limited: 5/min)
 * - POST /reset-password - Reset password with token (rate limited: 5/min)
 *
 * All endpoints include automatic request validation via Zod schemas
 */

/**
 * POST /api/v1/auth/register
 * Register a new user with email OTP verification
 *
 * Body: { email, password, fullName, phone? }
 * Response: { success: true, message: "Please check your email for verification code" }
 *
 * Rate limit: 3 requests per hour per IP
 */
router.post(
  '/register',
  registrationRateLimiter,
  validate(registerSchema, 'body'),
  authController.register.bind(authController)
);

/**
 * POST /api/v1/auth/verify-otp
 * Verify OTP code and complete registration/login
 *
 * Body: { email, otp }
 * Response: { success: true, user: {...}, session: {...} }
 *
 * Rate limit: 5 requests per minute per IP
 */
router.post(
  '/verify-otp',
  authRateLimiter,
  validate(verifyOtpSchema, 'body'),
  authController.verifyOtp.bind(authController)
);

/**
 * POST /api/v1/auth/login
 * Login with email and password
 *
 * Body: { email, password }
 * Response: { success: true, user: {...}, session: {...} }
 *
 * Rate limit: 5 requests per minute per IP
 */
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema, 'body'),
  authController.login.bind(authController)
);

/**
 * POST /api/v1/auth/change-password
 * Change password for authenticated user
 *
 * Body: { currentPassword, newPassword }
 * Response: { success: true, message: "Password changed successfully" }
 *
 * Requires: Authentication
 */
router.post(
  '/change-password',
  authenticate,
  authRateLimiter,
  validate(changePasswordSchema, 'body'),
  authController.changePassword.bind(authController)
);

/**
 * POST /api/v1/auth/forgot-password
 * Send password reset email
 *
 * Body: { email }
 * Response: { success: true, message: "If an account exists with this email, a password reset link has been sent" }
 *
 * Rate limit: 5 requests per minute per IP
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema, 'body'),
  authController.forgotPassword.bind(authController)
);

/**
 * POST /api/v1/auth/reset-password
 * Reset password using token from email
 *
 * Body: { token, newPassword }
 * Response: { success: true, message: "Password reset successfully" }
 *
 * Rate limit: 5 requests per minute per IP
 */
router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema, 'body'),
  authController.resetPassword.bind(authController)
);

export default router;
