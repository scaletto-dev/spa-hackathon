/**
 * Authentication API Service
 * Handles all authentication-related API calls to backend
 */

import axios from 'axios';
import axiosInstance from '../utils/axios';
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/auth';

export const authApi = {
  /**
   * Register a new user with email OTP verification
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/register', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  },

  /**
   * Verify OTP code and complete registration/login
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/verify-otp', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'OTP verification failed');
      }
      throw error;
    }
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  },

  /**
   * Logout current user
   * Token is automatically added by axios interceptor
   */
  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Logout failed');
      }
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/refresh', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Token refresh failed');
      }
      throw error;
    }
  },
};

// Re-export types for convenience
export type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthUser,
  AuthSession,
} from '../types/auth';

// Export legacy functions for backward compatibility
// TODO: Remove these and update all imports to use authApi object
export const register = authApi.register;
export const verifyOtp = authApi.verifyOtp;
export const login = authApi.login;
export const logout = authApi.logout;
export const refreshToken = authApi.refreshToken;
