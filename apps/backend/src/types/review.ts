/**
 * Review Type Definitions
 *
 * Types and interfaces for review-related operations
 */

export interface GetReviewsQueryParams {
    serviceId?: string;
    page?: string;
    limit?: string;
    sort?: 'recent' | 'rating' | 'helpful';
    rating?: string;
}

export interface CreateReviewDto {
    serviceId: string;
    userId?: string;
    customerName: string;
    email: string;
    avatar?: string;
    rating: number;
    reviewText: string;
}

export interface ReviewResponseDto {
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
