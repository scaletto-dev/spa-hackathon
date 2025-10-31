import { Router } from 'express';
import contactController from '@/controllers/contact.controller';
import { validate } from '@/middleware/validate';
import {
  createContactSchema,
  getContactsQuerySchema,
  getContactParamsSchema,
  updateContactStatusSchema,
} from '@/validators/contact.validator';
import { contactFormRateLimiter } from '@/config/rateLimits';

const router = Router();

/**
 * Contact Routes
 *
 * RESTful API endpoints for contact submission management
 * All endpoints include automatic request validation via Zod schemas
 */

/**
 * POST /api/v1/contact
 * Create a new contact form submission (public)
 * Rate limited: 3 submissions per hour per IP
 *
 * Validation: Auto-validates body schema
 */
router.post(
  '/',
  contactFormRateLimiter,
  validate(createContactSchema, 'body'),
  contactController.createContactSubmission.bind(contactController)
);

/**
 * GET /api/v1/contact
 * Get all contact submissions with pagination (admin only)
 *
 * Query params: page, limit, status (optional)
 * Validation: Auto-validates query params with pagination
 */
router.get(
  '/',
  validate(getContactsQuerySchema, 'query'),
  contactController.getAllContactSubmissions.bind(contactController)
);

/**
 * GET /api/v1/contact/:id
 * Get a single contact submission by ID (admin only)
 *
 * Path Parameters:
 * - id: UUID - Contact submission ID
 *
 * Validation: Auto-validates path param as UUID
 */
router.get(
  '/:id',
  validate(getContactParamsSchema, 'params'),
  contactController.getContactSubmission.bind(contactController)
);

/**
 * PATCH /api/v1/contact/:id/status
 * Update contact submission status (admin only)
 *
 * Path Parameters:
 * - id: UUID - Contact submission ID
 *
 * Body: status (PENDING | IN_PROGRESS | RESOLVED | CLOSED)
 * Validation: Auto-validates params and body
 */
router.patch(
  '/:id/status',
  validate(getContactParamsSchema, 'params'),
  validate(updateContactStatusSchema, 'body'),
  contactController.updateContactStatus.bind(contactController)
);

/**
 * DELETE /api/v1/contact/:id
 * Delete a contact submission (admin only)
 *
 * Path Parameters:
 * - id: UUID - Contact submission ID
 *
 * Validation: Auto-validates path param as UUID
 */
router.delete(
  '/:id',
  validate(getContactParamsSchema, 'params'),
  contactController.deleteContactSubmission.bind(contactController)
);

export default router;
