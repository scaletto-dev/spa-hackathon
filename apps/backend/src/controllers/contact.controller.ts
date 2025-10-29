import { Request, Response, NextFunction } from 'express';
import contactService from '../services/contact.service';
import { CreateContactSubmissionRequest, ContactSubmissionResponse } from '../types/contact';
import { ValidationError } from '../utils/errors';

/**
 * Contact Controller
 * Handles contact form submission requests
 */
class ContactController {
  /**
   * POST /api/v1/contact
   * Create a new contact form submission
   */
  async createContactSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, messageType, message } = req.body;

      // Validation
      if (!name || !email || !messageType || !message) {
        throw new ValidationError('Missing required fields: name, email, messageType, and message are required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Message type validation
      const validMessageTypes = ['general_inquiry', 'service_question', 'booking_assistance', 'feedback', 'other'];
      if (!validMessageTypes.includes(messageType)) {
        throw new ValidationError('Invalid messageType. Must be one of: general_inquiry, service_question, booking_assistance, feedback, other');
      }

      // Max length validation
      if (name.length > 100) {
        throw new ValidationError('Name must not exceed 100 characters');
      }

      if (email.length > 255) {
        throw new ValidationError('Email must not exceed 255 characters');
      }

      if (phone && phone.length > 20) {
        throw new ValidationError('Phone must not exceed 20 characters');
      }

      if (message.length > 2000) {
        throw new ValidationError('Message must not exceed 2000 characters');
      }

      const contactData: CreateContactSubmissionRequest = {
        name,
        email,
        phone,
        messageType,
        message,
      };

      const submission = await contactService.createContactSubmission(contactData);

      const response: ContactSubmissionResponse = {
        success: true,
        message: "Thank you for contacting us. We'll respond within 24 hours.",
        data: submission,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
