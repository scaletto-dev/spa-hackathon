import { Request, Response, NextFunction } from 'express';
import serviceService from '../services/service.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import { GetServicesQueryParams } from '../types/service';

/**
 * Service Controller
 *
 * Handles HTTP requests for service endpoints.
 * Validates input, calls service layer, and formats responses.
 */

export class ServiceController {
  /**
   * GET /api/v1/services
   * Get all services with pagination and filtering
   */
  async getAllServices(
    req: Request<{}, {}, {}, GetServicesQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const categoryId = req.query.categoryId;
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;

      // Validation
      if (page < 1) {
        throw new ValidationError('Page must be greater than 0');
      }
      if (limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      const result = await serviceService.getAllServices(page, limit, categoryId, featured);

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
   * GET /api/v1/services/:id
   * Get a single service by ID or slug
   * Automatically detects if parameter is UUID (ID) or slug
   */
  async getServiceById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Check if parameter is a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      // Fetch by ID or slug accordingly
      const service = isUUID
        ? await serviceService.getServiceById(id)
        : await serviceService.getServiceBySlug(id);

      const response: SuccessResponse<typeof service> = {
        success: true,
        data: service,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/featured
   * Get featured services
   */
  async getFeaturedServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const services = await serviceService.getFeaturedServices();

      const response: SuccessResponse<typeof services> = {
        success: true,
        data: services,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/categories
   * Get all service categories with service count
   */
  async getServiceCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await serviceService.getAllCategories();

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
}

export default new ServiceController();
