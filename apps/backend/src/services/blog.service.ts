import { NotFoundError } from '@/utils/errors';
import { blogRepository } from '@/repositories/blog.repository';
import {
  BlogPostDTO,
  BlogPostWithDetailsDTO,
  BlogPostListItemDTO,
  BlogCategoryDTO,
  BlogPostsListResponse,
} from '@/types/blog';

/**
 * Transform raw blog post to BlogPostDTO
 */
function toBlogPostDTO(post: any): BlogPostDTO {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categoryId: post.categoryId,
    authorId: post.authorId,
    published: post.published,
    publishedAt: post.publishedAt?.toISOString() || null,
    language: post.language,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

/**
 * Transform raw blog post with details to BlogPostWithDetailsDTO
 */
function toBlogPostWithDetailsDTO(post: any): BlogPostWithDetailsDTO {
  return {
    ...toBlogPostDTO(post),
    category: post.category,
    author: post.author,
  };
}

/**
 * Transform raw blog post to BlogPostListItemDTO
 */
function toBlogPostListItemDTO(post: any): BlogPostListItemDTO {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt?.toISOString() || null,
    category: post.category,
    author: post.author,
  };
}

export class BlogService {
  /**
   * Get all published blog posts with pagination and search
   */
  async getAllPosts(
    page: number = 1,
    limit: number = 6,
    categoryId?: string,
    search?: string
  ): Promise<BlogPostsListResponse> {
    const result = await blogRepository.findAllPublishedWithPagination(
      page,
      limit,
      categoryId,
      search
    );

    return {
      data: result.posts.map(toBlogPostWithDetailsDTO),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get a single blog post by slug with related posts
   */
  async getPostBySlug(slug: string): Promise<{
    post: BlogPostWithDetailsDTO;
    relatedPosts: BlogPostListItemDTO[];
  }> {
    const post = await blogRepository.findBySlug(slug);

    if (!post || !post.published) {
      throw new NotFoundError(`Blog post '${slug}' not found`);
    }

    const relatedPosts = await blogRepository.findRelatedPosts(post.categoryId, post.id);

    return {
      post: toBlogPostWithDetailsDTO(post),
      relatedPosts: relatedPosts.map(toBlogPostListItemDTO),
    };
  }

  /**
   * Get all blog categories with post counts
   */
  async getAllCategories(): Promise<BlogCategoryDTO[]> {
    return blogRepository.findAllCategoriesWithCounts();
  }
}

export default new BlogService();
