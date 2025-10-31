import axios from 'axios';
import {
    BlogListResponse,
    BlogPostParams,
    BlogCategoriesResponse,
    BlogPostDetailResponse,
    BlogCategory,
} from '../types/blog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const blogApi = {
    /**
     * Get all blog categories with post count
     */
    getAllCategories: async (): Promise<BlogCategory[]> => {
        const { data } = await axios.get<BlogCategoriesResponse>(
            `${API_URL}/api/v1/blog/categories`
        );
        return data.data;
    },

    /**
     * Get all blog posts with pagination and filtering
     */
    getAllPosts: async (params?: BlogPostParams): Promise<BlogListResponse> => {
        const { data } = await axios.get(`${API_URL}/api/v1/blog/posts`, { params });
        return data;
    },

    /**
     * Get a single blog post by slug with related posts
     */
    getPostBySlug: async (slug: string): Promise<BlogPostDetailResponse['data']> => {
        const { data } = await axios.get<BlogPostDetailResponse>(
            `${API_URL}/api/v1/blog/posts/${slug}`
        );
        return data.data;
    },
};

// Re-export types for convenience
export type { BlogCategory, BlogListResponse, BlogPostParams, BlogPostDetail } from '../types/blog';
