// Raw backend response types
export interface BlogPostBackend {
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
    category: {
        id: string;
        name: string;
        slug: string;
        description: string;
    };
    author: {
        id: string;
        fullName: string;
        email: string;
    };
}

// Frontend display types
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    postCount: number;
}

export interface BlogListResponse {
    success: boolean;
    data: BlogPostBackend[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    timestamp: string;
}

export interface BlogCategoriesResponse {
    success: boolean;
    data: BlogCategory[];
    timestamp: string;
}

export interface BlogPostDetail extends BlogPostBackend {
    relatedPosts: Array<{
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
    }>;
}

export interface BlogPostDetailResponse {
    success: boolean;
    data: BlogPostDetail;
    timestamp: string;
}

export interface BlogPostParams {
    page?: number;
    limit?: number;
    categoryId?: string;
}
