/**
 * Member Dashboard API Adapter
 * Real API integration with backend
 */

import axiosInstance from '../../utils/axios';

const API_BASE = '/api/v1';

export interface BookingSummary {
    id: string;
    referenceNumber: string;
    serviceName: string;
    branchName: string;
    appointmentDate: string; // ISO 8601
    appointmentTime: string; // HH:MM format
    status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    serviceImage?: string;
}

export interface DashboardStats {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    memberPoints: number;
}

export interface SpecialOffer {
    id: string;
    title: string;
    description: string;
    discountPercent: number;
    validUntil: string; // ISO 8601
    imageUrl?: string;
}

export interface MemberDashboardData {
    stats: DashboardStats;
    upcomingBookings: BookingSummary[];
    specialOffers: SpecialOffer[];
}

export interface BookingHistoryParams {
    page?: number;
    limit?: number;
    status?: 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'all';
    dateFrom?: string;
    dateTo?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface BookingHistoryResponse {
    data: BookingSummary[];
    meta: PaginationMeta;
}

// ============= API Functions =============

/**
 * Fetch member dashboard overview data
 * @returns Dashboard data with stats and upcoming bookings
 *
 * GET /api/v1/members/dashboard
 * Auth: Required (Bearer token)
 * Response: { data: MemberDashboardData }
 */
export async function getMemberDashboard(): Promise<MemberDashboardData> {
    try {
        const response = await axiosInstance.get(`${API_BASE}/members/dashboard`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch member dashboard:', error);
        throw error;
    }
}

/**
 * Quick action: Book new appointment
 * Redirects to booking page with pre-filled member data
 */
export function quickBookAppointment(): void {
    window.location.href = '/booking';
}

/**
 * Fetch member booking history with pagination and filters
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated booking history
 *
 * GET /api/v1/members/bookings?page&limit&status&dateFrom&dateTo
 * Auth: Required (Bearer token)
 * Response: { data: BookingSummary[], meta: PaginationMeta }
 */
export async function getMemberBookings(params: BookingHistoryParams = {}): Promise<BookingHistoryResponse> {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status) queryParams.append('status', params.status);
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);

        const response = await axiosInstance.get(`${API_BASE}/members/bookings?${queryParams.toString()}`);
        return {
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        console.error('Failed to fetch member bookings:', error);
        throw error;
    }
}

export interface MemberProfile {
    id: string; // UUID
    email: string;
    fullName: string;
    phone: string;
    language: 'vi' | 'ja' | 'en' | 'zh';
    createdAt: string; // ISO 8601
    updatedAt?: string; // ISO 8601
}

export interface UpdateProfileParams {
    fullName: string;
    phone: string;
    language?: 'vi' | 'ja' | 'en' | 'zh';
}

// Deprecated: Using real backend API instead
// const MOCK_MEMBER_PROFILE: MemberProfile = {
//     id: 'member-uuid-001',
//     email: 'nguyenvana@gmail.com',
//     fullName: 'Nguyễn Văn A',
//     phone: '+84 912 345 678',
//     language: 'vi',
//     createdAt: '2024-06-15T08:30:00Z',
//     updatedAt: '2025-10-20T14:22:00Z',
// };

/**
 * Fetch member profile information
 * @returns Member profile data
 *
 * API: GET /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Response: { success, data: MemberProfile, timestamp }
 */
export async function getMemberProfile(): Promise<MemberProfile> {
    try {
        const response = await axiosInstance.get(`${API_BASE}/members/profile`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch member profile:', error);
        throw error;
    }
}

/**
 * Update member profile information
 * @param params - Fields to update (fullName, phone, language)
 * @returns Updated profile data
 *
 * API: PATCH /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Body: { fullName?, phone?, language? }
 * Response: { success, data: MemberProfile, timestamp }
 */
export async function updateMemberProfile(params: UpdateProfileParams): Promise<MemberProfile> {
    try {
        const response = await axiosInstance.patch(`${API_BASE}/members/profile`, params);
        return response.data.data;
    } catch (error) {
        console.error('Failed to update member profile:', error);
        throw error;
    }
}

// ============= Voucher Types & Mock Data =============

import { Voucher, getActiveVouchers } from './voucher';

/**
 * Get member's available vouchers (active vouchers from API)
 * @returns Array of active vouchers for the member
 *
 * API: GET /api/v1/vouchers/active
 * Auth: Not required (public endpoint)
 * Response: { data: Voucher[] }
 */
export async function getMemberVouchers(): Promise<Voucher[]> {
    try {
        const vouchers = await getActiveVouchers();
        return vouchers;
    } catch (error) {
        console.error('Failed to fetch member vouchers:', error);
        return []; // Return empty array if API fails
    }
}
