import { Router } from 'express';
import reviewController from '../controllers/review.controller';

const router = Router();

/**
 * Review Routes
 * 
 * RESTful API endpoints for review management
 */

/**
 * GET /api/v1/reviews
 * Get all approved reviews with pagination and filtering
 * Query params: page, limit, serviceId, sort
 */
router.get('/', reviewController.getAllReviews.bind(reviewController));

/**
 * POST /api/v1/reviews
 * Create a new review (pending approval)
 */
router.post('/', reviewController.createReview.bind(reviewController));

/**
 * GET /api/v1/reviews/service/:serviceId/rating
 * Get average rating for a service
 */
router.get('/service/:serviceId/rating', reviewController.getServiceRating.bind(reviewController));

/**
 * GET /api/v1/reviews/:id
 * Get a single review by ID
 * Note: This must be last to avoid conflicts with other routes
 */
router.get('/:id', reviewController.getReviewById.bind(reviewController));

export default router;
