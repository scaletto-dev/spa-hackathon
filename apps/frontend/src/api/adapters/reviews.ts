/**
 * Reviews API Client
 * 
 * API functions for fetching and managing reviews/testimonials
 */

// ============= Types =============

export interface Review {
    id: string;
    serviceId: string;
    customerName: string;
    customerAvatar?: string | null;
    rating: number;
    reviewText: string;
    comment: string;
    date: string;
    branch?: string;
    approved: boolean;
    adminResponse?: string | null;
    createdAt: string;
    updatedAt: string;
    service?: {
        id: string;
        name: string;
    };
    verified?: boolean;
}

export interface ReviewsParams {
    page?: number;
    limit?: number;
    serviceId?: string;
    rating?: number;
    sortBy?: 'date' | 'rating' | 'helpful';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface ReviewsResponse {
    success: boolean;
    data: Review[];
    meta: PaginationMeta;
    stats: ReviewStats;
    timestamp: string;
}

// ============= API Configuration =============

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ============= API Functions =============

/**
 * Fetch public reviews with filters and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated reviews with stats
 * 
 * API: GET /api/v1/reviews?page&limit&serviceId&rating&sortBy&sortOrder
 * Auth: Public
 */
export async function getReviews(params: ReviewsParams = {}): Promise<ReviewsResponse> {
    const {
        page = 1,
        limit = 6,
        serviceId,
        rating,
        sortBy = 'date',
        sortOrder = 'desc'
    } = params;

    // Build query params
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    if (serviceId) queryParams.append('serviceId', serviceId);
    if (rating) queryParams.append('rating', rating.toString());

    // Make API request
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }

    const result = await response.json();
    return result;
}

/**
 * Get a single review by ID
 * @param id Review ID
 * @returns Single review details
 * 
 * API: GET /api/v1/reviews/:id
 * Auth: Public
 */
export async function getReviewById(id: string): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews/${id}`);

    if (!response.ok) {
        throw new Error('Failed to fetch review');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Submit a new review
 * @param data Review data
 * @returns Created review
 * 
 * API: POST /api/v1/reviews
 * Auth: Required
 */
export async function createReview(data: {
    serviceId: string;
    rating: number;
    reviewText: string;
    customerName: string;
    customerAvatar?: string;
}): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Get service rating statistics
 * @param serviceId Service ID
 * @returns Rating statistics
 * 
 * API: GET /api/v1/reviews/service/:serviceId/rating
 * Auth: Public
 */
export async function getServiceRating(serviceId: string): Promise<{
    averageRating: number;
    totalReviews: number;
}> {
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews/service/${serviceId}/rating`);

    if (!response.ok) {
        throw new Error('Failed to fetch service rating');
    }

    const result = await response.json();
    return result.data;
}
