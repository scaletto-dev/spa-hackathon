import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

/**
 * Admin Authentication Middleware (Placeholder)
 *
 * Full implementation will be available after merging epic3/3.7-3.8 branch.
 * This placeholder allows routes to be defined and tested independently.
 *
 * MVP implementation uses simple API key header.
 * TODO: Replace with Supabase JWT verification
 */

// Extend Express Request type to include user
declare global {
   namespace Express {
      interface Request {
         user?: {
            id: string;
            role: string;
            email: string;
         };
      }
   }
}

/**
 * Verify admin role
 * For MVP: Check X-Admin-Key header
 * TODO: Replace with Supabase Auth JWT verification
 */
export function requireAdmin(
   req: Request,
   res: Response,
   next: NextFunction
): void {
   try {
      const adminKey = req.headers["x-admin-key"] as string;

      if (!adminKey) {
         throw new UnauthorizedError(
            "Admin authentication required. Provide X-Admin-Key header."
         );
      }

      // Simple key check (in production, use proper JWT verification)
      const validAdminKey = process.env.ADMIN_API_KEY || "admin-secret-key";

      if (adminKey !== validAdminKey) {
         throw new UnauthorizedError("Invalid admin credentials");
      }

      // Set mock user for now
      req.user = {
         id: "admin-user",
         role: "ADMIN",
         email: "admin@beautyclinic.com",
      };

      next();
   } catch (error) {
      next(error);
   }
}
