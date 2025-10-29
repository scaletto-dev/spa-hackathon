/**
 * API Response Type Definitions
 * 
 * Provides a consistent structure for all API responses.
 * Includes standardized success and error formats to ensure predictable client-side handling.
 */

export interface BaseResponse {
  /**
   * Indicates whether the request was successful.
   */
  success: boolean;

  /**
   * ISO 8601 timestamp when the response was generated.
   */
  timestamp: string;

  /**
   * Optional unique request ID for tracing/debugging.
   */
  requestId?: string;
}

/**
 * Success Response
 * 
 * Returned when an operation completes successfully.
 * @template T - The type of the data payload.
 */
export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;

  /**
   * Optional metadata such as pagination or extra information.
   */
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

/**
 * Error Response
 * 
 * Returned when an API operation fails.
 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: string; // e.g., "ValidationError", "NotFoundError"
  message: string; // Human-readable message
  statusCode: number; // HTTP status code (400, 404, 500, etc.)
  details?: any; // Optional extra info for debugging
}

/**
 * Unified API Response Type
 * 
 * A discriminated union that ensures type-safe handling
 * of both success and error responses.
 */
export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;
