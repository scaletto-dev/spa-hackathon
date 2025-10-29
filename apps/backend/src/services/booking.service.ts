import prisma from "../lib/prisma";
import {
   NotFoundError,
   ValidationError,
   ConflictError,
} from "../utils/errors";
import {
   CreateBookingRequest,
   BookingWithDetailsDTO,
   CancelBookingRequest,
} from "../types/booking";
import ReferenceNumberGenerator from "../utils/referenceNumberGenerator";

/**
 * Booking Service
 *
 * Business logic for booking management.
 * Handles booking creation, retrieval, and cancellation.
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
         },
      });

      if (!branch) {
         throw new NotFoundError(
            `Branch with ID '${bookingData.branchId}' not found`
         );
      }

      // Use transaction to prevent double booking
      const booking = await prisma.$transaction(async (tx) => {
         // Check for conflicts
         const conflictingBookings = await tx.booking.findMany({
            where: {
               branchId: bookingData.branchId,
               appointmentDate: new Date(
                  bookingData.appointmentDate + "T00:00:00"
               ),
               appointmentTime: bookingData.appointmentTime,
               status: {
                  in: ["CONFIRMED"],
               },
            },
         });

         if (conflictingBookings.length > 0) {
            throw new ConflictError(
               "This time slot is no longer available. Please select another time."
            );
         }

         // Generate unique reference number
         let referenceNumber: string = "";
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

         if (!isUnique || !referenceNumber) {
            throw new Error("Failed to generate unique reference number");
         }

         // Create booking
         const newBooking = await tx.booking.create({
            data: {
               referenceNumber,
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

      if (email && booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
         throw new ValidationError("Email does not match booking records");
      }

      return this.mapToBookingWithDetailsDTO(booking);
   }

   /**
    * Cancel a booking
    *
    * @param referenceNumber - Booking reference number
    * @param cancelData - Cancellation data with email verification
    * @returns Updated booking
    */
   async cancelBooking(
      referenceNumber: string,
      cancelData: CancelBookingRequest
   ): Promise<BookingWithDetailsDTO> {
      // Validate reference number
      if (!ReferenceNumberGenerator.isValid(referenceNumber)) {
         throw new ValidationError("Invalid reference number format");
      }

      // Email verification required
      if (!cancelData.email) {
         throw new ValidationError(
            "Email verification is required to cancel booking"
         );
      }

      // Find booking
      const booking = await prisma.booking.findUnique({
         where: { referenceNumber: referenceNumber.toUpperCase() },
      });

      if (!booking) {
         throw new NotFoundError(
            `Booking with reference number '${referenceNumber}' not found`
         );
      }

      // Verify email matches
      if (
         booking.guestEmail.toLowerCase() !== cancelData.email.toLowerCase()
      ) {
         throw new ValidationError(
            "Email does not match booking records. Cannot cancel booking."
         );
      }

      // Check if already cancelled or completed
      if (booking.status === "CANCELLED") {
         throw new ConflictError("This booking has already been cancelled");
      }

      if (booking.status === "COMPLETED") {
         throw new ConflictError(
            "Cannot cancel a completed booking. Please contact support."
         );
      }

      // Optional: Check cancellation policy (24 hours before appointment)
      const appointmentDateTime = new Date(
         `${booking.appointmentDate.toISOString().split("T")[0]}T${booking.appointmentTime}:00`
      );
      const now = new Date();
      const hoursUntilAppointment =
         (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24) {
         throw new ValidationError(
            "Bookings cannot be cancelled within 24 hours of the appointment time. Please contact the branch directly."
         );
      }

      // Update booking status
      const updatedBooking = await prisma.booking.update({
         where: { id: booking.id },
         data: {
            status: "CANCELLED",
            cancellationReason: cancelData.reason || null,
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

      return this.mapToBookingWithDetailsDTO(updatedBooking);
   }

   /**
    * Validate booking data
    */
   private validateBookingData(data: CreateBookingRequest): void {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.guestEmail)) {
         throw new ValidationError("Invalid email format");
      }

      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(data.guestPhone) || data.guestPhone.length < 10) {
         throw new ValidationError("Invalid phone number format");
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.appointmentDate)) {
         throw new ValidationError(
            "Invalid date format. Use YYYY-MM-DD format"
         );
      }

      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(data.appointmentTime)) {
         throw new ValidationError("Invalid time format. Use HH:MM format");
      }

      if (data.notes && data.notes.length > 500) {
         throw new ValidationError(
            "Special requests cannot exceed 500 characters"
         );
      }
   }

   /**
    * Map to DTO
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
