import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import { createRateLimiter } from "../config/rateLimits";

const router = Router();

// Rate limiting for booking operations (10 requests per hour per IP)
const bookingRateLimiter = createRateLimiter({
   windowMs: 60 * 60 * 1000, // 1 hour
   max: 10,
   message: "Too many booking requests. Please try again later.",
});

/**
 * Bookings Routes
 *
 * API endpoints for booking management
 */

/**
 * POST /api/v1/bookings
 * Create new booking
 * Rate limited: 10/hour per IP
 */
router.post("/", bookingRateLimiter, bookingController.createBooking);

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking by reference number
 * Optional query: email (for verification)
 */
router.get("/:referenceNumber", bookingController.getBookingByReference);

/**
 * POST /api/v1/bookings/:referenceNumber/cancel
 * Cancel a booking
 * Requires email verification in body
 */
router.post("/:referenceNumber/cancel", bookingController.cancelBooking);

export default router;
