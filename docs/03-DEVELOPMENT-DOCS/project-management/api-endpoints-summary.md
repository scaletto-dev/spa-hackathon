# API Endpoints Summary & Development Plan

**Project:** Beauty Clinic Care Website  
**Date:** October 28, 2025  
**Team Size:** 3 Developers  
**Timeline:** 6 weeks

---

## Executive Summary

**Total Endpoints:** 62 API endpoints  
**Backend Focus:** Primary deliverable (Weeks 1-3)  
**Frontend Integration:** Secondary deliverable (Weeks 4-5)  
**Testing & Polish:** Final phase (Week 6)

**Technology Stack:**
- Backend: Node.js + Express.js + Prisma + PostgreSQL (Supabase)
- Authentication: Supabase Auth (Email OTP)
- Cache: Redis
- Frontend: React 18 + TypeScript (Pre-built UI)

---

## API Endpoints by Category

### 1. Health & System (1 endpoint)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | Public | Health check endpoint |

---

### 2. Authentication (4 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| POST | `/api/v1/auth/register` | Public | Register new user account | 🔴 Critical |
| POST | `/api/v1/auth/verify-otp` | Public | Verify OTP code | 🔴 Critical |
| POST | `/api/v1/auth/login` | Public | Login (send OTP) | 🔴 Critical |
| POST | `/api/v1/auth/logout` | Member | Logout current session | 🟡 High |

**Business Logic:**
- Supabase Auth integration for email OTP
- JWT token generation and verification
- User record creation in local DB
- Session management

**Database Tables:** `User`

---

### 3. Services (3 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/services` | Public | Get all services with pagination/filtering | 🔴 Critical |
| GET | `/api/v1/services/:slug` | Public | Get service details by slug | 🔴 Critical |
| GET | `/api/v1/services/categories` | Public | Get all service categories | 🟡 High |

**Business Logic:**
- Service listing with category filtering
- Search functionality
- Featured services flag
- Redis caching (15 min TTL)
- Average rating calculation

**Database Tables:** `Service`, `ServiceCategory`, `Review` (for ratings)

---

### 4. Branches (2 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/branches` | Public | Get all branches | 🔴 Critical |
| GET | `/api/v1/branches/:slug` | Public | Get branch details by slug | 🔴 Critical |

**Business Logic:**
- Branch listing with location data
- Operating hours JSON handling
- Services available at branch
- Google Maps coordinates
- Redis caching (15 min TTL)

**Database Tables:** `Branch`, `BranchService` (join table)

---

### 5. Bookings (3 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| POST | `/api/v1/bookings` | Public/Member | Create new booking | 🔴 Critical |
| GET | `/api/v1/bookings/:referenceNumber` | Public | Get booking by reference | 🔴 Critical |
| GET | `/api/v1/bookings/availability` | Public | Check availability for service/branch/date | 🔴 Critical |

**Business Logic:**
- Guest vs Member booking (nullable userId)
- Reference number generation (BCW-YYYY-NNNNNN)
- Availability calculation (operating hours - service duration - existing bookings)
- Concurrent booking prevention (DB unique constraint)
- Email confirmation sending
- Redis caching for availability (5 min TTL)

**Database Tables:** `Booking`, `Service`, `Branch`

---

### 6. Member Profile (3 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/profile` | Member | Get member profile | 🟡 High |
| PUT | `/api/v1/profile` | Member | Update member profile | 🟡 High |
| GET | `/api/v1/profile/bookings` | Member | Get member booking history | 🟡 High |

**Business Logic:**
- Profile CRUD operations
- Booking history with filtering
- Auto-fill data for booking

**Database Tables:** `User`, `Booking`

---

### 7. Blog (3 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/blog/posts` | Public | Get blog posts with pagination | 🟢 Medium |
| GET | `/api/v1/blog/posts/:slug` | Public | Get blog post details | 🟢 Medium |
| GET | `/api/v1/blog/categories` | Public | Get blog categories | 🟢 Medium |

**Business Logic:**
- Published posts filtering
- Language filtering
- Category filtering
- Search functionality
- Related posts calculation

