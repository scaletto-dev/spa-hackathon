import { Request, Response, NextFunction } from 'express';
import blogService from '../services/blog.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import { GetBlogPostsQueryParams } from '../types/blog';

/**
 * Blog Controller
 * 
 * Handles HTTP requests for blog endpoints.
 * Validates input, calls service layer, and formats responses.
 */
export class BlogController {
    /**
     * GET /api/v1/blog/posts
     * Get all published blog posts with pagination and search
     */
    async getAllPosts(
        req: Request<{}, {}, {}, GetBlogPostsQueryParams>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '6', 10);
            const categoryId = req.query.categoryId;
            const search = req.query.search;

            // Validation
            if (page < 1) {
                throw new ValidationError('Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ValidationError('Limit must be between 1 and 100');
            }

            const result = await blogService.getAllPosts(page, limit, categoryId, search);

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
     * GET /api/v1/blog/posts/:slug
     * Get a single blog post by slug
     */
    async getPostBySlug(
        req: Request<{ slug: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { slug } = req.params;
            const post = await blogService.getPostBySlug(slug);

            // Get related posts
            const relatedPosts = await blogService.getRelatedPosts(post.categoryId, post.id);

            const response: SuccessResponse<typeof post & { relatedPosts: typeof relatedPosts }> = {
                success: true,
                data: {
                    ...post,
                    relatedPosts,
                },
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/blog/categories
     * Get all blog categories with post count
     */
    async getAllCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const categories = await blogService.getAllCategories();

            const response: SuccessResponse<typeof categories> = {
                success: true,
                data: categories,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new BlogController();