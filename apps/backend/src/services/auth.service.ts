import { supabase } from '@/config/supabase';
import { UserRole } from '@prisma/client';
import { authRepository } from '@/repositories/auth.repository';
import {
  RegisterRequestDTO,
  VerifyOtpRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  AuthUserDTO,
  AuthSessionDTO,
  AuthenticatedResponseDTO,
} from '@/types/auth';
import { ValidationError, ConflictError, UnauthorizedError } from '@/utils/errors';
import logger from '@/config/logger';

/**
 * Auth Service
 * Handles authentication logic with Supabase Auth and application database
 * All validation is done by Zod middleware
 */
class AuthService {
  /**
   * Convert Supabase user to AuthUserDTO
   */
  private toAuthUserDTO(user: any): AuthUserDTO {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Convert Supabase session to AuthSessionDTO
   */
  private toAuthSessionDTO(session: any): AuthSessionDTO {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in || 3600,
      expiresAt: session.expires_at || Date.now() / 1000 + 3600,
    };
  }

  /**
   * Register a new user with email, password, and send OTP for verification
   * @param data - Registration data (email, password, fullName, phone)
   * @returns Promise<void>
   * @throws ConflictError if email already exists
   */
  async register(data: RegisterRequestDTO): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email, password, fullName, phone } = data;

    // Check if user already exists in database
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user in Supabase Auth with password and request email verification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...(phone && { phone }), // Only include phone if provided
        },
      },
    });

    if (authError) {
      logger.error('Supabase Auth registration error', {
        error: authError.message,
        email,
      });
      throw new Error(`Registration failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Registration failed: No user data returned');
    }

    // Send OTP for email verification
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // User already created
      },
    });

    if (otpError) {
      logger.error('Failed to send verification OTP', {
        error: otpError.message,
        email,
      });
      // Don't fail registration if OTP send fails, user can request resend
    }

    logger.info('Registration initiated, OTP sent', {
      email,
      fullName,
      userId: authData.user.id,
    });
  }

  /**
   * Verify OTP code and complete registration/login
   * @param data - OTP verification data (email, otp)
   * @returns User data and session tokens
   * @throws ValidationError if OTP is invalid
   */
  async verifyOtp(data: VerifyOtpRequestDTO): Promise<{ user: AuthUserDTO; session: AuthSessionDTO }> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email, otp } = data;

    // Verify OTP with Supabase Auth
    const { data: authData, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error || !authData.user || !authData.session) {
      logger.error('OTP verification failed', {
        error: error?.message,
        email,
      });
      throw new ValidationError('Invalid or expired verification code');
    }

    const supabaseUser = authData.user;
    const session = authData.session;

    // Check if user exists in our database
    let user = await authRepository.findByEmail(email);

    // If user doesn't exist, create new user record
    if (!user) {
      const fullName = supabaseUser.user_metadata?.full_name || 'User';
      const phone = supabaseUser.user_metadata?.phone || '';

      user = await authRepository.create({
        email,
        fullName,
        phone,
        supabaseAuthId: supabaseUser.id,
        emailVerified: true,
        role: UserRole.MEMBER,
      });

      logger.info('New user created', {
        userId: user.id,
        email: user.email,
      });
    } else {
      // Update existing user
      user = await authRepository.updateEmailVerified(email, supabaseUser.id);

      logger.info('User verified', {
        userId: user.id,
        email: user.email,
      });
    }

    // Map to response format
    const userData: AuthUserDTO = this.toAuthUserDTO(user);
    const sessionData: AuthSessionDTO = this.toAuthSessionDTO(session);

    return { user: userData, session: sessionData };
  }

  /**
   * Login with email and password
   * @param data - Login credentials (email, password)
   * @returns User data and session tokens
   * @throws UnauthorizedError if credentials are invalid
   */
  async login(data: LoginRequestDTO): Promise<{ user: AuthUserDTO; session: AuthSessionDTO }> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email, password } = data;

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      logger.error('Login failed', {
        error: authError?.message,
        email,
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    const supabaseUser = authData.user;
    const session = authData.session;

    // Get or create user in our database
    let user = await authRepository.findByEmail(email);

    // If user doesn't exist in our DB (shouldn't happen for login), create them
    if (!user) {
      user = await authRepository.create({
        email: supabaseUser.email!,
        fullName: supabaseUser.user_metadata?.full_name || 'User',
        phone: supabaseUser.user_metadata?.phone || '',
        supabaseAuthId: supabaseUser.id,
        emailVerified: supabaseUser.email_confirmed_at != null,
        role: UserRole.MEMBER,
      });
    }

    // Map to response format
    const userData: AuthUserDTO = this.toAuthUserDTO(user);
    const sessionData: AuthSessionDTO = this.toAuthSessionDTO(session);

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return { user: userData, session: sessionData };
  }

  /**
   * Change password for authenticated user
   * Requires current password verification
   *
   * @param data - Change password data (userId, currentPassword, newPassword)
   * @throws UnauthorizedError if current password is incorrect
   */
  async changePassword(userId: string, data: ChangePasswordRequestDTO): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { currentPassword, newPassword } = data;

    // Get user from database
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      logger.warn('Current password verification failed', {
        userId: user.id,
        email: user.email,
      });
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      logger.error('Password update failed', {
        error: updateError.message,
        userId: user.id,
      });
      throw new Error(`Password update failed: ${updateError.message}`);
    }

    logger.info('Password changed successfully', {
      userId: user.id,
      email: user.email,
    });
  }

  /**
   * Send password reset email
   *
   * @param data - Forgot password data (email)
   */
  async forgotPassword(data: ForgotPasswordRequestDTO): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email } = data;

    // Check if user exists in database
    const user = await authRepository.findByEmail(email);

    // Always return success even if user doesn't exist (security: don't reveal if email is registered)
    if (!user) {
      logger.info('Password reset requested for non-existent email', { email });
      return;
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
    });

    if (error) {
      logger.error('Failed to send password reset email', {
        error: error.message,
        email,
      });
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    logger.info('Password reset email sent', {
      userId: user.id,
      email: user.email,
    });
  }

  /**
   * Reset password using token from email
   * Note: With Supabase, the token is handled via redirectTo URL
   * User will be redirected to frontend with access_token in URL
   * Frontend should extract token and call updateUser with new password
   *
   * @param data - Reset password data (token, newPassword)
   * @throws UnauthorizedError if token is invalid
   */
  async resetPassword(data: ResetPasswordRequestDTO): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { token, newPassword } = data;

    // Set the session with the access token
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // Not needed for password reset
    });

    if (sessionError || !sessionData.user) {
      logger.error('Invalid or expired reset token', { error: sessionError?.message });
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      logger.error('Password reset failed', {
        error: updateError.message,
        userId: sessionData.user.id,
      });
      throw new Error(`Password reset failed: ${updateError.message}`);
    }

    logger.info('Password reset successfully', {
      userId: sessionData.user.id,
      email: sessionData.user.email,
    });
  }
}

export default new AuthService();
