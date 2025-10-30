/**
 * Service Type Definitions
 * 
 * Types for service-related API responses and data structures
 */

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  duration: number;
  price: string; // Decimal as string (e.g., "2500000")
  categoryId: string;
  categoryName?: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
  data: Service;
  timestamp: string;
}

