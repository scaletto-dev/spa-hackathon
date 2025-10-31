/**
 * API Type Definitions - Generated from Frontend Analysis
 *
 * These types match exactly with frontend interfaces for 1:1 mapping
 * Source: apps/frontend/src/store/mockDataStore.ts
 * Generated: October 29, 2025
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
    data: T;
    meta?: PaginationMeta;
}

export interface ApiError {
    error: {
        message: string;
        code: string;
        details?: Record<string, unknown>;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

// ============================================================================
// Authentication & User Types
// ============================================================================

export type UserRole = 'client' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    token: string;
    expiresAt?: string; // ISO 8601 date-time
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface GoogleAuthRequest {
    credential: string; // Google JWT token
    provider: 'google' | 'google-admin';
}

// ============================================================================
// Service Types
// ============================================================================

export interface Service {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: string; // e.g., "60 min", "45 min"
    price: number;
    image: string; // URL
    active: boolean;
    createdAt?: string; // ISO 8601 date-time
    updatedAt?: string; // ISO 8601 date-time
}

export interface CreateServiceRequest {
    name: string;
    category: string;
    description: string;
    duration: string;
    price: number;
    image: string;
    active: boolean;
}

export type UpdateServiceRequest = Partial<CreateServiceRequest>;

// ============================================================================
// Branch Types
// ============================================================================

export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string; // Plain text: "Monday - Friday: 9AM - 7PM\nSaturday: 10AM - 5PM"
    image: string; // URL
    location: {
        lat: number;
        lng: number;
    };
    services: string[]; // Array of service names (not IDs)
    createdAt?: string; // ISO 8601 date-time
    updatedAt?: string; // ISO 8601 date-time
}

export interface CreateBranchRequest {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    image: string;
    location: {
        lat: number;
        lng: number;
    };
    services: string[];
}

export type UpdateBranchRequest = Partial<CreateBranchRequest>;

// ============================================================================
// Booking / Appointment Types
// ============================================================================

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

export interface Appointment {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string; // Service name
    therapist: string; // Staff name
    branch: string; // Branch name
    date: string; // ISO date: "2025-10-30"
    time: string; // Time string: "10:00 AM"
    duration: string; // e.g., "60 min"
    status: AppointmentStatus;
    paymentStatus: PaymentStatus;
    price: number;
    notes?: string;
    customerId?: number | null; // Null for guest bookings
}

export interface CreateBookingRequest {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    therapist: string;
    branch: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    notes?: string;
    customerId?: number | null;
}

export interface UpdateAppointmentRequest {
    status?: AppointmentStatus;
}

// ============================================================================
// Customer Types
// ============================================================================

export type MembershipTier = 'new' | 'silver' | 'gold' | 'vip';

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateJoined: string; // ISO date
    totalVisits: number;
    totalSpent: number;
    lastVisit: string; // ISO date
    notes: string;
    avatar?: string; // URL, optional
    membershipTier?: MembershipTier; // Optional
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone: string;
    notes?: string;
}

export interface UpdateCustomerRequest {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

// ============================================================================
// Staff Types
// ============================================================================

export interface Staff {
    id: number;
    name: string;
    role: string; // e.g., "Facial Specialist", "Massage Therapist"
    email: string;
    phone: string;
    branch: string; // Branch name
    specialties: string[]; // e.g., ["Facial Treatments", "Skin Analysis"]
    image: string; // URL
    rating: number; // Average rating (e.g., 4.9)
    totalBookings: number; // Total number of bookings
    active: boolean;
}

export interface CreateStaffRequest {
    name: string;
    role: string;
    email: string;
    phone: string;
    branch: string;
    specialties: string[];
    image: string;
    active: boolean;
}

export type UpdateStaffRequest = Partial<CreateStaffRequest>;

// ============================================================================
// Review Types
// ============================================================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
    id: number;
    customerName: string;
    customerAvatar?: string; // URL, optional
    service: string; // Service name
    rating: number; // 1-5
    comment: string;
    date: string; // ISO date
    branch: string; // Branch name
    reply?: string; // Admin reply, optional
    replyDate?: string; // ISO date, optional
    status?: ReviewStatus; // Only in admin view
}

export interface CreateReviewRequest {
    customerName: string;
    customerEmail: string;
    service: string;
    rating: number; // 1-5
    comment: string;
    branch: string;
}

export interface UpdateReviewRequest {
    reply?: string;
    status?: ReviewStatus;
}

// ============================================================================
// Blog Post Types
// ============================================================================

export interface BlogPost {
    id: number;
    title: string;
    slug: string; // URL-friendly slug
    excerpt: string; // Short description
    content: string; // Full content (HTML/Markdown)
    category: string;
    author: string;
    authorAvatar?: string; // URL, optional
    image: string; // Featured image URL
    date: string; // ISO date
    readTime: string; // e.g., "5 min", "7 min"
    views: number; // View counter
    published: boolean;
    tags: string[]; // Array of tags
}

export interface CreateBlogPostRequest {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image: string;
    published: boolean;
    tags: string[];
}

export type UpdateBlogPostRequest = Partial<CreateBlogPostRequest>;

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethodStatus = 'completed' | 'pending' | 'refunded' | 'failed';

export interface Payment {
    id: number;
    appointmentId: number;
    customerName: string;
    customerEmail?: string; // Only in details view
    amount: number;
    method: string; // e.g., "Credit Card", "Digital Wallet"
    status: PaymentMethodStatus;
    date: string; // ISO date
    transactionId: string; // Payment gateway transaction ID
    service: string; // Service name
    refundAmount?: number; // Only if refunded
    refundReason?: string; // Only if refunded
    refundDate?: string; // ISO date-time, only if refunded
}

export interface RefundPaymentRequest {
    amount: number;
    reason: string;
}

export interface RefundPaymentResponse {
    id: number;
    status: 'refunded';
    refundAmount: number;
    refundReason: string;
    refundDate: string; // ISO date-time
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardMetrics {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    pendingReviews: number;
    revenueChange: number; // Percentage change
    bookingsChange: number; // Percentage change
    customersChange: number; // Percentage change
    recentBookings: Array<{
        id: number;
        customerName: string;
        service: string;
        date: string;
        status: string;
    }>;
}

// ============================================================================
// File Upload Types
// ============================================================================

export type UploadFolder = 'services' | 'branches' | 'blog' | 'profile' | 'staff';

export interface UploadImageRequest {
    file: File; // Binary file (multipart/form-data)
    folder: UploadFolder;
}

export interface UploadImageResponse {
    url: string; // Public URL of uploaded file
    id: string; // File ID
    folder: UploadFolder;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface ServiceListParams extends PaginationParams {
    category?: string;
    active?: boolean;
}

export interface AppointmentListParams extends PaginationParams {
    branch?: string;
    status?: AppointmentStatus;
    q?: string; // Search query
}

export interface CustomerListParams extends PaginationParams {
    q?: string; // Search query
}

export interface ReviewListParams extends PaginationParams {
    serviceId?: number;
    status?: ReviewStatus;
}

export interface BlogPostListParams extends PaginationParams {
    category?: string;
    published?: boolean;
}

export interface PaymentListParams extends PaginationParams {
    status?: PaymentMethodStatus;
    dateFrom?: string; // ISO date
    dateTo?: string; // ISO date
}

// ============================================================================
// Availability Types (TODO - Not yet implemented)
// ============================================================================

export interface AvailabilityCheckParams {
    serviceId: number;
    branchId: number;
    date: string; // ISO date
}

export interface AvailabilitySlot {
    time: string; // e.g., "09:00"
    available: boolean;
}

export interface AvailabilityCheckResponse {
    date: string; // ISO date
    availableSlots: AvailabilitySlot[];
}

// ============================================================================
// Contact Form Types (TODO - Not yet implemented)
// ============================================================================

export interface ContactFormRequest {
    name: string;
    email: string;
    phone: string;
    message: string;
    subject?: string;
}

// ============================================================================
// Profile Types (TODO - Not yet implemented)
// ============================================================================

export interface ClientProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string; // URL
    createdAt: string; // ISO date-time
}

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    avatar?: string;
}

// ============================================================================
// Staff Availability Types (TODO - Not yet implemented)
// ============================================================================

export interface StaffAvailabilityParams {
    branchId: number;
    serviceId: number;
}

export interface StaffAvailability {
    id: number;
    name: string;
    role: string;
    specialties: string[];
    image: string;
    rating: number;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isApiError(response: unknown): response is ApiError;

export function isApiResponse<T>(response: unknown): response is ApiResponse<T>;

// ============================================================================
// Utility Types
// ============================================================================

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type ApiEndpoint =
    | '/auth/register'
    | '/auth/login'
    | '/auth/google'
    | '/auth/logout'
    | '/admin/auth/login'
    | '/admin/auth/google'
    | '/services'
    | '/services/:id'
    | '/branches'
    | '/bookings'
    | '/admin/appointments'
    | '/admin/appointments/:id'
    | '/admin/customers'
    | '/admin/customers/:id'
    | '/admin/staff'
    | '/admin/staff/:id'
    | '/admin/services'
    | '/admin/services/:id'
    | '/admin/branches'
    | '/admin/branches/:id'
    | '/reviews'
    | '/admin/reviews'
    | '/admin/reviews/:id'
    | '/blog/posts'
    | '/blog/posts/:slug'
    | '/admin/blog/posts'
    | '/admin/blog/posts/:id'
    | '/admin/payments'
    | '/admin/payments/:id'
    | '/admin/payments/:id/refund'
    | '/admin/dashboard/metrics'
    | '/admin/uploads';

// ============================================================================
// Field Name Constants (for form validation and mapping)
// ============================================================================

export declare const FIELD_NAMES: {
    // User fields
    readonly USER: {
        readonly ID: 'id';
        readonly NAME: 'name';
        readonly EMAIL: 'email';
        readonly PHONE: 'phone';
        readonly PASSWORD: 'password';
        readonly ROLE: 'role';
    };

    // Booking fields
    readonly BOOKING: {
        readonly CUSTOMER_NAME: 'customerName';
        readonly CUSTOMER_EMAIL: 'customerEmail';
        readonly CUSTOMER_PHONE: 'customerPhone';
        readonly SERVICE: 'service';
        readonly THERAPIST: 'therapist';
        readonly BRANCH: 'branch';
        readonly DATE: 'date';
        readonly TIME: 'time';
        readonly DURATION: 'duration';
        readonly PRICE: 'price';
        readonly NOTES: 'notes';
        readonly STATUS: 'status';
        readonly PAYMENT_STATUS: 'paymentStatus';
    };

    // Service fields
    readonly SERVICE: {
        readonly NAME: 'name';
        readonly CATEGORY: 'category';
        readonly DESCRIPTION: 'description';
        readonly DURATION: 'duration';
        readonly PRICE: 'price';
        readonly IMAGE: 'image';
        readonly ACTIVE: 'active';
    };

    // Branch fields
    readonly BRANCH: {
        readonly NAME: 'name';
        readonly ADDRESS: 'address';
        readonly PHONE: 'phone';
        readonly EMAIL: 'email';
        readonly HOURS: 'hours';
        readonly IMAGE: 'image';
        readonly LOCATION: 'location';
        readonly SERVICES: 'services';
    };

    // Common fields
    readonly COMMON: {
        readonly ID: 'id';
        readonly CREATED_AT: 'createdAt';
        readonly UPDATED_AT: 'updatedAt';
        readonly PAGE: 'page';
        readonly LIMIT: 'limit';
        readonly TOTAL: 'total';
    };
};
