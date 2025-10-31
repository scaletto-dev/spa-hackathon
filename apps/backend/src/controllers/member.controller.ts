/**
 * Member Controller
 *
 * Handles HTTP requests for member endpoints.
 * Validates input, calls service layer, and formats responses.
 */

import { Request, Response, NextFunction } from 'express';
import memberService from '../services/member.service';
import { SuccessResponse, ErrorResponse } from '../types/api';
import { ValidationError } from '../utils/errors';
import logger from '../config/logger';
import { BookingHistoryParams } from '../services/member.service';

/**
 * Member Controller
 * Manages all member-related HTTP operations
 */
export class MemberController {
  /**
   * GET /api/v1/members/dashboard
   * Get member dashboard overview with stats and upcoming bookings
   */
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ValidationError('Authentication required');
      }

      const dashboard = await memberService.getMemberDashboard(req.user.id);

      const response: SuccessResponse<any> = {
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getDashboard:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/members/bookings
   * Get member booking history with pagination and filters
   *
   * Query params:
   * - page (optional, default: 1)
   * - limit (optional, default: 10, max: 100)
   * - status (optional, default: 'all') - 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', or 'all'
   * - dateFrom (optional) - ISO 8601 date format (YYYY-MM-DD)
   * - dateTo (optional) - ISO 8601 date format (YYYY-MM-DD)
   */
  async getBookings(
    req: Request<{}, {}, {}, any>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ValidationError('Authentication required');
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = (req.query.status as string) || 'all';
      const dateFrom = req.query.dateFrom ? (req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? (req.query.dateTo as string) : undefined;

      const bookingHistory = await memberService.getMemberBookings(req.user.id, {
        page,
        limit,
        status: status as any,
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      const response: SuccessResponse<any> = {
        success: true,
        data: bookingHistory.data,
        meta: bookingHistory.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getBookings:', error);
      next(error);
    }
  }

  /**
   * GET /api/v1/members/profile
   * Get member profile information
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ValidationError('Authentication required');
      }

      const profile = await memberService.getMemberProfile(req.user.id);

      const response: SuccessResponse<any> = {
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in getProfile:', error);
      next(error);
    }
  }

  /**
   * PATCH /api/v1/members/profile
   * Update member profile information
   */
  async updateProfile(
    req: Request<{}, {}, { fullName?: string; phone?: string; avatar?: string; language?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ValidationError('Authentication required');
      }

      const updatedProfile = await memberService.updateMemberProfile(req.user.id, req.body);

      const response: SuccessResponse<any> = {
        success: true,
        data: updatedProfile,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error('Error in updateProfile:', error);
      next(error);
    }
  }
}

export default new MemberController();
