/**
 * User Type Definitions
 * DTOs for user profile API
 */

// ============================================================================
// Request DTOs
// ============================================================================

export interface UpdateProfileRequestDTO {
  fullName?: string;
  phone?: string;
  language?: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface UserProfileDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Legacy type aliases (for backwards compatibility)
// ============================================================================

export type UpdateProfileRequest = UpdateProfileRequestDTO;

