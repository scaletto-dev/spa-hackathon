import { Router } from 'express';
import serviceController from '@/controllers/service.controller';
import { validate } from '@/middleware/validate';
import { getServicesQuerySchema, getServiceParamsSchema } from '@/validators/service.validator';

const router = Router();

/**
 * Services Routes
 *
 * RESTful API endpoints for service management
 */

/**
 * GET /api/v1/services
 * Get all services with pagination and filtering
 * Query params: page, limit, categoryId, featured
 */
router.get('/', validate(getServicesQuerySchema, 'query'), serviceController.getAllServices);

/**
 * GET /api/v1/services/featured
 * Get featured services for homepage display
 */
router.get('/featured', serviceController.getFeaturedServices);

/**
 * GET /api/v1/services/categories
 * Get all service categories
 */
router.get('/categories', serviceController.getServiceCategories);

/**
 * GET /api/v1/services/:id
 * Get a single service by ID or slug
 *
 * Accepts either:
 * - UUID format: /api/v1/services/123e4567-e89b-12d3-a456-426614174000
 * - Slug format: /api/v1/services/ai-skin-analysis-facial
 *
 * Note: This must be last to avoid conflicts with other routes
 */
router.get('/:id', validate(getServiceParamsSchema, 'params'), serviceController.getServiceById);

export default router;
