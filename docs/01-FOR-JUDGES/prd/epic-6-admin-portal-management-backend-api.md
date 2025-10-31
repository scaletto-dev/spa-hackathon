# Epic 6: Admin Portal & Management (Backend API)

**Expanded Goal:** Build comprehensive **backend API** for administrative operations management. Provide robust API endpoints for managing services, branches, bookings, users, blog content, reviews, and analytics. Enable efficient platform management through RESTful APIs with proper authentication, authorization, and role-based access control. This epic delivers the administrative backend - the foundation for future admin dashboard interfaces.

**Phase 1 Focus:** Backend API ONLY - Admin endpoints, analytics APIs, CRUD operations, role-based access control.

### Story 6.1: Create Admin Dashboard with Key Metrics

As an admin,
I want to see an overview dashboard with key business metrics,
so that I can monitor clinic performance at a glance.

#### Acceptance Criteria
1. Admin dashboard created at `/admin` route (protected, admin role required)
2. Dashboard displays key metrics cards: Total Bookings (all time), Today's Bookings, This Month's Bookings, Total Members
3. Metrics show change compared to previous period (e.g., "+12% from last month")
4. Recent bookings section showing last 10 bookings with details (service, branch, customer, date/time)
5. Booking status breakdown chart (pie or bar): Confirmed, Completed, Cancelled
6. Popular services chart showing top 5 services by booking count
7. Branch performance comparison showing bookings per branch
8. "Quick Actions" section with buttons: View All Bookings, Manage Services, Moderate Reviews
9. Dashboard data fetched from `GET /api/v1/admin/dashboard` endpoint
10. Auto-refresh option to update metrics every 60 seconds (optional toggle)

### Story 6.2: Build Booking Management Interface

As an admin,
I want to view and manage all bookings from a centralized interface,
so that I can oversee appointments and handle operational issues.

#### Acceptance Criteria
1. Booking management page created at `/admin/bookings` route (protected)
2. Bookings displayed in table view with columns: Ref#, Customer, Service, Branch, Date/Time, Status, Actions
3. Filter options: Date range picker, Branch dropdown, Status dropdown, Search by customer name/ref#
4. Status badges with colors: Confirmed (green), Completed (blue), Cancelled (red), No-show (gray)
5. Sortable columns: Date/Time, Customer Name, Service Name
6. Pagination with configurable page size (10, 25, 50, 100)
7. "View Details" action opens booking detail modal showing all information
8. "Mark as Completed" action updates booking status
9. "Cancel Booking" action with confirmation dialog and cancellation reason
10. Export functionality: "Export to CSV" button for filtered bookings

### Story 6.3: Implement Service Management CRUD Interface

As an admin,
I want to create, edit, and delete services through an admin interface,
so that I can keep the service catalog up-to-date.

#### Acceptance Criteria
1. Service management page created at `/admin/services` route (protected)
2. Services listed in table: Name, Category, Price, Duration, Featured, Status, Actions
3. "Add New Service" button opens service creation form/modal
4. Service form fields: Name, Category (dropdown), Description (textarea), Duration (minutes), Price, Featured (checkbox), Images (multi-upload)
5. Rich text editor for detailed description with formatting options
6. Image upload supports multiple images with drag-and-drop
7. "Save" button calls `POST /api/v1/admin/services` (create) or `PUT /api/v1/admin/services/:id` (update)
8. "Delete" button with confirmation: "Are you sure? This service has X bookings."
9. Form validation ensures required fields completed before save
10. Success/error messages displayed after operations

### Story 6.4: Build Branch Management Interface

As an admin,
I want to manage clinic branch information,
so that customers see accurate location details and operating hours.

#### Acceptance Criteria
1. Branch management page created at `/admin/branches` route (protected)
2. Branches listed in cards or table: Name, Address, Phone, Status, Actions
3. "Add New Branch" button opens branch creation form
4. Branch form fields: Name, Address, Phone, Email, Operating Hours (day/time grid), Latitude, Longitude, Images (multi-upload)
5. Operating hours editor with time pickers for each day of week and "Closed" option
6. Map integration showing selected coordinates with drag-to-adjust marker
7. "Geocode Address" button auto-fills latitude/longitude from address
8. Services available at branch: Multi-select checkbox list of all services
9. Form validation and save/update functionality
10. "Deactivate" button to temporarily close branch (not visible to customers)

### Story 6.5: Create User Management Interface

As an admin,
I want to view and manage user accounts,
so that I can handle user issues and manage admin access.

