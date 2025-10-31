/**
 * Branches API Client
 * Handles all branch-related API calls to backend
 */

import axios from 'axios';
import type { Branch, BranchParams, BranchesResponse } from '../types/branch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const branchesApi = {
    /**
     * Get all branches with pagination
     */
    getAllBranches: async (params?: BranchParams): Promise<BranchesResponse> => {
        const { data } = await axios.get(`${API_URL}/api/v1/branches`, { params });
        return data;
    },

    /**
     * Get a single branch by ID
     */
    getBranchById: async (id: string): Promise<Branch> => {
        const { data } = await axios.get(`${API_URL}/api/v1/branches/${id}`);
        return data.data;
    },
};

// Re-export types for convenience
export type {
    Branch,
    BranchesResponse,
    BranchDetailResponse,
    BranchParams,
    OperatingHoursEntry,
} from '../types/branch';

// Re-export format utilities for convenience
export { formatOperatingHours, formatPhone } from '../utils/format';

// Export legacy functions for backward compatibility
// TODO: Remove these and update all imports to use branchesApi object
export const getAllBranches = branchesApi.getAllBranches;
export const getBranchById = branchesApi.getBranchById;
