import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import { CreateReviewDto, ReviewResponseDto } from '../types/review';

/**
 * Review Service
 *
 * Business logic for review management
 */

class ReviewService {
    /**
     * Get all approved reviews with optional filtering and pagination
     */
    async getAllReviews(
        page: number = 1,
        limit: number = 20,
        serviceId?: string,
        sort: 'recent' | 'rating' | 'helpful' = 'recent',
        rating?: number,
    ) {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            approved: true, // Only show approved reviews
        };

        if (serviceId) {
            where.serviceId = serviceId;
        }

        if (rating !== undefined) {
            where.rating = rating;
        }

        // Build orderBy clause
        let orderBy: any = {};
        switch (sort) {
            case 'rating':
                orderBy = { rating: 'desc' };
                break;
            case 'recent':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        const [reviews, total] = await Promise.all([
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
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ]);

        // Transform data
        const data: ReviewResponseDto[] = reviews.map((review) => ({
            id: review.id,
            serviceId: review.serviceId,
            customerName: review.customerName,
            customerAvatar: review.avatar || null,
            rating: review.rating,
            reviewText: review.reviewText,
            approved: review.approved,
            adminResponse: review.adminResponse,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
            service: review.service,
        }));

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single review by ID
     */
    async getReviewById(id: string): Promise<ReviewResponseDto> {
        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });

        if (!review) {
            throw new NotFoundError('Review not found');
        }

        return {
            id: review.id,
            serviceId: review.serviceId,
            customerName: review.customerName,
            customerAvatar: review.avatar || null,
            rating: review.rating,
            reviewText: review.reviewText,
            approved: review.approved,
            adminResponse: review.adminResponse,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
            service: review.service,
        };
    }

    /**
     * Create a new review (pending approval)
     */
    async createReview(data: CreateReviewDto): Promise<ReviewResponseDto> {
        // Validate rating
        if (data.rating < 1 || data.rating > 5) {
            throw new ValidationError('Rating must be between 1 and 5');
        }

        // Validate review text length
        if (data.reviewText.length > 500) {
            throw new ValidationError('Review text must be less than 500 characters');
        }

        // Check if service exists
        const service = await prisma.service.findUnique({
            where: { id: data.serviceId },
        });

        if (!service) {
            throw new NotFoundError('Service not found');
        }

        // Create review (pending approval)
        const review = await prisma.review.create({
            data: {
                serviceId: data.serviceId,
                userId: data.userId || null,
                customerName: data.customerName,
                email: data.email,
                avatar: data.avatar || null,
                rating: data.rating,
                reviewText: data.reviewText,
                approved: false, // Pending moderation
            },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });

        return {
            id: review.id,
            serviceId: review.serviceId,
            customerName: review.customerName,
            customerAvatar: review.avatar || null,
            rating: review.rating,
            reviewText: review.reviewText,
            approved: review.approved,
            adminResponse: review.adminResponse,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
            service: review.service,
        };
    }

    /**
     * Get average rating for a service
     */
    async getServiceRating(serviceId: string) {
        const reviews = await prisma.review.findMany({
            where: {
                serviceId,
                approved: true,
            },
            select: {
                rating: true,
            },
        });

        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviews.length,
        };
    }
}

export default new ReviewService();
