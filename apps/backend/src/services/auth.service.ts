import { supabase } from '../config/supabase';
import { PrismaClient, UserRole } from '@prisma/client';
import { RegisterRequest, AuthUserData, AuthSession } from '../types/auth';
import { ValidationError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

const prisma = new PrismaClient();

/**
 * Auth Service
 * Handles authentication logic with Supabase Auth and application database
 */
class AuthService {
  /**
   * Register a new user with email OTP verification
   * @param data - Registration data (email, fullName, phone)
   * @returns Promise<void>
   * @throws ValidationError if data is invalid
   * @throws ConflictError if email already exists
   */
  async register(data: RegisterRequest): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email, fullName, phone } = data;

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user in Supabase Auth with OTP (passwordless)
    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      email,
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

    // Store pending registration data (will be finalized on OTP verification)
    // We don't create the User record yet - it will be created after email verification
    logger.info('Registration OTP sent', {
      email,
      fullName,
    });
  }

  /**
   * Verify OTP code and complete registration/login
   * @param email - User's email
   * @param otp - OTP code from email
   * @returns User data and session tokens
   * @throws ValidationError if OTP is invalid
   */
  async verifyOtp(email: string, otp: string): Promise<{ user: AuthUserData; session: AuthSession }> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    // Verify OTP with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error || !data.user || !data.session) {
      logger.error('OTP verification failed', {
        error: error?.message,
        email,
      });
      throw new ValidationError('Invalid or expired verification code');
    }

    const supabaseUser = data.user;
    const session = data.session;

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create new user record
    if (!user) {
      const fullName = supabaseUser.user_metadata?.full_name || 'User';
      const phone = supabaseUser.user_metadata?.phone || '';

      user = await prisma.user.create({
        data: {
          email,
          fullName,
          phone,
          role: UserRole.MEMBER,
          emailVerified: true,
          supabaseAuthId: supabaseUser.id,
        },
      });

      logger.info('New user created', {
        userId: user.id,
        email: user.email,
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          supabaseAuthId: supabaseUser.id,
        },
      });

      logger.info('User verified', {
        userId: user.id,
        email: user.email,
      });
    }

    // Map to response format
    const userData: AuthUserData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
    };

    const sessionData: AuthSession = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in || 3600,
      expiresAt: session.expires_at || Date.now() / 1000 + 3600,
    };

    return { user: userData, session: sessionData };
  }

  /**
   * Send login OTP to user's email
   * @param email - User's email
   * @returns Promise<void>
   * @throws ValidationError if email not found
   */
  async login(email: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError('No account found with this email address');
    }

    // Send OTP via Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      logger.error('Login OTP send failed', {
        error: error.message,
        email,
      });
      throw new Error(`Login failed: ${error.message}`);
    }

    logger.info('Login OTP sent', { email });
  }
}

export default new AuthService();
