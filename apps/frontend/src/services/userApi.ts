/**
 * User API Client
 * Handles all user profile-related API calls to backend
 */

import axiosInstance from '../utils/axios';

export interface UserProfile {
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

export interface GetProfileResponse {
    success: boolean;
    data: UserProfile;
    timestamp: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    data: UserProfile;
    message: string;
    timestamp: string;
}

export const userApi = {
    /**
     * Get current user's profile
     * Requires authentication
     */
    getProfile: async (): Promise<UserProfile> => {
        const { data } = await axiosInstance.get<GetProfileResponse>('/api/v1/user/profile');
        return data.data;
    },

    /**
     * Update current user's profile
     * Requires authentication
     */
    updateProfile: async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
        const { data } = await axiosInstance.put<UpdateProfileResponse>(
            '/api/v1/user/profile',
            profileData
        );
        return data.data;
    },
};

// Re-export types for convenience
export type { UserProfile as MemberProfile, UpdateProfileRequest };

// Export legacy functions for backward compatibility
export const getMemberProfile = userApi.getProfile;
export const updateMemberProfile = userApi.updateProfile;
