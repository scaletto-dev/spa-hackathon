import { supabase, supabaseAdmin } from './supabase';
import type { User, AuthError } from '@supabase/supabase-js';

/**
 * Auth helper result type
 */
export interface AuthResult<T = any> {
  data: T | null;
  error: AuthError | Error | null;
}

/**
 * User metadata for signup
 */
export interface UserMetadata {
  fullName: string;
  phone: string;
  language?: string;
}

/**
 * Sign up a new user with email and password
 * Sends OTP code to email for verification
 *
 * @param email - User''s email address
 * @param password - User''s password (optional if using OTP only)
 * @param metadata - Additional user metadata (fullName, phone, language)
 * @returns AuthResult with user data or error
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: UserMetadata
): Promise<AuthResult<User>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: process.env.FRONTEND_URL || 'http://localhost:5173',
      },
    });

    if (error) {
      return { data: null, error };
    }

    return { data: data.user, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error during signup'),
    };
  }
}

/**
 * Send OTP code to user''s email for passwordless sign in
 *
 * @param email - User''s email address
 * @returns AuthResult indicating success or failure
 */
export async function signInWithOTP(email: string): Promise<AuthResult<void>> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.FRONTEND_URL || 'http://localhost:5173',
      },
    });

    if (error) {
      return { data: null, error };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error sending OTP'),
    };
  }
}

/**
 * Verify OTP code sent to user''s email
 *
 * @param email - User''s email address
 * @param token - 6-digit OTP code from email
 * @returns AuthResult with session data (access token, refresh token, user)
 */
export async function verifyOTP(
  email: string,
  token: string
): Promise<AuthResult<{ accessToken: string; refreshToken: string; user: User }>> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { data: null, error };
    }

    if (!data.session) {
      return {
        data: null,
        error: new Error('No session returned after OTP verification'),
      };
    }

    return {
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: data.user!,
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error verifying OTP'),
    };
  }
}

/**
 * Get current user from access token
 *
 * @param accessToken - JWT access token
 * @returns AuthResult with user data or error
 */
export async function getCurrentUser(accessToken: string): Promise<AuthResult<User>> {
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      return { data: null, error };
    }

    return { data: data.user, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error getting current user'),
    };
  }
}

/**
 * Sign out user (invalidate refresh token)
 *
 * @param accessToken - JWT access token
 * @returns AuthResult indicating success or failure
 */
export async function signOut(accessToken: string): Promise<AuthResult<void>> {
  try {
    // Set the session before signing out
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '', // Will be ignored for signOut
    });

    if (sessionError) {
      return { data: null, error: sessionError };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { data: null, error };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error during sign out'),
    };
  }
}

/**
 * Get user by email (admin only)
 * Uses service role key to bypass RLS
 *
 * @param email - User''s email address
 * @returns AuthResult with user data or error
 */
export async function getUserByEmail(email: string): Promise<AuthResult<User>> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY.'),
    };
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return { data: null, error };
    }

    const user = data.users.find((u) => u.email === email);

    if (!user) {
      return {
        data: null,
        error: new Error(`User with email ${email} not found`),
      };
    }

    return { data: user, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error getting user by email'),
    };
  }
}

/**
 * Update user metadata (admin only)
 *
 * @param userId - Supabase user ID
 * @param metadata - Metadata to update
 * @returns AuthResult with updated user or error
 */
export async function updateUserMetadata(
  userId: string,
  metadata: Partial<UserMetadata>
): Promise<AuthResult<User>> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY.'),
    };
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    });

    if (error) {
      return { data: null, error };
    }

    return { data: data.user, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error updating user metadata'),
    };
  }
}

/**
 * Delete user (admin only)
 *
 * @param userId - Supabase user ID
 * @returns AuthResult indicating success or failure
 */
export async function deleteUser(userId: string): Promise<AuthResult<void>> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY.'),
    };
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return { data: null, error };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error deleting user'),
    };
  }
}