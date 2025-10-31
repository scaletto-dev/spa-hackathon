import { Request, Response, NextFunction } from 'express';
import contactService from '@/services/contact.service';
import emailService from '@/services/email.service';
import { SuccessResponse } from '@/types/api';
import {
  CreateContactRequest,
  GetContactsQuery,
  GetContactParams,
  UpdateContactStatusRequest,
} from '@/validators/contact.validator';

/**
 * Contact Controller
 *
 * Handles HTTP requests for contact endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */

export class ContactController {
  /**
   * POST /api/v1/contact
   * Create a new contact form submission
   */
  async createContactSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.body
      const contactData = req.body as unknown as CreateContactRequest;

      const submission = await contactService.createContactSubmission(contactData);

      // Send email notification asynchronously (don't wait for it)
      emailService.sendContactFormNotification(submission).catch((error) => {
        console.error('Failed to send contact form notification email:', error);
        // Don't throw error - email failure shouldn't block the response
      });

      const response: SuccessResponse<typeof submission> = {
        success: true,
        data: submission,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/contact
   * Get all contact submissions with pagination (admin only)
   */
  async getAllContactSubmissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and coerced types (stored in req.validatedQuery)
      const { page = 1, limit = 20, status } = (req as any).validatedQuery as GetContactsQuery;

      const result = await contactService.getAllContactSubmissions(page, limit, status);

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
   * GET /api/v1/contact/:id
   * Get a single contact submission by ID (admin only)
   */
  async getContactSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.validatedParams
      const { id } = (req as any).validatedParams as GetContactParams;

      const submission = await contactService.getContactSubmissionById(id);

      const response: SuccessResponse<typeof submission> = {
        success: true,
        data: submission,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/contact/:id/status
   * Update contact submission status (admin only)
   */
  async updateContactStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.validatedParams
      const { id } = (req as any).validatedParams as GetContactParams;
      // Middleware already validated and stored in req.body
      const { status } = req.body as unknown as UpdateContactStatusRequest;

      const submission = await contactService.updateContactStatus(id, status);

      const response: SuccessResponse<typeof submission> = {
        success: true,
        data: submission,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/contact/:id
   * Delete a contact submission (admin only)
   */
  async deleteContactSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Middleware already validated and stored in req.validatedParams
      const { id } = (req as any).validatedParams as GetContactParams;

      await contactService.deleteContactSubmission(id);

      const response: SuccessResponse<null> = {
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
