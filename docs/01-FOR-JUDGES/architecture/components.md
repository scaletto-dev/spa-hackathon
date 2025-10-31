# Components

This section defines the major logical components across the fullstack application. Components represent cohesive units of functionality with well-defined boundaries and interfaces. The architecture follows a feature-based organization where related frontend and backend components are grouped by domain (e.g., all booking-related code together).

### Frontend Components (React SPA)

#### App Shell & Navigation

**Responsibility:** Top-level application structure, routing, and navigation UI

**Key Interfaces:**
- `<Header />` - Main navigation bar with language switcher, auth buttons
- `<Footer />` - Site footer with links and contact info
- `<MobileNav />` - Responsive hamburger menu for mobile
- `<LanguageSwitcher />` - 4-language selector (🇻🇳 🇯🇵 🇬🇧 🇨🇳)
- `<AuthGuard />` - Protected route wrapper component

**Dependencies:** i18next for translations, React Router for navigation, AuthContext for user state

**Technology Stack:** React Router v6 for routing, shadcn/ui navigation components, Tailwind for styling

---

#### Authentication Module

**Responsibility:** User registration, login (email OTP), profile management, session handling

**Key Interfaces:**
- `<RegisterForm />` - Email, name, phone capture + OTP verification
- `<LoginForm />` - Email input for OTP request
- `<OTPVerification />` - 6-digit code input with timer
- `<ProfilePage />` - View/edit profile information
- `useAuth()` - Custom hook exposing: `{ user, login, logout, register, isAuthenticated }`
- `<AuthContext.Provider>` - Global auth state provider

**Dependencies:** Supabase Auth SDK, Axios for API calls, React Hook Form + Zod for validation

**Technology Stack:** React Context API for state, localStorage for token persistence, Supabase Auth for backend

