/**
 * Review Type Definitions & DTOs
 *
 * Defines types for review requests, responses, and database entities.
 * Following clean architecture pattern: types → validators → repository → service → controller
 */

/**
 * Create Review Request DTO
 */
export interface CreateReviewRequest {
  serviceId: string;
  userId?: string;
  customerName: string;
  email: string;
  avatar?: string;
  rating: number;
  reviewText: string;
}

/**
 * Review DTO
 * Main review data transfer object
 */
export interface ReviewDTO {
  id: string;
  serviceId: string;
  userId?: string;
  customerName: string;
  customerAvatar?: string | null;
  email: string;
  rating: number;
  reviewText: string;
  approved: boolean;
  adminResponse?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Review with Service DTO
 * Extended review with service details
 */
export interface ReviewWithServiceDTO extends ReviewDTO {
  service: {
    id: string;
    name: string;
  };
}

/**
 * Service Rating DTO
 * Average rating and count for a service
 */
export interface ServiceRatingDTO {
  serviceId: string;
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

/**
 * Reviews List Response DTO
 * Paginated list of reviews
 */
export interface ReviewsListResponse {
  data: ReviewWithServiceDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
