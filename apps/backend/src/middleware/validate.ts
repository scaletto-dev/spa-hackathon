/**
 * Zod Validation Middleware
 *
 * Generic validation middleware for request body, query, and params.
 * Attaches validated data back to request and returns consistent error format.
 *
 * Usage:
 *   router.post('/', validate(schemaBody), controller.action)
 *   router.get('/', validate(schemaQuery, 'query'), controller.action)
 *   router.get('/:id', validate(schemaParams, 'params'), controller.action)
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import logger from '@/config/logger';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Express middleware for Zod schema validation
 *
 * @param schema - Zod schema to validate against
 * @param source - Request property to validate ('body', 'query', or 'params')
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Extract data from appropriate request source
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;

      // Parse and validate with Zod
      const validated = schema.parse(data);

      // Attach validated data back to request for controller use
      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        // Store validated query in custom property since req.query is read-only
        (req as any).validatedQuery = validated;
      } else if (source === 'params') {
        // Store validated params in custom property since req.params is read-only
        (req as any).validatedParams = validated;
      }

      // Continue to next middleware/controller
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Validation error [${source}]:`, {
          errors: error.errors,
          path: error.issues.map((issue) => issue.path.join('.')),
        });

        // Format validation errors for client
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.') || source,
          message: issue.message,
          code: issue.code,
        }));

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Request ${source} validation failed`,
            timestamp: new Date().toISOString(),
            details,
          },
        });
      } else {
        // Unexpected error, pass to error handler
        next(error);
      }
    }
  };
}
