import { Request, Response, NextFunction } from 'express';
import branchService from '../services/branch.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import { GetBranchesQueryParams, GetBranchServicesQueryParams } from '../types/branch';

/**
 * Branch Controller
 * 
 * Handles HTTP requests for branch endpoints.
 * Validates input, calls service layer, and formats responses.
 */

export class BranchController {
  /**
   * GET /api/v1/branches
   * Get all branches
   */
  async getAllBranches(
    req: Request<{}, {}, {}, GetBranchesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const includeServices = req.query.includeServices === 'true';
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
      
      // Validate page
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      
      // Validate limit if provided
      if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
        throw new ValidationError('Limit must be between 1 and 100');
      }
      
      const result = await branchService.getAllBranches(includeServices, page, limit);

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
  async getBranchById(
    req: Request<{ id: string }, {}, {}, GetBranchesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const includeServices = req.query.includeServices === 'true';

      const branch = await branchService.getBranchById(id, includeServices);

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
  async getBranchServices(
    req: Request<{ id: string }, {}, {}, GetBranchServicesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);

      // Validation
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await branchService.getBranchServices(id, page, limit);

      const response: SuccessResponse<typeof result.services> = {
        success: true,
        data: result.services,
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
