import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { contactFormRateLimiter } from '../config/rateLimits';

const router = Router();

/**
 * POST /api/v1/contact
 * Submit a contact form inquiry
 * Rate limited: 3 submissions per hour per IP
 */
router.post('/', contactFormRateLimiter, contactController.createContactSubmission);

export default router;
