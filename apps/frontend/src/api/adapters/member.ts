/**
 * Member Dashboard API Adapter (MOCK)
 * TODO: Replace with real API integration when backend is ready
 * All functions return mock data shaped according to expected API responses
 */

// ============= Types =============

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

// ============= Mock Data =============

const MOCK_UPCOMING_BOOKINGS: BookingSummary[] = [
    {
        id: '1',
        referenceNumber: 'BCW-2025-000123',
        serviceName: 'AI Skin Analysis Facial',
        branchName: 'Chi nhánh Trung tâm',
        appointmentDate: '2025-11-05T10:00:00Z',
        appointmentTime: '10:00',
        status: 'confirmed',
        serviceImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    },
    {
        id: '2',
        referenceNumber: 'BCW-2025-000124',
        serviceName: 'Hydrafacial Treatment',
        branchName: 'Chi nhánh Tây',
        appointmentDate: '2025-11-12T14:30:00Z',
        appointmentTime: '14:30',
        status: 'confirmed',
        serviceImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
    },
    {
        id: '3',
        referenceNumber: 'BCW-2025-000125',
        serviceName: 'Laser Hair Removal',
        branchName: 'Chi nhánh Đông',
        appointmentDate: '2025-11-20T16:00:00Z',
        appointmentTime: '16:00',
        status: 'confirmed',
        serviceImage: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=300&fit=crop',
    },
];

const MOCK_SPECIAL_OFFERS: SpecialOffer[] = [
    {
        id: '1',
        title: '20% OFF Facial Treatments',
        description: 'Get 20% discount on all facial treatments this month',
        discountPercent: 20,
        validUntil: '2025-11-30T23:59:59Z',
        imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop',
    },
    {
        id: '2',
        title: 'Free Skin Analysis',
        description: 'Complimentary AI skin analysis with any service booking',
        discountPercent: 100,
        validUntil: '2025-12-15T23:59:59Z',
        imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop',
    },
];

// Mock data for booking history (all statuses)
const MOCK_ALL_BOOKINGS: BookingSummary[] = [
    ...MOCK_UPCOMING_BOOKINGS,
    {
        id: '4',
        referenceNumber: 'BCW-2025-000120',
        serviceName: 'Botox & Fillers',
        branchName: 'Chi nhánh Trung tâm',
        appointmentDate: '2025-10-15T09:00:00Z',
        appointmentTime: '09:00',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
    },
    {
        id: '5',
        referenceNumber: 'BCW-2025-000118',
        serviceName: 'Body Contouring',
        branchName: 'Chi nhánh Đông',
        appointmentDate: '2025-10-08T15:00:00Z',
        appointmentTime: '15:00',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    },
    {
        id: '6',
        referenceNumber: 'BCW-2025-000115',
        serviceName: 'Hydrafacial Treatment',
        branchName: 'Chi nhánh Tây',
        appointmentDate: '2025-09-28T11:30:00Z',
        appointmentTime: '11:30',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
    },
    {
        id: '7',
        referenceNumber: 'BCW-2025-000112',
        serviceName: 'AI Skin Analysis Facial',
        branchName: 'Chi nhánh Trung tâm',
        appointmentDate: '2025-09-20T14:00:00Z',
        appointmentTime: '14:00',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    },
    {
        id: '8',
        referenceNumber: 'BCW-2025-000110',
        serviceName: 'Laser Hair Removal',
        branchName: 'Chi nhánh Tây',
        appointmentDate: '2025-09-15T10:00:00Z',
        appointmentTime: '10:00',
        status: 'cancelled',
        serviceImage: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=300&fit=crop',
    },
    {
        id: '9',
        referenceNumber: 'BCW-2025-000108',
        serviceName: 'Botox & Fillers',
        branchName: 'Chi nhánh Đông',
        appointmentDate: '2025-09-10T16:30:00Z',
        appointmentTime: '16:30',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
    },
    {
        id: '10',
        referenceNumber: 'BCW-2025-000105',
        serviceName: 'AI Skin Analysis Facial',
        branchName: 'Chi nhánh Trung tâm',
        appointmentDate: '2025-08-25T13:00:00Z',
        appointmentTime: '13:00',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    },
    {
        id: '11',
        referenceNumber: 'BCW-2025-000102',
        serviceName: 'Hydrafacial Treatment',
        branchName: 'Chi nhánh Tây',
        appointmentDate: '2025-08-18T10:30:00Z',
        appointmentTime: '10:30',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
    },
    {
        id: '12',
        referenceNumber: 'BCW-2025-000100',
        serviceName: 'Body Contouring',
        branchName: 'Chi nhánh Đông',
        appointmentDate: '2025-08-12T14:00:00Z',
        appointmentTime: '14:00',
        status: 'completed',
        serviceImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    },
];

