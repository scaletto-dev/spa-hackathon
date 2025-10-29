/**
 * Branch Type Definitions
 * 
 * DTO types for branch/location API responses
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

export interface BranchDTO {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: string; // Decimal returned as string
  longitude: string; // Decimal returned as string
  operatingHours: Record<string, any>; // JSON object
  images: string[];
  active: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BranchWithServicesDTO extends BranchDTO {
  services: ServiceDTO[];
}

export interface GetBranchesQueryParams {
  includeServices?: string; // 'true' | 'false'
}

export interface GetBranchServicesQueryParams {
  page?: string;
  limit?: string;
}
