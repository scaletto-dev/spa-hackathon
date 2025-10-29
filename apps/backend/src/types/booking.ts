import { BookingStatus } from '@prisma/client';

/**
 * Booking DTOs and Types
 */

/**
 * Create Booking Request
 */
export interface CreateBookingRequest {
   serviceId: string;
   branchId: string;
   appointmentDate: string; // YYYY-MM-DD
   appointmentTime: string; // HH:MM
   guestName: string;
   guestEmail: string;
   guestPhone: string;
   notes?: string; // Special requests (max 500 characters)
   language?: string; // 'vi' | 'en' | 'ja'
}

/**
 * Cancel Booking Request
 */
export interface CancelBookingRequest {
   email: string; // Email verification
   reason?: string; // Optional cancellation reason
}

/**
 * List Bookings Query Parameters (Admin)
 */
export interface ListBookingsQueryParams {
   page?: string;
   limit?: string;
   branchId?: string;
   serviceId?: string;
   status?: string; // BookingStatus
   date?: string; // YYYY-MM-DD (specific date)
   dateFrom?: string; // YYYY-MM-DD (date range start)
   dateTo?: string; // YYYY-MM-DD (date range end)
   sortBy?: string; // Field to sort by (default: appointmentDate)
   sortOrder?: "asc" | "desc"; // Sort order (default: desc)
}

/**
 * Update Booking Status Request (Admin)
 */
export interface UpdateBookingStatusRequest {
   status: BookingStatus;
}

/**
 * Basic Booking DTO
 */
export interface BookingDTO {
   id: string;
   referenceNumber: string;
   serviceId: string;
   branchId: string;
   appointmentDate: string;
   appointmentTime: string;
   status: BookingStatus;
   guestName: string;
   guestEmail: string;
   guestPhone: string;
   notes: string | null;
   language: string;
   createdAt: string;
   updatedAt: string;
}

/**
 * Booking with Details DTO (includes service and branch info)
 */
export interface BookingWithDetailsDTO extends BookingDTO {
   service: {
      id: string;
      name: string;
      duration: number;
      price: string;
   };
   branch: {
      id: string;
      name: string;
      address: string;
      phone: string;
   };
}

/**
 * List Bookings Response (Admin)
 */
export interface ListBookingsResponse {
   data: BookingWithDetailsDTO[];
   meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
   };
}
