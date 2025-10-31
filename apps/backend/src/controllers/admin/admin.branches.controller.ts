/**
 * Admin Branches Controller
 *
 * Handles HTTP requests for admin branch management
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/database';
import { ValidationError, NotFoundError } from '../../utils/errors';

class AdminBranchesController {
  /**
   * GET /api/v1/admin/branches
   * Get all branches with pagination
   */
  async getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [branches, total] = await Promise.all([
        prisma.branch.findMany({
          skip,
          take: limit,
          include: { _count: { select: { bookings: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.branch.count(),
      ]);

      res.status(200).json({
        success: true,
        data: branches,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/branches/:id
   * Get branch details by ID
   */
  async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Branch ID is required');

      const branch = await prisma.branch.findUnique({
        where: { id },
        include: { bookings: { take: 10 } },
      });

      if (!branch) throw new NotFoundError('Branch not found');

      res.status(200).json({
        success: true,
        data: branch,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/branches
   * Create a new branch
   */
  async createBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        slug,
        address,
        phone,
        email,
        latitude,
        longitude,
        operatingHours,
        images = [],
      } = req.body;

      if (!name || !slug || !address || !phone || !latitude || !longitude) {
        throw new ValidationError(
          'Missing required fields: name, slug, address, phone, latitude, longitude'
        );
      }

      const existingSlug = await prisma.branch.findUnique({
        where: { slug },
      });
      if (existingSlug) throw new ValidationError('Branch slug already exists');

      const branch = await prisma.branch.create({
        data: {
          name,
          slug,
          address,
          phone,
          email: email || undefined,
          latitude,
          longitude,
          operatingHours: operatingHours || {},
          images,
        },
      });

      res.status(201).json({
        success: true,
        data: branch,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/branches/:id
   * Update branch details
   */
  async updateBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Branch ID is required');

      const branch = await prisma.branch.findUnique({ where: { id } });
      if (!branch) throw new NotFoundError('Branch not found');

      if (req.body.slug && req.body.slug !== branch.slug) {
        const existingSlug = await prisma.branch.findUnique({
          where: { slug: req.body.slug },
        });
        if (existingSlug) throw new ValidationError('Branch slug already exists');
      }

      const updated = await prisma.branch.update({
        where: { id },
        data: {
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.slug && { slug: req.body.slug }),
          ...(req.body.address && { address: req.body.address }),
          ...(req.body.phone && { phone: req.body.phone }),
          ...(req.body.email && { email: req.body.email }),
          ...(req.body.latitude && { latitude: req.body.latitude }),
          ...(req.body.longitude && { longitude: req.body.longitude }),
          ...(req.body.operatingHours && {
            operatingHours: req.body.operatingHours,
          }),
          ...(req.body.images && { images: req.body.images }),
          ...(req.body.description && {
            description: req.body.description,
          }),
          ...(typeof req.body.active === 'boolean' && {
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
   * DELETE /api/v1/admin/branches/:id
   * Delete a branch
   */
  async deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Branch ID is required');

      const branch = await prisma.branch.findUnique({ where: { id } });
      if (!branch) throw new NotFoundError('Branch not found');

      await prisma.branch.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Branch deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/branches/:id/toggle-active
   * Toggle branch active status
   */
  async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Branch ID is required');

      const branch = await prisma.branch.findUnique({ where: { id } });
      if (!branch) throw new NotFoundError('Branch not found');

      const updated = await prisma.branch.update({
        where: { id },
        data: { active: !branch.active },
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

export default new AdminBranchesController();
