import prisma from '../lib/prisma';
import type { BlogPostResponseDto, BlogPostListItem } from '../types/blog';

/**
 * Blog Service
 * 
 * Handles business logic for blog posts and categories
 */
class BlogService {
    /**
     * Get all published blog posts with pagination and search
     */
    async getAllPosts(
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

        // Add search condition (search in title, excerpt, and content)
        if (search && search.trim()) {
            where.OR = [
                { title: { contains: search.trim(), mode: 'insensitive' } },
                { excerpt: { contains: search.trim(), mode: 'insensitive' } },
                { content: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        // Get posts with category and author
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

        // Transform to response DTOs
        const data: BlogPostResponseDto[] = posts.map((post) => ({
            ...post,
            publishedAt: post.publishedAt?.toISOString() || null,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }));

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single blog post by slug
     */
    async getPostBySlug(slug: string): Promise<BlogPostResponseDto> {
        const post = await prisma.blogPost.findUnique({
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

        if (!post || !post.published) {
            throw new Error('Blog post not found');
        }

        return {
            ...post,
            publishedAt: post.publishedAt?.toISOString() || null,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    }

    /**
     * Get related posts for a given post
     */
    async getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3): Promise<BlogPostListItem[]> {
        const posts = await prisma.blogPost.findMany({
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

        return posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            publishedAt: post.publishedAt?.toISOString() || null,
            category: {
                name: post.category.name,
                slug: post.category.slug,
            },
            author: {
                fullName: post.author.fullName,
            },
        }));
    }

    /**
     * Get all blog categories with post count
     */
    async getAllCategories() {
        const categories = await prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        posts: {
                            where: {
                                published: true,
                            },
                        },
                    },
                },
            },
        });

        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            postCount: category._count.posts,
        }));
    }
}

export default new BlogService();