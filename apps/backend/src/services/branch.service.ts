import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { BranchDTO, BranchWithServicesDTO, ServiceDTO } from '../types/branch';

/**
 * Branch Service
 * 
 * Business logic layer for branch/location operations.
 * Handles data retrieval, transformation, and business rules.
 * 
 * Note: Currently, we don't have a direct many-to-many relationship between branches and services.
 * Services are linked to branches through bookings. For MVP, we return all active services
 * when includeServices=true. In production, you might want to add a BranchService join table.
 */

export class BranchService {
  /**
   * Get all branches
   * 
   * @param includeServices - Whether to include services in the response
   * @returns Array of branches with optional services
   */
  async getAllBranches(includeServices: boolean = false): Promise<BranchDTO[] | BranchWithServicesDTO[]> {
    const branches = await prisma.branch.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (includeServices) {
      // Get all active services for each branch
      // Note: In a real system, you'd have a BranchService join table
      const allServices = await prisma.service.findMany({
        where: {
          active: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        slug: branch.slug,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        latitude: branch.latitude.toString(),
        longitude: branch.longitude.toString(),
        operatingHours: branch.operatingHours as Record<string, any>,
        images: branch.images,
        active: branch.active,
        description: branch.description,
        createdAt: branch.createdAt.toISOString(),
        updatedAt: branch.updatedAt.toISOString(),
        services: allServices.map((service) => this.mapServiceToDTO(service)),
      }));
    }

    return branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      slug: branch.slug,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      latitude: branch.latitude.toString(),
      longitude: branch.longitude.toString(),
      operatingHours: branch.operatingHours as Record<string, any>,
      images: branch.images,
      active: branch.active,
      description: branch.description,
      createdAt: branch.createdAt.toISOString(),
      updatedAt: branch.updatedAt.toISOString(),
    }));
  }

  /**
   * Get a single branch by ID
   * 
   * @param id - Branch ID
   * @param includeServices - Whether to include services
   * @returns Branch with optional services
   * @throws NotFoundError if branch not found
   */
  async getBranchById(id: string, includeServices: boolean = false): Promise<BranchDTO | BranchWithServicesDTO> {
    const branch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!branch || !branch.active) {
      throw new NotFoundError(`Branch with ID '${id}' not found`);
    }

    const baseDTO = {
      id: branch.id,
      name: branch.name,
      slug: branch.slug,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      latitude: branch.latitude.toString(),
      longitude: branch.longitude.toString(),
      operatingHours: branch.operatingHours as Record<string, any>,
      images: branch.images,
      active: branch.active,
      description: branch.description,
      createdAt: branch.createdAt.toISOString(),
      updatedAt: branch.updatedAt.toISOString(),
    };

    if (includeServices) {
      // Get all active services
      const services = await prisma.service.findMany({
        where: {
          active: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return {
        ...baseDTO,
        services: services.map((service) => this.mapServiceToDTO(service)),
      };
    }

    return baseDTO;
  }

  /**
   * Get services for a specific branch with pagination
   * 
   * @param branchId - Branch ID
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Paginated services available at the branch
   * @throws NotFoundError if branch not found
   */
  async getBranchServices(
    branchId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    services: ServiceDTO[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    // Verify branch exists and is active
    const branchExists = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { id: true, active: true },
    });

    if (!branchExists || !branchExists.active) {
      throw new NotFoundError(`Branch with ID '${branchId}' not found`);
    }

    // Get total count of active services
    const total = await prisma.service.count({
      where: {
        active: true,
      },
    });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get services
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    return {
      services: services.map((service) => this.mapServiceToDTO(service)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Map Prisma Service model to ServiceDTO
   * 
   * @param service - Prisma service object
   * @returns ServiceDTO
   */
  private mapServiceToDTO(service: any): ServiceDTO {
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
}

export default new BranchService();
