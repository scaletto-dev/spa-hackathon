import { z } from 'zod';

/**
 * Auth Validators
 * Zod schemas for authentication endpoints
 */

// Email regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex pattern (optional)
const phoneRegex = /^[\d\s\-\+\(\)]*$/;

/**
 * Schema for POST /auth/register
 */
export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').regex(emailRegex, 'Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .transform((val) => val.trim()),
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone format')
    .min(8, 'Phone number must be between 8 and 20 characters')
    .max(20, 'Phone number must not exceed 20 characters')
    .optional(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

/**
 * Schema for POST /auth/verify-otp
 */
export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format')
    .transform((val) => val.toLowerCase().trim()),
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit code')
    .transform((val) => val.trim()),
});

export type VerifyOtpRequest = z.infer<typeof verifyOtpSchema>;

/**
 * Schema for POST /auth/login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format')
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Schema for POST /auth/change-password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'New password must not exceed 100 characters'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

/**
 * Schema for POST /auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format')
    .transform((val) => val.toLowerCase().trim()),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema for POST /auth/reset-password
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
