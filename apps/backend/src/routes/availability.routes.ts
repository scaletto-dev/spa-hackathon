import { Router } from "express";
import availabilityController from "../controllers/availability.controller";

const router = Router();

/**
 * Availability Routes
 *
 * API endpoints for checking appointment availability
 */

/**
 * GET /api/v1/availability
 * Get available time slots for a service at a branch on a specific date
 * Query params: serviceId, branchId, date (YYYY-MM-DD)
 */
router.get("/", availabilityController.getAvailableSlots);

export default router;

