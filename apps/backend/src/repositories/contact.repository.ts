/**
 * Contact Repository
 *
 * Data access layer for contact submissions.
 * Encapsulates all Prisma queries related to contact submissions.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class ContactRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.contactSubmission;

  /**
   * Create a new contact submission
   */
  async create(data: {
    name: string;
    email: string;
    phone: string | null;
    messageType: string;
    message: string;
  }) {
    return prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        messageType: data.messageType as any,
        message: data.message,
        status: 'PENDING' as any, // Set default status
      },
    });
  }

  /**
   * Find contact submission by ID
   */
  async findById(id: string) {
    return prisma.contactSubmission.findUnique({
      where: { id },
    });
  }

  /**
   * Find all contact submissions with pagination
   */
  async findAllWithPagination(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [total, submissions] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      submissions,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find contact submissions by status
   */
  async findByStatus(status: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [total, submissions] = await Promise.all([
      prisma.contactSubmission.count({
        where: { status: status as any },
      }),
      prisma.contactSubmission.findMany({
        where: { status: status as any },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      submissions,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update contact submission status
   */
  async updateStatus(id: string, status: string) {
    return prisma.contactSubmission.update({
      where: { id },
      data: { status: status as any },
    });
  }

  /**
   * Delete contact submission
   */
  async delete(id: string) {
    return prisma.contactSubmission.delete({
      where: { id },
    });
  }
}

export const contactRepository = new ContactRepository();
