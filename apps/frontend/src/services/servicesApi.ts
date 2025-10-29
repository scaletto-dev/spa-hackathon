/**
 * Services API Client
 * Handles all service-related API calls to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  duration: number;
  price: string; // Decimal as string (e.g., "2500000")
  categoryId: string;
  categoryName?: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  success: boolean;
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

/**
 * Get featured services for homepage
 * @param limit - Number of services to fetch (default: 6)
 * @returns Array of featured services
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/services?featured=true&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch featured services: ${response.statusText}`);
    }
    
    const result: ServicesResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching featured services:', error);
    throw error;
  }
}

/**
 * Get all services with optional filters
 * @param params - Query parameters (page, limit, categoryId, featured)
 * @returns Paginated services response
 */
export async function getServices(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}): Promise<ServicesResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    
    const url = `${API_BASE_URL}/api/v1/services${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get a single service by ID
 * @param id - Service ID
 * @returns Service details
 */
export async function getServiceById(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/services/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

/**
 * Format price from string to VND currency format
 * @param price - Price as string (e.g., "2500000")
 * @returns Formatted price (e.g., "2.500.000 ₫")
 */
export function formatPrice(price: string): string {
  const num = parseInt(price, 10);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
}

/**
 * Format duration to human-readable string
 * @param duration - Duration in minutes
 * @returns Formatted duration (e.g., "90 phút")
 */
export function formatDuration(duration: number): string {
  if (duration < 60) {
    return `${duration} phút`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) {
    return `${hours} giờ`;
  }
  return `${hours} giờ ${minutes} phút`;
}

/**
 * Format operating hours object to readable string
 * @param hours - Operating hours JSON object
 * @returns Formatted hours (e.g., "Thứ 2-6: 9:00-18:00")
 */
export function formatOperatingHours(hours: Record<string, any>): string {
  if (!hours || typeof hours !== 'object') {
    return 'Liên hệ để biết giờ làm việc';
  }
  
  // Try to format as a simple range if all weekdays have same hours
  const monday = hours.monday || hours.Monday || hours.mon;
  if (monday && monday.open && monday.close) {
    return `Thứ 2-6: ${monday.open}-${monday.close}`;
  }
  
  return 'Liên hệ để biết giờ làm việc';
}
