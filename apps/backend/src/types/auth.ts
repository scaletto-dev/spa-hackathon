/**
 * Authentication Types
 * Type definitions for auth endpoints (registration, login, verification)
 */

/**
 * Registration request body (with password)
 */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string; // Optional phone number
}

/**
 * Registration response (OTP sent)
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
}

/**
 * OTP verification request body
 */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/**
 * User data returned after authentication
 */
export interface AuthUserData {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  emailVerified: boolean;
}

/**
 * Session data with tokens
 */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

/**
 * OTP verification response (after registration)
 */
export interface VerifyOtpResponse {
  success: boolean;
  user: AuthUserData;
  session: AuthSession;
}

/**
 * Login request body (with password)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  user: AuthUserData;
  session: AuthSession;
}

/**
 * Change password request body
 * Requires authentication
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change password response
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Forgot password request body
 * Sends reset email
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Reset password request body
 * Used when user clicks link from email
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Reset password response
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}