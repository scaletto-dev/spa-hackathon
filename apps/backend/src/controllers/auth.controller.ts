import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import {
    RegisterRequest,
    RegisterResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    LoginRequest,
    LoginResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from '../types/auth';
import { ValidationError } from '../utils/errors';

/**
 * Auth Controller
 * Handles authentication endpoints (registration, login, OTP verification)
 */
class AuthController {
    /**
     * POST /api/v1/auth/register
     * Register a new user with email, password and send OTP for verification
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, fullName, phone } = req.body;

            // Validation
            if (!email || !password || !fullName) {
                throw new ValidationError('Missing required fields: email, password, and fullName are required');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidationError('Invalid email format');
            }

            // Password validation
            if (password.length < 8) {
                throw new ValidationError('Password must be at least 8 characters');
            }

            if (password.length > 100) {
                throw new ValidationError('Password must not exceed 100 characters');
            }

            // Full name validation
            if (fullName.trim().length < 2) {
                throw new ValidationError('Full name must be at least 2 characters');
            }

            if (fullName.length > 100) {
                throw new ValidationError('Full name must not exceed 100 characters');
            }

            // Phone validation (optional)
            if (phone) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(phone)) {
                    throw new ValidationError('Invalid phone format');
                }

                if (phone.length < 8 || phone.length > 20) {
                    throw new ValidationError('Phone number must be between 8 and 20 characters');
                }
            }

            const registrationData: RegisterRequest = {
                email: email.toLowerCase().trim(),
                password,
                fullName: fullName.trim(),
                phone: phone ? phone.trim() : undefined,
            };

            await authService.register(registrationData);

            const response: RegisterResponse = {
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
            const { email, otp } = req.body;

            // Validation
            if (!email || !otp) {
                throw new ValidationError('Missing required fields: email and otp are required');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidationError('Invalid email format');
            }

            // OTP format validation (6 digits)
            if (!/^\d{6}$/.test(otp)) {
                throw new ValidationError('OTP must be a 6-digit code');
            }

            const verifyData: VerifyOtpRequest = {
                email: email.toLowerCase().trim(),
                otp: otp.trim(),
            };

            const { user, session } = await authService.verifyOtp(verifyData.email, verifyData.otp);

            const response: VerifyOtpResponse = {
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
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                throw new ValidationError('Email and password are required');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidationError('Invalid email format');
            }

            const loginData: LoginRequest = {
                email: email.toLowerCase().trim(),
                password,
            };

            const result = await authService.login(loginData);

            const response: LoginResponse = {
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
                throw new ValidationError('User ID not found in request. Authentication required.');
            }

            const { currentPassword, newPassword } = req.body;

            // Validation
            if (!currentPassword || !newPassword) {
                throw new ValidationError('Current password and new password are required');
            }

            if (currentPassword === newPassword) {
                throw new ValidationError('New password must be different from current password');
            }

            const changePasswordData: ChangePasswordRequest = {
                currentPassword,
                newPassword,
            };

            await authService.changePassword(
                userId,
                changePasswordData.currentPassword,
                changePasswordData.newPassword,
            );

            const response: ChangePasswordResponse = {
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
            const { email } = req.body;

            // Validation
            if (!email) {
                throw new ValidationError('Email is required');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidationError('Invalid email format');
            }

            const forgotPasswordData: ForgotPasswordRequest = {
                email: email.toLowerCase().trim(),
            };

            await authService.forgotPassword(forgotPasswordData.email);

            // Always return success message (security: don't reveal if email exists)
            const response: ForgotPasswordResponse = {
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
            const { token, newPassword } = req.body;

            // Validation
            if (!token || !newPassword) {
                throw new ValidationError('Token and new password are required');
            }

            if (newPassword.length < 8) {
                throw new ValidationError('Password must be at least 8 characters');
            }

            if (newPassword.length > 100) {
                throw new ValidationError('Password must not exceed 100 characters');
            }

            const resetPasswordData: ResetPasswordRequest = {
                token,
                newPassword,
            };

            await authService.resetPassword(resetPasswordData.token, resetPasswordData.newPassword);

            const response: ResetPasswordResponse = {
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
