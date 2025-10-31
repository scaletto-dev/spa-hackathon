/**
 * Blog Types
 * Contains interfaces and types for blog-related functionality
 */

/**
 * Blog Post DTO - Full post details
 */
export interface BlogPostDTO {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  authorId: string;
  published: boolean;
  publishedAt: string | null;
  language: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog Post with Category and Author
 */
export interface BlogPostWithDetailsDTO extends BlogPostDTO {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  author: {
    id: string;
    fullName: string;
    email: string;
  };
}

/**
 * Blog Post List Item - Minimal info for listings
 */
export interface BlogPostListItemDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string | null;
  category: {
    name: string;
    slug: string;
  };
  author: {
    fullName: string;
  };
}

/**
 * Blog Category DTO
 */
export interface BlogCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

/**
 * Blog Posts List Response
 */
export interface BlogPostsListResponse {
  data: BlogPostWithDetailsDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}