**Database Tables:** `BlogPost`, `BlogCategory`, `User` (author)

---

### 8. Reviews (2 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| POST | `/api/v1/reviews` | Public | Submit service review | 🟡 High |
| GET | `/api/v1/reviews/service/:serviceId` | Public | Get approved reviews for service | 🟡 High |

**Business Logic:**
- Review submission (pending approval)
- Rate limiting (max 3 reviews/day per email)
- Average rating calculation
- Rating distribution (5★ to 1★)
- Admin moderation required

**Database Tables:** `Review`, `Service`

---

### 9. Contact (1 endpoint)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| POST | `/api/v1/contact` | Public | Submit contact form | 🟢 Medium |

**Business Logic:**
- Contact form submission
- Email notification to admin
- Message type categorization

**Database Tables:** `ContactSubmission`

---

### 10. Admin - Dashboard (1 endpoint)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/dashboard` | Admin | Get admin dashboard metrics | 🟡 High |

**Business Logic:**
- Total bookings count
- New member registrations
- Pending reviews count
- Revenue metrics
- Booking status distribution

**Database Tables:** `Booking`, `User`, `Review`

---

### 11. Admin - Bookings (2 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/bookings` | Admin | Get all bookings (admin view) | 🟡 High |
| PUT | `/api/v1/admin/bookings/:id/status` | Admin | Update booking status | 🟡 High |

**Business Logic:**
- Booking management with advanced filtering
- Status updates (confirmed, completed, cancelled, no_show)
- Cancellation reason tracking
- Search by customer name or reference number

**Database Tables:** `Booking`, `Service`, `Branch`, `User`

---

### 12. Admin - Services (4 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/services` | Admin | Get all services (admin view) | 🟡 High |
| POST | `/api/v1/admin/services` | Admin | Create new service | 🟡 High |
| PUT | `/api/v1/admin/services/:id` | Admin | Update service | 🟡 High |
| DELETE | `/api/v1/admin/services/:id` | Admin | Delete service | 🟢 Medium |

**Business Logic:**
- Service CRUD operations
- Image upload to Supabase Storage
- Slug generation
- Cache invalidation on updates
- Category assignment

**Database Tables:** `Service`, `ServiceCategory`

---

### 13. Admin - Branches (4 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/branches` | Admin | Get all branches (admin view) | 🟡 High |
| POST | `/api/v1/admin/branches` | Admin | Create new branch | 🟡 High |
| PUT | `/api/v1/admin/branches/:id` | Admin | Update branch | 🟡 High |
| DELETE | `/api/v1/admin/branches/:id` | Admin | Delete branch | 🟢 Medium |

**Business Logic:**
- Branch CRUD operations
- Operating hours JSON management
- GPS coordinates validation
- Service-branch associations
- Cache invalidation

**Database Tables:** `Branch`, `BranchService`

---

### 14. Admin - Reviews (4 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/reviews` | Admin | Get all reviews for moderation | 🟡 High |
| PUT | `/api/v1/admin/reviews/:id/approve` | Admin | Approve review | 🟡 High |
| PUT | `/api/v1/admin/reviews/:id/reject` | Admin | Reject review | 🟡 High |
| PUT | `/api/v1/admin/reviews/:id/response` | Admin | Add admin response | 🟢 Medium |

**Business Logic:**
- Review moderation workflow
- Approval/rejection
- Admin response to reviews
- Rating recalculation on approval

**Database Tables:** `Review`, `Service`

---

### 15. Admin - Blog (5 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/blog/posts` | Admin | Get all blog posts (admin view) | 🟢 Medium |
| POST | `/api/v1/admin/blog/posts` | Admin | Create blog post | 🟢 Medium |
| PUT | `/api/v1/admin/blog/posts/:id` | Admin | Update blog post | 🟢 Medium |
| DELETE | `/api/v1/admin/blog/posts/:id` | Admin | Delete blog post | 🟢 Medium |
| POST | `/api/v1/admin/upload` | Admin | Upload image to Supabase Storage | 🟢 Medium |

