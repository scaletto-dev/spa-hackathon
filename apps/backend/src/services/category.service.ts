import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { CategoryDTO, CategoryWithServicesDTO, ServiceDTO } from '../types/category';

/**
 * Category Service
 * 
 * Business logic layer for service category operations.
 * Handles data retrieval, transformation, and business rules.
 */

export class CategoryService {
  /**
   * Get all service categories
   * 
   * @param includeServices - Whether to include services in the response
   * @returns Array of categories with optional services
   */
  async getAllCategories(includeServices: boolean = false): Promise<CategoryDTO[] | CategoryWithServicesDTO[]> {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        services: includeServices ? {
          where: {
            active: true,
          },
          orderBy: {
            name: 'asc',
          },
        } : false,
        _count: {
          select: {
            services: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    });

    if (includeServices) {
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        serviceCount: category._count.services,
        displayOrder: category.displayOrder,
        icon: category.icon,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
        services: (category.services as any[]).map((service) => this.mapServiceToDTO(service)),
      }));
    }

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      serviceCount: category._count.services,
      displayOrder: category.displayOrder,
      icon: category.icon,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
  }

  /**
   * Get a single category by ID
   * 
   * @param id - Category ID
   * @param includeServices - Whether to include services
   * @returns Category with optional services
   * @throws NotFoundError if category not found
   */
  async getCategoryById(id: string, includeServices: boolean = false): Promise<CategoryDTO | CategoryWithServicesDTO> {
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: includeServices ? {
          where: {
            active: true,
          },
          orderBy: {
            name: 'asc',
          },
        } : false,
        _count: {
          select: {
            services: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    const baseCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      serviceCount: category._count.services,
      displayOrder: category.displayOrder,
      icon: category.icon,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };

    if (includeServices) {
      return {
        ...baseCategory,
        services: (category.services as any[]).map((service) => this.mapServiceToDTO(service)),
      };
    }

    return baseCategory;
  }

  /**
   * Get services for a specific category
   * 
   * @param categoryId - Category ID
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Paginated services in the category
   * @throws NotFoundError if category not found
   */
  async getCategoryServices(
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    services: ServiceDTO[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    // Verify category exists
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      throw new NotFoundError(`Category with ID '${categoryId}' not found`);
    }

    // Get total count
    const total = await prisma.service.count({
      where: {
        categoryId,
        active: true,
      },
    });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get services
    const services = await prisma.service.findMany({
      where: {
        categoryId,
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    return {
      services: services.map((service) => this.mapServiceToDTO(service)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Map Prisma Service model to ServiceDTO
   * 
   * @param service - Prisma service object
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
      images: service.images,
      featured: service.featured,
      active: service.active,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };
  }
}

export default new CategoryService();
