/**
 * Admin Reviews Controller
 *
 * Handles HTTP requests for admin review management
 * Includes approval, responding to reviews
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/database';
import { ValidationError, NotFoundError } from '../../utils/errors';

class AdminReviewsController {
  /**
   * GET /api/v1/admin/reviews
   * Get all reviews with pagination and filtering
   */
  async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const approved = req.query.approved as string;
      const serviceId = req.query.serviceId as string;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (approved !== undefined) where.approved = approved === 'true';
      if (serviceId) where.serviceId = serviceId;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          include: {
            service: true,
            user: { select: { id: true, fullName: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: reviews,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/reviews/:id
   * Get review details by ID
   */
  async getReviewById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Review ID is required');

      const review = await prisma.review.findUnique({
        where: { id },
        include: { service: true, user: true },
      });

      if (!review) throw new NotFoundError('Review not found');

      res.status(200).json({
        success: true,
        data: review,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/reviews/:id/approve
   * Approve a review
   */
  async approveReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Review ID is required');

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundError('Review not found');

      const updated = await prisma.review.update({
        where: { id },
        data: { approved: true },
      });

      res.status(200).json({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/reviews/:id/reject
   * Reject a review
   */
  async rejectReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Review ID is required');

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundError('Review not found');

      await prisma.review.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Review rejected and deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/reviews/:id/response
   * Add admin response to a review
   */
  async addResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { response } = req.body;

      if (!id) throw new ValidationError('Review ID is required');
      if (!response) throw new ValidationError('Response text is required');

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundError('Review not found');

      const updated = await prisma.review.update({
        where: { id },
        data: { adminResponse: response },
      });

      res.status(200).json({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/reviews/:id
   * Delete a review
   */
  async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Review ID is required');

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundError('Review not found');

      await prisma.review.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminReviewsController();
