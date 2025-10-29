import { Request, Response } from 'express';
import { ErrorResponse } from '../types/api';

/**
 * 404 Not Found Handler Middleware
 * 
 * Catches requests to undefined routes and returns a consistent 404 error.
 * 
 * This middleware should be registered after all valid routes but before
 * the global error handler.
 */
export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'NotFoundError',
    message: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
    details: {
      path: req.url,
      method: req.method,
    },
  };

  res.status(404).json(errorResponse);
}
