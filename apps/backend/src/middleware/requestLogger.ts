import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Request Logger Middleware
 *
 * Logs all incoming HTTP requests with:
 * - Timestamp
 * - HTTP method
 * - URL path
 * - Status code
 * - Response time in milliseconds
 *
 * Uses Winston logger configured in config/logger.ts
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Log after response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Use req.originalUrl to get the full request path including all route prefixes
    // req.url would only show the path relative to the mounted route handler
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    // Use appropriate log level based on status code
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
}
