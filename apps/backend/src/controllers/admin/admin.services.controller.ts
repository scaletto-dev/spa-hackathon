/**
 * Admin Services Controller
 *
 * Handles HTTP requests for admin service management
 * Supports CRUD operations for services
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ValidationError, NotFoundError } from "../../utils/errors";

class AdminServicesController {
   /**
    * GET /api/v1/admin/services
    * Get all services with pagination and filtering
    */
   async getAllServices(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const categoryId = req.query.categoryId as string;
         const skip = (page - 1) * limit;

         const where: any = {};
         if (categoryId) where.categoryId = categoryId;

         const [services, total] = await Promise.all([
            prisma.service.findMany({
               where,
               skip,
               take: limit,
               include: {
                  category: true,
                  _count: { select: { reviews: true } },
               },
               orderBy: { createdAt: "desc" },
            }),
            prisma.service.count({ where }),
         ]);

         res.status(200).json({
            success: true,
            data: services,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/admin/services/:id
    * Get service details by ID
    */
   async getServiceById(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Service ID is required");

         const service = await prisma.service.findUnique({
            where: { id },
            include: { category: true, reviews: { take: 5 } },
         });

         if (!service) throw new NotFoundError("Service not found");

         res.status(200).json({
            success: true,
            data: service,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/services
    * Create a new service
    */
   async createService(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const {
            name,
            slug,
            description,
            duration,
            price,
            categoryId,
            excerpt,
            images = [],
         } = req.body;

         if (
            !name ||
            !slug ||
            !description ||
            !duration ||
            !price ||
            !categoryId ||
            !excerpt
         ) {
            throw new ValidationError(
               "Missing required fields: name, slug, description, duration, price, categoryId, excerpt"
            );
         }

         const existingSlug = await prisma.service.findUnique({
            where: { slug },
         });
         if (existingSlug)
            throw new ValidationError("Service slug already exists");

         const service = await prisma.service.create({
            data: {
               name,
               slug,
               description,
               duration: parseInt(duration),
               price: parseFloat(price),
               categoryId,
               excerpt,
               images,
            },
         });

         res.status(201).json({
            success: true,
            data: service,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PUT /api/v1/admin/services/:id
    * Update service details
    */
   async updateService(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Service ID is required");

         const service = await prisma.service.findUnique({ where: { id } });
         if (!service) throw new NotFoundError("Service not found");

         if (req.body.slug && req.body.slug !== service.slug) {
            const existingSlug = await prisma.service.findUnique({
               where: { slug: req.body.slug },
            });
            if (existingSlug)
               throw new ValidationError("Service slug already exists");
         }

         const updated = await prisma.service.update({
            where: { id },
            data: {
               ...(req.body.name && { name: req.body.name }),
               ...(req.body.slug && { slug: req.body.slug }),
               ...(req.body.description && {
                  description: req.body.description,
               }),
               ...(req.body.longDescription && {
                  longDescription: req.body.longDescription,
               }),
               ...(req.body.excerpt && { excerpt: req.body.excerpt }),
               ...(req.body.duration && {
                  duration: parseInt(req.body.duration),
               }),
               ...(req.body.price && { price: parseFloat(req.body.price) }),
               ...(req.body.categoryId && { categoryId: req.body.categoryId }),
               ...(req.body.images && { images: req.body.images }),
               ...(typeof req.body.featured === "boolean" && {
                  featured: req.body.featured,
               }),
               ...(typeof req.body.active === "boolean" && {
                  active: req.body.active,
               }),
            },
         });

         res.status(200).json({
            success: true,
            data: updated,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * DELETE /api/v1/admin/services/:id
    * Delete a service
    */
   async deleteService(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Service ID is required");

         const service = await prisma.service.findUnique({ where: { id } });
         if (!service) throw new NotFoundError("Service not found");

         await prisma.service.delete({ where: { id } });

         res.status(200).json({
            success: true,
            message: "Service deleted successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PATCH /api/v1/admin/services/:id/toggle-featured
    * Toggle service featured status
    */
   async toggleFeatured(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Service ID is required");

         const service = await prisma.service.findUnique({ where: { id } });
         if (!service) throw new NotFoundError("Service not found");

         const updated = await prisma.service.update({
            where: { id },
            data: { featured: !service.featured },
         });

         res.status(200).json({
            success: true,
            data: updated,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PATCH /api/v1/admin/services/:id/toggle-active
    * Toggle service active status
    */
   async toggleActive(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Service ID is required");

         const service = await prisma.service.findUnique({ where: { id } });
         if (!service) throw new NotFoundError("Service not found");

         const updated = await prisma.service.update({
            where: { id },
            data: { active: !service.active },
         });

         res.status(200).json({
            success: true,
            data: updated,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AdminServicesController();
