import { Request, Response, NextFunction } from 'express';
import blogService from '@/services/blog.service';
import { SuccessResponse } from '@/types/api';
import { GetBlogPostsQuery, GetBlogPostParams } from '@/validators/blog.validator';

/**
 * Blog Controller
 *
 * Handles HTTP requests for blog endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */
export class BlogController {
  /**
   * GET /api/v1/blog/posts
   * Get all published blog posts with pagination and optional filtering
   */
  async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedQuery)
      const {
        page = 1,
        limit = 6,
        categoryId,
        search,
      } = (req as any).validatedQuery as GetBlogPostsQuery;

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
   * Get a single blog post by slug with related posts
   */
  async getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.validatedParams
      const { slug } = (req as any).validatedParams as GetBlogPostParams;

      const { post, relatedPosts } = await blogService.getPostBySlug(slug);

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
   * Get all blog categories with post counts
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
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
