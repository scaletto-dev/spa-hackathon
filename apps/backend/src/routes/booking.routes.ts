import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Booking Routes
 *
 * RESTful API endpoints for booking management
 * Supports both member and guest bookings
 */

/**
 * POST /api/v1/bookings
 * Create a new booking (guest or member)
 * Supports multiple services per booking (package/combo services)
 * 
 * Request body:
 * - serviceIds (required) - Array of service UUIDs
 * - branchId (required)
 * - appointmentDate (required) - ISO 8601 format (YYYY-MM-DD)
 * - appointmentTime (required) - HH:mm format
 * - notes (optional)
 * - language (optional) - Default: 'vi'
 * 
 * For guest bookings:
 * - guestName (required if not authenticated)
 * - guestEmail (required if not authenticated)
 * - guestPhone (required if not authenticated)
 * 
 * For member bookings:
 * - Authentication token required (userId extracted from JWT)
 * 
 * Example request:
 * {
 *   "serviceIds": ["service-uuid-1", "service-uuid-2"],
 *   "branchId": "branch-uuid",
 *   "appointmentDate": "2025-11-15",
 *   "appointmentTime": "14:30",
 *   "guestName": "Nguyen Van A",
 *   "guestEmail": "guest@example.com",
 *   "guestPhone": "+84912345678"
 * }
 */
router.post('/', bookingController.createBooking);

/**
 * GET /api/v1/bookings/stats
 * Get booking statistics (admin only)
 * 
 * Query params:
 * - startDate (optional) - ISO 8601 format
 * - endDate (optional) - ISO 8601 format
 * 
 * Note: This route requires admin authentication
 * TODO: Add admin authorization middleware
 */
router.get('/stats', bookingController.getBookingStats);

/**
 * GET /api/v1/bookings
 * List user's bookings (member only)
 * Requires authentication
 * 
 * Query params:
 * - page (optional) - Default: 1
 * - limit (optional) - Default: 10, Max: 100
 * - status (optional) - Filter by booking status (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, PENDING)
 */
router.get('/', authenticate, bookingController.listUserBookings);

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking details by reference number
 * 
 * Anyone can view booking details using reference number (public access)
 * Members with authentication can only view their own bookings if they pass userId check
 */
router.get('/:referenceNumber', bookingController.getBookingByReference);

/**
 * POST /api/v1/bookings/:bookingId/send-confirmation
 * Send booking confirmation email
 */
router.post('/:bookingId/send-confirmation', bookingController.sendConfirmationEmail.bind(bookingController));

/**
 * PATCH /api/v1/bookings/:id/cancel
 * Cancel a booking
 * 
 * Request body:
 * - cancellationReason (required)
 * 
 * Rules:
 * - Can only cancel confirmed or pending bookings
 * - Cannot cancel past appointments
 * - Cannot cancel completed bookings
 * - Members can only cancel their own bookings
 * - Guests can cancel using booking ID (if they have it)
 */
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
