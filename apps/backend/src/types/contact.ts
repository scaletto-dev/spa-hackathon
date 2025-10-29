import { MessageType, ContactStatus } from '@prisma/client';

/**
 * Contact form submission DTO
 */
export interface ContactSubmissionDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  messageType: MessageType;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

/**
 * Create contact submission request body
 */
export interface CreateContactSubmissionRequest {
  name: string;
  email: string;
  phone?: string;
  messageType: 'general_inquiry' | 'service_question' | 'booking_assistance' | 'feedback' | 'other';
  message: string;
}

/**
 * Contact submission success response
 */
export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data?: ContactSubmissionDTO;
}
