/**
 * Reviews API Client
 * Handles all review/testimonial-related API calls to backend
 */

import axios from 'axios';
import type {
  Review,
  ReviewsResponse,
  ReviewDetailResponse,
  ServiceRating,
  ServiceRatingResponse,
  ReviewParams,
  CreateReviewRequest,
  CreateReviewResponse,
} from '../types/review';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const reviewsApi = {
  /**
   * Get all approved reviews with pagination
   */
  getAllReviews: async (params?: ReviewParams): Promise<ReviewsResponse> => {
    const { data } = await axios.get(`${API_URL}/api/v1/reviews`, { params });
    return data;
  },

  /**
   * Get featured reviews for homepage (limit 3, recent)
   */
  getFeaturedReviews: async (limit: number = 3): Promise<Review[]> => {
    const response = await reviewsApi.getAllReviews({ 
      page: 1, 
      limit, 
      sort: 'recent' 
    });
    return response.data;
  },

  /**
   * Get a single review by ID
   */
  getReviewById: async (id: string): Promise<Review> => {
    const { data } = await axios.get(`${API_URL}/api/v1/reviews/${id}`);
    return data.data;
  },

  /**
   * Create a new review (pending approval)
   */
  createReview: async (reviewData: CreateReviewRequest): Promise<Review> => {
    const { data } = await axios.post(`${API_URL}/api/v1/reviews`, reviewData);
    return data.data;
  },

  /**
   * Get average rating for a service
   */
  getServiceRating: async (serviceId: string): Promise<ServiceRating> => {
    const { data } = await axios.get(
      `${API_URL}/api/v1/reviews/service/${serviceId}/rating`
    );
    return data.data;
  },
};

// Re-export types for convenience
export type {
  Review,
  ReviewsResponse,
  ReviewDetailResponse,
  ServiceRating,
  ServiceRatingResponse,
  ReviewParams,
  CreateReviewRequest,
  CreateReviewResponse,
};

// Re-export format utilities for convenience
export { formatReviewDate } from '../utils/format';

// Export legacy functions for backward compatibility
// TODO: Remove these and update all imports to use reviewsApi object
export const getAllReviews = reviewsApi.getAllReviews;
export const getFeaturedReviews = reviewsApi.getFeaturedReviews;
export const getReviewById = reviewsApi.getReviewById;
export const createReview = reviewsApi.createReview;
export const getServiceRating = reviewsApi.getServiceRating;
