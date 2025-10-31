/**
 * Authentication Types
 * Type definitions for auth endpoints (registration, login, verification)
 */

// ============================================================================
// Request DTOs
// ============================================================================

export interface RegisterRequestDTO {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface VerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  newPassword: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface AuthUserDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  emailVerified: boolean;
}

export interface AuthSessionDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface AuthenticatedResponseDTO {
  success: boolean;
  user: AuthUserDTO;
  session: AuthSessionDTO;
}

export interface MessageResponseDTO {
  success: boolean;
  message: string;
}

// ============================================================================
// Legacy type aliases (for backwards compatibility)
// ============================================================================

export type RegisterRequest = RegisterRequestDTO;
export type VerifyOtpRequest = VerifyOtpRequestDTO;
export type LoginRequest = LoginRequestDTO;
export type ChangePasswordRequest = ChangePasswordRequestDTO;
export type ForgotPasswordRequest = ForgotPasswordRequestDTO;
export type ResetPasswordRequest = ResetPasswordRequestDTO;
export type AuthUserData = AuthUserDTO;
export type AuthSession = AuthSessionDTO;

export type RegisterResponse = MessageResponseDTO;
export type VerifyOtpResponse = AuthenticatedResponseDTO;
export type LoginResponse = AuthenticatedResponseDTO;
export type ChangePasswordResponse = MessageResponseDTO;
export type ForgotPasswordResponse = MessageResponseDTO;
export type ResetPasswordResponse = MessageResponseDTO;
