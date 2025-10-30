/**
 * Blog Types
 * Contains interfaces and types for blog-related functionality
 */

export interface GetBlogPostsQueryParams {
    page?: string;
    limit?: string;
    categoryId?: string;
}

export interface BlogPostResponseDto {
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
    category?: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
    };
    author?: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface BlogPostListItem {
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

export interface BlogPostDetail extends Omit<BlogPostResponseDto, 'category' | 'author'> {
    category: NonNullable<BlogPostResponseDto['category']>;
    author: NonNullable<BlogPostResponseDto['author']>;
    relatedPosts: BlogPostListItem[];
}