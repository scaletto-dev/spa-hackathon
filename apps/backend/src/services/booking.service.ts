import prisma from "../lib/prisma";
import {
   NotFoundError,
   ValidationError,
   ConflictError,
} from "../utils/errors";
import {
   CreateBookingRequest,
   BookingDTO,
   BookingWithDetailsDTO,
} from "../types/booking";
import ReferenceNumberGenerator from "../utils/referenceNumberGenerator";
import availabilityService from "./availability.service";

/**
 * Booking Service
 *
 * Business logic for booking management.
 * Handles booking creation, retrieval, cancellation, and validation.
 */

export class BookingService {
   /**
    * Create a new booking
    *
    * @param bookingData - Booking creation data
    * @returns Created booking with details
    */
   async createBooking(
      bookingData: CreateBookingRequest
   ): Promise<BookingWithDetailsDTO> {
      // Validate required fields
      this.validateBookingData(bookingData);

      // Validate date is in the future
      const appointmentDateTime = new Date(
         `${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`
      );
      const now = new Date();

      if (appointmentDateTime <= now) {
         throw new ValidationError(
            "Appointment date and time must be in the future"
         );
      }

      // Verify service exists
      const service = await prisma.service.findUnique({
         where: { id: bookingData.serviceId, active: true },
         select: {
            id: true,
            name: true,
            duration: true,
            price: true,
         },
      });

      if (!service) {
         throw new NotFoundError(
            `Service with ID '${bookingData.serviceId}' not found`
         );
      }

      // Verify branch exists
      const branch = await prisma.branch.findUnique({
         where: { id: bookingData.branchId, active: true },
         select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            operatingHours: true,
         },
      });

      if (!branch) {
         throw new NotFoundError(
            `Branch with ID '${bookingData.branchId}' not found`
         );
      }

      // Validate time slot is within operating hours and available
      await this.validateTimeSlot(
         bookingData.serviceId,
         bookingData.branchId,
         bookingData.appointmentDate,
         bookingData.appointmentTime
      );

      // Use transaction to prevent double booking
      const booking = await prisma.$transaction(async (tx) => {
         // Double-check availability within transaction
         const conflictingBookings = await tx.booking.findMany({
            where: {
               branchId: bookingData.branchId,
               appointmentDate: new Date(
                  bookingData.appointmentDate + "T00:00:00"
               ),
               appointmentTime: bookingData.appointmentTime,
               status: {
                  in: ["PENDING", "CONFIRMED"],
               },
            },
         });

         if (conflictingBookings.length > 0) {
            throw new ConflictError(
               "This time slot is no longer available. Please select another time."
            );
         }

         // Generate unique reference number
         let referenceNumber: string;
         let isUnique = false;
         let attempts = 0;
         const maxAttempts = 10;

         while (!isUnique && attempts < maxAttempts) {
            referenceNumber = ReferenceNumberGenerator.generate(
               new Date(bookingData.appointmentDate)
            );

            const existing = await tx.booking.findUnique({
               where: { referenceNumber },
            });

            if (!existing) {
               isUnique = true;
            }
            attempts++;
         }

         if (!isUnique) {
            throw new Error("Failed to generate unique reference number");
         }

         // Create booking
         const newBooking = await tx.booking.create({
            data: {
               referenceNumber: referenceNumber!,
               serviceId: bookingData.serviceId,
               branchId: bookingData.branchId,
               appointmentDate: new Date(
                  bookingData.appointmentDate + "T00:00:00"
               ),
               appointmentTime: bookingData.appointmentTime,
               guestName: bookingData.guestName,
               guestEmail: bookingData.guestEmail.toLowerCase(),
               guestPhone: bookingData.guestPhone,
               notes: bookingData.notes || null,
               language: bookingData.language || "vi",
               status: "CONFIRMED",
            },
            include: {
               service: {
                  select: {
                     id: true,
                     name: true,
                     duration: true,
                     price: true,
                  },
               },
               branch: {
                  select: {
                     id: true,
                     name: true,
                     address: true,
                     phone: true,
                  },
               },
            },
         });

         return newBooking;
      });

