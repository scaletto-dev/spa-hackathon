import axios from 'axios';
import { BlogListResponse, BlogPost, BlogPostParams } from '../types/blog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const blogApi = {
  /**
   * Get all blog posts with pagination and filtering
   */
  getAllPosts: async (params?: BlogPostParams): Promise<BlogListResponse> => {
    const { data } = await axios.get(`${API_URL}/api/v1/blog/posts`, { params });
    return data;
  },

  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const { data } = await axios.get(`${API_URL}/api/v1/blog/posts/${slug}`);
    return data;
  }
};