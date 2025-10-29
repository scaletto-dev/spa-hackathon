import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../utils/errors";
import { BookingStatus } from "@prisma/client";

/**
 * Booking Request Validators
 *
 * Express middleware functions for validating booking-related requests.
 * Ensures data integrity before processing business logic.
 */

/**
 * Validate Create Booking Request
 *
 * Validates:
 * - Required fields presence
 * - Email format
 * - Phone format (10+ digits, allows international format)
 * - Date format (YYYY-MM-DD)
 * - Time format (HH:MM)
 * - Future date/time
 * - Notes length (max 500 characters)
 * - Language code (vi, en, ja)
 */
export function validateCreateBooking(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const {
         serviceId,
         branchId,
         appointmentDate,
         appointmentTime,
         guestName,
         guestEmail,
         guestPhone,
         notes,
         language,
      } = req.body;

      // Required fields
      if (!serviceId || typeof serviceId !== "string") {
         throw new ValidationError("Service ID is required and must be a string");
      }

      if (!branchId || typeof branchId !== "string") {
         throw new ValidationError("Branch ID is required and must be a string");
      }

      if (!appointmentDate || typeof appointmentDate !== "string") {
         throw new ValidationError("Appointment date is required and must be a string");
      }

      if (!appointmentTime || typeof appointmentTime !== "string") {
         throw new ValidationError("Appointment time is required and must be a string");
      }

      if (!guestName || typeof guestName !== "string" || guestName.trim().length === 0) {
         throw new ValidationError("Guest name is required");
      }

      if (!guestEmail || typeof guestEmail !== "string") {
         throw new ValidationError("Guest email is required");
      }

      if (!guestPhone || typeof guestPhone !== "string") {
         throw new ValidationError("Guest phone is required");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
         throw new ValidationError("Invalid email format");
      }

      // Phone format validation (10+ digits, allows +, -, spaces, parentheses)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      const phoneDigits = guestPhone.replace(/[\s\-\+\(\)]/g, "");
      if (!phoneRegex.test(guestPhone) || phoneDigits.length < 10) {
         throw new ValidationError(
            "Invalid phone number format. Must contain at least 10 digits"
         );
      }

      // Date format validation (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(appointmentDate)) {
         throw new ValidationError(
            "Invalid date format. Use YYYY-MM-DD format (e.g., 2024-01-15)"
         );
      }

      // Validate date is valid
      const date = new Date(appointmentDate);
      if (isNaN(date.getTime())) {
         throw new ValidationError("Invalid appointment date");
      }

      // Time format validation (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(appointmentTime)) {
         throw new ValidationError(
            "Invalid time format. Use HH:MM format (e.g., 14:30)"
         );
      }

      // Validate time is within valid range
      const timeParts = appointmentTime.split(":");
      const hours = parseInt(timeParts[0] || "0");
      const minutes = parseInt(timeParts[1] || "0");
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
         throw new ValidationError("Invalid time. Hours must be 00-23, minutes 00-59");
      }

      // Validate appointment is in the future
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
      const now = new Date();
      if (appointmentDateTime <= now) {
         throw new ValidationError(
            "Appointment date and time must be in the future"
         );
      }

      // Optional: Notes length validation
      if (notes) {
         if (typeof notes !== "string") {
            throw new ValidationError("Notes must be a string");
         }
         if (notes.length > 500) {
            throw new ValidationError(
               "Special requests cannot exceed 500 characters"
            );
         }
      }

      // Optional: Language validation
      if (language) {
         if (typeof language !== "string") {
            throw new ValidationError("Language must be a string");
         }
         const validLanguages = ["vi", "en", "ja"];
         if (!validLanguages.includes(language)) {
            throw new ValidationError(
               `Invalid language. Must be one of: ${validLanguages.join(", ")}`
            );
         }
      }

      next();
   } catch (error) {
      next(error);
   }
}

/**
 * Validate Cancel Booking Request
 *
 * Validates:
 * - Email presence
 * - Email format
 * - Optional reason length
 */
export function validateCancelBooking(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const { email, reason } = req.body;

      // Required: Email for verification
      if (!email || typeof email !== "string") {
         throw new ValidationError(
            "Email verification is required to cancel booking"
         );
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new ValidationError("Invalid email format");
      }

      // Optional: Reason validation
      if (reason !== undefined && reason !== null) {
         if (typeof reason !== "string") {
            throw new ValidationError("Cancellation reason must be a string");
         }
         if (reason.length > 500) {
            throw new ValidationError(
               "Cancellation reason cannot exceed 500 characters"
            );
         }
      }

      next();
   } catch (error) {
      next(error);
   }
}

/**
 * Validate Reference Number Parameter
 *
 * Validates reference number format: BC-YYYYMMDD-XXXX
 */
