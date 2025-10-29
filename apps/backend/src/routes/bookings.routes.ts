import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import { rateLimiters } from "../config/rateLimits";

const router = Router();

/**
 * Bookings Routes
 *
 * Public API endpoints for guest booking management
 */

/**
 * POST /api/v1/bookings
 * Create new booking
 *
 * Rate limited: 10 requests per hour per IP
 */
router.post(
   "/",
   rateLimiters.bookingCreation,
   bookingController.createBooking
);

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking by reference number
 *
 * Optional query param: email (for verification)
 */
router.get("/:referenceNumber", bookingController.getBookingByReference);

/**
 * POST /api/v1/bookings/:referenceNumber/cancel
 * Cancel a booking
 *
 * Requires email verification in request body
 * Rate limited: 10 requests per hour per IP
 */
router.post(
   "/:referenceNumber/cancel",
   rateLimiters.bookingCreation,
   bookingController.cancelBooking
);

export default router;