      // Map to DTO
      return this.mapToBookingWithDetailsDTO(booking);
   }

   /**
    * Get booking by reference number
    *
    * @param referenceNumber - Booking reference number
    * @param email - Optional email for verification
    * @returns Booking with details
    */
   async getBookingByReference(
      referenceNumber: string,
      email?: string
   ): Promise<BookingWithDetailsDTO> {
      // Validate reference number format
      if (!ReferenceNumberGenerator.isValid(referenceNumber)) {
         throw new ValidationError("Invalid reference number format");
      }

      const booking = await prisma.booking.findUnique({
         where: { referenceNumber: referenceNumber.toUpperCase() },
         include: {
            service: {
               select: {
                  id: true,
                  name: true,
                  duration: true,
                  price: true,
               },
            },
            branch: {
               select: {
                  id: true,
                  name: true,
                  address: true,
                  phone: true,
               },
            },
         },
      });

      if (!booking) {
         throw new NotFoundError(
            `Booking with reference number '${referenceNumber}' not found`
         );
      }

      // Optional email verification
      if (email && booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
         throw new ValidationError(
            "Email does not match booking records"
         );
      }

      return this.mapToBookingWithDetailsDTO(booking);
   }

   /**
    * Validate booking data
    *
    * @param data - Booking data to validate
    */
   private validateBookingData(data: CreateBookingRequest): void {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.guestEmail)) {
         throw new ValidationError("Invalid email format");
      }

      // Phone validation (basic)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(data.guestPhone) || data.guestPhone.length < 10) {
         throw new ValidationError("Invalid phone number format");
      }

      // Date format validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.appointmentDate)) {
         throw new ValidationError(
            "Invalid date format. Use YYYY-MM-DD format"
         );
      }

      // Time format validation
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(data.appointmentTime)) {
         throw new ValidationError("Invalid time format. Use HH:MM format");
      }

      // Notes length validation
      if (data.notes && data.notes.length > 500) {
         throw new ValidationError(
            "Special requests cannot exceed 500 characters"
         );
      }
   }

   /**
    * Validate time slot availability and operating hours
    *
    * @param serviceId - Service ID
    * @param branchId - Branch ID
    * @param date - Date string
    * @param time - Time string
    */
   private async validateTimeSlot(
      serviceId: string,
      branchId: string,
      date: string,
      time: string
   ): Promise<void> {
      // Get availability
      const availability = await availabilityService.getAvailableSlots(
         serviceId,
         branchId,
         date
      );

      // Check if requested time slot is available
      const requestedSlot = availability.slots.find(
         (slot) => slot.time === time
      );

      if (!requestedSlot) {
         throw new ValidationError(
            "The selected time is outside of operating hours"
         );
      }

      if (!requestedSlot.available) {
         throw new ConflictError(
            "The selected time slot is not available. Please choose another time."
         );
      }
   }

   /**
    * Map Prisma booking to BookingWithDetailsDTO
    *
    * @param booking - Prisma booking object
    * @returns BookingWithDetailsDTO
    */
   private mapToBookingWithDetailsDTO(booking: any): BookingWithDetailsDTO {
      return {
         id: booking.id,
         referenceNumber: booking.referenceNumber,
         serviceId: booking.serviceId,
         branchId: booking.branchId,
         appointmentDate: booking.appointmentDate.toISOString(),
         appointmentTime: booking.appointmentTime,
         status: booking.status,
         guestName: booking.guestName,
         guestEmail: booking.guestEmail,
         guestPhone: booking.guestPhone,
         notes: booking.notes,
         language: booking.language,
         createdAt: booking.createdAt.toISOString(),
         updatedAt: booking.updatedAt.toISOString(),
         service: {
            id: booking.service.id,
            name: booking.service.name,
            duration: booking.service.duration,
            price: booking.service.price.toString(),
         },
         branch: {
            id: booking.branch.id,
            name: booking.branch.name,
            address: booking.branch.address,
            phone: booking.branch.phone,
         },
      };
   }
}

export default new BookingService();

