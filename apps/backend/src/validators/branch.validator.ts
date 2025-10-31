/**
 * Branch Validators
 *
 * Zod schemas for validating branch request data
 */

import { z } from 'zod';

/**
 * Schema: GET /api/v1/branches
 * Query parameters with pagination and filtering
 */
export const getBranchesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
  includeServices: z
    .union([z.literal('true'), z.literal('false')])
    .transform((val) => val === 'true')
    .optional(),
});

export type GetBranchesQuery = z.infer<typeof getBranchesQuerySchema>;

/**
 * Schema: GET /api/v1/branches/:id
 * Path parameters
 */
export const getBranchParamsSchema = z.object({
  id: z.string().uuid('Invalid branch ID format'),
});

export type GetBranchParams = z.infer<typeof getBranchParamsSchema>;

/**
 * Schema: GET /api/v1/branches/:id/services
 * Query parameters with pagination
 */
export const getBranchServicesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
});

export type GetBranchServicesQuery = z.infer<typeof getBranchServicesQuerySchema>;
