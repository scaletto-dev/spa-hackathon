/**
 * Booking Type Definitions
 * 
 * Defines types for booking requests, responses, and database entities.
 */

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'PENDING';

/**
 * Create Booking Request
 * Supports both member and guest bookings
 * Now supports multiple services per booking
 */
export interface CreateBookingRequest {
  serviceIds: string[]; // Array of service IDs for combo/package bookings
  branchId: string;
  appointmentDate: string; // ISO 8601 date format
  appointmentTime: string; // HH:mm format
  notes?: string;
  language?: string; // Default: 'vi'
  
  // For member bookings (if userId is provided in auth context)
  // userId is extracted from JWT token
  
  // For guest bookings
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

/**
 * Update Booking Status Request
 */
export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  cancellationReason?: string; // Required if status is CANCELLED
}

/**
 * Booking Response
 * Returned from API endpoints
 */
export interface BookingResponse {
  id: string;
  referenceNumber: string;
  userId?: string;
  serviceIds: string[];
  branchId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  language: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data (populated from routes)
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }> | undefined;
  branch: {
    id: string;
    name: string;
    address: string;
    phone: string;
  } | undefined;
}

/**
 * List Bookings Query Parameters
 */
export interface ListBookingsQueryParams {
  page?: string;
  limit?: string;
  status?: BookingStatus;
  startDate?: string; // ISO 8601 format
  endDate?: string;   // ISO 8601 format
}

/**
 * Generate Reference Number
 * Format: SPAbooking-YYYYMMDD-XXXXXX (where X is random)
 * Example: SPAbooking-20251030-a1b2c3
 */
export interface GeneratedReference {
  referenceNumber: string;
  timestamp: string;
}

/**
 * Booking Availability Check
 */
export interface AvailabilityCheckRequest {
  serviceId: string;
  branchId: string;
  appointmentDate: string; // ISO 8601 format
}

export interface AvailabilityCheckResponse {
  serviceId: string;
  branchId: string;
  appointmentDate: string;
  availableTimeSlots: string[]; // Array of HH:mm times
  isAvailable: boolean;
}

/**
 * Booking Statistics (for admin/dashboard)
 */
export interface BookingStats {
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  noShow: number;
  pending: number;
}
