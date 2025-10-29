import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { ServiceDTO, ServiceWithCategoryDTO, ServicesResponse } from '../types/service';

/**
 * Service Service
 *
 * Business logic layer for service operations.
 * Handles data retrieval, transformation, and business rules.
 */

export class ServiceService {
  /**
   * Get all services with optional filtering and pagination
   *
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param categoryId - Filter by category ID
   * @param featured - Filter by featured status
   * @returns Paginated services with metadata
   */
  async getAllServices(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    featured?: boolean
  ): Promise<ServicesResponse> {
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

    // Get total count
    const total = await prisma.service.count({ where });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get services with category information
    const services = await prisma.service.findMany({
      where,
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
      orderBy: [
        { featured: 'desc' }, // Featured services first
        { name: 'asc' }, // Then alphabetical
      ],
      skip,
      take: limit,
    });

    return {
      data: services.map((service) => this.mapServiceToDTO(service)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get featured services
   *
   * @param limit - Maximum number of services to return
   * @returns Array of featured services
   */
  async getFeaturedServices(limit: number = 8): Promise<ServiceDTO[]> {
    const services = await prisma.service.findMany({
      where: {
        featured: true,
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
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });

    return services.map((service) => this.mapServiceToDTO(service));
  }

  /**
   * Get a single service by ID
   *
   * @param id - Service ID
   * @returns Service with category information
   * @throws NotFoundError if service not found
   */
  async getServiceById(id: string): Promise<ServiceWithCategoryDTO> {
    const service = await prisma.service.findUnique({
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

    if (!service) {
      throw new NotFoundError(`Service with ID '${id}' not found`);
    }

    return this.mapServiceWithCategoryToDTO(service);
  }

  /**
   * Get a single service by slug
   *
   * @param slug - Service slug
   * @returns Service with category information
   * @throws NotFoundError if service not found
   */
  async getServiceBySlug(slug: string): Promise<ServiceWithCategoryDTO> {
    const service = await prisma.service.findUnique({
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

    if (!service) {
      throw new NotFoundError(`Service with slug '${slug}' not found`);
    }

    return this.mapServiceWithCategoryToDTO(service);
  }

  /**
   * Map Prisma Service model to ServiceDTO
   *
   * @param service - Prisma service object with category
   * @returns ServiceDTO
   */
  private mapServiceToDTO(service: any): ServiceDTO {
    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      excerpt: service.excerpt,
      duration: service.duration,
      price: service.price.toString(),
      categoryId: service.categoryId,
      categoryName: service.category?.name,
      images: service.images,
      featured: service.featured,
      active: service.active,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };
  }

  /**
   * Map Prisma Service model with category to ServiceWithCategoryDTO
   *
   * @param service - Prisma service object with category relation
   * @returns ServiceWithCategoryDTO
   */
  private mapServiceWithCategoryToDTO(service: any): ServiceWithCategoryDTO {
    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      excerpt: service.excerpt,
      duration: service.duration,
      price: service.price.toString(),
      categoryId: service.categoryId,
      images: service.images,
      featured: service.featured,
      active: service.active,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      category: {
        id: service.category.id,
        name: service.category.name,
        slug: service.category.slug,
        description: service.category.description,
        icon: service.category.icon,
      },
    };
  }
}

export default new ServiceService();
