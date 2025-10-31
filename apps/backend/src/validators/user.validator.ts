import { z } from 'zod';

/**
 * User Validators
 * Zod schemas for user profile endpoints
 */

// Phone regex pattern (optional)
const phoneRegex = /^[\d\s\-\+\(\)]*$/;

// Valid languages
const validLanguages = ['vi', 'en', 'ja', 'zh'];

/**
 * Schema for PUT /user/profile
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .transform(val => val.trim())
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone format')
    .min(8, 'Phone number must be between 8 and 20 characters')
    .max(20, 'Phone number must not exceed 20 characters')
    .transform(val => val.trim())
    .optional(),
  language: z
    .enum(['vi', 'en', 'ja', 'zh'] as const, {
      errorMap: () => ({ message: 'Language must be one of: vi, en, ja, zh' })
    })
    .optional(),
}).refine(
  data => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined),
  { message: 'At least one field must be provided for update' }
);

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
