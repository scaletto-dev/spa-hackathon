import { MessageType } from '@prisma/client';
import prisma from '../lib/prisma';
import { CreateContactSubmissionRequest, ContactSubmissionDTO } from '../types/contact';

/**
 * Contact Service
 * Handles contact form submission business logic
 */
class ContactService {
  /**
   * Create a new contact form submission
   */
  async createContactSubmission(data: CreateContactSubmissionRequest): Promise<ContactSubmissionDTO> {
    // Map API messageType to Prisma enum
    const messageTypeMap: Record<string, MessageType> = {
      general_inquiry: 'GENERAL_INQUIRY' as MessageType,
      service_question: 'SERVICE_QUESTION' as MessageType,
      booking_assistance: 'BOOKING_ASSISTANCE' as MessageType,
      feedback: 'FEEDBACK' as MessageType,
      other: 'OTHER' as MessageType,
    };

    const messageType = messageTypeMap[data.messageType];
    if (!messageType) {
      throw new Error('Invalid message type');
    }

    // Sanitize input to prevent XSS
    const sanitizedData = {
      name: this.sanitizeInput(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? this.sanitizeInput(data.phone) : null,
      messageType,
      message: this.sanitizeInput(data.message),
    };

    const submission = await prisma.contactSubmission.create({
      data: sanitizedData,
    });

    return {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      messageType: submission.messageType,
      message: submission.message,
      status: submission.status,
      createdAt: submission.createdAt,
    };
  }

  /**
   * Sanitize input to prevent XSS attacks
   * Strips HTML tags and sanitizes special characters
   */
  private sanitizeInput(input: string): string {
    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Replace special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    // Trim whitespace
    return sanitized.trim();
  }
}

export default new ContactService();
