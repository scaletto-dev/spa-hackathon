import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Services Routes (Placeholder)
 * 
 * Actual implementations will be added in Story 1.6
 */

/**
 * GET /api/v1/services
 * Get all services
 */
router.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Story 1.6',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/services/:id
 * Get service by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Story 1.6',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

export default router;
