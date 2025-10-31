import { Router } from 'express';
import categoryController from '@/controllers/category.controller';
import { validate } from '@/middleware/validate';
import {
  getCategoriesQuerySchema,
  getCategoryParamsSchema,
  getCategoryServicesQuerySchema,
} from '@/validators/category.validator';

const router = Router();

/**
 * Category Routes
 *
 * Defines API endpoints for service category management
 * All endpoints include automatic request validation via Zod schemas
 */

/**
 * GET /api/v1/categories
 * Get all service categories
 *
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 *
 * Validation: Auto-validates query params, transforms includeServices to boolean
 */
router.get(
  '/',
  validate(getCategoriesQuerySchema, 'query'),
  categoryController.getAllCategories.bind(categoryController)
);

/**
 * GET /api/v1/categories/:id
 * Get a single category by ID
 *
 * Path Parameters:
 * - id: string (UUID) - Category ID (validated as UUID)
 *
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 *
 * Validation: Auto-validates path param as UUID, transforms includeServices to boolean
 */
router.get(
  '/:id',
  validate(getCategoryParamsSchema, 'params'),
  validate(getCategoriesQuerySchema, 'query'),
  categoryController.getCategoryById.bind(categoryController)
);

/**
 * GET /api/v1/categories/:id/services
 * Get all services in a specific category
 *
 * Path Parameters:
 * - id: string (UUID) - Category ID
 *
 * Query Parameters:
 * - page: number (optional, default: 1) - Page number (must be > 0)
 * - limit: number (optional, default: 20, max: 100) - Items per page
 *
 * Validation: Auto-validates path param as UUID, coerces and validates pagination params
 */
router.get(
  '/:id/services',
  validate(getCategoryParamsSchema, 'params'),
  validate(getCategoryServicesQuerySchema, 'query'),
  categoryController.getCategoryServices.bind(categoryController)
);

export default router;
