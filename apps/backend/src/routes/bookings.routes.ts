import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import { createRateLimiter } from "../config/rateLimits";

const router = Router();

// Rate limiting for booking creation (max 10 bookings per hour per IP)
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
 * Rate limited: 10 requests per hour per IP
 */
router.post("/", bookingRateLimiter, bookingController.createBooking);

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking by reference number
 * Optional query param: email (for verification)
 */
router.get("/:referenceNumber", bookingController.getBookingByReference);

export default router;
