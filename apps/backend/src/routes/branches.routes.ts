import { Router } from 'express';
import branchController from '@/controllers/branch.controller';
import { validate } from '@/middleware/validate';
import {
  getBranchesQuerySchema,
  getBranchParamsSchema,
  getBranchServicesQuerySchema,
} from '@/validators/branch.validator';

const router = Router();

/**
 * Branch Routes
 *
 * Defines API endpoints for branch/location management
 * All endpoints include automatic request validation via Zod schemas
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
 * Validation: Auto-validates query params, transforms includeServices to boolean
 */
router.get(
  '/',
  validate(getBranchesQuerySchema, 'query'),
  branchController.getAllBranches.bind(branchController)
);

/**
 * GET /api/v1/branches/:id
 * Get a single branch by ID
 *
 * Path Parameters:
 * - id: string (UUID) - Branch ID
 *
 * Query Parameters:
 * - includeServices: 'true' | 'false' (optional) - Include services in response
 *
 * Validation: Auto-validates path param as UUID, transforms includeServices to boolean
 */
router.get(
  '/:id',
  validate(getBranchParamsSchema, 'params'),
  validate(getBranchesQuerySchema, 'query'),
  branchController.getBranchById.bind(branchController)
);

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
 *
 * Validation: Auto-validates path param as UUID, coerces and validates pagination params
 */
router.get(
  '/:id/services',
  validate(getBranchParamsSchema, 'params'),
  validate(getBranchServicesQuerySchema, 'query'),
  branchController.getBranchServices.bind(branchController)
);

export default router;
