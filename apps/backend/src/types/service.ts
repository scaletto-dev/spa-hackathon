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
   excerpt: string;
   duration: number;
   price: string; // Decimal returned as string
   categoryId: string;
   categoryName?: string; // Optional for includes
   images: string[];
   featured: boolean;
   active: boolean;
   createdAt: string;
   updatedAt: string;
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
   data: ServiceDTO[];
   meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
   };
}
