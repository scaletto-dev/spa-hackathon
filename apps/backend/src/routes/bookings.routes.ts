import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Bookings Routes (Placeholder)
 * 
 * Actual implementations will be added in Epic 3 (Guest Booking Flow)
 */

/**
 * POST /api/v1/bookings
 * Create new booking
 */
router.post('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Epic 3 (Guest Booking Flow)',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/bookings/:referenceNumber
 * Get booking by reference number
 */
router.get('/:referenceNumber', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Epic 3 (Guest Booking Flow)',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

export default router;
