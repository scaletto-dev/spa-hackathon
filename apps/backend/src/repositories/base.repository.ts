/**
 * Base Repository
 *
 * Provides common CRUD operations for all repositories.
 * All repositories should extend this class to inherit standard methods.
 *
 * @template T - Type of entity managed by this repository
 */

export abstract class BaseRepository<T> {
  /**
   * Prisma model instance - must be defined in subclass
   */
  protected abstract model: any;

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  /**
   * Find all entities with optional filtering
   */
  async findAll(where?: any): Promise<T[]> {
    return this.model.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create new entity
   */
  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  /**
   * Update existing entity
   */
  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  /**
   * Count entities with optional filtering
   */
  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }
}
