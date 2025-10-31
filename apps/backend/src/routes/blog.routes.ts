import { Router } from 'express';
import blogController from '@/controllers/blog.controller';
import { validate } from '@/middleware/validate';
import {
  getBlogPostsQuerySchema,
  getBlogPostParamsSchema,
  getBlogCategoriesQuerySchema,
} from '@/validators/blog.validator';

const router = Router();

/**
 * Blog Routes
 *
 * RESTful API endpoints for blog management
 * All endpoints include automatic request validation via Zod schemas
 */

/**
 * GET /api/v1/blog/categories
 * Get all blog categories with post counts
 *
 * Validation: Auto-validates query (no params needed)
 */
router.get('/categories', validate(getBlogCategoriesQuerySchema, 'query'), blogController.getAllCategories.bind(blogController));

/**
 * GET /api/v1/blog/posts
 * Get all published blog posts with pagination and optional filtering
 *
 * Query params: page, limit, categoryId (optional), search (optional)
 * Validation: Auto-validates query params with pagination
 */
router.get('/posts', validate(getBlogPostsQuerySchema, 'query'), blogController.getAllPosts.bind(blogController));

/**
 * GET /api/v1/blog/posts/:slug
 * Get a single blog post by slug with related posts
 *
 * Path Parameters:
 * - slug: string - Post's URL slug
 *
 * Validation: Auto-validates path param
 * Note: This must be last to avoid conflicts with other routes
 */
router.get('/posts/:slug', validate(getBlogPostParamsSchema, 'params'), blogController.getPostBySlug.bind(blogController));

export default router;