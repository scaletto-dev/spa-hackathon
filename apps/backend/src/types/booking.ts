/**
 * Booking Type Definitions
 *
 * DTO types for booking API requests and responses
 */

import { BookingStatus } from "@prisma/client";

export interface CreateBookingRequest {
   serviceId: string;
   branchId: string;
   appointmentDate: string; // YYYY-MM-DD format
   appointmentTime: string; // HH:MM format
   guestName: string;
   guestEmail: string;
   guestPhone: string;
   notes?: string; // Special requests
   language?: string; // For email confirmations (vi, ja, en, zh)
}

export interface BookingDTO {
   id: string;
   referenceNumber: string;
   serviceId: string;
   branchId: string;
   appointmentDate: string; // ISO string
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

export interface CancelBookingRequest {
   email: string; // Email verification
   reason?: string; // Optional cancellation reason
}

export interface GetBookingQueryParams {
   email?: string; // Optional email verification
}

export interface ListBookingsQueryParams {
   branchId?: string;
   serviceId?: string;
   status?: string;
   date?: string; // YYYY-MM-DD
   dateFrom?: string;
   dateTo?: string;
   page?: string;
   limit?: string;
   sortBy?: string; // appointmentDate, createdAt
   sortOrder?: string; // asc, desc
}

export interface UpdateBookingStatusRequest {
   status: BookingStatus;
}

