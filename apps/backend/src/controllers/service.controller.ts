import { Request, Response, NextFunction } from 'express';
import serviceService from '@/services/service.service';
import { SuccessResponse } from '@/types/api';
import { GetServicesQuery, GetServiceParams } from '@/validators/service.validator';

/**
 * Service Controller
 *
 * Handles HTTP requests for service endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */

export class ServiceController {
  /**
   * GET /api/v1/services
   * Get all services with pagination and filtering
   */
  async getAllServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Use validated query from middleware
      const { page = 1, limit = 20, categoryId, featured } = (req as any).validatedQuery as GetServicesQuery;

      const result = await serviceService.getAllServices(
        page,
        limit,
        categoryId,
        featured as boolean | undefined
      );

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
   */
  async getServiceById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Use validated params from middleware
      const { id } = (req as any).validatedParams as GetServiceParams;

      // Check if parameter is a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      // Fetch by ID or slug
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