**Business Logic:**
- Blog post CRUD
- Rich text content handling
- Slug generation
- Featured image upload
- Publish/unpublish functionality
- Language-specific posts

**Database Tables:** `BlogPost`, `BlogCategory`, `User`

---

### 16. Admin - Users (3 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/users` | Super Admin | Get all users | 🟢 Medium |
| PUT | `/api/v1/admin/users/:id/role` | Super Admin | Update user role | 🟢 Medium |
| PUT | `/api/v1/admin/users/:id/status` | Super Admin | Suspend/activate user | 🟢 Medium |

**Business Logic:**
- User management
- Role management (member, admin, super_admin)
- Account suspension
- User search and filtering

**Database Tables:** `User`

---

### 17. Admin - Contact (2 endpoints)

| Method | Endpoint | Auth | Description | Priority |
|--------|----------|------|-------------|----------|
| GET | `/api/v1/admin/contact` | Admin | Get contact submissions | 🟢 Medium |
| PUT | `/api/v1/admin/contact/:id/status` | Admin | Update contact submission status | 🟢 Medium |

**Business Logic:**
- Contact submission management
- Status tracking (new, in_progress, resolved)
- Admin notes

**Database Tables:** `ContactSubmission`

---

## Priority Breakdown

### 🔴 Critical (Must Have - Week 1-2)
**18 endpoints** - Core booking and service functionality

- Authentication (4): Register, Verify OTP, Login, Logout
- Services (3): List, Detail, Categories
- Branches (2): List, Detail
- Bookings (3): Create, Lookup, Availability
- Health (1): Health check

### 🟡 High (Should Have - Week 2-3)
**20 endpoints** - Member features and basic admin

- Profile (3): Get, Update, Booking History
- Reviews (2): Submit, Get by Service
- Admin Dashboard (1): Metrics
- Admin Bookings (2): List, Update Status
- Admin Services (4): CRUD
- Admin Branches (4): CRUD
- Admin Reviews (4): Moderation

### 🟢 Medium (Nice to Have - Week 3+)
**24 endpoints** - Content management and advanced admin

- Blog (3): Posts List, Post Detail, Categories
- Contact (1): Submit Form
- Admin Blog (5): CRUD + Upload
- Admin Users (3): User Management
- Admin Contact (2): Contact Management
- Admin Service/Branch delete operations

---

## Team Allocation Strategy (3 Developers)

### 👨‍💻 Developer 1: Backend Core + Authentication (Lead)

**Responsibilities:**
- Project setup and architecture
- Authentication system
- Core API infrastructure
- Database schema design

**Weeks 1-3: Backend Development**
1. **Week 1: Foundation**
   - Monorepo setup (npm workspaces)
   - Express.js server setup
   - Prisma schema design
   - Supabase integration (Auth + DB + Storage)
   - Redis setup
   - Middleware (CORS, helmet, rate limiting, error handling)
   - Authentication endpoints (4) 🔴
   - Health check (1) 🔴

2. **Week 2-3: Member & Admin Auth**
   - Profile endpoints (3) 🟡
   - Admin authentication middleware
   - Role-based access control
   - JWT token refresh logic
   - Session management
   - **Total: 8 endpoints**

**Weeks 4-5: Frontend Integration**
   - AuthContext implementation
   - Supabase Auth SDK integration
   - Login/Register/OTP forms connection
   - Protected routes setup
   - Token management (localStorage, refresh)

**Week 6: Testing & Documentation**
   - Auth flow testing
   - API documentation (Swagger)
   - Security audit

---

### 👨‍💻 Developer 2: Booking System + Services

**Responsibilities:**
- Booking system (critical path)
- Service management
- Availability calculation
- Email notifications

**Weeks 1-3: Backend Development**
1. **Week 1: Services & Branches**
   - Service endpoints (3) 🔴
   - Branch endpoints (2) 🔴
   - Service categories logic
   - Redis caching for services/branches
   - **Total: 5 endpoints**

