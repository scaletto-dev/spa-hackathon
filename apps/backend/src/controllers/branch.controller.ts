import { Request, Response, NextFunction } from 'express';
import branchService from '@/services/branch.service';
import { SuccessResponse } from '@/types/api';
import {
  GetBranchesQuery,
  GetBranchParams,
  GetBranchServicesQuery,
} from '@/validators/branch.validator';

/**
 * Branch Controller
 *
 * Handles HTTP requests for branch endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */

export class BranchController {
  /**
   * GET /api/v1/branches
   * Get all branches
   */
  async getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedQuery)
      const {
        page = 1,
        limit = 20,
        includeServices,
      } = (req as any).validatedQuery as GetBranchesQuery;

      const result = await branchService.getAllBranches(includeServices ?? false, page, limit);

      const response: SuccessResponse<typeof result.data> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/branches/:id
   * Get a single branch by ID with optional services
   */
  async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedParams and req.validatedQuery)
      const { id } = (req as any).validatedParams as GetBranchParams;
      const { includeServices } = (req as any).validatedQuery as GetBranchesQuery;

      const branch = await branchService.getBranchById(id, includeServices ?? false);

      const response: SuccessResponse<typeof branch> = {
        success: true,
        data: branch,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/branches/:id/services
   * Get all services available at a specific branch with pagination
   */
  async getBranchServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedParams and req.validatedQuery)
      const { id } = (req as any).validatedParams as GetBranchParams;
      const { page = 1, limit = 20 } = (req as any).validatedQuery as GetBranchServicesQuery;

      const result = await branchService.getBranchServices(id, page, limit);

      const response: SuccessResponse<typeof result.data> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new BranchController();
