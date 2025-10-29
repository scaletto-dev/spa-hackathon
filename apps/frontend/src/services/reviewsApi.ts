/**
 * Reviews API Client
 * 
 * API functions for fetching and managing reviews/testimonials
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
  timestamp: string;
}

export interface ServiceRating {
  averageRating: number;
  totalReviews: number;
}

/**
 * Get all approved reviews
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with array of reviews and pagination metadata
 */
export async function getAllReviews(params?: {
  serviceId?: string;
  page?: number;
  limit?: number;
  sort?: 'recent' | 'rating' | 'helpful';
}): Promise<Review[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.serviceId) queryParams.append('serviceId', params.serviceId);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const url = `${API_BASE_URL}/api/v1/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  
  const result: ReviewsResponse = await response.json();
  return result.data;
}

/**
 * Get reviews for display on homepage (limit 3, recent)
 * @returns Promise with array of 3 most recent reviews
 */
export async function getFeaturedReviews(limit: number = 3): Promise<Review[]> {
  return getAllReviews({ page: 1, limit, sort: 'recent' });
}

/**
 * Get a single review by ID
 * @param id - Review ID
 * @returns Promise with review data
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
 * Create a new review (pending approval)
 * @param reviewData - Review data
 * @returns Promise with created review
 */
export async function createReview(reviewData: {
  serviceId: string;
  customerName: string;
  email: string;
  rating: number;
  reviewText: string;
  userId?: string;
}): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create review');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Get average rating for a service
 * @param serviceId - Service ID
 * @returns Promise with average rating and total reviews
 */
export async function getServiceRating(serviceId: string): Promise<ServiceRating> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reviews/service/${serviceId}/rating`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch service rating');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Hôm nay';
  } else if (diffInDays === 1) {
    return 'Hôm qua';
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} tuần trước`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} tháng trước`;
  } else {
    return date.toLocaleDateString('vi-VN');
  }
}
