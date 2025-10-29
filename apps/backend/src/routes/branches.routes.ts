import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Branches Routes (Placeholder)
 * 
 * Actual implementations will be added in Story 2.5
 */

/**
 * GET /api/v1/branches
 * Get all branches
 */
router.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Story 2.5',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/branches/:id
 * Get branch by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplementedError',
    message: 'This endpoint will be implemented in Story 2.5',
    statusCode: 501,
    timestamp: new Date().toISOString(),
  });
});

export default router;
