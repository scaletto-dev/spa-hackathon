import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health Check Endpoint
 * 
 * GET /api/health
 * 
 * Returns server health status and uptime information.
 * Used for monitoring and load balancer health checks.
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
