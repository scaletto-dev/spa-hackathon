/**
 * Custom Error Classes
 * 
 * Provides specific error types for common HTTP error scenarios.
 * Each error class includes an appropriate HTTP status code.
 */

/**
 * Base API Error Class
 * 
 * Extends the native Error class with an HTTP status code.
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400 Bad Request)
 * 
 * Used when request data fails validation.
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

/**
 * Unauthorized Error (401 Unauthorized)
 * 
 * Used when authentication is required but missing or invalid.
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Not Found Error (404 Not Found)
 * 
 * Used when a requested resource does not exist.
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Conflict Error (409 Conflict)
 * 
 * Used when a request conflicts with existing data (e.g., duplicate email).
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * Internal Server Error (500 Internal Server Error)
 * 
 * Used for unexpected server errors.
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}
