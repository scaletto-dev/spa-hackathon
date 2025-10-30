/**
 * User Type Definitions
 * 
 * DTO types for user profile API responses
 */

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

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  language?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: UserProfileDTO;
  message: string;
  timestamp: string;
}

export interface GetProfileResponse {
  success: boolean;
  data: UserProfileDTO;
  timestamp: string;
}

