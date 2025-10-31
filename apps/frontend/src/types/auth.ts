/**
 * Authentication Type Definitions
 *
 * Types for authentication-related API requests and responses
 */

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    emailVerified: boolean;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
}

export interface VerifyOtpResponse {
    success: boolean;
    user: AuthUser;
    session: AuthSession;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: AuthUser;
    session: AuthSession;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    session: AuthSession;
}
