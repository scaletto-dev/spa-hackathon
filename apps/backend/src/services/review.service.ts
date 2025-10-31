import { NotFoundError } from '@/utils/errors';
import { reviewRepository } from '@/repositories/review.repository';
import { ReviewDTO, ReviewWithServiceDTO, ServiceRatingDTO, ReviewsListResponse } from '@/types/review';

/**
 * Transform review to ReviewDTO
 */
function toReviewDTO(review: any): ReviewDTO {
  return {
    id: review.id,
    serviceId: review.serviceId,
    userId: review.userId,
    customerName: review.customerName,
    customerAvatar: review.avatar || null,
    email: review.email,
    rating: review.rating,
    reviewText: review.reviewText,
    approved: review.approved,
    adminResponse: review.adminResponse || null,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

/**
 * Transform review with service to ReviewWithServiceDTO
 */
function toReviewWithServiceDTO(review: any): ReviewWithServiceDTO {
  return {
    ...toReviewDTO(review),
    service: review.service,
  };
}

export class ReviewService {
  /**
   * Get all approved reviews with optional filtering and pagination
   */
  async getAllReviews(
    page: number = 1,
    limit: number = 20,
    serviceId?: string,
    sort: 'recent' | 'rating' = 'recent',
    rating?: number
  ): Promise<ReviewsListResponse> {
    const result = await reviewRepository.findAllWithPagination(
      page,
      limit,
      serviceId,
      sort,
      rating
    );

    return {
      data: result.reviews.map(toReviewWithServiceDTO),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(id: string): Promise<ReviewWithServiceDTO> {
    const review = await reviewRepository.findById(id);

    if (!review) {
      throw new NotFoundError(`Review with ID '${id}' not found`);
    }

    return toReviewWithServiceDTO(review);
  }

  /**
   * Create a new review (pending approval)
   */
  async createReview(data: any): Promise<ReviewWithServiceDTO> {
    // Validate service exists
    const serviceExists = await reviewRepository.serviceExists(data.serviceId);

    if (!serviceExists) {
      throw new NotFoundError(`Service with ID '${data.serviceId}' not found`);
    }

    const review = await reviewRepository.create({
      serviceId: data.serviceId,
      userId: data.userId || null,
      customerName: data.customerName,
      email: data.email,
      avatar: data.avatar || null,
      rating: data.rating,
      reviewText: data.reviewText,
    });

    return toReviewWithServiceDTO(review);
  }

  /**
   * Get average rating for a service
   */
  async getServiceRating(serviceId: string): Promise<ServiceRatingDTO> {
    const result = await reviewRepository.getServiceRating(serviceId);
    return result;
  }
}

export default new ReviewService();
