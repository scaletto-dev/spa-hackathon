import { Request, Response, NextFunction } from 'express';
import authService from '@/services/auth.service';
import {
  RegisterRequestDTO,
  VerifyOtpRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  MessageResponseDTO,
  AuthenticatedResponseDTO,
} from '@/types/auth';

/**
 * Auth Controller
 * Handles authentication endpoints
 * All validation is done by Zod middleware
 * Controllers can assume valid, typed data from request
 */
class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user with email, password and send OTP for verification
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const validatedData = req.body as RegisterRequestDTO;

      await authService.register(validatedData);

      const response: MessageResponseDTO = {
        success: true,
        message: 'Please check your email for verification code',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/verify-otp
   * Verify OTP code and complete registration/login
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const validatedData = req.body as VerifyOtpRequestDTO;

      const { user, session } = await authService.verifyOtp(validatedData);

      const response: AuthenticatedResponseDTO = {
        success: true,
        user,
        session,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login with email and password
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const validatedData = req.body as LoginRequestDTO;

      const result = await authService.login(validatedData);

      const response: AuthenticatedResponseDTO = {
        success: true,
        user: result.user,
        session: result.session,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/change-password
   * Change password for authenticated user
   * Requires authentication
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error('User ID not found in request. Authentication required.');
      }

      // Middleware already validated and stored in req.body
      const validatedData = req.body as ChangePasswordRequestDTO;

      await authService.changePassword(userId, validatedData);

      const response: MessageResponseDTO = {
        success: true,
        message: 'Password changed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Send password reset email
   * Public endpoint (no authentication required)
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const validatedData = req.body as ForgotPasswordRequestDTO;

      await authService.forgotPassword(validatedData);

      // Always return success message (security: don't reveal if email exists)
      const response: MessageResponseDTO = {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   * Reset password using token from email
   * Public endpoint (no authentication required)
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const validatedData = req.body as ResetPasswordRequestDTO;

      await authService.resetPassword(validatedData);

      const response: MessageResponseDTO = {
        success: true,
        message: 'Password reset successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
