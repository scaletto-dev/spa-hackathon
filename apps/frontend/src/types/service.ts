/**
 * Service Type Definitions
 * 
 * Types for service-related API responses and data structures
 */

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  serviceCount: number;
}

export interface ServiceCategoriesResponse {
  success: boolean;
  data: ServiceCategory[];
  timestamp: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  excerpt: string;
  duration: number;
  price: string; // Decimal as string (e.g., "2500000")
  categoryId: string;
  categoryName?: string;
  images: string[];
  benefits?: string[];
  featured: boolean;
  active: boolean;
  beforeAfterPhotos?: string[];
  faqs?: Array<{ question: string; answer: string }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWithCategory extends Service {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
  };
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ServiceParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}

export interface ServiceDetailResponse {
  success: boolean;
  data: ServiceWithCategory;
  timestamp: string;
}

