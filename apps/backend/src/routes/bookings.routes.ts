import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import { rateLimiters } from "../config/rateLimits";
import {
   validateCreateBooking,
   validateCancelBooking,
   validateReferenceNumber,
} from "../middleware/validators/bookingValidators";

const router = Router();

/**
 * Bookings Routes
 *
 * Public API endpoints for guest booking management.
 * All mutation endpoints are rate-limited to prevent abuse.
 */

/**
 * POST /api/v1/bookings
 * Create new booking
 *
 * Rate limited: 10 requests per hour per IP
 * Validation: Full booking data validation
 */
router.post(
   "/",
   rateLimiters.bookingCreation,
   validateCreateBooking,
   bookingController.createBooking
);

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking by reference number
 *
 * Validation: Reference number format
 * Optional query param: email (for verification)
 */
router.get(
   "/:referenceNumber",
   validateReferenceNumber,
   bookingController.getBookingByReference
);

/**
 * POST /api/v1/bookings/:referenceNumber/cancel
 * Cancel a booking
 *
 * Rate limited: 10 requests per hour per IP
 * Validation: Reference number format + email verification
 */
router.post(
   "/:referenceNumber/cancel",
   rateLimiters.bookingCreation,
   validateReferenceNumber,
   validateCancelBooking,
   bookingController.cancelBooking
);

export default router;
