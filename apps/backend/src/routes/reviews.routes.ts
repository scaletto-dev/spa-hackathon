import { Router } from 'express';
import reviewController from '@/controllers/review.controller';
import { validate } from '@/middleware/validate';
import {
  getReviewsQuerySchema,
  getReviewParamsSchema,
  createReviewSchema,
  getServiceRatingParamsSchema,
} from '@/validators/review.validator';

const router = Router();

/**
 * Review Routes
 *
 * RESTful API endpoints for review management
 * All endpoints include automatic request validation via Zod schemas
 */

/**
 * GET /api/v1/reviews
 * Get all approved reviews with pagination and filtering
 * Query params: page, limit, serviceId, sort, rating
 *
 * Validation: Auto-validates query params with pagination and optional filters
 */
router.get(
  '/',
  validate(getReviewsQuerySchema, 'query'),
  reviewController.getAllReviews.bind(reviewController)
);

/**
 * POST /api/v1/reviews
 * Create a new review (pending approval)
 *
 * Body: serviceId, customerName, email, rating, reviewText, userId (optional), avatar (optional)
 * Validation: Auto-validates body schema
 */
router.post(
  '/',
  validate(createReviewSchema, 'body'),
  reviewController.createReview.bind(reviewController)
);

/**
 * GET /api/v1/reviews/service/:serviceId/rating
 * Get average rating for a service
 *
 * Path Parameters:
 * - serviceId: UUID - Service ID
 *
 * Validation: Auto-validates path param as UUID
 */
router.get(
  '/service/:serviceId/rating',
  validate(getServiceRatingParamsSchema, 'params'),
  reviewController.getServiceRating.bind(reviewController)
);

/**
 * GET /api/v1/reviews/:id
 * Get a single review by ID
 *
 * Path Parameters:
 * - id: UUID - Review ID
 *
 * Validation: Auto-validates path param as UUID
 * Note: This must be last to avoid conflicts with other routes
 */
router.get(
  '/:id',
  validate(getReviewParamsSchema, 'params'),
  reviewController.getReviewById.bind(reviewController)
);

export default router;
