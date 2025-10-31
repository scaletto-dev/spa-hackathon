/**
 * Authentication Middleware
 *
 * Verifies JWT token and attaches user data to request
 */

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import prisma from '../config/database';
import { UnauthorizedError } from '../utils/errors';
import logger from '../config/logger';

/**
 * Extend Express Request to include user data
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        supabaseAuthId?: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 *
 * Usage: router.get('/protected', authenticate, controller)
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authorization token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedError('Invalid authorization token');
    }

    if (!supabase) {
      logger.error('Supabase client not configured');
      throw new Error('Authentication service unavailable');
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logger.warn('Token verification failed', {
        error: error?.message,
      });
      throw new UnauthorizedError('Invalid or expired token');
    }

    const supabaseUser = data.user;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { supabaseAuthId: supabaseUser.id },
      select: {
        id: true,
        email: true,
        role: true,
        supabaseAuthId: true,
        emailVerified: true,
      },
    });

    if (!user) {
      logger.warn('User not found in database', {
        supabaseAuthId: supabaseUser.id,
        email: supabaseUser.email,
      });
      throw new UnauthorizedError('User not found');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedError('Email not verified. Please verify your email.');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...(user.supabaseAuthId && { supabaseAuthId: user.supabaseAuthId }),
    };

    logger.debug('User authenticated', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error.message,
      });
      return;
    }

    logger.error('Authentication middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't fail if missing
 *
 * Usage: router.get('/optional', optionalAuthenticate, controller)
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (!token || !supabase) {
      next();
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      // Invalid token, continue without user
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseAuthId: data.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        supabaseAuthId: true,
        emailVerified: true,
      },
    });

    if (user && user.emailVerified) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.supabaseAuthId && { supabaseAuthId: user.supabaseAuthId }),
      };
    }

    next();
  } catch (error) {
    // On error, continue without user (don't block request)
    logger.warn('Optional authentication failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    next();
  }
}

/**
 * Role-based authorization middleware
 * Requires authenticate middleware to be called first
 *
 * Usage: router.get('/admin', authenticate, requireRole('ADMIN'), controller)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });

      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

/**
 * Admin authorization middleware
 * Checks if user has ADMIN or SUPER_ADMIN role
 * Must be used AFTER authenticate middleware
 *
 * Usage: router.get('/admin', authenticate, requireAdmin, controller)
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
    return;
  }

  const adminRoles = ['ADMIN', 'SUPER_ADMIN'];

  if (!adminRoles.includes(req.user.role)) {
    logger.warn('Admin access denied', {
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      endpoint: `${req.method} ${req.path}`,
    });

    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Admin access required',
    });
    return;
  }

  logger.debug('Admin access granted', {
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
  });

  next();
}