// ============= API Functions (MOCK) =============

/**
 * Fetch member dashboard overview data
 * @returns Dashboard data with stats, upcoming bookings, and offers
 *
 * TODO API: GET /api/v1/members/dashboard
 * Auth: Required (Bearer token)
 * Response: { data: MemberDashboardData }
 */
export async function getMemberDashboard(): Promise<MemberDashboardData> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
        stats: {
            totalBookings: 12,
            upcomingBookings: 3,
            completedBookings: 9,
            memberPoints: 450,
        },
        upcomingBookings: MOCK_UPCOMING_BOOKINGS,
        specialOffers: MOCK_SPECIAL_OFFERS,
    };
}

/**
 * Quick action: Book new appointment
 * Redirects to booking page with pre-filled member data
 *
 * TODO API: Member data auto-fill from GET /api/v1/members/profile
 */
export function quickBookAppointment(): void {
    // Client-side navigation, no API call needed
    window.location.href = '/booking';
}

/**
 * Fetch member booking history with pagination and filters
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated booking history
 *
 * TODO API: GET /api/v1/members/bookings?page&limit&status&dateFrom&dateTo
 * Auth: Required (Bearer token)
 * Response: { data: BookingSummary[], meta: PaginationMeta }
 */
export async function getMemberBookings(params: BookingHistoryParams = {}): Promise<BookingHistoryResponse> {
    const { page = 1, limit = 10, status = 'all', dateFrom, dateTo } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Filter bookings by status
    let filteredBookings = [...MOCK_ALL_BOOKINGS];

    if (status !== 'all') {
        filteredBookings = filteredBookings.filter((b) => b.status === status);
    }

    // Filter by date range
    if (dateFrom) {
        filteredBookings = filteredBookings.filter((b) => new Date(b.appointmentDate) >= new Date(dateFrom));
    }
    if (dateTo) {
        filteredBookings = filteredBookings.filter((b) => new Date(b.appointmentDate) <= new Date(dateTo));
    }

    // Sort by date (newest first)
    filteredBookings.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

    // Calculate pagination
    const total = filteredBookings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredBookings.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    };
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

const MOCK_MEMBER_PROFILE: MemberProfile = {
    id: 'member-uuid-001',
    email: 'nguyenvana@gmail.com',
    fullName: 'Nguyễn Văn A',
    phone: '+84 912 345 678',
    language: 'vi',
    createdAt: '2024-06-15T08:30:00Z',
    updatedAt: '2025-10-20T14:22:00Z',
};

/**
 * Fetch member profile information
 * @returns Member profile data
 *
 * TODO API: GET /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Response: { data: MemberProfile }
 */
export async function getMemberProfile(): Promise<MemberProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a copy to avoid mutations
    return { ...MOCK_MEMBER_PROFILE };
}

/**
 * Update member profile information
 * @param params - Fields to update (fullName, phone, language)
 * @returns Updated profile data
 *
 * TODO API: PUT /api/v1/members/profile
 * Auth: Required (Bearer token)
 * Body: { fullName, phone, language? }
 * Response: { data: MemberProfile }
 */
export async function updateMemberProfile(params: UpdateProfileParams): Promise<MemberProfile> {
    const { fullName, phone, language } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Update mock data
    MOCK_MEMBER_PROFILE.fullName = fullName;
    MOCK_MEMBER_PROFILE.phone = phone;
    if (language) {
        MOCK_MEMBER_PROFILE.language = language;
    }
    MOCK_MEMBER_PROFILE.updatedAt = new Date().toISOString();

    // Return updated copy
    return { ...MOCK_MEMBER_PROFILE };
}