export function validateReferenceNumber(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const { referenceNumber } = req.params;

      if (!referenceNumber) {
         throw new ValidationError("Reference number is required");
      }

      const pattern = /^BC-\d{8}-\d{4}$/;
      if (!pattern.test(referenceNumber)) {
         throw new ValidationError(
            "Invalid reference number format. Expected format: BC-YYYYMMDD-XXXX"
         );
      }

      next();
   } catch (error) {
      next(error);
   }
}

/**
 * Validate Admin List Bookings Query Parameters
 *
 * Validates:
 * - Pagination parameters (page, limit)
 * - Date formats
 * - Status values
 * - Sort parameters
 */
export function validateListBookingsQuery(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const { page, limit, status, date, dateFrom, dateTo, sortBy, sortOrder } =
         req.query;

      // Validate page
      if (page !== undefined) {
         const pageNum = parseInt(page as string);
         if (isNaN(pageNum) || pageNum < 1) {
            throw new ValidationError("Page must be a positive integer");
         }
      }

      // Validate limit
      if (limit !== undefined) {
         const limitNum = parseInt(limit as string);
         if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            throw new ValidationError(
               "Limit must be a positive integer between 1 and 100"
            );
         }
      }

      // Validate status
      if (status !== undefined) {
         const validStatuses: BookingStatus[] = [
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED",
            "NO_SHOW",
         ];
         if (!validStatuses.includes(status as BookingStatus)) {
            throw new ValidationError(
               `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            );
         }
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (date !== undefined) {
         if (typeof date !== "string" || !dateRegex.test(date)) {
            throw new ValidationError(
               "Invalid date format. Use YYYY-MM-DD format"
            );
         }
         const dateObj = new Date(date);
         if (isNaN(dateObj.getTime())) {
            throw new ValidationError("Invalid date value");
         }
      }

      if (dateFrom !== undefined) {
         if (typeof dateFrom !== "string" || !dateRegex.test(dateFrom)) {
            throw new ValidationError(
               "Invalid dateFrom format. Use YYYY-MM-DD format"
            );
         }
         const dateObj = new Date(dateFrom);
         if (isNaN(dateObj.getTime())) {
            throw new ValidationError("Invalid dateFrom value");
         }
      }

      if (dateTo !== undefined) {
         if (typeof dateTo !== "string" || !dateRegex.test(dateTo)) {
            throw new ValidationError(
               "Invalid dateTo format. Use YYYY-MM-DD format"
            );
         }
         const dateObj = new Date(dateTo);
         if (isNaN(dateObj.getTime())) {
            throw new ValidationError("Invalid dateTo value");
         }
      }

      // Validate date range logic
      if (dateFrom && dateTo) {
         const from = new Date(dateFrom as string);
         const to = new Date(dateTo as string);
         if (from > to) {
            throw new ValidationError("dateFrom must be before or equal to dateTo");
         }
      }

      // Validate sortBy
      if (sortBy !== undefined) {
         const validSortFields = [
            "appointmentDate",
            "createdAt",
            "updatedAt",
            "status",
         ];
         if (
            typeof sortBy !== "string" ||
            !validSortFields.includes(sortBy)
         ) {
            throw new ValidationError(
               `Invalid sortBy field. Must be one of: ${validSortFields.join(", ")}`
            );
         }
      }

      // Validate sortOrder
      if (sortOrder !== undefined) {
         const validSortOrders = ["asc", "desc"];
         if (
            typeof sortOrder !== "string" ||
            !validSortOrders.includes(sortOrder)
         ) {
            throw new ValidationError(
               `Invalid sortOrder. Must be one of: ${validSortOrders.join(", ")}`
            );
         }
      }

      next();
   } catch (error) {
      next(error);
   }
}

/**
 * Validate Admin Update Booking Status Request
 *
 * Validates:
 * - Status presence
 * - Status value
 */
export function validateUpdateBookingStatus(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const { status } = req.body;

      // Required: Status
      if (!status || typeof status !== "string") {
         throw new ValidationError("Status is required and must be a string");
      }

      // Validate status value
      const validStatuses: BookingStatus[] = [
         "CONFIRMED",
         "CANCELLED",
         "COMPLETED",
         "NO_SHOW",
      ];
      if (!validStatuses.includes(status as BookingStatus)) {
         throw new ValidationError(
            `Invalid status. Must be one of: ${validStatuses.join(", ")}`
         );
      }

      next();
   } catch (error) {
      next(error);
   }
}

/**
 * Validate UUID Parameter
 *
 * Generic validator for UUID route parameters
 */
export function validateUUID(paramName: string = "id") {
   return (req: Request, res: Response, next: NextFunction): void => {
      try {
         const value = req.params[paramName];

         if (!value) {
            throw new ValidationError(`${paramName} is required`);
         }

         // UUID v4 format validation
         const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
         if (!uuidRegex.test(value)) {
            throw new ValidationError(
               `Invalid ${paramName} format. Must be a valid UUID`
            );
         }

         next();
      } catch (error) {
         next(error);
      }
   };
}

