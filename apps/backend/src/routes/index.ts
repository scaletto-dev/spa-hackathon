import { Express } from 'express';
import healthRoutes from './health.routes';
import servicesRoutes from './services.routes';
import branchesRoutes from './branches.routes';
import authRoutes from './auth.routes';
import bookingsRoutes from './bookings.routes';
import categoriesRoutes from './categories.routes';
import contactRoutes from './contact.routes';
import bookingsAdminRoutes from './admin/bookingsAdmin.routes';

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
 * - /api/v1/contact - Contact form submission routes (with rate limiting)
 * - /api/v1/admin/bookings - Admin booking management routes (protected)
 * 
 * @param app - Express application instance
 */
export function configureRoutes(app: Express): void {
  // Health check (no /v1 prefix)
  app.use('/api/health', healthRoutes);

  // API v1 routes
  app.use('/api/v1/services', servicesRoutes);
  app.use('/api/v1/categories', categoriesRoutes);
  app.use('/api/v1/branches', branchesRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/bookings', bookingsRoutes);
  app.use('/api/v1/contact', contactRoutes);

  // Admin routes (protected)
  app.use('/api/v1/admin/bookings', bookingsAdminRoutes);
}
