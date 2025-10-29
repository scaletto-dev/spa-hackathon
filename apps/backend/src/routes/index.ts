import { Express } from "express";
import healthRoutes from "./health.routes";
import servicesRoutes from "./services.routes";
import branchesRoutes from "./branches.routes";
import categoriesRoutes from "./categories.routes";
import contactRoutes from "./contact.routes";
import uploadRoutes from "./upload.routes";
import authRoutes from "./auth.routes";

/**
 * Configure all application routes
 *
 * Mounts route handlers at their respective paths:
 * - /api/health - Health check endpoint (no /v1 prefix)
 * - /api/v1/services - Service catalog routes
 * - /api/v1/categories - Service category routes
 * - /api/v1/branches - Branch location routes
 * - /api/v1/auth - Authentication routes (with rate limiting)
 * - /api/v1/bookings - Booking management routes
 * - /api/v1/availability - Availability check routes
 * - /api/v1/contact - Contact form submission routes (with rate limiting)
 *
 * - /api/v1/upload - Image upload routes (with rate limiting)
 * 
 * @param app - Express application instance
 */
export function configureRoutes(app: Express): void {
   // Health check (no /v1 prefix)
   app.use("/api/health", healthRoutes);
   // API v1 routes
   app.use("/api/v1/services", servicesRoutes);
   app.use("/api/v1/categories", categoriesRoutes);
   app.use("/api/v1/branches", branchesRoutes);
   app.use("/api/v1/contact", contactRoutes);
   app.use('/api/v1/upload', uploadRoutes);
   app.use('/api/v1/auth', authRoutes);
}
