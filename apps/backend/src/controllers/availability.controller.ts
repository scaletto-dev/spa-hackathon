import { Request, Response, NextFunction } from "express";
import availabilityService from "../services/availability.service";
import { SuccessResponse } from "../types/api";
import { ValidationError } from "../utils/errors";
import { GetAvailabilityQueryParams } from "../types/availability";

/**
 * Availability Controller
 *
 * Handles HTTP requests for availability check endpoints.
 * Validates input, calls service layer, and formats responses.
 */

export class AvailabilityController {
   /**
    * GET /api/v1/availability
    * Get available time slots for a service at a branch on a specific date
    */
   async getAvailableSlots(
      req: Request<{}, {}, {}, GetAvailabilityQueryParams>,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const { serviceId, branchId, date } = req.query;

         // Validation
         if (!serviceId) {
            throw new ValidationError("serviceId is required");
         }
         if (!branchId) {
            throw new ValidationError("branchId is required");
         }
         if (!date) {
            throw new ValidationError("date is required");
         }

         const availability = await availabilityService.getAvailableSlots(
            serviceId,
            branchId,
            date
         );

         const response: SuccessResponse<typeof availability> = {
            success: true,
            data: availability,
            timestamp: new Date().toISOString(),
         };

         res.status(200).json(response);
      } catch (error) {
         next(error);
      }
   }
}

export default new AvailabilityController();
