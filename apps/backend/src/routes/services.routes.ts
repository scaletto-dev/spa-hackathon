import { Router } from 'express';
import serviceController from '../controllers/service.controller';

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
router.get('/', serviceController.getAllServices);

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
 * Get a single service by ID
 * Note: This must be last to avoid conflicts with other routes
 */
router.get('/:id', serviceController.getServiceById);

export default router;
