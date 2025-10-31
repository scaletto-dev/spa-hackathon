/**
 * Review Validators
 *
 * Zod schemas for validating review request data
 */

import { z } from 'zod';

/**
 * Schema: GET /api/v1/reviews
 * Query parameters with pagination and filtering
 */
export const getReviewsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
  serviceId: z.string().uuid('Invalid service ID format').optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
  sort: z
    .enum(['recent', 'rating'])
    .default('recent')
    .optional(),
});

export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;

/**
 * Schema: GET /api/v1/reviews/:id
 * Path parameters
 */
export const getReviewParamsSchema = z.object({
  id: z.string().uuid('Invalid review ID format'),
});

export type GetReviewParams = z.infer<typeof getReviewParamsSchema>;

/**
 * Schema: POST /api/v1/reviews
 * Body validation for creating a review
 */
export const createReviewSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID format'),
  userId: z.string().uuid('Invalid user ID format').optional(),
  customerName: z.string().min(2, 'Customer name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  avatar: z.string().url('Invalid avatar URL').optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  reviewText: z.string()
    .min(10, 'Review text must be at least 10 characters')
    .max(1000, 'Review text must be at most 1000 characters'),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

/**
 * Schema: GET /api/v1/reviews/service/:serviceId/rating
 * Path parameters
 */
export const getServiceRatingParamsSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID format'),
});

export type GetServiceRatingParams = z.infer<typeof getServiceRatingParamsSchema>;
