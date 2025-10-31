/**
 * Category Validation Schemas
 * 
 * Zod schemas for validating category API requests.
 * Each schema validates a specific endpoint's input (query params, body, params).
 * 
 * Usage in routes:
 *   router.get('/', validate(getCategoriesQuerySchema, 'query'), controller.action)
 */

import { z } from 'zod';

/**
 * Schema: GET /api/v1/categories
 * Query parameters for fetching all categories
 */
export const getCategoriesQuerySchema = z.object({
  includeServices: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

/**
 * Schema: GET /api/v1/categories/:id
 * Path parameters
 */
export const getCategoryParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID format'),
});

/**
 * Schema: GET /api/v1/categories/:id/services
 * Query parameters with pagination
 */
export const getCategoryServicesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int('Page must be an integer')
    .positive('Page must be greater than 0')
    .default(1),
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
});

// Type inference for use in controllers and services
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
export type GetCategoryParams = z.infer<typeof getCategoryParamsSchema>;
export type GetCategoryServicesQuery = z.infer<typeof getCategoryServicesQuerySchema>;