2. **Week 2: Booking System (Critical)**
   - Booking endpoints (3) 🔴
   - Availability calculation engine
   - Reference number generation
   - Concurrent booking prevention
   - Email service setup (Nodemailer)
   - Booking confirmation emails
   - Redis caching for availability
   - **Total: 3 endpoints**

3. **Week 3: Admin Service/Branch Management**
   - Admin Services CRUD (4) 🟡
   - Admin Branches CRUD (4) 🟡
   - Image upload to Supabase Storage
   - Cache invalidation
   - **Total: 8 endpoints**

**Weeks 4-5: Frontend Integration**
   - Booking wizard state management
   - Availability hooks (useAvailability)
   - Service catalog integration
   - Branch locator integration
   - Google Maps integration
   - Booking confirmation flow

**Week 6: Testing**
   - Booking flow end-to-end testing
   - Availability calculation edge cases
   - Concurrent booking testing
   - Email delivery testing

---

### 👨‍💻 Developer 3: Content & Admin Features

**Responsibilities:**
- Reviews and ratings
- Blog system
- Contact forms
- Admin portal features

**Weeks 1-3: Backend Development**
1. **Week 1: Reviews & Contact**
   - Review endpoints (2) 🟡
   - Contact endpoint (1) 🟢
   - Review rate limiting (Redis)
   - Rating calculation logic
   - Contact email notifications
   - **Total: 3 endpoints**

2. **Week 2: Blog System**
   - Blog endpoints (3) 🟢
   - Admin Blog CRUD (5) 🟢
   - Rich text content handling
   - Slug generation
   - Related posts algorithm
   - **Total: 8 endpoints**

3. **Week 3: Admin Features**
   - Admin Dashboard (1) 🟡
   - Admin Bookings (2) 🟡
   - Admin Reviews (4) 🟡
   - Admin Users (3) 🟢
   - Admin Contact (2) 🟢
   - **Total: 12 endpoints**

**Weeks 4-5: Frontend Integration**
   - Review form integration
   - Blog pages integration
   - Admin portal integration
   - Rich text editor setup
   - Image upload component
   - Admin dashboard charts

**Week 6: Testing**
   - Review moderation flow
   - Blog publishing workflow
   - Admin features testing
   - Content management testing

---

## Development Timeline (6 Weeks)

### Phase 1: Backend Development (Weeks 1-3)

**Week 1: Foundation + Critical APIs**
- Dev 1: Project setup + Auth (9 endpoints) 🔴
- Dev 2: Services + Branches (5 endpoints) 🔴
- Dev 3: Reviews + Contact (3 endpoints) 🟡🟢
- **Total Week 1: 17 endpoints**

**Week 2: Core Features**
- Dev 1: Profile + Admin Auth (3 endpoints) 🟡
- Dev 2: Booking System (3 endpoints) 🔴 + Email service
- Dev 3: Blog System (8 endpoints) 🟢
- **Total Week 2: 14 endpoints**

**Week 3: Admin Features**
- Dev 1: Testing + Documentation
- Dev 2: Admin Services/Branches (8 endpoints) 🟡
- Dev 3: Admin Portal (12 endpoints) 🟡🟢
- **Total Week 3: 20 endpoints**

**Backend Total: 51 endpoints** (some admin endpoints shared)

---

### Phase 2: Frontend Integration (Weeks 4-5)

**Week 4: Core Integration**
- Dev 1: Auth integration (AuthContext, login/register flows)
- Dev 2: Booking integration (wizard, availability, confirmation)
- Dev 3: Admin integration (dashboard, booking management)

**Week 5: Polish Integration**
- Dev 1: i18n setup (4 languages), context providers
- Dev 2: Service/Branch integration, Google Maps
- Dev 3: Reviews, Blog, Admin features

**Deliverables:**
- API service layer (10-12 service files)
- Custom hooks (15+ hooks)
- State management (AuthContext, LanguageContext)
- i18n configuration
- Form validation (Zod schemas)
- Error handling

---

### Phase 3: Testing & Polish (Week 6)

