import { Request, Response, NextFunction } from "express";

/**
 * Booking Controller (Placeholder)
 *
 * Full implementation will be available after merging epic3/3.3-3.4-3.6 branch.
 * This placeholder allows validation middleware to be tested independently.
 */

class BookingController {
   async createBooking(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      res.status(501).json({
         success: false,
         error: "NotImplementedError",
         message: "Booking creation will be implemented in Epic 3",
      });
   }

   async getBookingByReference(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      res.status(501).json({
         success: false,
         error: "NotImplementedError",
         message: "Booking retrieval will be implemented in Epic 3",
      });
   }

   async cancelBooking(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      res.status(501).json({
         success: false,
         error: "NotImplementedError",
         message: "Booking cancellation will be implemented in Epic 3",
      });
   }
}

export default new BookingController();
