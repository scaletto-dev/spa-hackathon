/**
 * Admin Contacts Controller
 *
 * Handles HTTP requests for admin contact submission management
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '@/config/database';
import { ValidationError, NotFoundError } from '../../utils/errors';

class AdminContactsController {
  /**
   * GET /api/v1/admin/contacts
   * Get all contact submissions with pagination and filtering
   */
  async getAllContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const messageType = req.query.messageType as string;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) where.status = status;
      if (messageType) where.messageType = messageType;

      const [contacts, total] = await Promise.all([
        prisma.contactSubmission.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.contactSubmission.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: contacts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/contacts/:id
   * Get contact submission details by ID
   */
  async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Contact ID is required');

      const contact = await prisma.contactSubmission.findUnique({
        where: { id },
      });
      if (!contact) throw new NotFoundError('Contact submission not found');

      res.status(200).json({
        success: true,
        data: contact,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/contacts/:id/status
   * Update contact submission status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!id) throw new ValidationError('Contact ID is required');
      if (!status) throw new ValidationError('Status is required');

      const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const contact = await prisma.contactSubmission.findUnique({
        where: { id },
      });
      if (!contact) throw new NotFoundError('Contact submission not found');

      const updated = await prisma.contactSubmission.update({
        where: { id },
        data: { status },
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
   * PATCH /api/v1/admin/contacts/:id/notes
   * Add or update admin notes
   */
  async addNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { notes } = req.body;

      if (!id) throw new ValidationError('Contact ID is required');
      if (!notes) throw new ValidationError('Notes are required');

      const contact = await prisma.contactSubmission.findUnique({
        where: { id },
      });
      if (!contact) throw new NotFoundError('Contact submission not found');

      const updated = await prisma.contactSubmission.update({
        where: { id },
        data: { adminNotes: notes },
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
   * DELETE /api/v1/admin/contacts/:id
   * Delete a contact submission
   */
  async deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) throw new ValidationError('Contact ID is required');

      const contact = await prisma.contactSubmission.findUnique({
        where: { id },
      });
      if (!contact) throw new NotFoundError('Contact submission not found');

      await prisma.contactSubmission.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Contact submission deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/contacts/stats
   * Get contact statistics
   */
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [total, pending, inProgress, resolved] = await Promise.all([
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { status: 'PENDING' } }),
        prisma.contactSubmission.count({
          where: { status: 'IN_PROGRESS' },
        }),
        prisma.contactSubmission.count({ where: { status: 'RESOLVED' } }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          pending,
          inProgress,
          resolved,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminContactsController();
