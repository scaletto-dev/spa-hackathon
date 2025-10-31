import { Request, Response, NextFunction } from 'express';
import categoryService from '@/services/category.service';
import { SuccessResponse } from '@/types/api';
import {
  GetCategoriesQuery,
  GetCategoryParams,
  GetCategoryServicesQuery,
} from '@/validators/category.validator';
import logger from '@/config/logger';

/**
 * Category Controller
 *
 * Handles HTTP requests for category endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */

export class CategoryController {
  /**
   * GET /api/v1/categories
   * Get all service categories
   *
   * Query params are validated and typed by middleware before reaching this handler.
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Use validated query from middleware
      const { includeServices } = (req as any).validatedQuery as GetCategoriesQuery;

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
   *
   * Path params and query params are validated and typed by middleware.
   */
  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Use validated params and query from middleware
      const { id } = (req as any).validatedParams as GetCategoryParams;
      const { includeServices } = (req as any).validatedQuery as GetCategoriesQuery;

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
   *
   * Path params and query params are validated by middleware.
   * No manual parseInt() or validation needed - middleware already did it.
   */
  async getCategoryServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Use validated params and query from middleware
      const { id } = (req as any).validatedParams as GetCategoryParams;
      const { page, limit } = (req as any).validatedQuery as GetCategoryServicesQuery;

      // No need for parseInt() or validation - middleware already handled it
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
