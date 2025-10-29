import { Request, Response, NextFunction } from "express";
import bookingService from "../services/booking.service";
import { SuccessResponse } from "../types/api";
import { ValidationError } from "../utils/errors";
import {
   CreateBookingRequest,
   GetBookingQueryParams,
   CancelBookingRequest,
} from "../types/booking";

/**
 * Booking Controller
 *
 * Handles HTTP requests for booking endpoints.
 */

export class BookingController {
   /**
    * POST /api/v1/bookings
    * Create a new booking
    */
   async createBooking(
      req: Request<{}, {}, CreateBookingRequest>,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const bookingData = req.body;

         // Validation
         if (!bookingData.serviceId) {
            throw new ValidationError("serviceId is required");
         }
         if (!bookingData.branchId) {
            throw new ValidationError("branchId is required");
         }
         if (!bookingData.appointmentDate) {
            throw new ValidationError("appointmentDate is required");
         }
         if (!bookingData.appointmentTime) {
            throw new ValidationError("appointmentTime is required");
         }
         if (!bookingData.guestName) {
            throw new ValidationError("guestName is required");
         }
         if (!bookingData.guestEmail) {
            throw new ValidationError("guestEmail is required");
         }
         if (!bookingData.guestPhone) {
            throw new ValidationError("guestPhone is required");
         }

         const booking = await bookingService.createBooking(bookingData);

         const response: SuccessResponse<typeof booking> = {
            success: true,
            data: booking,
            timestamp: new Date().toISOString(),
         };

         res.status(201).json(response);
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/bookings/:referenceNumber
    * Get booking by reference number
    */
   async getBookingByReference(
      req: Request<{ referenceNumber: string }, {}, {}, GetBookingQueryParams>,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { referenceNumber } = req.params;
         const { email } = req.query;

         const booking = await bookingService.getBookingByReference(
            referenceNumber,
            email
         );

         const response: SuccessResponse<typeof booking> = {
            success: true,
            data: booking,
            timestamp: new Date().toISOString(),
         };

         res.status(200).json(response);
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/bookings/:referenceNumber/cancel
    * Cancel a booking
    */
   async cancelBooking(
      req: Request<{ referenceNumber: string }, {}, CancelBookingRequest>,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { referenceNumber } = req.params;
         const cancelData = req.body;

         const booking = await bookingService.cancelBooking(
            referenceNumber,
            cancelData
         );

         const response: SuccessResponse<typeof booking> = {
            success: true,
            data: booking,
            message: "Your booking has been cancelled successfully.",
            timestamp: new Date().toISOString(),
         };

         res.status(200).json(response);
      } catch (error) {
         next(error);
      }
   }
}

export default new BookingController();
