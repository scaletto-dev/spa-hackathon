/**
 * Branch Type Definitions
 * 
 * Types for branch-related API responses and data structures
 */

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: string;
  longitude: string;
  operatingHours: Record<string, OperatingHoursEntry>;
  images: string[];
  active: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHoursEntry {
  open?: string;
  close?: string;
}

export interface BranchesResponse {
  success: boolean;
  data: Branch[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface BranchDetailResponse {
  success: boolean;
  data: Branch;
  timestamp: string;
}

export interface BranchParams {
  page?: number;
  limit?: number;
  includeServices?: boolean;
}

