import { NotFoundError } from '@/utils/errors';
import { contactRepository } from '@/repositories/contact.repository';
import { ContactSubmissionDTO, CreateContactSubmissionRequest } from '@/types/contact';

/**
 * Transform raw contact submission to ContactSubmissionDTO
 */
function toContactSubmissionDTO(submission: any): ContactSubmissionDTO {
  return {
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    messageType: submission.messageType,
    message: submission.message,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
  };
}

/**
 * Sanitize input to prevent XSS attacks
 * Strips HTML tags and sanitizes special characters
 */
function sanitizeInput(input: string): string {
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

export class ContactService {
  /**
   * Create a new contact submission
   */
  async createContactSubmission(data: CreateContactSubmissionRequest): Promise<ContactSubmissionDTO> {
    // Map API messageType to Prisma enum
    const messageTypeMap: Record<string, string> = {
      general_inquiry: 'GENERAL_INQUIRY',
      service_question: 'SERVICE_QUESTION',
      booking_assistance: 'BOOKING_ASSISTANCE',
      feedback: 'FEEDBACK',
      other: 'OTHER',
    };

    const messageType = messageTypeMap[data.messageType];
    if (!messageType) {
      throw new Error('Invalid message type');
    }

    // Sanitize input to prevent XSS
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? sanitizeInput(data.phone) : null,
      messageType,
      message: sanitizeInput(data.message),
    };

    const submission = await contactRepository.create(sanitizedData);

    return toContactSubmissionDTO(submission);
  }

  /**
   * Get contact submission by ID
   */
  async getContactSubmissionById(id: string): Promise<ContactSubmissionDTO> {
    const submission = await contactRepository.findById(id);

    if (!submission) {
      throw new NotFoundError(`Contact submission with ID '${id}' not found`);
    }

    return toContactSubmissionDTO(submission);
  }

  /**
   * Get all contact submissions with pagination
   */
  async getAllContactSubmissions(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{
    data: ContactSubmissionDTO[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    let result;

    if (status) {
      result = await contactRepository.findByStatus(status, page, limit);
    } else {
      result = await contactRepository.findAllWithPagination(page, limit);
    }

    return {
      data: result.submissions.map(toContactSubmissionDTO),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Update contact submission status
   */
  async updateContactStatus(id: string, status: string): Promise<ContactSubmissionDTO> {
    const submission = await contactRepository.findById(id);

    if (!submission) {
      throw new NotFoundError(`Contact submission with ID '${id}' not found`);
    }

    const updated = await contactRepository.updateStatus(id, status);

    return toContactSubmissionDTO(updated);
  }

  /**
   * Delete contact submission
   */
  async deleteContactSubmission(id: string): Promise<void> {
    const submission = await contactRepository.findById(id);

    if (!submission) {
      throw new NotFoundError(`Contact submission with ID '${id}' not found`);
    }

    await contactRepository.delete(id);
  }
}

export default new ContactService();