**All Developers:**
- Unit tests (80%+ coverage target)
- Integration tests (API endpoints)
- E2E tests (Playwright - critical flows)
- Performance optimization
- Security audit
- Bug fixes
- Documentation

---

## Database Schema

**10 Core Tables:**
1. `User` - Members and admins
2. `Service` - Beauty services
3. `ServiceCategory` - Service categories
4. `Branch` - Clinic locations
5. `BranchService` - Join table (services available at branches)
6. `Booking` - Appointments
7. `Review` - Service reviews
8. `BlogPost` - Blog articles
9. `BlogCategory` - Blog categories
10. `ContactSubmission` - Contact form submissions

**Prisma Setup:**
- Dev 1 creates initial schema (Week 1)
- All devs contribute to migrations
- Seed scripts for development data

---

## External Services Integration

**Shared Responsibilities:**

1. **Supabase** (Dev 1 leads)
   - Auth setup
   - PostgreSQL database
   - Storage buckets

2. **Redis** (Dev 2 leads)
   - Cache service
   - Rate limiting
   - Session storage

3. **Email Service** (Dev 2 implements)
   - Nodemailer + SMTP
   - Email templates (4 languages)
   - Booking confirmations
   - Contact notifications

4. **Google Maps** (Dev 2 integrates)
   - Frontend integration only
   - Branch location display
   - Directions

---

## Success Metrics

**Backend Deliverables:**
- ✅ 62 API endpoints functional
- ✅ 80%+ test coverage (critical flows)
- ✅ API documentation (Swagger/OpenAPI)
- ✅ <200ms average API response time
- ✅ Supabase Auth integration working
- ✅ Redis caching operational
- ✅ Email notifications sending

**Frontend Integration Deliverables:**
- ✅ All forms connected to APIs
- ✅ State management working
- ✅ i18n configured (4 languages)
- ✅ Protected routes functional
- ✅ Error handling implemented
- ✅ Loading states added

**Quality Metrics:**
- ✅ All functional requirements met (FR1-FR57)
- ✅ Performance targets achieved
- ✅ Security audit passed
- ✅ Zero critical bugs
- ✅ Booking flow tested end-to-end

---

## Risk Mitigation

**Technical Risks:**

1. **Booking Concurrency** (Dev 2)
   - Mitigation: Database unique constraints + optimistic locking
   - Testing: Concurrent booking simulation

2. **Availability Calculation** (Dev 2)
   - Mitigation: Comprehensive edge case testing
   - Cache invalidation strategy

3. **Supabase Auth Integration** (Dev 1)
   - Mitigation: Early POC in Week 1
   - Fallback: Email OTP is simpler than SMS

4. **Team Coordination** (All)
   - Mitigation: Daily standups
   - Shared Prisma schema
   - API contract-first development

**Schedule Risks:**
- Buffer built into Week 6 for overruns
- Medium priority features can be deferred
- Clear prioritization (Critical > High > Medium)

---

## Communication & Coordination

**Daily Standups:** 15 min
- Progress updates
- Blockers discussion
- API contract alignment

**Weekly Reviews:**
- Week 1: Architecture review
- Week 2: API contract review
- Week 3: Backend completion review
- Week 4: Integration progress
- Week 5: Feature completeness
- Week 6: Launch readiness

**Shared Documentation:**
- API documentation (Swagger)
- Prisma schema
- Zod validation schemas
- TypeScript interfaces

**Tools:**
- Git branching: feature branches
- PR reviews: Required before merge
- Testing: CI/CD with GitHub Actions

---

## Conclusion

This 6-week plan with 3 developers focuses on:
1. **Backend-first approach** (Weeks 1-3)
2. **Clear ownership** and minimal dependencies
3. **Parallel development** where possible
4. **Critical path prioritization** (booking system)
5. **Integration phase** after stable backend (Weeks 4-5)
6. **Quality assurance** built into timeline (Week 6)

The team can deliver a fully functional Beauty Clinic Care Website with all 62 API endpoints, complete frontend integration, and comprehensive testing within the 6-week timeline.