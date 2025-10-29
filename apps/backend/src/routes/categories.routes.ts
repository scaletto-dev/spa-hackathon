import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const router = Router();

/**
 * Category Routes
 * 
 * Defines API endpoints for service category management
 */

/**
 * GET /api/v1/categories
 * Get all service categories
 * 
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 */
router.get('/', categoryController.getAllCategories.bind(categoryController));

/**
 * GET /api/v1/categories/:id
 * Get a single category by ID
 * 
 * Path Parameters:
 * - id: string (UUID) - Category ID
 * 
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 */
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

/**
 * GET /api/v1/categories/:id/services
 * Get all services in a specific category
 * 
 * Path Parameters:
 * - id: string (UUID) - Category ID
 * 
 * Query Parameters:
 * - page: number (optional, default: 1) - Page number
 * - limit: number (optional, default: 20, max: 100) - Items per page
 */
router.get('/:id/services', categoryController.getCategoryServices.bind(categoryController));

export default router;
