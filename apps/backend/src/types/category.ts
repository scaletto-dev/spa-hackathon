/**
 * Category Type Definitions
 *
 * DTO types for service category API responses
 */

export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  duration: number;
  price: string; // Decimal returned as string
  categoryId: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  serviceCount: number;
  displayOrder: number;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithServicesDTO extends CategoryDTO {
  services: ServiceDTO[];
}

export interface GetCategoriesQueryParams {
  includeServices?: string; // 'true' | 'false'
}

export interface GetCategoryServicesQueryParams {
  page?: string;
  limit?: string;
}
