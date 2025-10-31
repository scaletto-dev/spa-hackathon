/**
 * Service Repository
 * 
 * Data access layer for services.
 * Encapsulates all Prisma queries related to services.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class ServiceRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.service;
  /**
   * Find all services with pagination and filtering
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    featured?: boolean
  ) {
    // Build where clause
    const where: any = {
      active: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    // Get total count and services in parallel
    const [total, services] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        include: {
          category: {
            select: featured
              ? { name: true }
              : {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  icon: true,
                },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { name: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      services,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find service by ID
   */
  async findById(id: string) {
    return prisma.service.findUnique({
      where: {
        id,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
          },
        },
      },
    });
  }

  /**
   * Find service by slug
   */
  async findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: {
        slug,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
          },
        },
      },
    });
  }

  /**
   * Find featured services
   */
  async findFeatured(limit: number = 8) {
    return prisma.service.findMany({
      where: {
        featured: true,
        active: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Get all service categories
   */
  async getAllCategories() {
    return prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            services: {
              where: {
                active: true,
                featured: true,
              },
            },
          },
        },
      },
    });
  }
}

export const serviceRepository = new ServiceRepository();
