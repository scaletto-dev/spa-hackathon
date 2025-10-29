/**
 * Branches API Client
 * Handles all branch-related API calls to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: string;
  longitude: string;
  operatingHours: Record<string, any>;
  images: string[];
  active: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BranchesResponse {
  success: boolean;
  data: Branch[];
  timestamp: string;
}

/**
 * Get all branches
 * @param limit - Number of branches to fetch (optional)
 * @returns Array of branches
 */
export async function getAllBranches(limit?: number): Promise<Branch[]> {
  try {
    const url = limit 
      ? `${API_BASE_URL}/api/v1/branches?limit=${limit}`
      : `${API_BASE_URL}/api/v1/branches`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch branches: ${response.statusText}`);
    }
    
    const result: BranchesResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
}

/**
 * Get a single branch by ID
 * @param id - Branch ID
 * @returns Branch details
 */
export async function getBranchById(id: string): Promise<Branch> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/branches/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch branch: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
}

/**
 * Format operating hours from JSON to readable string
 * @param hours - Operating hours object
 * @returns Formatted string
 */
export function formatOperatingHours(hours: Record<string, any>): string {
  if (!hours || typeof hours !== 'object') {
    return 'Liên hệ để biết giờ làm việc';
  }
  
  // Try to get Monday hours as representative
  const monday = hours.monday || hours.Monday || hours.mon;
  if (monday && typeof monday === 'object' && monday.open && monday.close) {
    return `Thứ 2-6: ${monday.open} - ${monday.close}`;
  }
  
  // Fallback to first available day
  const firstDay = Object.values(hours)[0];
  if (firstDay && typeof firstDay === 'object' && (firstDay as any).open && (firstDay as any).close) {
    return `${(firstDay as any).open} - ${(firstDay as any).close}`;
  }
  
  return 'Liên hệ để biết giờ làm việc';
}
