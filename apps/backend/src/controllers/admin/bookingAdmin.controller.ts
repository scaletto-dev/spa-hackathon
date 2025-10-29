import { Request, Response, NextFunction } from "express";
import bookingService from "../../services/booking.service";
import {
   ListBookingsQueryParams,
   UpdateBookingStatusRequest,
} from "../../types/booking";
import { ValidationError } from "../../utils/errors";
import { BookingStatus } from "@prisma/client";

/**
 * Admin Booking Controller
 *
 * Handles admin-only booking operations:
 * - List all bookings with filtering
 * - Update booking status
 */

class BookingAdminController {
   /**
    * GET /api/v1/admin/bookings
    * List all bookings with filtering and pagination
    */
   async listBookings(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const params: ListBookingsQueryParams = {
            page: req.query.page as string,
            limit: req.query.limit as string,
            branchId: req.query.branchId as string,
            serviceId: req.query.serviceId as string,
            status: req.query.status as string,
            date: req.query.date as string,
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as "asc" | "desc",
         };

         // Validate status if provided
         if (params.status) {
            const validStatuses: BookingStatus[] = [
               "CONFIRMED",
               "CANCELLED",
               "COMPLETED",
               "NO_SHOW",
            ];
            if (!validStatuses.includes(params.status as BookingStatus)) {
               throw new ValidationError(
                  `Invalid status. Must be one of: ${validStatuses.join(", ")}`
               );
            }
         }

         // Validate date formats if provided
         if (params.date && !/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
            throw new ValidationError(
               "Invalid date format. Use YYYY-MM-DD format"
            );
         }
         if (
            params.dateFrom &&
            !/^\d{4}-\d{2}-\d{2}$/.test(params.dateFrom)
         ) {
            throw new ValidationError(
               "Invalid dateFrom format. Use YYYY-MM-DD format"
            );
         }
         if (params.dateTo && !/^\d{4}-\d{2}-\d{2}$/.test(params.dateTo)) {
            throw new ValidationError(
               "Invalid dateTo format. Use YYYY-MM-DD format"
            );
         }

         const result = await bookingService.listBookings(params);

         res.status(200).json({
            success: true,
            data: result.bookings,
            meta: result.meta,
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PATCH /api/v1/admin/bookings/:id/status
    * Update booking status
    */
   async updateBookingStatus(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id || "";
         const statusData = req.body as UpdateBookingStatusRequest;

         // Validate status
         if (!statusData.status) {
            throw new ValidationError("Status is required");
         }

         const validStatuses: BookingStatus[] = [
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED",
            "NO_SHOW",
         ];
         if (!validStatuses.includes(statusData.status)) {
            throw new ValidationError(
               `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            );
         }

         const updatedBooking = await bookingService.updateBookingStatus(
            id,
            statusData
         );

         res.status(200).json({
            success: true,
            data: updatedBooking,
            message: `Booking status updated to ${statusData.status}`,
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new BookingAdminController();

