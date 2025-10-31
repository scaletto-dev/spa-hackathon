/**
 * Blog Validators
 *
 * Zod schemas for validating blog request data
 */

import { z } from 'zod';

/**
 * Schema: GET /api/v1/blog/posts
 * Query parameters for listing blog posts
 */
export const getBlogPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(6),
  categoryId: z.string().uuid('Invalid category ID format').optional(),
  search: z.string().max(200, 'Search must not exceed 200 characters').optional(),
});

export type GetBlogPostsQuery = z.infer<typeof getBlogPostsQuerySchema>;

/**
 * Schema: GET /api/v1/blog/posts/:slug
 * Path parameters for getting single blog post
 */
export const getBlogPostParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must not exceed 200 characters'),
});

export type GetBlogPostParams = z.infer<typeof getBlogPostParamsSchema>;

/**
 * Schema: GET /api/v1/blog/categories
 * No parameters needed - returns all categories
 */
export const getBlogCategoriesQuerySchema = z.object({}).strict();

export type GetBlogCategoriesQuery = z.infer<typeof getBlogCategoriesQuerySchema>;
