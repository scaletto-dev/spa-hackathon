/**
 * Service Validators
 * 
 * Zod schemas for validating service request data
 */

import { z } from 'zod';

/**
 * Get services query validation
 */
export const getServicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(20),
  categoryId: z.string().uuid('Invalid category ID format').optional(),
  featured: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

export type GetServicesQuery = z.infer<typeof getServicesQuerySchema>;

/**
 * Get service by ID or slug params validation
 */
export const getServiceParamsSchema = z.object({
  id: z.string().min(1, 'Service ID or slug is required'),
});

export type GetServiceParams = z.infer<typeof getServiceParamsSchema>;
