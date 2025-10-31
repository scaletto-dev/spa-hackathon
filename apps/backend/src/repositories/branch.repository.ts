/**
 * Branch Repository
 *
 * Data access layer for branches.
 * Encapsulates all Prisma queries related to branches.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class BranchRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.branch;

  /**
   * Find all branches with pagination
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    includeServices: boolean = false
  ) {
    const where = { active: true };
    const skip = (page - 1) * limit;

    // Get total count and branches in parallel
    const [total, branches] = await Promise.all([
      prisma.branch.count({ where }),
      prisma.branch.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    // Optionally fetch services
    let branchesWithServices = branches;
    if (includeServices) {
      const allServices = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });

      branchesWithServices = branches.map((branch) => ({
        ...branch,
        services: allServices,
      }));
    }

    return {
      branches: branchesWithServices,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find branch by ID
   */
  async findById(id: string) {
    return prisma.branch.findUnique({
      where: {
        id,
        active: true,
      },
    });
  }

  /**
   * Find branch by ID with services
   */
  async findByIdWithServices(id: string) {
    const branch = await prisma.branch.findUnique({
      where: {
        id,
        active: true,
      },
    });

    if (!branch) {
      return null;
    }

    // Fetch all active services
    const allServices = await prisma.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });

    return {
      ...branch,
      services: allServices,
    };
  }

  /**
   * Get services available at a branch (paginated)
   * Currently returns all active services (no direct branch-service relationship)
   */
  async findBranchServices(
    branchId: string,
    page: number = 1,
    limit: number = 20
  ) {
    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
        active: true,
      },
    });

    if (!branch) {
      return null;
    }

    const where = { active: true };
    const skip = (page - 1) * limit;

    // Get total count and services in parallel
    const [total, services] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      branch,
      services,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const branchRepository = new BranchRepository();
