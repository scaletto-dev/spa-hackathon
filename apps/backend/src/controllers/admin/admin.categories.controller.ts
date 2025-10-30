/**
 * Admin Categories Controller
 *
 * Handles HTTP requests for admin category management
 * Supports both Service and Blog categories
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ValidationError, NotFoundError } from "../../utils/errors";

class AdminCategoriesController {
   /**
    * GET /api/v1/admin/categories/service
    * Get all service categories
    */
   async getAllServiceCategories(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const skip = (page - 1) * limit;

         const [categories, total] = await Promise.all([
            prisma.serviceCategory.findMany({
               skip,
               take: limit,
               include: { _count: { select: { services: true } } },
               orderBy: { displayOrder: "asc" },
            }),
            prisma.serviceCategory.count(),
         ]);

         res.status(200).json({
            success: true,
            data: categories,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/admin/categories/blog
    * Get all blog categories
    */
   async getAllBlogCategories(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const skip = (page - 1) * limit;

         const [categories, total] = await Promise.all([
            prisma.blogCategory.findMany({
               skip,
               take: limit,
               include: { _count: { select: { posts: true } } },
               orderBy: { createdAt: "desc" },
            }),
            prisma.blogCategory.count(),
         ]);

         res.status(200).json({
            success: true,
            data: categories,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/categories/service
    * Create a new service category
    */
   async createServiceCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { name, slug, description, icon, displayOrder = 0 } = req.body;

         if (!name || !slug)
            throw new ValidationError("Name and slug are required");

         const existingSlug = await prisma.serviceCategory.findUnique({
            where: { slug },
         });
         if (existingSlug)
            throw new ValidationError("Service category slug already exists");

         const category = await prisma.serviceCategory.create({
            data: {
               name,
               slug,
               description: description || undefined,
               icon: icon || undefined,
               displayOrder,
            },
         });

         res.status(201).json({
            success: true,
            data: category,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/categories/blog
    * Create a new blog category
    */
   async createBlogCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { name, slug, description } = req.body;

         if (!name || !slug)
            throw new ValidationError("Name and slug are required");

         const existingSlug = await prisma.blogCategory.findUnique({
            where: { slug },
         });
         if (existingSlug)
            throw new ValidationError("Blog category slug already exists");

         const category = await prisma.blogCategory.create({
            data: {
               name,
               slug,
               description: description || undefined,
            },
         });

         res.status(201).json({
            success: true,
            data: category,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PUT /api/v1/admin/categories/service/:id
    * Update service category
    */
   async updateServiceCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Category ID is required");

         const category = await prisma.serviceCategory.findUnique({
            where: { id },
         });
         if (!category) throw new NotFoundError("Service category not found");

         if (req.body.slug && req.body.slug !== category.slug) {
            const existingSlug = await prisma.serviceCategory.findUnique({
               where: { slug: req.body.slug },
            });
            if (existingSlug)
               throw new ValidationError(
                  "Service category slug already exists"
               );
         }

         const updated = await prisma.serviceCategory.update({
            where: { id },
            data: {
               ...(req.body.name && { name: req.body.name }),
               ...(req.body.slug && { slug: req.body.slug }),
               ...(req.body.description && {
                  description: req.body.description,
               }),
               ...(req.body.icon && { icon: req.body.icon }),
               ...(typeof req.body.displayOrder === "number" && {
                  displayOrder: req.body.displayOrder,
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
    * PUT /api/v1/admin/categories/blog/:id
    * Update blog category
    */
   async updateBlogCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Category ID is required");

         const category = await prisma.blogCategory.findUnique({
            where: { id },
         });
         if (!category) throw new NotFoundError("Blog category not found");

         if (req.body.slug && req.body.slug !== category.slug) {
            const existingSlug = await prisma.blogCategory.findUnique({
               where: { slug: req.body.slug },
            });
            if (existingSlug)
               throw new ValidationError("Blog category slug already exists");
         }

         const updated = await prisma.blogCategory.update({
            where: { id },
            data: {
               ...(req.body.name && { name: req.body.name }),
               ...(req.body.slug && { slug: req.body.slug }),
               ...(req.body.description && {
                  description: req.body.description,
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
    * DELETE /api/v1/admin/categories/service/:id
    * Delete service category
    */
   async deleteServiceCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Category ID is required");

         const category = await prisma.serviceCategory.findUnique({
            where: { id },
         });
         if (!category) throw new NotFoundError("Service category not found");

         await prisma.serviceCategory.delete({ where: { id } });

         res.status(200).json({
            success: true,
            message: "Service category deleted successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * DELETE /api/v1/admin/categories/blog/:id
    * Delete blog category
    */
   async deleteBlogCategory(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Category ID is required");

         const category = await prisma.blogCategory.findUnique({
            where: { id },
         });
         if (!category) throw new NotFoundError("Blog category not found");

         await prisma.blogCategory.delete({ where: { id } });

         res.status(200).json({
            success: true,
            message: "Blog category deleted successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AdminCategoriesController();
