import prisma from "../lib/prisma";
import { NotFoundError, ValidationError } from "../utils/errors";
import {
   AvailabilityResponse,
   TimeSlot,
   BranchOperatingHours,
   OperatingHours,
} from "../types/availability";

/**
 * Availability Service
 *
 * Business logic for checking appointment availability.
 * Handles time slot generation, booking conflicts, and operating hours.
 */

export class AvailabilityService {
   private readonly BUFFER_TIME_MINUTES = 15; // Cleanup time between appointments
   private readonly TIME_SLOT_INCREMENT = 30; // Minutes between slots

   /**
    * Get available time slots for a specific service, branch, and date
    *
    * @param serviceId - Service ID
    * @param branchId - Branch ID
    * @param date - Date in YYYY-MM-DD format
    * @returns Available time slots
    */
   async getAvailableSlots(
      serviceId: string,
      branchId: string,
      date: string
   ): Promise<AvailabilityResponse> {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
         throw new ValidationError(
            "Invalid date format. Use YYYY-MM-DD format"
         );
      }

      // Parse date and validate it's not in the past
      const requestedDate = new Date(date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (requestedDate < today) {
         throw new ValidationError("Cannot check availability for past dates");
      }

      // Fetch service to get duration
      const service = await prisma.service.findUnique({
         where: { id: serviceId, active: true },
         select: { id: true, duration: true, name: true },
      });

      if (!service) {
         throw new NotFoundError(`Service with ID '${serviceId}' not found`);
      }

      // Fetch branch to get operating hours
      const branch = await prisma.branch.findUnique({
         where: { id: branchId, active: true },
         select: {
            id: true,
            name: true,
            operatingHours: true,
         },
      });

      if (!branch) {
         throw new NotFoundError(`Branch with ID '${branchId}' not found`);
      }

      // Get operating hours for the day of week
      const dayOfWeek = this.getDayOfWeek(requestedDate);
      const operatingHours = (branch.operatingHours as BranchOperatingHours)[
         dayOfWeek
      ];

      if (!operatingHours) {
         // Branch is closed on this day
         return {
            date,
            slots: [],
         };
      }

      // Generate all possible time slots based on operating hours
      const allSlots = this.generateTimeSlots(
         operatingHours.open,
         operatingHours.close,
         service.duration
      );

      // Get existing bookings for this branch and date
      const existingBookings = await this.getExistingBookings(branchId, date);

      // Mark slots as available/unavailable based on existing bookings
      const slots = allSlots.map((slot) => {
         const isAvailable = this.isTimeSlotAvailable(
            slot.time,
            service.duration,
            existingBookings
         );

         return {
            time: slot.time,
            available: isAvailable,
         };
      });

      // Filter out past time slots if date is today
      const now = new Date();
      const isToday = requestedDate.toDateString() === now.toDateString();

      if (isToday) {
         const currentTime = `${String(now.getHours()).padStart(
            2,
            "0"
         )}:${String(now.getMinutes()).padStart(2, "0")}`;
         return {
            date,
            slots: slots.filter((slot) => slot.time > currentTime),
         };
      }

      return {
         date,
         slots,
      };
   }

   /**
    * Generate time slots between open and close times
    *
    * @param openTime - Opening time (HH:MM)
    * @param closeTime - Closing time (HH:MM)
    * @param serviceDuration - Service duration in minutes
    * @returns Array of time slots
    */
   private generateTimeSlots(
      openTime: string,
      closeTime: string,
      serviceDuration: number
   ): TimeSlot[] {
      const slots: TimeSlot[] = [];
      const [openHour, openMinute] = openTime.split(":").map(Number);
      const [closeHour, closeMinute] = closeTime.split(":").map(Number);

      let currentMinutes = openHour * 60 + openMinute;
      const closeMinutes = closeHour * 60 + closeMinute;

      // Generate slots, ensuring the service can be completed before closing
      while (currentMinutes + serviceDuration <= closeMinutes) {
         const hours = Math.floor(currentMinutes / 60);
         const minutes = currentMinutes % 60;
         const timeString = `${String(hours).padStart(2, "0")}:${String(
            minutes
         ).padStart(2, "0")}`;

         slots.push({
            time: timeString,
            available: true, // Will be updated based on existing bookings
         });

         currentMinutes += this.TIME_SLOT_INCREMENT;
      }

      return slots;
   }

   /**
    * Get existing bookings for a branch on a specific date
    *
    * @param branchId - Branch ID
    * @param date - Date string (YYYY-MM-DD)
    * @returns Array of bookings with appointment times
    */
   private async getExistingBookings(
      branchId: string,
      date: string
   ): Promise<Array<{ appointmentTime: string; serviceDuration: number }>> {
      const startOfDay = new Date(date + "T00:00:00");
      const endOfDay = new Date(date + "T23:59:59");

      const bookings = await prisma.booking.findMany({
         where: {
            branchId,
            appointmentDate: {
               gte: startOfDay,
               lte: endOfDay,
            },
            status: {
               in: ["PENDING", "CONFIRMED"], // Only consider active bookings
            },
         },
         select: {
            appointmentTime: true,
            service: {
               select: {
                  duration: true,
               },
            },
         },
      });

      return bookings.map((booking) => ({
         appointmentTime: booking.appointmentTime,
         serviceDuration: booking.service.duration,
      }));
   }

   /**
    * Check if a time slot is available
    *
    * @param slotTime - Time slot to check (HH:MM)
    * @param serviceDuration - Duration of service in minutes
    * @param existingBookings - Array of existing bookings
    * @returns True if slot is available
    */
   private isTimeSlotAvailable(
      slotTime: string,
      serviceDuration: number,
      existingBookings: Array<{
         appointmentTime: string;
         serviceDuration: number;
      }>
   ): boolean {
      const [slotHour, slotMinute] = slotTime.split(":").map(Number);
      const slotStartMinutes = slotHour * 60 + slotMinute;
      const slotEndMinutes =
         slotStartMinutes + serviceDuration + this.BUFFER_TIME_MINUTES;

      // Check if this slot conflicts with any existing booking
      for (const booking of existingBookings) {
         const [bookingHour, bookingMinute] = booking.appointmentTime
            .split(":")
            .map(Number);
         const bookingStartMinutes = bookingHour * 60 + bookingMinute;
         const bookingEndMinutes =
            bookingStartMinutes +
            booking.serviceDuration +
            this.BUFFER_TIME_MINUTES;

         // Check for overlap
         // Slot overlaps if it starts before booking ends and ends after booking starts
         if (
            slotStartMinutes < bookingEndMinutes &&
            slotEndMinutes > bookingStartMinutes
         ) {
            return false; // Conflict found
         }
      }

      return true; // No conflicts
   }

   /**
    * Get day of week in lowercase format
    *
    * @param date - Date object
    * @returns Day of week (e.g., "monday", "tuesday")
    */
   private getDayOfWeek(date: Date): keyof BranchOperatingHours {
      const days: Array<keyof BranchOperatingHours> = [
         "sunday",
         "monday",
         "tuesday",
         "wednesday",
         "thursday",
         "friday",
         "saturday",
      ];
      return days[date.getDay()];
   }
}

export default new AvailabilityService();