#### Acceptance Criteria
1. User management page created at `/admin/users` route (protected, super admin only)
2. Users displayed in table: Name, Email, Phone, Role, Registration Date, Status, Actions
3. Filter options: Role (Member, Admin, Super Admin), Status (Active, Suspended), Search by name/email
4. "View Profile" action shows user details and booking history
5. "Edit Role" action allows changing user role (with confirmation for admin promotion)
6. "Suspend Account" action prevents user login (with reason and notification)
7. "Activate Account" action re-enables suspended accounts
8. User statistics shown: Total Members, Active Today, New This Month
9. Data fetched from `GET /api/v1/admin/users` endpoint
10. Bulk actions: Select multiple users for suspend/activate operations

### Story 6.6: Implement Admin API Endpoints

As a backend developer,
I want to create protected admin API endpoints for management operations,
so that admin interfaces can perform CRUD operations on all entities.

#### Acceptance Criteria
1. Admin dashboard endpoint: `GET /api/v1/admin/dashboard` returns metrics and stats
2. Admin bookings endpoint: `GET /api/v1/admin/bookings` with filtering, pagination
3. Update booking status: `PUT /api/v1/admin/bookings/:id/status` (completed, cancelled)
4. Service CRUD: `POST/PUT/DELETE /api/v1/admin/services/:id`
5. Branch CRUD: `POST/PUT/DELETE /api/v1/admin/branches/:id`
6. User management: `GET /api/v1/admin/users`, `PUT /api/v1/admin/users/:id/role`, `PUT /api/v1/admin/users/:id/status`
7. All admin endpoints require authentication and admin role verification
8. Super admin role required for user role modifications
9. Audit logging for sensitive admin actions (role changes, deletions)
10. All endpoints tested with proper authorization checks

### Story 6.7: Add Contact Submissions Management

As an admin,
I want to view and manage contact form submissions,
so that I can respond to customer inquiries efficiently.

#### Acceptance Criteria
1. Contact submissions page created at `/admin/contact` route (protected)
2. Submissions displayed in table: Date, Name, Email, Message Type, Status, Actions
3. Status options: New (unread), In Progress, Resolved
4. Clicking submission opens detail view showing full message
5. "Mark as Resolved" action updates status
6. "Reply" button opens email compose interface (optional, can link to email client)
7. Filter by status, date range, message type
8. Search by name or email
9. Submissions fetched from database (ContactSubmission model from Epic 2)
10. Badge showing count of unread submissions in admin navigation

### Story 6.8: Build Analytics and Reporting Interface

As an admin,
I want to view analytics reports and charts,
so that I can understand business trends and make data-driven decisions.

#### Acceptance Criteria
1. Analytics page created at `/admin/analytics` route (protected)
2. Date range selector for custom period analysis (last 7 days, 30 days, 90 days, custom)
3. Booking trends chart: Line graph showing bookings per day/week/month
4. Revenue projection chart (bookings × service price) over time
5. Service popularity: Bar chart of most booked services
6. Branch performance comparison: Bookings per branch
7. Peak hours heatmap: Busiest booking times by day and hour
8. Member growth chart: New member registrations over time
9. Conversion funnel: Visitors → Service Views → Bookings Started → Completed
10. Export reports as PDF or CSV for sharing

### Story 6.9: Implement Admin Navigation and Layout

As an admin,
I want a consistent admin navigation and layout,
so that I can easily access all management tools.

#### Acceptance Criteria
1. Admin layout component created wrapping all admin pages
2. Persistent sidebar navigation (collapsible on mobile) with sections:
   - Dashboard (overview)
   - Bookings (manage appointments)
   - Services (CRUD)
   - Branches (CRUD)
   - Blog (from Epic 5)
   - Reviews (from Epic 5)
   - Users (manage accounts)
   - Contact (submissions)
   - Analytics (reports)
   - Settings (future)
3. Top header with: Logo, Admin badge, User menu (profile, logout)
4. Breadcrumb navigation showing current location
5. Responsive: Sidebar collapses to hamburger menu on mobile/tablet
6. Active navigation item highlighted
7. Badge indicators for pending items (unread contacts, pending reviews)
8. "Back to Website" link to return to customer-facing site
9. Consistent spacing, typography, and color scheme across all admin pages
10. Role-based menu: Super admins see Users section, regular admins don't

### Story 6.10: Add Admin Settings and Configuration

As an admin,
I want to configure application settings,
so that I can customize the platform without code changes.

#### Acceptance Criteria
1. Settings page created at `/admin/settings` route (protected, super admin only)
2. General settings section: Site Name, Contact Email, Support Phone, Timezone
3. Booking settings: Default appointment duration, Buffer time between appointments, Max days in advance to book
4. Email settings: Sender name, Sender email, SMTP configuration (read-only, set via env)
5. Notification settings: Enable/disable booking confirmations, review notifications, contact form alerts
6. Business hours: Default operating hours template for new branches
7. Feature flags: Enable/disable features (e.g., member registration, reviews, blog)
8. Settings stored in database (Settings table) and cached for performance
9. "Save Settings" button with confirmation and success message
10. Settings applied application-wide immediately after save

---
