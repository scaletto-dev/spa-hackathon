import { Request, Response, NextFunction } from "express";

/**
 * Admin Booking Controller (Placeholder)
 *
 * Full implementation will be available after merging epic3/3.7-3.8 branch.
 * This placeholder allows validation middleware to be tested independently.
 */

class BookingAdminController {
   async listBookings(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      res.status(501).json({
         success: false,
         error: "NotImplementedError",
         message: "Admin booking list will be implemented in Epic 3",
      });
   }

   async updateBookingStatus(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      res.status(501).json({
         success: false,
         error: "NotImplementedError",
         message: "Admin booking update will be implemented in Epic 3",
      });
   }
}

export default new BookingAdminController();
