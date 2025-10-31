/**
 * Category Repository
 *
 * Data access layer for service categories.
 * Encapsulates all Prisma queries related to categories.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

export class CategoryRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.serviceCategory;

  /**
   * Find category by slug
   */
  async findBySlug(slug: string) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  /**
   * Find category by ID with optional services
   *
   * @param id - Category ID
   * @param onlyActive - If true, only include active services
   */
  async findByIdWithServices(id: string, onlyActive = true) {
    if (onlyActive) {
      return this.model.findUnique({
        where: { id },
        include: {
          services: { where: { active: true }, orderBy: { name: 'asc' } },
          _count: {
            select: {
              services: { where: { active: true } },
            },
          },
        },
      });
    }

    return this.model.findUnique({
      where: { id },
      include: {
        services: { orderBy: { name: 'asc' } },
        _count: {
          select: {
            services: true,
          },
        },
      },
    });
  }

  /**
   * Get all categories with service count
   * Used for listing all categories
   */
  async findAllWithCount() {
    return this.model.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        services: {
          where: { active: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            services: {
              where: { active: true },
            },
          },
        },
      },
    });
  }

  /**
   * Get all categories with services included (full data)
   * Alternative to findAllWithCount when services are needed
   */
  async findAllWithServices() {
    return this.model.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        services: {
          where: { active: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            services: {
              where: { active: true },
            },
          },
        },
      },
    });
  }

  /**
   * Get services in specific category with pagination
   *
   * @param categoryId - Category ID
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   */
  async getServicesInCategory(categoryId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Verify category exists
    const category = await this.findById(categoryId);
    if (!category) {
      return null;
    }

    // Fetch services and total count in parallel
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: {
          categoryId,
          active: true,
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.service.count({
        where: {
          categoryId,
          active: true,
        },
      }),
    ]);

    return {
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

/**
 * Export singleton instance for use throughout application
 * Usage: import { categoryRepository } from '@/repositories/category.repository'
 */
export const categoryRepository = new CategoryRepository();
