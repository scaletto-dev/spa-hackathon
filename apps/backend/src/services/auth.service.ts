import { supabase } from '../config/supabase';
import { PrismaClient, UserRole } from '@prisma/client';
import { RegisterRequest, AuthUserData, AuthSession, LoginRequest } from '../types/auth';
import { ValidationError, ConflictError, UnauthorizedError } from '../utils/errors';
import logger from '../config/logger';

const prisma = new PrismaClient();

/**
 * Auth Service
 * Handles authentication logic with Supabase Auth and application database
 */
class AuthService {
  /**
   * Register a new user with email, password, and send OTP for verification
   * @param data - Registration data (email, password, fullName, phone)
   * @returns Promise<void>
   * @throws ValidationError if data is invalid
   * @throws ConflictError if email already exists
   */
  async register(data: RegisterRequest): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    const { email, password, fullName, phone } = data;

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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
   * Login with email and password
   * @param data - Login credentials (email, password)
   * @returns User data and session tokens
   * @throws UnauthorizedError if credentials are invalid
   */
  async login(data: LoginRequest): Promise<{ user: AuthUserData; session: AuthSession }> {
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
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist in our DB (shouldn't happen for login), create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: supabaseUser.email!,
          fullName: supabaseUser.user_metadata?.full_name || 'User',
          phone: supabaseUser.user_metadata?.phone || '',
          role: UserRole.MEMBER,
          emailVerified: supabaseUser.email_confirmed_at != null,
          supabaseAuthId: supabaseUser.id,
        },
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

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return { user: userData, session: sessionData };
  }
}

export default new AuthService();