**API Endpoints Used:**
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/verify-otp`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- GET `/api/v1/profile`
- PUT `/api/v1/profile`

---

#### Service Catalog Module

**Responsibility:** Display services, filter by category, search, show service details with reviews

**Key Interfaces:**
- `<ServicesPage />` - Service grid with filters and search
- `<ServiceCard />` - Service preview card for listings
- `<ServiceDetailPage />` - Full service info, FAQs, before/after photos, reviews
- `<ServiceCategoryFilter />` - Category selector sidebar/dropdown
- `<ServiceSearch />` - Search input with debounce
- `useServices()` - Hook for fetching services data
- `useServiceDetail(slug)` - Hook for single service with reviews

**Dependencies:** Axios for API calls, React Router for navigation, i18next for translations

**Technology Stack:** React Query (optional) or custom hooks for data fetching, shadcn/ui Card components

**API Endpoints Used:**
- GET `/api/v1/services?category=X&search=Y&page=1`
- GET `/api/v1/services/:slug`
- GET `/api/v1/services/categories`

---

#### Branch Locator Module

**Responsibility:** Display clinic branches, show details with Google Maps integration

**Key Interfaces:**
- `<BranchesPage />` - Branch listing with thumbnails
- `<BranchCard />` - Branch preview card
- `<BranchDetailPage />` - Full branch info with embedded map, operating hours, services
- `<GoogleMap />` - Google Maps integration component
- `<OperatingHours />` - Display formatted hours per day
- `useBranches()` - Hook for fetching branches data

**Dependencies:** Google Maps JavaScript API, Axios, i18next

**Technology Stack:** @react-google-maps/api or similar wrapper, shadcn/ui components

**API Endpoints Used:**
- GET `/api/v1/branches`
- GET `/api/v1/branches/:slug`

---

#### Booking Wizard Module

**Responsibility:** Multi-step booking flow (service → branch → date/time → guest info → confirm)

**Key Interfaces:**
- `<BookingWizard />` - Stepper container managing wizard state
- `<StepServiceSelection />` - Choose service from list
- `<StepBranchSelection />` - Choose branch from list
- `<StepDateTime />` - Calendar and time slot picker
- `<StepGuestInfo />` - Name, email, phone form (auto-filled for members)
- `<StepConfirmation />` - Review booking and submit
- `<BookingConfirmationPage />` - Success page with reference number
- `<AvailabilityCalendar />` - Date picker with availability indicators
- `<TimeSlotPicker />` - Time slot grid with available/booked state
- `useBookingWizard()` - Hook managing wizard state and navigation
- `useAvailability(serviceId, branchId, date)` - Hook for checking availability

**Dependencies:** React Hook Form + Zod for validation, date-fns for date manipulation, Axios for API calls, AuthContext for member data

**Technology Stack:** Multi-step form pattern, shadcn/ui Form, Calendar, Select components

**API Endpoints Used:**
- GET `/api/v1/bookings/availability?serviceId=X&branchId=Y&date=Z`
- POST `/api/v1/bookings`
- GET `/api/v1/bookings/:referenceNumber?email=X`

---

#### Member Dashboard Module

**Responsibility:** Member-only features - booking history, profile, dashboard overview

**Key Interfaces:**
- `<DashboardPage />` - Overview with upcoming bookings, quick actions
- `<BookingHistoryPage />` - Filterable list of past/upcoming bookings
- `<BookingCard />` - Single booking display with status badge
- `useBookingHistory(status)` - Hook for fetching user's bookings

**Dependencies:** AuthContext for user data, Axios, date-fns for formatting

**Technology Stack:** Protected routes, shadcn/ui Table/Card components

**API Endpoints Used:**
- GET `/api/v1/profile/bookings?status=X&page=1`

---

#### Blog & Content Module

**Responsibility:** Display blog posts, categories, search, individual post pages

**Key Interfaces:**
- `<BlogPage />` - Blog listing with filters and search
- `<BlogPostCard />` - Post preview card for listings
- `<BlogPostPage />` - Full post content with related posts
- `<BlogCategoryFilter />` - Category filter sidebar
- `<BlogSearch />` - Search input
- `useBlogPosts(category, search, language)` - Hook for fetching posts
- `useBlogPost(slug)` - Hook for single post

**Dependencies:** Axios, i18next for language filtering, React Router

**Technology Stack:** Rich text rendering (dangerouslySetInnerHTML or markdown parser), shadcn/ui components

**API Endpoints Used:**
- GET `/api/v1/blog/posts?category=X&search=Y&language=vi&page=1`
- GET `/api/v1/blog/posts/:slug`
- GET `/api/v1/blog/categories`

---

#### Review Module

**Responsibility:** Submit service reviews, display reviews with ratings

**Key Interfaces:**
- `<ReviewForm />` - Star rating, name, email, text input
- `<ReviewList />` - Display approved reviews for service
- `<ReviewCard />` - Single review with star rating, admin response
- `<StarRating />` - Interactive star rating input/display
- `<RatingDistribution />` - Bar chart showing 5→1 star distribution
- `useServiceReviews(serviceId)` - Hook for fetching service reviews

**Dependencies:** Axios, React Hook Form + Zod

**Technology Stack:** shadcn/ui Form components, custom star rating component

**API Endpoints Used:**
- POST `/api/v1/reviews`
- GET `/api/v1/reviews/service/:serviceId?page=1`

---

#### Contact Module

**Responsibility:** Contact form submission

**Key Interfaces:**
- `<ContactPage />` - Contact form + info + Google Maps
- `<ContactForm />` - Name, email, phone, message type, message
- `<GoogleMapEmbed />` - Embedded map for flagship location

**Dependencies:** Axios, React Hook Form + Zod, Google Maps

**Technology Stack:** shadcn/ui Form, Textarea components

**API Endpoints Used:**
- POST `/api/v1/contact`

---

#### Admin Portal Module

**Responsibility:** Admin dashboard, CRUD operations for services/branches/blog/reviews, booking management, user management

**Key Interfaces:**
- `<AdminLayout />` - Admin sidebar + header wrapper
- `<AdminDashboard />` - Metrics and analytics overview
- `<AdminBookings />` - Booking management table with filters
- `<AdminServices />` - Service CRUD interface
- `<AdminBranches />` - Branch CRUD interface
- `<AdminBlog />` - Blog post editor with rich text
- `<AdminReviews />` - Review moderation interface (approve/reject/respond)
- `<AdminUsers />` - User management (super admin only)
- `<AdminContact />` - Contact submissions inbox
- `<RichTextEditor />` - WYSIWYG editor for blog content
- `<ImageUploader />` - Upload to Supabase Storage
- `useAdminAuth()` - Hook checking admin role

**Dependencies:** All of the above, plus rich text editor library (e.g., TipTap, Quill, or Lexical)

**Technology Stack:** Protected admin routes, shadcn/ui Table, Dialog, Form components, rich text editor

**API Endpoints Used:** All `/api/v1/admin/*` endpoints (25+ endpoints)

---

### Backend Components (Express.js API)

#### API Server Core

**Responsibility:** Express app initialization, middleware configuration, routing setup, error handling

**Key Interfaces:**
- `createServer()` - Factory function to create Express app
- `configureMiddleware(app)` - Apply cors, helmet, json parsing, rate limiting
- `configureRoutes(app)` - Mount all route routers
- `errorHandler(err, req, res, next)` - Global error handling middleware
- `notFoundHandler(req, res)` - 404 handler

**Dependencies:** Express, cors, helmet, express-rate-limit, winston (logging)

**Technology Stack:** Express.js middleware pattern, Winston for logging

---

#### Authentication Service

**Responsibility:** Supabase Auth integration, JWT verification, user management

**Key Interfaces:**
- `authService.register(email, fullName, phone, language)` - Create Supabase user + User record
- `authService.verifyOTP(email, otp)` - Verify OTP and return tokens
- `authService.login(email)` - Send OTP for login
- `authService.logout(userId)` - Invalidate session
- `authMiddleware(req, res, next)` - Verify JWT token and attach user
- `requireAdmin(req, res, next)` - Check admin role
- `requireSuperAdmin(req, res, next)` - Check super admin role

**Dependencies:** Supabase Auth SDK (@supabase/supabase-js), Prisma (User model), JWT verification

**Technology Stack:** Supabase Auth for OTP generation/verification, JWT for stateless auth

**Database Tables:** User

---

#### Service Management Service

**Responsibility:** Service CRUD operations, category management, caching

**Key Interfaces:**
- `serviceService.getAll(filters, pagination)` - Get services with filtering
- `serviceService.getBySlug(slug)` - Get service detail with reviews
- `serviceService.create(data)` - Create new service (admin)
- `serviceService.update(id, data)` - Update service (admin)
- `serviceService.delete(id)` - Delete service (admin)
- `categoryService.getAll()` - Get all categories with service counts
- `serviceCache.getServices()` - Get cached service list
- `serviceCache.invalidate()` - Clear service cache

**Dependencies:** Prisma (Service, ServiceCategory models), Redis for caching

**Technology Stack:** Prisma for database access, Redis for caching (15-minute TTL)

**Database Tables:** Service, ServiceCategory, BranchService (join table)

---

#### Branch Management Service

**Responsibility:** Branch CRUD operations, operating hours management

**Key Interfaces:**
- `branchService.getAll()` - Get all branches
- `branchService.getBySlug(slug)` - Get branch detail with services
- `branchService.create(data)` - Create new branch (admin)
- `branchService.update(id, data)` - Update branch (admin)
- `branchService.delete(id)` - Delete branch (admin)
- `branchService.isOpen(branchId, dateTime)` - Check if branch is open at given time

**Dependencies:** Prisma (Branch model), Redis for caching

**Technology Stack:** JSON storage for operating hours, coordinate validation for lat/lng

**Database Tables:** Branch, BranchService (join table)

---

#### Booking Service

**Responsibility:** Booking creation, availability checking, reference number generation, booking management

**Key Interfaces:**
- `bookingService.create(data)` - Create booking with validation
- `bookingService.getByReferenceNumber(refNum, email)` - Lookup booking
- `bookingService.checkAvailability(serviceId, branchId, date)` - Get available time slots
- `bookingService.getUserBookings(userId, filters, pagination)` - Get member booking history
- `bookingService.updateStatus(id, status, reason)` - Update booking status (admin)
- `bookingService.generateReferenceNumber()` - Generate unique reference (BCW-YYYY-NNNNNN)
- `availabilityService.getSlots(serviceId, branchId, date)` - Calculate available slots based on duration, operating hours, existing bookings
- `availabilityService.isSlotAvailable(serviceId, branchId, dateTime)` - Check single slot

**Dependencies:** Prisma (Booking, Service, Branch models), Redis for availability caching, date-fns for date calculations

**Technology Stack:** Optimistic locking for concurrent booking prevention, Redis caching (5-minute TTL for availability)

**Database Tables:** Booking

**Critical Logic:**
- Slot availability calculation: Branch operating hours - Service duration - Existing bookings
- Reference number uniqueness: Atomic counter with year prefix
- Concurrent booking prevention: Database unique constraint on (serviceId, branchId, appointmentDate, appointmentTime)

---

#### Review Service

**Responsibility:** Review submission, moderation, rating calculations

**Key Interfaces:**
- `reviewService.create(data)` - Submit review (pending approval)
- `reviewService.getServiceReviews(serviceId, pagination)` - Get approved reviews
- `reviewService.approve(id)` - Approve review (admin)
- `reviewService.reject(id)` - Reject/delete review (admin)
- `reviewService.addAdminResponse(id, response)` - Add admin response (admin)
- `reviewService.calculateRating(serviceId)` - Calculate average rating and distribution
- `reviewService.checkRateLimit(email)` - Verify email hasn't submitted 3+ reviews today

**Dependencies:** Prisma (Review, Service models), Redis for rate limiting

**Technology Stack:** Redis for rate limiting (rolling window), database triggers for rating updates (optional)

**Database Tables:** Review

---

#### Blog Service

**Responsibility:** Blog post CRUD, category management, rich content handling

**Key Interfaces:**
- `blogService.getPosts(filters, pagination)` - Get published posts with filtering
- `blogService.getBySlug(slug)` - Get single post with related posts
- `blogService.create(data)` - Create post (admin)
- `blogService.update(id, data)` - Update post (admin)
- `blogService.delete(id)` - Delete post (admin)
- `blogService.generateSlug(title)` - Generate unique slug from title
- `categoryService.getBlogCategories()` - Get all blog categories

**Dependencies:** Prisma (BlogPost, BlogCategory, User models)

**Technology Stack:** Slug generation with uniqueness check, rich text sanitization (optional)

**Database Tables:** BlogPost, BlogCategory

---

#### Contact Service

**Responsibility:** Contact form submission handling, email notifications

**Key Interfaces:**
- `contactService.create(data)` - Create contact submission
- `contactService.getAll(filters, pagination)` - Get submissions (admin)
- `contactService.updateStatus(id, status, notes)` - Update submission status (admin)
- `contactService.sendNotification(submission)` - Send email to admin

**Dependencies:** Prisma (ContactSubmission model), Email service for notifications

**Technology Stack:** Simple CRUD with email integration

**Database Tables:** ContactSubmission

---

#### Email Service

**Responsibility:** Transactional email sending (bookings, OTP, contact notifications)

**Key Interfaces:**
- `emailService.sendBookingConfirmation(booking, language)` - Send confirmation email
- `emailService.sendOTP(email, code, language)` - Send OTP code (handled by Supabase)
- `emailService.sendContactNotification(submission)` - Notify admin of new contact
- `emailService.getTemplate(templateName, language)` - Get localized email template

**Dependencies:** Nodemailer, SMTP configuration, i18next for email templates

**Technology Stack:** HTML email templates, template engine (Handlebars or EJS), i18next for multilingual emails

**Email Templates:**
- booking-confirmation.{vi|ja|en|zh}.html
- otp-verification.{vi|ja|en|zh}.html (Supabase-handled)
- contact-notification.html (admin email)

---

#### Storage Service

**Responsibility:** File upload to Supabase Storage, image optimization

**Key Interfaces:**
- `storageService.uploadImage(file, folder)` - Upload to Supabase Storage
- `storageService.deleteImage(url)` - Delete image from storage
- `storageService.getPublicUrl(path)` - Get public URL for file

**Dependencies:** Supabase Storage SDK, multer for multipart upload handling

**Technology Stack:** Supabase Storage with public bucket, image validation (size, type)

**Storage Buckets:** images (public), organized by folders: services/, branches/, blog/, profile/

---

#### User Service

**Responsibility:** User profile management, role management (super admin)

**Key Interfaces:**
- `userService.getProfile(userId)` - Get user profile
- `userService.updateProfile(userId, data)` - Update profile
- `userService.getAll(filters, pagination)` - Get all users (admin)
- `userService.updateRole(userId, role)` - Change user role (super admin)
- `userService.suspend(userId, reason)` - Suspend account (admin)
- `userService.activate(userId)` - Reactivate account (admin)

**Dependencies:** Prisma (User model), Supabase Auth for sync

**Technology Stack:** Simple CRUD with authorization checks

**Database Tables:** User

---

#### Cache Service

**Responsibility:** Redis caching abstraction layer

**Key Interfaces:**
- `cacheService.get(key)` - Get cached value
- `cacheService.set(key, value, ttl)` - Set cached value with expiry
- `cacheService.del(key)` - Delete cached value
- `cacheService.clear(pattern)` - Clear keys matching pattern

**Dependencies:** Redis client (ioredis)

**Technology Stack:** Redis with key prefixing (services:, branches:, availability:)

**Cache Keys:**
- `services:all` (15 min TTL)
- `services:{slug}` (15 min TTL)
- `branches:all` (15 min TTL)
- `availability:{serviceId}:{branchId}:{date}` (5 min TTL)

---

### Shared Components (Monorepo Packages)

#### @packages/shared (TypeScript Interfaces)

**Responsibility:** Shared types, constants, utilities used by both frontend and backend

**Key Interfaces:**
- All TypeScript interfaces from Data Models section (User, Service, Booking, etc.)
- Shared enums: BookingStatus, UserRole, MessageType, ContactStatus
- Shared constants: LANGUAGES, SERVICE_CATEGORIES, BOOKING_STATUSES
- Validation schemas: Zod schemas shared between frontend forms and backend validation

**Dependencies:** Zod for validation schemas

**Technology Stack:** Pure TypeScript, no runtime dependencies

**Example:**
```typescript
// packages/shared/src/types/booking.ts
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface BookingCreateInput {
  serviceId: string;
  branchId: string;
  appointmentDate: Date;
  appointmentTime: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  language?: string;
}

// packages/shared/src/validation/booking.ts
import { z } from 'zod';

export const bookingCreateSchema = z.object({
  serviceId: z.string().uuid(),
  branchId: z.string().uuid(),
  appointmentDate: z.date(),
  appointmentTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  guestName: z.string().min(2).optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  notes: z.string().max(500).optional(),
  language: z.enum(['vi', 'ja', 'en', 'zh']).default('vi'),
});
```

---

#### @packages/database (Prisma Schema)

**Responsibility:** Prisma schema, migrations, seed scripts

**Key Interfaces:**
- Prisma schema definition (schema.prisma)
- Migration files
- Seed scripts for initial data

**Dependencies:** Prisma CLI, @prisma/client

**Technology Stack:** Prisma ORM

---

### Component Interaction Diagram

```mermaid
graph TB
    subgraph "Frontend (React SPA)"
        APP[App Shell]
        AUTH[Auth Module]
        SERVICES[Service Catalog]
        BRANCHES[Branch Locator]
        BOOKING[Booking Wizard]
        MEMBER[Member Dashboard]
        BLOG[Blog Module]
        REVIEW[Review Module]
        CONTACT[Contact Module]
        ADMIN[Admin Portal]
    end

    subgraph "Backend (Express API)"
        API[API Server Core]
        AUTH_SVC[Auth Service]
        SERVICE_SVC[Service Service]
        BRANCH_SVC[Branch Service]
        BOOKING_SVC[Booking Service]
        REVIEW_SVC[Review Service]
        BLOG_SVC[Blog Service]
        CONTACT_SVC[Contact Service]
        USER_SVC[User Service]
        EMAIL_SVC[Email Service]
        STORAGE_SVC[Storage Service]
        CACHE_SVC[Cache Service]
    end

    subgraph "Shared Packages"
        TYPES[@packages/shared]
        DB[@packages/database]
    end

    subgraph "External Services"
        SUPABASE_AUTH[Supabase Auth]
        SUPABASE_DB[(Supabase PostgreSQL)]
        SUPABASE_STORAGE[Supabase Storage]
        REDIS[(Redis Cache)]
        GMAPS[Google Maps API]
    end

    APP --> AUTH
    APP --> SERVICES
    APP --> BRANCHES
    APP --> BOOKING
    APP --> MEMBER
    APP --> BLOG
    APP --> REVIEW
    APP --> CONTACT
    APP --> ADMIN

    AUTH --> API
    SERVICES --> API
    BRANCHES --> API
    BOOKING --> API
    MEMBER --> API
    BLOG --> API
    REVIEW --> API
    CONTACT --> API
    ADMIN --> API

    API --> AUTH_SVC
    API --> SERVICE_SVC
    API --> BRANCH_SVC
    API --> BOOKING_SVC
    API --> REVIEW_SVC
    API --> BLOG_SVC
    API --> CONTACT_SVC
    API --> USER_SVC

    AUTH_SVC --> SUPABASE_AUTH
    AUTH_SVC --> DB
    SERVICE_SVC --> DB
    SERVICE_SVC --> CACHE_SVC
    BRANCH_SVC --> DB
    BRANCH_SVC --> CACHE_SVC
    BOOKING_SVC --> DB
    BOOKING_SVC --> EMAIL_SVC
    BOOKING_SVC --> CACHE_SVC
    REVIEW_SVC --> DB
    REVIEW_SVC --> CACHE_SVC
    BLOG_SVC --> DB
    CONTACT_SVC --> DB
    CONTACT_SVC --> EMAIL_SVC
    USER_SVC --> DB
    STORAGE_SVC --> SUPABASE_STORAGE

    CACHE_SVC --> REDIS
    DB --> SUPABASE_DB

    BRANCHES -.Google Maps API.-> GMAPS
    CONTACT -.Google Maps API.-> GMAPS

    AUTH --> TYPES
    BOOKING --> TYPES
    API --> TYPES
    AUTH_SVC --> TYPES
    SERVICE_SVC --> TYPES
    BOOKING_SVC --> TYPES

    style TYPES fill:#e1f5fe
    style DB fill:#e1f5fe
    style API fill:#c8e6c9
    style APP fill:#fff9c4
```

---


