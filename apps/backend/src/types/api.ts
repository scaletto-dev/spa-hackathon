/**
 * API Response Type Definitions
 * 
 * Defines consistent response formats for all API endpoints.
 */

/**
 * Error Response Interface
 * 
 * Standard format for all API error responses.
 * 
 * @property error - Error type (e.g., "ValidationError", "NotFoundError")
 * @property message - Human-readable error message
 * @property statusCode - HTTP status code (400, 401, 404, 500, etc.)
 * @property details - Optional detailed error information
 * @property timestamp - ISO 8601 timestamp
 * @property requestId - Optional request tracking ID
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  requestId?: string;
}

/**
 * Success Response Interface
 * 
 * Standard format for successful API responses.
 * 
 * @template T - Type of the response data
 * @property data - Response payload
 * @property meta - Optional metadata (pagination, etc.)
 */
export interface SuccessResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
