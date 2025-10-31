import { NotFoundError } from '@/utils/errors';
import { branchRepository } from '@/repositories/branch.repository';
import {
  BranchDTO,
  BranchWithServicesDTO,
  ServiceDTO,
  BranchServicesResponse,
} from '@/types/branch';

export class BranchService {
  /**
   * Get all branches with pagination
   */
  async getAllBranches(
    includeServices: boolean = false,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: BranchDTO[] | BranchWithServicesDTO[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const result = await branchRepository.findAllWithPagination(page, limit, includeServices);

    let data: (BranchDTO | BranchWithServicesDTO)[];

    if (includeServices) {
      // Filter out services property and map separately
      data = result.branches.map((item: any) => {
        const { services, ...branch } = item;
        return toBranchWithServicesDTO(branch, services || []);
      });
    } else {
      data = result.branches.map(toBranchDTO);
    }

    return {
      data,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get a single branch by ID
   */
  async getBranchById(
    id: string,
    includeServices: boolean = false
  ): Promise<BranchDTO | BranchWithServicesDTO> {
    if (includeServices) {
      const result = await branchRepository.findByIdWithServices(id);

      if (!result) {
        throw new NotFoundError(`Branch with ID '${id}' not found`);
      }

      const { services, ...branch } = result;
      return toBranchWithServicesDTO(branch, services);
    }

    const branch = await branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundError(`Branch with ID '${id}' not found`);
    }

    return toBranchDTO(branch);
  }

  /**
   * Get services for a specific branch with pagination
   */
  async getBranchServices(
    branchId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<BranchServicesResponse> {
    const result = await branchRepository.findBranchServices(branchId, page, limit);

    if (!result) {
      throw new NotFoundError(`Branch with ID '${branchId}' not found`);
    }

    return {
      branchId: result.branch.id,
      branchName: result.branch.name,
      data: result.services.map(toServiceDTO),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: result.totalPages,
      },
    };
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

/**
 * Transform branch to BranchDTO
 */
function toBranchDTO(branch: any): BranchDTO {
  return {
    id: branch.id,
    name: branch.name,
    slug: branch.slug,
    address: branch.address,
    phone: branch.phone,
    email: branch.email,
    latitude: parseFloat(branch.latitude.toString()),
    longitude: parseFloat(branch.longitude.toString()),
    operatingHours: branch.operatingHours as Record<string, any>,
    images: branch.images,
    image: branch.images[0] || '',
    active: branch.active,
    description: branch.description,
    createdAt: branch.createdAt.toISOString(),
    updatedAt: branch.updatedAt.toISOString(),
  };
}

/**
 * Transform branch with services to BranchWithServicesDTO
 */
function toBranchWithServicesDTO(branch: any, services: any[]): BranchWithServicesDTO {
  return {
    ...toBranchDTO(branch),
    services: services.map(toServiceDTO),
  };
}

export default new BranchService();
