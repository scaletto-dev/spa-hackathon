/**
 * Review Repository
 *
 * Data access layer for reviews.
 * Encapsulates all Prisma queries related to reviews.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class ReviewRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.review;

  /**
   * Find all approved reviews with pagination and filtering
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    serviceId?: string,
    sort: 'recent' | 'rating' = 'recent',
    rating?: number
  ) {
    const where: any = {
      approved: true,
    };

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (rating !== undefined) {
      where.rating = rating;
    }

    const orderBy: any = sort === 'rating' ? { rating: 'desc' } : { createdAt: 'desc' };
    const skip = (page - 1) * limit;

    // Get total count, reviews, and stats in parallel
    const [total, reviews, statsResult, distribution] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.review.aggregate({
        where: {
          approved: true,
        },
        _avg: {
          rating: true,
        },
        _count: true,
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          approved: true,
        },
        _count: true,
      }),
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    distribution.forEach((item) => {
      ratingDistribution[item.rating as keyof typeof ratingDistribution] = item._count;
    });

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      stats: {
        averageRating: statsResult._avg.rating || 0,
        totalReviews: statsResult._count,
        ratingDistribution,
      },
    };
  }

  /**
   * Find review by ID
   */
  async findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Create a new review (pending approval)
   */
  async create(data: any) {
    return prisma.review.create({
      data: {
        ...data,
        approved: false, // New reviews are pending approval
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get average rating for a service
   */
  async getServiceRating(serviceId: string) {
    const result = await prisma.review.aggregate({
      where: {
        serviceId,
        approved: true,
      },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    // Get rating distribution
    const distribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        serviceId,
        approved: true,
      },
      _count: true,
    });

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    distribution.forEach((item) => {
      ratingDistribution[item.rating as keyof typeof ratingDistribution] = item._count;
    });

    return {
      serviceId,
      averageRating: result._avg.rating || 0,
      totalReviews: result._count,
      ratingDistribution,
    };
  }

  /**
   * Check if service exists
   */
  async serviceExists(serviceId: string): Promise<boolean> {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    return !!service;
  }
}

export const reviewRepository = new ReviewRepository();
