import { Router } from 'express';
import blogController from '../controllers/blog.controller';

const router = Router();

/**
 * Blog Routes
 * 
 * Defines API endpoints for blog post retrieval
 */

/**
 * GET /api/v1/blog/categories
 * Get all blog categories with post count
 * 
 * Response:
 * - Array of categories with id, name, slug, description, postCount
 */
router.get('/categories', blogController.getAllCategories.bind(blogController));

/**
 * GET /api/v1/blog/posts
 * Get all published blog posts with pagination
 * 
 * Query Parameters:
 * - page: number (optional, default: 1) - Page number
 * - limit: number (optional, default: 6) - Items per page
 * - categoryId: string (optional) - Filter by category ID
 */
router.get('/posts', blogController.getAllPosts.bind(blogController));

/**
 * GET /api/v1/blog/posts/:slug
 * Get a single blog post by slug
 * 
 * Path Parameters:
 * - slug: string - Post's URL slug
 */
router.get('/posts/:slug', blogController.getPostBySlug.bind(blogController));

export default router;