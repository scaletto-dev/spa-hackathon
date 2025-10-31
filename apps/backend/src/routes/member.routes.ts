/**
 * Member Routes
 * 
 * RESTful API endpoints for member management
 */

import { Router } from 'express';
import memberController from '../controllers/member.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * All member routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/v1/members/dashboard
 * Get member dashboard overview
 * 
 * Returns dashboard data including:
 * - stats (total bookings, upcoming, completed, member points)
 * - upcomingBookings (next 5 bookings)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "stats": {
 *       "totalBookings": 12,
 *       "upcomingBookings": 3,
 *       "completedBookings": 9,
 *       "memberPoints": 450
 *     },
 *     "upcomingBookings": [...]
 *   }
 * }
 */
router.get('/dashboard', memberController.getDashboard);

/**
 * GET /api/v1/members/bookings
 * Get member booking history with pagination and filters
 * 
 * Query params:
 * - page (optional, default: 1)
 * - limit (optional, default: 10, max: 100)
 * - status (optional, default: 'all') - Filter by booking status
 * - dateFrom (optional) - Filter bookings from this date (YYYY-MM-DD)
 * - dateTo (optional) - Filter bookings until this date (YYYY-MM-DD)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "meta": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 12,
 *     "totalPages": 2
 *   }
 * }
 */
router.get('/bookings', memberController.getBookings);

/**
 * GET /api/v1/members/profile
 * Get member profile information
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "email": "user@example.com",
 *     "fullName": "User Name",
 *     "phone": "...",
 *     "avatar": "...",
 *     "language": "vi",
 *     "emailVerified": true,
 *     "createdAt": "..."
 *   }
 * }
 */
router.get('/profile', memberController.getProfile);

/**
 * PATCH /api/v1/members/profile
 * Update member profile
 * 
 * Request body (all optional):
 * {
 *   "fullName": "New Name",
 *   "phone": "+84912345678",
 *   "avatar": "url",
 *   "language": "en"
 * }
 */
router.patch('/profile', memberController.updateProfile);

export default router;
