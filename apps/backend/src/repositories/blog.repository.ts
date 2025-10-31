/**
 * Blog Repository
 *
 * Data access layer for blog posts and categories.
 * Encapsulates all Prisma queries related to blog functionality.
 * Extends BaseRepository for common CRUD operations.
 */

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class BlogRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.blogPost;

  /**
   * Find all published blog posts with pagination and filtering
   */
  async findAllPublishedWithPagination(
    page: number = 1,
    limit: number = 6,
    categoryId?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      published: true,
      ...(categoryId ? { categoryId } : {}),
    };

    // Add search condition
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { excerpt: { contains: search.trim(), mode: 'insensitive' } },
        { content: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
          author: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      posts,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find a single blog post by slug
   */
  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Find related posts in the same category
   */
  async findRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3) {
    return prisma.blogPost.findMany({
      where: {
        categoryId,
        published: true,
        id: { not: currentPostId },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Find all blog categories with post count
   */
  async findAllCategoriesWithCounts() {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      postCount: cat._count.posts,
    }));
  }
}

export const blogRepository = new BlogRepository();
