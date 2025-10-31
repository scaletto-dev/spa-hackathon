import { categoryRepository } from '@/repositories/category.repository';
import { NotFoundError } from '@/utils/errors';
import { CategoryDTO, CategoryWithServicesDTO, ServiceDTO } from '@/types/category';
import { Service, ServiceCategory } from '@prisma/client';

/**
 * Category Service
 * 
 * Business logic layer for service category operations.
 * Uses CategoryRepository for data access, focuses on business logic and transformation.
 */
export class CategoryService {
  /**
   * Get all service categories
   * 
   * @param includeServices - Whether to include services in the response
   * @returns Array of categories with optional services
   */
  async getAllCategories(includeServices: boolean = false): Promise<CategoryDTO[] | CategoryWithServicesDTO[]> {
    const categories = includeServices
      ? await categoryRepository.findAllWithServices()
      : await categoryRepository.findAllWithCount();

    return includeServices
      ? categories.map(toCategoryWithServicesDTO)
      : categories.map(toCategoryDTO);
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
    const category = includeServices
      ? await categoryRepository.findByIdWithServices(id, true)
      : await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    return includeServices
      ? toCategoryWithServicesDTO(category as CategoryWithCount)
      : toCategoryDTO(category as CategoryWithCount);
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
  async getCategoryServices(categoryId: string, page: number = 1, limit: number = 20) {
    const result = await categoryRepository.getServicesInCategory(categoryId, page, limit);

    if (!result) {
      throw new NotFoundError(`Category with ID '${categoryId}' not found`);
    }

    return {
      services: result.services.map(toServiceDTO),
      meta: result.pagination,
    };
  }
}

// Type helpers
type CategoryWithCount = ServiceCategory & { _count: { services: number }; services?: Service[] };

/**
 * Transform Prisma Service to ServiceDTO
 */
const toServiceDTO = (service: Service): ServiceDTO => ({
  id: service.id,
  name: service.name,
  slug: service.slug,
  description: service.description,
  excerpt: service.excerpt,
  duration: service.duration,
  price: service.price.toString(),
  categoryId: service.categoryId,
  images: service.images as string[],
  featured: service.featured,
  active: service.active,
  createdAt: service.createdAt.toISOString(),
  updatedAt: service.updatedAt.toISOString(),
});

/**
 * Transform Prisma ServiceCategory to CategoryDTO
 */
const toCategoryDTO = (category: CategoryWithCount): CategoryDTO => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  serviceCount: category._count.services,
  displayOrder: category.displayOrder,
  icon: category.icon,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
});

/**
 * Transform Prisma ServiceCategory with services to CategoryWithServicesDTO
 */
const toCategoryWithServicesDTO = (category: CategoryWithCount): CategoryWithServicesDTO => ({
  ...toCategoryDTO(category),
  services: (category.services || []).map(toServiceDTO),
});

export default new CategoryService();
