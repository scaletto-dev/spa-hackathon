import { NotFoundError } from '@/utils/errors';
import { serviceRepository } from '@/repositories/service.repository';
import {
  ServiceDTO,
  ServiceWithCategoryDTO,
  ServicesResponse,
  FeaturedServiceDTO,
} from '@/types/service';

export class ServiceService {
  /**
   * Get all services with optional filtering and pagination
   */
  async getAllServices(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    featured?: boolean
  ): Promise<ServicesResponse> {
    const { services, total, totalPages } = await serviceRepository.findAllWithPagination(
      page,
      limit,
      categoryId,
      featured
    );

    // Map to appropriate DTO based on featured flag
    const mappedServices = featured
      ? services.map(toFeaturedServiceDTO)
      : services.map(toServiceDTO);

    return {
      data: mappedServices,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get featured services (lightweight version for display)
   */
  async getFeaturedServices(limit: number = 8): Promise<FeaturedServiceDTO[]> {
    const services = await serviceRepository.findFeatured(limit);
    return services.map(toFeaturedServiceDTO);
  }

  /**
   * Get a single service by ID
   */
  async getServiceById(id: string): Promise<ServiceWithCategoryDTO> {
    const service = await serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError(`Service with ID '${id}' not found`);
    }

    return toServiceWithCategoryDTO(service);
  }

  /**
   * Get a single service by slug
   */
  async getServiceBySlug(slug: string): Promise<ServiceWithCategoryDTO> {
    const service = await serviceRepository.findBySlug(slug);

    if (!service) {
      throw new NotFoundError(`Service with slug '${slug}' not found`);
    }

    return toServiceWithCategoryDTO(service);
  }

  /**
   * Get all service categories with service count
   */
  async getAllCategories() {
    const categories = await serviceRepository.getAllCategories();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      serviceCount: category._count.services,
    }));
  }
}

/**
 * Transform service to ServiceDTO
 */
function toServiceDTO(service: any): ServiceDTO {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    longDescription: service.longDescription,
    excerpt: service.excerpt,
    duration: service.duration,
    price: service.price.toString(),
    categoryId: service.categoryId,
    categoryName: service.category?.name,
    images: service.images,
    benefits: service.benefits,
    featured: service.featured,
    active: service.active,
    beforeAfterPhotos: service.beforeAfterPhotos,
    faqs: service.faqs,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

/**
 * Transform service to FeaturedServiceDTO (lightweight version)
 */
function toFeaturedServiceDTO(service: any): FeaturedServiceDTO {
  return {
    id: service.id,
    name: service.name,
    categoryName: service.category?.name || 'Uncategorized',
    images: service.images,
    duration: `${service.duration} min`,
    price: service.price.toString(),
    excerpt: service.excerpt,
    slug: service.slug,
  };
}

/**
 * Transform service with category to ServiceWithCategoryDTO
 */
function toServiceWithCategoryDTO(service: any): ServiceWithCategoryDTO {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    longDescription: service.longDescription,
    excerpt: service.excerpt,
    duration: service.duration,
    price: service.price.toString(),
    categoryId: service.categoryId,
    images: service.images,
    benefits: service.benefits,
    featured: service.featured,
    active: service.active,
    beforeAfterPhotos: service.beforeAfterPhotos,
    faqs: service.faqs,
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

export default new ServiceService();
