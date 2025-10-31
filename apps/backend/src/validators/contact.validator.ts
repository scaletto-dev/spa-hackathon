/**
 * Contact Validators
 *
 * Zod schemas for validating contact submission request data
 */

import { z } from 'zod';

/**
 * Schema: POST /api/v1/contact
 * Create a new contact submission
 */
export const createContactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  phone: z.string().max(20, 'Phone must not exceed 20 characters').optional().nullable(),
  messageType: z.enum(
    ['general_inquiry', 'service_question', 'booking_assistance', 'feedback', 'other'],
    {
      errorMap: () => ({
        message:
          'Invalid messageType. Must be one of: general_inquiry, service_question, booking_assistance, feedback, other',
      }),
    }
  ),
  message: z
    .string({ required_error: 'Message is required' })
    .min(5, 'Message must be at least 5 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

export type CreateContactRequest = z.infer<typeof createContactSchema>;

/**
 * Schema: GET /api/v1/contact
 * Query parameters for listing contact submissions (admin only)
 */
export const getContactsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
});

export type GetContactsQuery = z.infer<typeof getContactsQuerySchema>;

/**
 * Schema: GET /api/v1/contact/:id
 * Path parameters for getting single contact
 */
export const getContactParamsSchema = z.object({
  id: z.string().uuid('Invalid contact ID format'),
});

export type GetContactParams = z.infer<typeof getContactParamsSchema>;

/**
 * Schema: PATCH /api/v1/contact/:id/status
 * Update contact submission status
 */
export const updateContactStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});

export type UpdateContactStatusRequest = z.infer<typeof updateContactStatusSchema>;
