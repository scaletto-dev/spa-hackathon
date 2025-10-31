/**
 * Admin Customers Controller
 *
 * Handles HTTP requests for admin customer management
 * Only accessible by ADMIN and SUPER_ADMIN roles
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/database';
import { ValidationError, NotFoundError } from '../../utils/errors';

class AdminCustomersController {
  /**
   * GET /api/v1/admin/customers
   * Get all customers with pagination and filtering
   */
  async getAllCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;
      const skip = (page - 1) * limit;

      // Build where clause with proper typing
      interface WhereClause {
        role?: string;
      }
      const where: WhereClause = {};
      if (role) {
        where.role = role.toUpperCase();
      } else {
        where.role = 'MEMBER';
      }

      const [customers, total] = await Promise.all([
        prisma.user.findMany({
          where: where as any,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            phone: true,
            fullName: true,
            role: true,
            emailVerified: true,
            language: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { bookings: true, reviews: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: where as any }),
      ]);

      res.status(200).json({
        success: true,
        data: customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/customers/:id
   * Get customer details by ID
   */
  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Customer ID is required');

      const customer = await prisma.user.findUnique({
        where: { id },
        include: {
          bookings: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          blogPosts: true,
        },
      });

      if (!customer) {
        throw new NotFoundError('Customer not found');
      }

      res.status(200).json({
        success: true,
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/customers
   * Create a new customer (admin can create members)
   */
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phone, fullName, language = 'vi' } = req.body;

      if (!email || !phone || !fullName) {
        throw new ValidationError('Email, phone, and fullName are required');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }

      const customer = await prisma.user.create({
        data: {
          email,
          phone,
          fullName,
          language,
          role: 'MEMBER',
        },
      });

      res.status(201).json({
        success: true,
        data: customer,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/customers/:id
   * Update customer details
   */
  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Customer ID is required');

      const { email, phone, fullName, language } = req.body;

      const customer = await prisma.user.findUnique({ where: { id } });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }

      if (email && email !== customer.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          throw new ValidationError('Email already exists');
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(phone && { phone }),
          ...(fullName && { fullName }),
          ...(language && { language }),
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
   * DELETE /api/v1/admin/customers/:id
   * Delete a customer (soft or hard - depends on business logic)
   */
  async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Customer ID is required');

      const customer = await prisma.user.findUnique({ where: { id } });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }

      await prisma.user.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/customers/:id/verify-email
   * Verify customer email
   */
  async verifyCustomerEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Customer ID is required');

      const customer = await prisma.user.findUnique({ where: { id } });
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { emailVerified: true },
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

export default new AdminCustomersController();
