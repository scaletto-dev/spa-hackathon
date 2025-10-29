import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { contactFormLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/v1/contact
 * Create a new contact form submission
 * Rate limited: 3 submissions per hour per IP
 */
router.post('/', contactFormLimiter, (req, res, next) => {
  contactController.createContactSubmission(req, res, next);
});

export default router;
