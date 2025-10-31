import { Express, Router } from 'express';
import healthRoutes from './health.routes';
import servicesRoutes from './services.routes';
import branchesRoutes from './branches.routes';
import categoriesRoutes from './categories.routes';
import contactRoutes from './contact.routes';
import uploadRoutes from './upload.routes';
import authRoutes from './auth.routes';
import reviewsRoutes from './reviews.routes';
import blogRoutes from './blog.routes';
import userRoutes from './user.routes';
import vouchersRoutes from './vouchers.route';
import aiRoutes from './ai.routes';
import supportRoutes from './support.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payments';
import memberRoutes from './member.routes';
import { configureAdminRoutes } from './admin';

/**
 * Configure all application routes
 *
 * Mounts route handlers at their respective paths:
 * - /api/health - Health check endpoint (no /v1 prefix)
 * - /api/v1/services - Service catalog routes
 * - /api/v1/categories - Service category routes
 * - /api/v1/branches - Branch location routes
 * - /api/v1/auth - Authentication routes (with rate limiting)
 * - /api/v1/user - User profile management routes (requires authentication)
 * - /api/v1/members - Member dashboard and booking history routes (requires authentication)
 * - /api/v1/vouchers - Voucher routes (public validation and retrieval)
 * - /api/v1/admin - Admin management routes (requires admin authentication)
 * - /api/v1/bookings - Booking management routes
 * - /api/v1/availability - Availability check routes
 * - /api/v1/blog - Blog post routes
 * - /api/v1/upload - Image upload routes (with rate limiting)
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
  app.use('/api/v1/reviews', reviewsRoutes);
  app.use('/api/v1/contact', contactRoutes);
  app.use('/api/v1/upload', uploadRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/members', memberRoutes);
  app.use('/api/v1/blog', blogRoutes);
  app.use('/api/v1/vouchers', vouchersRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/support', supportRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
  app.use('/api/v1/payments', paymentRoutes);

  // Admin routes
  const adminRouter = Router();
  configureAdminRoutes(adminRouter);
  app.use('/api/v1/admin', adminRouter);
}
