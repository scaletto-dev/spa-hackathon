/**
 * Services API Client
 * Handles all service-related API calls to backend
 */

import axios from 'axios';
import {
    Service,
    ServiceCategory,
    ServiceWithCategory,
    ServicesResponse,
    ServiceParams,
    ServiceDetailResponse,
    ServiceCategoriesResponse,
} from '../types/service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const servicesApi = {
    /**
     * Get all service categories with service count
     */
    getAllCategories: async (): Promise<ServiceCategory[]> => {
        const { data } = await axios.get<ServiceCategoriesResponse>(
            `${API_URL}/api/v1/services/categories`
        );
        return data.data;
    },

    /**
     * Get all services with optional filters and pagination
     */
    getServices: async (params?: ServiceParams): Promise<ServicesResponse> => {
        const { data } = await axios.get(`${API_URL}/api/v1/services`, { params });
        return data;
    },

    /**
     * Get featured services for homepage
     */
    getFeaturedServices: async (limit: number = 6): Promise<Service[]> => {
        const { data } = await axios.get(`${API_URL}/api/v1/services`, {
            params: { featured: true, limit },
        });
        return data.data;
    },

    /**
     * Get a single service by ID with full category details
     */
    getServiceById: async (id: string): Promise<ServiceWithCategory> => {
        const { data } = await axios.get(`${API_URL}/api/v1/services/${id}`);
        return data.data;
    },
};

// Re-export types for convenience
export type { Service, ServiceCategory, ServicesResponse, ServiceParams, ServiceDetailResponse };

// Re-export format utilities for convenience
export { formatPrice, formatDuration, formatOperatingHours } from '../utils/format';

// Export legacy functions for backward compatibility
// TODO: Remove these and update all imports to use servicesApi object
export const getServices = servicesApi.getServices;
export const getFeaturedServices = servicesApi.getFeaturedServices;
export const getServiceById = servicesApi.getServiceById;
