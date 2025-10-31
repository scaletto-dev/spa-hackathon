/**
 * Review Type Definitions
 *
 * Types for review/testimonial-related API responses and data structures
 */

export interface Review {
    id: string;
    serviceId: string;
    customerName: string;
    customerAvatar?: string | null;
    rating: number;
    reviewText: string;
    approved: boolean;
    adminResponse?: string | null;
    createdAt: string;
    updatedAt: string;
    service?: {
        id: string;
        name: string;
    };
}

export interface ReviewsResponse {
    success: boolean;
    data: Review[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    stats?: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    };
    timestamp: string;
}

export interface ReviewDetailResponse {
    success: boolean;
    data: Review;
    timestamp: string;
}

export interface ServiceRating {
    averageRating: number;
    totalReviews: number;
    ratingDistribution?: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface ServiceRatingResponse {
    success: boolean;
    data: ServiceRating;
    timestamp: string;
}

export interface ReviewParams {
    serviceId?: string;
    page?: number;
    limit?: number;
    sort?: 'recent' | 'rating' | 'helpful';
    rating?: number;
}

export interface CreateReviewRequest {
    serviceId: string;
    customerName: string;
    email: string;
    rating: number;
    reviewText: string;
    userId?: string;
}

export interface CreateReviewResponse {
    success: boolean;
    data: Review;
    message: string;
    timestamp: string;
}
