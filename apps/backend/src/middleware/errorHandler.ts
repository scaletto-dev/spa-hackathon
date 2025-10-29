import { Request, Response, NextFunction } from 'express';
import { ValidationError as ExpressValidationError } from 'express-validator';
import logger from '../config/logger';
import { ErrorResponse } from '../types/api';
import { ApiError } from '../utils/errors';

/**
 * Global Error Handler Middleware
 * 
 * Catches all errors from route handlers and middleware, logs them,
 * and returns a consistent error response format.
 * 
 * Handles:
 * - Custom ApiError instances (ValidationError, NotFoundError, etc.)
 * - Prisma errors (P2002 unique constraint, P2025 not found, etc.)
 * - express-validator validation errors
 * - Generic JavaScript errors
 * 
 * IMPORTANT: This middleware MUST be registered last in the middleware chain.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error(err.message, {
    url: req.url,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  let statusCode = 500;
  let errorName = 'InternalServerError';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  // Handle custom ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorName = err.name;
    message = err.message;
  }
  // Handle Prisma errors
  else if (err.code && err.code.startsWith('P')) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    errorName = prismaError.error;
    message = prismaError.message;
    details = prismaError.details;
  }
  // Handle express-validator errors
  else if (Array.isArray(err.array) && typeof err.array === 'function') {
    statusCode = 400;
    errorName = 'ValidationError';
    message = 'Validation failed';
    details = err.array();
  }
  // Handle generic errors
  else if (err instanceof Error) {
    message = err.message;
    if (err.name) {
      errorName = err.name;
    }
  }

  // Construct error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: errorName,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  // Add details if available and not in production
  if (details && process.env.NODE_ENV !== 'production') {
    errorResponse.details = details;
  }

  // Do not expose stack traces in production
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.details = {
      ...errorResponse.details,
      stack: err.stack,
    };
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Handle Prisma-specific errors and map them to appropriate HTTP errors
 */
function handlePrismaError(err: any): {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
} {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return {
        error: 'ConflictError',
        message: 'A record with this value already exists',
        statusCode: 409,
        details: {
          fields: err.meta?.target,
        },
      };

    case 'P2025':
      // Record not found
      return {
        error: 'NotFoundError',
        message: 'The requested record was not found',
        statusCode: 404,
      };

    case 'P2003':
      // Foreign key constraint failed
      return {
        error: 'ValidationError',
        message: 'Invalid reference to related record',
        statusCode: 400,
        details: {
          field: err.meta?.field_name,
        },
      };

    case 'P2014':
      // Invalid ID
      return {
        error: 'ValidationError',
        message: 'Invalid ID format',
        statusCode: 400,
      };

    default:
      // Unknown Prisma error
      return {
        error: 'DatabaseError',
        message: 'A database error occurred',
        statusCode: 500,
        details: process.env.NODE_ENV === 'development' ? { code: err.code } : undefined,
      };
  }
}
