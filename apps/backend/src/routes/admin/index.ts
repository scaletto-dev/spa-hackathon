/**
 * Admin Routes Index
 *
 * Aggregates all admin API routes
 * All routes are protected by authentication and require ADMIN or SUPER_ADMIN role
 */

import { Express, Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware";
import adminDashboardController from "../../controllers/admin/admin.dashboard.controller";
import adminProfileController from "../../controllers/admin/admin.profile.controller";
import adminCustomersController from "../../controllers/admin/admin.customers.controller";
import adminServicesController from "../../controllers/admin/admin.services.controller";
import adminBranchesController from "../../controllers/admin/admin.branches.controller";
import adminAppointmentsController from "../../controllers/admin/admin.appointments.controller";
import adminReviewsController from "../../controllers/admin/admin.reviews.controller";
import adminBlogController from "../../controllers/admin/admin.blog.controller";
import adminCategoriesController from "../../controllers/admin/admin.categories.controller";
import adminContactsController from "../../controllers/admin/admin.contacts.controller";

/**
 * Configure admin routes
 * Base path: /api/v1/admin
 * All routes require authentication + admin role
 */
export function configureAdminRoutes(router: Router): void {
   // Apply authentication and admin authorization to all admin routes
   router.use(authenticate, requireAdmin);
   // ============================================
   // DASHBOARD ROUTES
   // ============================================
   router.get(
      "/dashboard/stats",
      adminDashboardController.getStats.bind(adminDashboardController)
   );

   // ============================================
   // PROFILE ROUTES
   // ============================================
   router.get(
      "/profile",
      adminProfileController.getProfile.bind(adminProfileController)
   );
   router.put(
      "/profile",
      adminProfileController.updateProfile.bind(adminProfileController)
   );
   router.post(
      "/profile/change-password",
      adminProfileController.changePassword.bind(adminProfileController)
   );

   // ============================================
   // CUSTOMERS ROUTES
   // ============================================
   router.get(
      "/customers",
      adminCustomersController.getAllCustomers.bind(adminCustomersController)
   );
   router.get(
      "/customers/:id",
      adminCustomersController.getCustomerById.bind(adminCustomersController)
   );
   router.post(
      "/customers",
      adminCustomersController.createCustomer.bind(adminCustomersController)
   );
   router.put(
      "/customers/:id",
      adminCustomersController.updateCustomer.bind(adminCustomersController)
   );
   router.delete(
      "/customers/:id",
      adminCustomersController.deleteCustomer.bind(adminCustomersController)
   );
   router.patch(
      "/customers/:id/verify-email",
      adminCustomersController.verifyCustomerEmail.bind(
         adminCustomersController
      )
   );

   // ============================================
   // SERVICES ROUTES
   // ============================================
   router.get(
      "/services",
      adminServicesController.getAllServices.bind(adminServicesController)
   );
   router.get(
      "/services/:id",
      adminServicesController.getServiceById.bind(adminServicesController)
   );
   router.post(
      "/services",
      adminServicesController.createService.bind(adminServicesController)
   );
   router.put(
      "/services/:id",
      adminServicesController.updateService.bind(adminServicesController)
   );
   router.delete(
      "/services/:id",
      adminServicesController.deleteService.bind(adminServicesController)
   );
   router.patch(
      "/services/:id/toggle-featured",
      adminServicesController.toggleFeatured.bind(adminServicesController)
   );
   router.patch(
      "/services/:id/toggle-active",
      adminServicesController.toggleActive.bind(adminServicesController)
   );

   // ============================================
   // BRANCHES ROUTES
   // ============================================
   router.get(
      "/branches",
      adminBranchesController.getAllBranches.bind(adminBranchesController)
   );
   router.get(
      "/branches/:id",
      adminBranchesController.getBranchById.bind(adminBranchesController)
   );
   router.post(
      "/branches",
      adminBranchesController.createBranch.bind(adminBranchesController)
   );
   router.put(
      "/branches/:id",
      adminBranchesController.updateBranch.bind(adminBranchesController)
   );
   router.delete(
      "/branches/:id",
      adminBranchesController.deleteBranch.bind(adminBranchesController)
   );
   router.patch(
      "/branches/:id/toggle-active",
      adminBranchesController.toggleActive.bind(adminBranchesController)
   );

   // ============================================
   // APPOINTMENTS ROUTES
   // ============================================
   router.get(
      "/appointments",
      adminAppointmentsController.getAllAppointments.bind(
         adminAppointmentsController
      )
   );
   router.get(
      "/appointments/:id",
      adminAppointmentsController.getAppointmentById.bind(
         adminAppointmentsController
      )
   );
   router.post(
      "/appointments",
      adminAppointmentsController.createAppointment.bind(
         adminAppointmentsController
      )
   );
   router.put(
      "/appointments/:id",
      adminAppointmentsController.updateAppointment.bind(
         adminAppointmentsController
      )
   );
   router.delete(
      "/appointments/:id",
      adminAppointmentsController.deleteAppointment.bind(
         adminAppointmentsController
      )
   );
   router.patch(
      "/appointments/:id/status",
      adminAppointmentsController.updateStatus.bind(adminAppointmentsController)
   );

   // ============================================
   // REVIEWS ROUTES
   // ============================================
   router.get(
      "/reviews",
      adminReviewsController.getAllReviews.bind(adminReviewsController)
   );
   router.get(
      "/reviews/:id",
      adminReviewsController.getReviewById.bind(adminReviewsController)
   );
   router.patch(
      "/reviews/:id/approve",
      adminReviewsController.approveReview.bind(adminReviewsController)
   );
   router.patch(
      "/reviews/:id/reject",
      adminReviewsController.rejectReview.bind(adminReviewsController)
   );
   router.patch(
      "/reviews/:id/response",
      adminReviewsController.addResponse.bind(adminReviewsController)
   );
   router.delete(
      "/reviews/:id",
      adminReviewsController.deleteReview.bind(adminReviewsController)
   );

   // ============================================
   // BLOG ROUTES
   // ============================================
   router.get(
      "/blog/posts",
      adminBlogController.getAllPosts.bind(adminBlogController)
   );
   router.get(
      "/blog/posts/:id",
      adminBlogController.getPostById.bind(adminBlogController)
   );
   router.post(
      "/blog/posts",
      adminBlogController.createPost.bind(adminBlogController)
   );
   router.put(
      "/blog/posts/:id",
      adminBlogController.updatePost.bind(adminBlogController)
   );
   router.delete(
      "/blog/posts/:id",
      adminBlogController.deletePost.bind(adminBlogController)
   );
   router.patch(
      "/blog/posts/:id/publish",
      adminBlogController.publishPost.bind(adminBlogController)
   );
   router.patch(
      "/blog/posts/:id/unpublish",
      adminBlogController.unpublishPost.bind(adminBlogController)
   );

   // ============================================
   // CATEGORIES ROUTES
   // ============================================
   // Service Categories
   router.get(
      "/categories/service",
      adminCategoriesController.getAllServiceCategories.bind(
         adminCategoriesController
      )
   );
   router.post(
      "/categories/service",
      adminCategoriesController.createServiceCategory.bind(
         adminCategoriesController
      )
   );
   router.put(
      "/categories/service/:id",
      adminCategoriesController.updateServiceCategory.bind(
         adminCategoriesController
      )
   );
   router.delete(
      "/categories/service/:id",
      adminCategoriesController.deleteServiceCategory.bind(
         adminCategoriesController
      )
   );

   // Blog Categories
   router.get(
      "/categories/blog",
      adminCategoriesController.getAllBlogCategories.bind(
         adminCategoriesController
      )
   );
   router.post(
      "/categories/blog",
      adminCategoriesController.createBlogCategory.bind(
         adminCategoriesController
      )
   );
   router.put(
      "/categories/blog/:id",
      adminCategoriesController.updateBlogCategory.bind(
         adminCategoriesController
      )
   );
   router.delete(
      "/categories/blog/:id",
      adminCategoriesController.deleteBlogCategory.bind(
         adminCategoriesController
      )
   );

   // ============================================
   // CONTACTS ROUTES
   // ============================================
   router.get(
      "/contacts",
      adminContactsController.getAllContacts.bind(adminContactsController)
   );
   router.get(
      "/contacts/:id",
      adminContactsController.getContactById.bind(adminContactsController)
   );
   router.get(
      "/contacts/stats",
      adminContactsController.getStatistics.bind(adminContactsController)
   );
   router.patch(
      "/contacts/:id/status",
      adminContactsController.updateStatus.bind(adminContactsController)
   );
   router.patch(
      "/contacts/:id/notes",
      adminContactsController.addNotes.bind(adminContactsController)
   );
   router.delete(
      "/contacts/:id",
      adminContactsController.deleteContact.bind(adminContactsController)
   );
}

export default configureAdminRoutes;
