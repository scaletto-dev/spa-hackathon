/**
 * Branch Type Definitions & DTOs
 *
 * Defines types for branch requests, responses, and database entities.
 * Following clean architecture pattern: types → validators → repository → service → controller
 */

/**
 * Service DTO (referenced by branch)
 * Minimal service info when included with branch
 */
export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  duration: number;
  price: string;
  categoryId: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Branch DTO
 * Main branch data transfer object
 */
export interface BranchDTO {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: number;
  longitude: number;
  operatingHours: Record<string, any>;
  images: string[];
  image: string;
  active: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Branch with Services DTO
 * Extended branch with service list
 */
export interface BranchWithServicesDTO extends BranchDTO {
  services: ServiceDTO[];
}

/**
 * Branches List Response DTO
 * Paginated list of branches
 */
export interface BranchesListResponse {
  data: BranchDTO[] | BranchWithServicesDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Branch Services Response DTO
 * Services available at a branch with pagination
 */
export interface BranchServicesResponse {
  branchId: string;
  branchName: string;
  data: ServiceDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
