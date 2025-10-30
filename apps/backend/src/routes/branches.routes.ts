import { Router } from 'express';
import branchController from '../controllers/branch.controller';

const router = Router();

/**
 * Branch Routes
 * 
 * Defines API endpoints for branch/location management
 */

/**
 * GET /api/v1/branches
 * Get all branches with pagination
 * 
 * Query Parameters:
 * - page: number (optional, default: 1) - Page number
 * - limit: number (optional, 1-100) - Maximum number of branches per page
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 * 
 * Response includes meta object with pagination info
 */
router.get('/', branchController.getAllBranches.bind(branchController));

/**
 * GET /api/v1/branches/:id
 * Get a single branch by ID
 * 
 * Path Parameters:
 * - id: string (UUID) - Branch ID
 * 
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 */
router.get('/:id', branchController.getBranchById.bind(branchController));

/**
 * GET /api/v1/branches/:id/services
 * Get all services available at a specific branch
 * 
 * Path Parameters:
 * - id: string (UUID) - Branch ID
 * 
 * Query Parameters:
 * - page: number (optional, default: 1) - Page number
 * - limit: number (optional, default: 20, max: 100) - Items per page
 */
router.get('/:id/services', branchController.getBranchServices.bind(branchController));

export default router;
