import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import { GetCategoriesQueryParams, GetCategoryServicesQueryParams } from '../types/category';

/**
 * Category Controller
 * 
 * Handles HTTP requests for category endpoints.
 * Validates input, calls service layer, and formats responses.
 */

export class CategoryController {
  /**
   * GET /api/v1/categories
   * Get all service categories
   */
  async getAllCategories(
    req: Request<{}, {}, {}, GetCategoriesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const includeServices = req.query.includeServices === 'true';
      
      const categories = await categoryService.getAllCategories(includeServices);

      const response: SuccessResponse<typeof categories> = {
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories/:id
   * Get a single category by ID with optional services
   */
  async getCategoryById(
    req: Request<{ id: string }, {}, {}, GetCategoriesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const includeServices = req.query.includeServices === 'true';

      const category = await categoryService.getCategoryById(id, includeServices);

      const response: SuccessResponse<typeof category> = {
        success: true,
        data: category,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories/:id/services
   * Get all services in a specific category with pagination
   */
  async getCategoryServices(
    req: Request<{ id: string }, {}, {}, GetCategoryServicesQueryParams>,
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

      const result = await categoryService.getCategoryServices(id, page, limit);

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

export default new CategoryController();
