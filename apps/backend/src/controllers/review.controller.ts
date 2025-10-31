import { Request, Response, NextFunction } from 'express';
import reviewService from '@/services/review.service';
import { SuccessResponse } from '@/types/api';
import {
  GetReviewsQuery,
  GetReviewParams,
  CreateReviewRequest,
  GetServiceRatingParams,
} from '@/validators/review.validator';

/**
 * Review Controller
 *
 * Handles HTTP requests for review endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */

export class ReviewController {
  /**
   * GET /api/v1/reviews
   * Get all approved reviews with filtering and pagination
   */
  async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedQuery)
      const {
        page = 1,
        limit = 20,
        serviceId,
        rating,
        sort = 'recent',
      } = (req as any).validatedQuery as GetReviewsQuery;

      const result = await reviewService.getAllReviews(
        page,
        limit,
        serviceId,
        sort as 'recent' | 'rating',
        rating
      );

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
  async getReviewById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware validated req.params
      const { id } = req.params as GetReviewParams;

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
  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware validated req.body
      const reviewData = req.body as unknown as CreateReviewRequest;

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
  async getServiceRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.validatedParams
      const { serviceId } = (req as any).validatedParams as GetServiceRatingParams;

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
