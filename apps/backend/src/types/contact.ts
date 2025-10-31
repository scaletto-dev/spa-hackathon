import { MessageType, ContactStatus } from '@prisma/client';

/**
 * Contact Submission DTO
 * Clean response format for API
 */
export interface ContactSubmissionDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  messageType: string;
  message: string;
  status: string;
  createdAt: string;
}

/**
 * Create Contact Submission Request
 * Request body for POST /api/v1/contact
 */
export interface CreateContactSubmissionRequest {
  name: string;
  email: string;
  phone?: string | null | undefined;
  messageType: 'general_inquiry' | 'service_question' | 'booking_assistance' | 'feedback' | 'other';
  message: string;
}
