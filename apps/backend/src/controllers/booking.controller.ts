import { Request, Response, NextFunction } from "express";
import bookingService from "../services/booking.service";
import {
   CreateBookingRequest,
   CancelBookingRequest,
} from "../types/booking";

/**
 * Booking Controller
 *
 * Handles public booking operations:
 * - Create booking
 * - Retrieve booking by reference number
 * - Cancel booking
 */

class BookingController {
   /**
    * POST /api/v1/bookings
    * Create a new booking
    */
   async createBooking(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const bookingData = req.body as CreateBookingRequest;
         const booking = await bookingService.createBooking(bookingData);

         res.status(201).json({
            success: true,
            data: booking,
            message:
               "Booking created successfully. Check your email for confirmation.",
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/bookings/:referenceNumber
    * Get booking by reference number
    */
   async getBookingByReference(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const referenceNumber = req.params.referenceNumber || "";
         const email = req.query.email ? String(req.query.email) : undefined;

         const booking = await bookingService.getBookingByReference(
            referenceNumber,
            email
         );

         res.status(200).json({
            success: true,
            data: booking,
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/bookings/:referenceNumber/cancel
    * Cancel a booking
    */
   async cancelBooking(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const referenceNumber = req.params.referenceNumber || "";
         const cancelData = req.body as CancelBookingRequest;

         const booking = await bookingService.cancelBooking(
            referenceNumber,
            cancelData
         );

         res.status(200).json({
            success: true,
            data: booking,
            message:
               "Booking cancelled successfully. You will receive a confirmation email shortly.",
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new BookingController();
