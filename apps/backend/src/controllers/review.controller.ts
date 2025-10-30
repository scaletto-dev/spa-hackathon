import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/review.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import { GetReviewsQueryParams, CreateReviewDto } from '../types/review';

/**
 * Review Controller
 * 
 * Handles HTTP requests for review endpoints.
 * Validates input, calls service layer, and formats responses.
 */

export class ReviewController {
  /**
   * GET /api/v1/reviews
   * Get all approved reviews with filtering and pagination
   */
  async getAllReviews(
    req: Request<{}, {}, {}, GetReviewsQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const serviceId = req.query.serviceId;
      const sort = req.query.sort || 'recent';

      // Validation
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await reviewService.getAllReviews(page, limit, serviceId, sort);

      const response: SuccessResponse<typeof result.data> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reviews/:id
   * Get a single review by ID
   */
  async getReviewById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const review = await reviewService.getReviewById(id);

      const response: SuccessResponse<typeof review> = {
        success: true,
        data: review,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/reviews
   * Create a new review (pending approval)
   */
  async createReview(
    req: Request<{}, {}, CreateReviewDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviewData: CreateReviewDto = req.body;

      // Validation
      if (!reviewData.serviceId || !reviewData.customerName || !reviewData.email || 
          !reviewData.rating || !reviewData.reviewText) {
        throw new ValidationError('Missing required fields');
      }

      const review = await reviewService.createReview(reviewData);

      const response: SuccessResponse<typeof review> = {
        success: true,
        data: review,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reviews/service/:serviceId/rating
   * Get average rating for a service
   */
  async getServiceRating(
    req: Request<{ serviceId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { serviceId } = req.params;
      const rating = await reviewService.getServiceRating(serviceId);

      const response: SuccessResponse<typeof rating> = {
        success: true,
        data: rating,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
