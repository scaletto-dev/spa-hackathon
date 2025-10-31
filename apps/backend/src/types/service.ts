/**
 * Service Type Definitions
 *
 * DTO types for service API responses
 */

export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  excerpt: string;
  duration: number;
  price: string; // Decimal returned as string
  categoryId: string;
  categoryName?: string; // Optional for includes
  images: string[];
  benefits: string[];
  featured: boolean;
  active: boolean;
  beforeAfterPhotos: string[];
  faqs: Array<{ question: string; answer: string }> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Featured Service DTO - Lightweight response for featured services list
 * Only includes essential display fields
 */
export interface FeaturedServiceDTO {
  id: string;
  name: string;
  categoryName: string;
  images: string[];
  duration: string; // Formatted as "90 min"
  price: string;
  excerpt: string;
  slug: string;
}

export interface ServiceWithCategoryDTO extends ServiceDTO {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
  };
}

export interface GetServicesQueryParams {
  page?: string;
  limit?: string;
  categoryId?: string;
  featured?: string; // 'true' | 'false'
}

export interface ServicesResponse {
  data: ServiceDTO[] | FeaturedServiceDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
