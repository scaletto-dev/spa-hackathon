import { Router } from 'express';
import bookingAdminController from '../../controllers/admin/bookingAdmin.controller';
import { requireAdmin } from '../../middleware/adminAuth';
import { rateLimiters } from '../../config/rateLimits';
import {
   validateListBookingsQuery,
   validateUpdateBookingStatus,
   validateUUID,
} from '../../middleware/validators/bookingValidators';

const router = Router();

/**
 * Admin Booking Routes
 *
 * Protected routes for booking management.
 * All routes require admin authentication.
 */

// Apply admin auth middleware to all routes
router.use(requireAdmin);

/**
 * GET /api/v1/admin/bookings
 * List all bookings with filtering and pagination
 *
 * Validation: Query parameters (page, limit, dates, status, sort)
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 50, max: 100)
 * - branchId: string (optional)
 * - serviceId: string (optional)
 * - status: CONFIRMED | CANCELLED | COMPLETED | NO_SHOW (optional)
 * - date: YYYY-MM-DD (specific date, optional)
 * - dateFrom: YYYY-MM-DD (date range start, optional)
 * - dateTo: YYYY-MM-DD (date range end, optional)
 * - sortBy: field name (default: appointmentDate)
 * - sortOrder: asc | desc (default: desc)
 */
router.get("/", validateListBookingsQuery, bookingAdminController.listBookings);

/**
 * PATCH /api/v1/admin/bookings/:id/status
 * Update booking status
 *
 * Validation: UUID format + status value
 * Rate limited: 30 requests per minute
 *
 * Body: { status: BookingStatus }
 */
router.patch(
   "/:id/status",
   rateLimiters.default,
   validateUUID("id"),
   validateUpdateBookingStatus,
   bookingAdminController.updateBookingStatus
);

export default router;
