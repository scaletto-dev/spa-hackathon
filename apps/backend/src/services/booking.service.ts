import prisma from "../lib/prisma";
import { NotFoundError, ValidationError, ConflictError } from "../utils/errors";
import {
   CreateBookingRequest,
   BookingWithDetailsDTO,
   CancelBookingRequest,
   ListBookingsQueryParams,
   UpdateBookingStatusRequest,
   BookingDTO,
} from "../types/booking";
import ReferenceNumberGenerator from "../utils/referenceNumberGenerator";
import { BookingStatus } from "@prisma/client";

/**
 * Booking Service
 *
 * Business logic for booking management.
 * Handles creation, retrieval, cancellation, and admin operations.
 */

export class BookingService {
   /**
    * Create a new booking
    */
   async createBooking(
      bookingData: CreateBookingRequest
   ): Promise<BookingWithDetailsDTO> {
      this.validateBookingData(bookingData);

      const appointmentDateTime = new Date(
         `${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`
      );
      const now = new Date();

      if (appointmentDateTime <= now) {
         throw new ValidationError(
            "Appointment date and time must be in the future"
         );
      }

      const service = await prisma.service.findUnique({
         where: { id: bookingData.serviceId, active: true },
         select: { id: true, name: true, duration: true, price: true },
      });

      if (!service) {
         throw new NotFoundError(
            `Service with ID '${bookingData.serviceId}' not found`
         );
      }

      const branch = await prisma.branch.findUnique({
         where: { id: bookingData.branchId, active: true },
         select: { id: true, name: true, address: true, phone: true },
      });

      if (!branch) {
         throw new NotFoundError(
            `Branch with ID '${bookingData.branchId}' not found`
         );
      }

      const booking = await prisma.$transaction(async (tx) => {
         const conflictingBookings = await tx.booking.findMany({
            where: {
               branchId: bookingData.branchId,
               appointmentDate: new Date(
                  bookingData.appointmentDate + "T00:00:00"
               ),
               appointmentTime: bookingData.appointmentTime,
               status: { in: ["CONFIRMED"] },
            },
         });

         if (conflictingBookings.length > 0) {
            throw new ConflictError(
               "This time slot is no longer available. Please select another time."
            );
         }

         let referenceNumber: string = "";
         let isUnique = false;
         let attempts = 0;

         while (!isUnique && attempts < 10) {
            referenceNumber = ReferenceNumberGenerator.generate(
               new Date(bookingData.appointmentDate)
            );
            const existing = await tx.booking.findUnique({
               where: { referenceNumber },
            });
            if (!existing) isUnique = true;
            attempts++;
         }

         if (!isUnique) {
            throw new Error("Failed to generate unique reference number");
         }

         return await tx.booking.create({
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
      });

      return this.mapToBookingWithDetailsDTO(booking);
   }

   /**
    * Get booking by reference number
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

      if (
         email &&
         booking.guestEmail &&
         booking.guestEmail.toLowerCase() !== email.toLowerCase()
      ) {
         throw new ValidationError("Email does not match booking records");
      }

      return this.mapToBookingWithDetailsDTO(booking);
   }

   /**
    * Cancel a booking
    */
   async cancelBooking(
      referenceNumber: string,
      cancelData: CancelBookingRequest
   ): Promise<BookingWithDetailsDTO> {
      if (!ReferenceNumberGenerator.isValid(referenceNumber)) {
         throw new ValidationError("Invalid reference number format");
      }

      if (!cancelData.email) {
         throw new ValidationError(
            "Email verification is required to cancel booking"
         );
      }

      const booking = await prisma.booking.findUnique({
         where: { referenceNumber: referenceNumber.toUpperCase() },
      });

      if (!booking) {
         throw new NotFoundError(
            `Booking with reference number '${referenceNumber}' not found`
         );
      }

      if (
         !booking.guestEmail ||
         booking.guestEmail.toLowerCase() !== cancelData.email.toLowerCase()
      ) {
         throw new ValidationError(
            "Email does not match booking records. Cannot cancel booking."
         );
      }

      if (booking.status === "CANCELLED") {
         throw new ConflictError("This booking has already been cancelled");
      }

      if (booking.status === "COMPLETED") {
         throw new ConflictError(
            "Cannot cancel a completed booking. Please contact support."
         );
      }

      const appointmentDateTime = new Date(
         `${booking.appointmentDate.toISOString().split("T")[0]}T${
            booking.appointmentTime
         }:00`
      );
      const now = new Date();
      const hoursUntilAppointment =
         (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24) {
         throw new ValidationError(
            "Bookings cannot be cancelled within 24 hours of the appointment time. Please contact the branch directly."
         );
      }

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
    * List bookings with filtering and pagination (Admin)
    */
   async listBookings(params: ListBookingsQueryParams): Promise<{
      bookings: BookingWithDetailsDTO[];
      meta: {
         total: number;
         page: number;
         limit: number;
         totalPages: number;
      };
   }> {
      const page = parseInt(params.page || "1");
      const limit = Math.min(parseInt(params.limit || "50"), 100);
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (params.branchId) {
         where.branchId = params.branchId;
      }

      if (params.serviceId) {
         where.serviceId = params.serviceId;
      }

      if (params.status) {
         where.status = params.status as BookingStatus;
      }

      if (params.date) {
         const date = new Date(params.date + "T00:00:00");
         const nextDate = new Date(params.date + "T23:59:59");
         where.appointmentDate = { gte: date, lte: nextDate };
      }

      if (params.dateFrom || params.dateTo) {
         where.appointmentDate = {};
         if (params.dateFrom) {
            where.appointmentDate.gte = new Date(params.dateFrom + "T00:00:00");
         }
         if (params.dateTo) {
            where.appointmentDate.lte = new Date(params.dateTo + "T23:59:59");
         }
      }

      // Count total
      const total = await prisma.booking.count({ where });

      // Build orderBy
      const sortBy = params.sortBy || "appointmentDate";
      const sortOrder = params.sortOrder || "desc";
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Fetch bookings
      const bookings = await prisma.booking.findMany({
         where,
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
         orderBy,
         skip,
         take: limit,
      });

      return {
         bookings: bookings.map((b) => this.mapToBookingWithDetailsDTO(b)),
         meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      };
   }

   /**
    * Update booking status (Admin)
    */
   async updateBookingStatus(
      bookingId: string,
      statusData: UpdateBookingStatusRequest
   ): Promise<BookingWithDetailsDTO> {
      const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
      });

      if (!booking) {
         throw new NotFoundError(`Booking with ID '${bookingId}' not found`);
      }

      // Validate status transitions
      this.validateStatusTransition(booking.status, statusData.status);

      const updatedBooking = await prisma.booking.update({
         where: { id: bookingId },
         data: { status: statusData.status },
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
    * Validate status transitions
    */
   private validateStatusTransition(
      currentStatus: BookingStatus,
      newStatus: BookingStatus
   ): void {
      // Cannot change completed bookings
      if (currentStatus === "COMPLETED" && newStatus !== "COMPLETED") {
         throw new ValidationError("Cannot change status of completed booking");
      }

      // Cannot un-cancel bookings
      if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
         throw new ValidationError("Cannot reactivate cancelled booking");
      }
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
