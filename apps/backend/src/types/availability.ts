/**
 * Availability Type Definitions
 *
 * DTO types for availability check API responses
 */

export interface TimeSlot {
   time: string; // HH:MM format (e.g., "09:00", "14:30")
   available: boolean;
}

export interface AvailabilityResponse {
   date: string; // YYYY-MM-DD format
   slots: TimeSlot[];
}

export interface GetAvailabilityQueryParams {
   serviceId: string;
   branchId: string;
   date: string; // YYYY-MM-DD format
}

export interface OperatingHours {
   open: string; // HH:MM format
   close: string; // HH:MM format
}

export interface BranchOperatingHours {
   monday?: OperatingHours;
   tuesday?: OperatingHours;
   wednesday?: OperatingHours;
   thursday?: OperatingHours;
   friday?: OperatingHours;
   saturday?: OperatingHours;
   sunday?: OperatingHours;
}
