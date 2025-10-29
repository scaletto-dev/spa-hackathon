# Beauty Clinic Care Website - Product Requirements Document (PRD)

**Version:** 1.1 (Backend-First Phase)  
**Date:** October 29, 2025  
**Project:** Beauty Clinic Care Website  
**Document Owner:** John (Product Manager)

---

## Goals and Background Context

### Goals

- Enable 24/7 online appointment booking for beauty clinic services through an intuitive, mobile-responsive platform
- Support both guest (frictionless) and member (enhanced) booking workflows to maximize conversion while building loyalty
- Provide comprehensive multilingual experience (Vietnamese, Japanese, English, Chinese) to serve diverse customer base
- Reduce operational overhead by enabling customer self-service for service information and appointment scheduling
- Establish digital foundation for future enhancements (e-commerce, virtual consultations, advanced loyalty programs)
- Deliver modern, image-rich presentation that builds trust and positions clinic as premium service provider
- Achieve 60% online booking rate and 25% guest-to-member conversion within first 6 months

### Background Context

The beauty clinic industry is undergoing rapid digital transformation, with customer expectations increasingly shaped by seamless online booking experiences in hospitality, fitness, and restaurant sectors. Currently, potential customers face significant friction with phone-only booking systems restricted to business hours, lack of detailed service information, and language barriers for international clientele. This results in lost customer acquisition opportunities, excessive staff time handling repetitive inquiries, and competitive disadvantage against clinics offering modern digital experiences.

The Beauty Clinic Care Website addresses these challenges by creating a comprehensive digital platform that serves as the central hub for service discovery, branch information, and appointment booking. The platform's dual-user model uniquely accommodates walk-in booking culture while incentivizing membership through enhanced features. With full multilingual support across four languages and mobile-first design, the platform positions the clinic to capture both domestic and international market segments while building the foundation for future digital services including e-commerce and telemedicine capabilities.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| October 28, 2025 | 1.0 | Initial PRD creation from approved Project Brief | John (PM) |
| October 29, 2025 | 1.1 | **Scope Adjustment:** Changed from "Integration-First" to "Backend-First Approach" - Phase 1 focuses exclusively on API development, no UI work | John (PM) |

---

## Scope Adjustment: Backend-First Approach (API Development Priority)

### Overview

**Critical Context:** The clinic's website will be built in phases. **Phase 1 focuses exclusively on backend API development** to establish a solid foundation. Frontend UI development will follow in subsequent phases once the API layer is complete and tested.

### Current Phase: Backend API Development ONLY

**What We Are Building in Phase 1:**

1. **Backend API Development (EXCLUSIVE FOCUS)**
   - Build complete RESTful API using Node.js + Express
   - Design and implement database schema with PostgreSQL via Supabase and Prisma ORM
   - Implement all business logic for bookings, authentication, content management
   - Configure Supabase Auth for email OTP authentication
   - Implement Redis caching for performance optimization
   - Set up file storage using Supabase Storage for images
   - Create comprehensive API documentation
   - Write unit and integration tests for all endpoints
   - Implement security measures (rate limiting, input validation, authentication)

2. **API Testing & Documentation**
   - Create Postman/Insomnia collection for all endpoints
   - Document request/response schemas for each endpoint
   - Provide example API calls and responses
   - Set up automated API testing suite

### What is NOT in Current Scope

**Phase 1 Exclusions (Deferred to Future Phases):**

- ❌ **No Frontend UI Development** - No React components, pages, or styling
- ❌ **No UI Integration** - No API consumption from frontend
- ❌ **No User Interface Design** - No mockups, wireframes, or visual design
- ❌ **No End-User Testing** - Focus on API testing only (Postman/automated tests)
- ❌ **No Client-Side Code** - No JavaScript/TypeScript for browser execution

### Epic Interpretation for Phase 1

When epics reference "Create UI" or "Implement pages," interpret as:
- **"Build API endpoints to support [Feature/Page]"**
- Focus on:
  - RESTful endpoint design and implementation
  - Database queries and data modeling
  - Business logic and validation rules
  - Response formatting and error handling
  - API documentation
- **Defer all UI work** to Phase 2

### Requirements Scope for Phase 1

- **Functional Requirements (FR):** Implemented as **backend API capabilities**
  - Example: FR8 "Guest users must be able to initiate booking" → Build `POST /api/v1/bookings` endpoint accepting guest data
- **Non-Functional Requirements (NFR):** Apply to **backend services**
  - Performance: API response times, database query optimization
  - Security: Authentication, authorization, input validation, rate limiting
  - Testing: Unit tests, integration tests, API contract tests
- **Technical Requirements:** **Backend-focused only**
  - Database design and migrations
  - API architecture and patterns
  - Testing infrastructure
  - Development environment setup

### Success Criteria for Phase 1

- ✅ All backend APIs functional and tested (80%+ test coverage)
- ✅ Database schema complete with proper relationships and indexes
- ✅ Authentication system working (Supabase Auth integration)
- ✅ All business logic implemented (booking, availability, notifications)
- ✅ API documentation complete with examples
- ✅ Postman collection available for manual testing
- ✅ Performance benchmarks met (API response < 200ms)
- ✅ Security measures in place (rate limiting, validation, encryption)

---

## Requirements

### Functional

**Homepage & Branding**
- **FR1:** The homepage must display a hero banner with compelling brand imagery, value proposition, and prominent "Book Now" call-to-action button
- **FR2:** The homepage must showcase 6-8 featured services in a grid/card layout with images and brief descriptions
- **FR3:** The homepage must include a photo gallery section displaying clinic facilities to demonstrate cleanliness and modernity

**Service Catalog**
- **FR4:** The system must display all services in a grid/card layout with service images, titles, and brief descriptions
- **FR5:** Services must be organized into categories (e.g., facial care, body treatments, aesthetic procedures)
- **FR6:** Each service must have a dedicated detail page containing: full description, duration, pricing, before/after photos (where applicable), and FAQ section
- **FR7:** Service pages must include a "Book This Service" call-to-action button leading to the booking flow

**Booking System - Guest Flow**
- **FR8:** Guest users must be able to initiate booking without creating an account or logging in
- **FR9:** The booking flow for guests must follow this sequence: Service selection → Branch selection → Date/time selection → Contact information entry → Confirmation
- **FR10:** The system must display real-time availability for appointment slots based on selected service and branch
- **FR11:** Guests must provide: full name, phone number, and email address to complete booking
- **FR12:** The system must generate a unique booking reference number for each confirmed appointment

**Booking System - Member Flow**
- **FR13:** Registered members must be able to log in before booking to access enhanced features
- **FR14:** The booking flow for members must follow: Login → Service selection → Branch selection → Date/time selection (with profile auto-fill) → Confirmation
- **FR15:** Member profiles must auto-fill contact information during booking to reduce friction
- **FR16:** The system must save all member bookings to their booking history

**Booking Confirmation**
- **FR17:** Upon successful booking, the system must send confirmation via email containing: booking reference number, service name, branch address, date/time, and contact information
- **FR18:** The confirmation page must display all booking details and provide option to add appointment to calendar

**Member Registration & Authentication**
- **FR19:** The system must provide a registration form requiring: full name, email address, phone number, and password
- **FR20:** New registrations must be verified via OTP (One-Time Password) sent through email before account activation (using Supabase Auth email OTP)
- **FR21:** The system must provide secure login functionality using email and password
- **FR22:** The system must provide password reset functionality via email verification link
- **FR23:** User authentication and password security handled by Supabase Auth (industry-standard security practices)

**Member Dashboard**
- **FR24:** Members must have access to a personalized dashboard displaying: upcoming appointments, booking history, profile information, and special offers/promotions
- **FR25:** Members must be able to view and update their profile information (name, phone, email, password)
- **FR26:** The booking history must display: service name, branch, date/time, booking status, and reference number

**Branch Information**
- **FR27:** The system must display a listing page showing all clinic branches with: name, address, phone number, and thumbnail image
- **FR28:** Each branch must have a dedicated detail page containing: Google Maps integration, operating hours, contact number, facility photos, and list of services available at that location
- **FR29:** Branch detail pages must include a "Book at This Branch" button that pre-selects the branch in the booking flow
- **FR30:** Google Maps integration must display accurate branch location with zoom and navigation capabilities

**Contact Page**
- **FR31:** The system must provide a contact form requiring: name, email, phone, message type (dropdown), and message content
- **FR32:** Contact form submissions must send email notifications to clinic administration
- **FR33:** The contact page must display clinic contact information: primary phone number, email address, and main office address
- **FR34:** The contact page must embed Google Maps showing the flagship/primary clinic location
- **FR35:** Users must receive confirmation message upon successful form submission

**Multilingual Support**
- **FR36:** The system must support four languages: Vietnamese (🇻🇳), Japanese (🇯🇵), English (🇬🇧), and Chinese (🇨🇳)
- **FR37:** The system must provide a visible language switcher with flag icons in the main navigation
- **FR38:** All user-facing content (UI labels, service descriptions, blog content) must be fully translated in all four languages
- **FR39:** The system must auto-detect user's browser language preference on first visit and set appropriate language
- **FR40:** Language preference must persist in cookies/session storage across user sessions
- **FR41:** Email confirmations must be sent in the user's selected language

**Blog/News Section**
- **FR42:** The system must display a blog listing page showing articles in card layout with: title, featured image, excerpt, publish date, and category
- **FR43:** Blog articles must be categorized (e.g., skincare tips, treatment technologies, health & wellness, clinic news)
- **FR44:** Each article must have a dedicated detail page with rich content formatting (headings, images, lists, quotes)
- **FR45:** The blog must include basic search functionality to find articles by title or content keywords
- **FR46:** Blog content must be manageable through an admin interface without requiring code deployment

**Review & Feedback System**
- **FR47:** Customers must be able to submit reviews through a form containing: name, rating (1-5 stars), and written review text
- **FR48:** Reviews must be displayed on relevant service detail pages after admin approval
- **FR49:** The system must provide an admin moderation dashboard to approve/reject reviews and respond to feedback
- **FR50:** Approved reviews must display: reviewer name, star rating, review text, submission date, and optional admin response

**Admin Portal**
- **FR51:** The system must provide role-based admin access with at least two roles: Super Admin and Content Editor
- **FR52:** Admins must be able to manage service catalog: create, update, delete services, upload images, set pricing
- **FR53:** Admins must be able to manage branch information: update operating hours, contact details, facility photos
- **FR54:** Admins must be able to view all bookings with filtering options by: date range, branch, service, status
- **FR55:** Admins must be able to manage blog posts: create, edit, publish, unpublish, categorize articles
- **FR56:** Admins must be able to moderate reviews: approve, reject, respond to customer feedback
- **FR57:** The system must provide a dashboard showing key metrics: total bookings, new member registrations, pending reviews

### Non Functional

**Performance**
- **NFR1:** Mobile page load time must be less than 2 seconds on 4G connection
- **NFR2:** Desktop page load time must be less than 1.5 seconds on broadband connection
- **NFR3:** Time to Interactive (TTI) must be less than 3.5 seconds
- **NFR4:** First Contentful Paint (FCP) must be less than 1.5 seconds
- **NFR5:** API server response time must average less than 200ms
- **NFR6:** Database queries must average less than 100ms response time
- **NFR7:** The system must support 1,000 concurrent users without performance degradation
- **NFR8:** Images must be optimized and lazy-loaded to minimize initial page load
- **NFR9:** Redis caching must be implemented for frequently accessed data (services, branch info)

**Security**
- **NFR10:** All traffic must be encrypted using HTTPS with valid SSL/TLS certificates
- **NFR11:** Sensitive data at rest (passwords, personal information) must be encrypted
- **NFR12:** The system must implement rate limiting on authentication endpoints to prevent brute force attacks
- **NFR13:** Contact forms and review submissions must include CAPTCHA or similar anti-spam protection
- **NFR14:** The system must comply with GDPR/PDPA requirements for personal data handling
- **NFR15:** JWT tokens must expire after 24 hours and support refresh token mechanism
- **NFR16:** Email OTP codes must expire after 10 minutes and be single-use only (managed by Supabase Auth)
- **NFR17:** The system must log all security-relevant events (failed logins, password resets, admin actions)
- **NFR18:** A security audit must be conducted before production launch with no critical vulnerabilities

**Reliability & Availability**
- **NFR19:** The system must maintain 99.5% uptime during business hours (6 AM - 11 PM local time)
- **NFR20:** Automated daily backups of database must be performed with 30-day retention
- **NFR21:** Database backups must support 99.9% data recovery guarantee
- **NFR22:** The system must implement graceful error handling with user-friendly error messages
- **NFR23:** Email delivery failures must trigger retry logic (3 attempts with exponential backoff)

**Compatibility & Responsiveness**
- **NFR24:** The system must function correctly on Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+ (latest 2 versions of each)
- **NFR25:** The system must support iOS 13+ and Android 9+ mobile operating systems
- **NFR26:** The system must pass Google Mobile-Friendly Test with no critical issues
- **NFR27:** The UI must be fully responsive with breakpoints for mobile (<768px), tablet (768-1024px), and desktop (>1024px)
- **NFR28:** Touch interactions must be optimized for mobile devices with appropriate tap target sizes (minimum 44x44px)
- **NFR29:** Mobile navigation must use hamburger menu pattern with smooth transitions

**Accessibility**
- **NFR30:** The system should aim for WCAG 2.1 Level AA compliance where feasible for MVP
- **NFR31:** All images must have appropriate alt text for screen readers
- **NFR32:** Color contrast ratios must meet accessibility guidelines for text readability
- **NFR33:** Form inputs must have associated labels and error messages must be screen-reader accessible

**Testing**
- **NFR34:** Unit test coverage must achieve minimum 80% for critical booking and authentication flows using Jest
- **NFR35:** Integration tests must verify end-to-end booking flows for both guest and member paths
- **NFR36:** All API endpoints must have automated API tests verifying request/response contracts
- **NFR37:** Manual testing must validate multilingual content accuracy with native speakers

**Scalability & Maintainability**
- **NFR38:** Code must follow consistent style guidelines enforced by linters (ESLint for JavaScript/TypeScript)
- **NFR39:** The system must use Prisma ORM for type-safe database operations with migration support
- **NFR40:** API must follow RESTful conventions with consistent resource naming and HTTP methods
- **NFR41:** Frontend components must be modular and reusable following React best practices
- **NFR42:** The codebase must use feature-based folder structure for improved maintainability
- **NFR43:** Environment-specific configuration must be managed through environment variables (not hardcoded)

**Monitoring & Analytics**
- **NFR44:** Google Analytics must be integrated to track: page views, booking funnel conversion, bounce rates
- **NFR45:** Sentry or similar error tracking must be integrated to capture and report client and server errors
- **NFR46:** The system must log booking events (initiated, completed, failed) for business analytics

---

## User Interface Design Goals

### Overall UX Vision

The Beauty Clinic Care Website aims to deliver a premium, spa-like digital experience that mirrors the quality and professionalism of the clinic's physical environment. The interface should feel calm, clean, and confidence-inspiring, using generous white space, high-quality imagery, and subtle animations to create a sense of luxury and trust. 

The user journey prioritizes **effortless booking conversion** through a progressive disclosure approach—showing users only what they need at each step while maintaining clear progress indicators. For guests, the path from discovery to confirmed appointment should feel frictionless (under 5 minutes). For members, the experience becomes increasingly personalized with each visit, using familiar patterns that reduce cognitive load.

The multilingual experience must feel native in each language, not merely translated. Text length variations across languages (e.g., Vietnamese vs. Chinese) should be accommodated through flexible layouts that maintain visual harmony regardless of content length.

### Key Interaction Paradigms

**Mobile-First Touch Interactions:**
- Large, tappable targets (minimum 44x44px) with adequate spacing to prevent accidental taps
- Swipe gestures for image galleries and service browsing (using Swiper library)
- Pull-to-refresh pattern for member dashboard and booking history
- Bottom sheet modals for date/time picker and language selection on mobile
- Sticky "Book Now" floating action button that follows scroll on mobile

**Progressive Booking Flow:**
- Multi-step wizard with clear progress indicators (e.g., "Step 2 of 4")
- Persistent back navigation without losing entered data
- Real-time validation with inline error messages
- Pre-filled selections when user arrives from specific service or branch pages
- Summary card showing all selections before final confirmation

**Visual Feedback & Micro-interactions:**
- Skeleton loading states for content being fetched
- Smooth transitions between pages (300ms ease-in-out)
- Success animations (checkmarks, confetti) on booking confirmation
- Hover states on desktop with subtle scale/shadow effects
- Loading spinners with branded colors during API calls

**Trust-Building Elements:**
- Prominent display of facility photos and before/after imagery
- Star ratings and review counts visible on service cards
- Real-time availability indicators (e.g., "3 slots available today")
- Security badges near forms (SSL, data protection)
- Social proof (e.g., "500+ happy customers this month")

### Core Screens and Views

**Public-Facing Screens:**
1. **Homepage** - Hero section with CTA, featured services grid, facility gallery, testimonials, quick stats
2. **Services Listing** - Filterable/sortable grid of service cards with category navigation
3. **Service Detail** - Full service description, pricing, duration, before/after gallery, FAQ accordion, reviews section, prominent "Book Now" CTA
4. **Booking Wizard (4 steps)** - Service selection, Branch selection, Date/Time picker, Contact info/confirmation
5. **Branch Listing** - Grid/list view of all locations with map toggle
6. **Branch Detail** - Hero image, operating hours, services offered, facility photos, embedded map, staff profiles (if available)
7. **Blog Listing** - Card grid with category filters and search
8. **Blog Article Detail** - Rich content with table of contents for long articles
9. **Contact Page** - Split layout with form on left, contact info and map on right
10. **Login/Register** - Minimal, centered forms with social proof sidebar
11. **Password Reset** - Simple email entry with confirmation feedback

**Member-Only Screens:**
12. **Member Dashboard** - Card-based layout showing upcoming appointments, quick book widget, special offers, loyalty status
13. **Booking History** - Tabular view with filtering (upcoming, past, cancelled)
14. **Profile Settings** - Tabbed interface for personal info, password, preferences, notifications

**Admin Screens:**
15. **Admin Dashboard** - Metrics overview with charts (bookings, members, revenue trends)
16. **Bookings Management** - Calendar view + table view with filters
17. **Services Management** - CRUD interface with image upload and rich text editor
18. **Branch Management** - Form-based editor with map integration
19. **Blog Management** - Post list with publish status, editor with preview
20. **Review Moderation** - Queue of pending reviews with approve/reject actions
21. **Admin Settings** - User roles, system configuration

### Accessibility: WCAG 2.1 Level AA (Target)

While MVP timeline may limit full WCAG AAA compliance, we commit to WCAG 2.1 Level AA standards including:
- Minimum 4.5:1 color contrast ratio for normal text, 3:1 for large text
- All interactive elements keyboard accessible with visible focus indicators
- Alt text for all meaningful images, decorative images marked as such
- Form labels properly associated with inputs
- Error messages clearly linked to form fields
- Skip navigation links for keyboard users
- No reliance on color alone to convey information
- Captions for any video content
- Semantic HTML structure with proper heading hierarchy
- ARIA labels where native HTML semantics insufficient

**Note:** Full accessibility audit recommended post-MVP to identify gaps and prioritize improvements.

### Branding

**Current Brand Assets:** *(To be confirmed with stakeholder)*
- Logo and favicon (high-resolution versions for retina displays)
- Brand color palette (primary, secondary, accent colors)
- Typography guidelines (font families, weights, sizes)
- Brand voice and tone guidelines for content

**Assumed Brand Direction (based on premium positioning):**
- **Color Palette:** Calming, spa-like tones (soft pastels, whites, light grays) with accent color for CTAs (possibly rose gold, soft teal, or sage green)
- **Typography:** Modern sans-serif for UI (clean readability), serif optional for headings (elegance)
- **Imagery Style:** Professional photography with natural lighting, authentic (not overly retouched), diverse representation
- **Iconography:** Minimalist line icons (consistent stroke width)
- **Motion:** Subtle, elegant animations (avoid jarring or playful)

**If brand guidelines don't exist:** Design system will be created during UX phase establishing:
- Color tokens (8-10 shades per primary/secondary/neutral)
- Typography scale (8 sizes from xs to 3xl)
- Spacing system (4px base unit)
- Component patterns (buttons, cards, forms)
- shadcn/ui will be customized with brand tokens

### Target Device and Platforms: Web Responsive (Mobile-First)

**Primary Target:** Mobile devices (60-70% of traffic expected)
- **Mobile:** 360px - 767px (primary design focus)
- **Tablet:** 768px - 1024px (comfortable single-hand use)
- **Desktop:** 1025px+ (optimal use of screen real estate)

**Responsive Strategy:**
- Mobile: Single column, stacked layouts, hamburger navigation, bottom CTAs
- Tablet: Two-column layouts where appropriate, sidebar navigation option
- Desktop: Multi-column grids (2-4 columns), persistent navigation, hover states

**Browser Support:**
- Chrome 90+ (most common in target markets)
- Safari 14+ (critical for iOS users)
- Firefox 88+
- Edge 90+

**No support for:**
- Internet Explorer (discontinued)
- Browsers older than specified versions above

**Future Consideration (Post-MVP):**
- Progressive Web App (PWA) capabilities for "Add to Home Screen"
- Native iOS/Android apps if user demand justifies investment

---

## Technical Assumptions

### Repository Structure: Monorepo

**Decision:** Use a **monorepo** structure to house frontend, backend, and shared code in a single repository.

**Rationale:**
- **Simplified Dependency Management:** Shared types, utilities, and i18n translations used by both frontend and backend can be managed in a single location
- **Atomic Changes:** Changes spanning frontend and backend (e.g., API contract updates) can be made in a single commit/PR
- **Easier Development:** Developers can work across full stack without switching repositories
- **Future Scalability:** Supports future addition of admin dashboard as separate app or worker services
- **Tooling:** Turborepo or Nx optional for efficient build caching

**Structure:**
```
app/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Basic UI elements (Button, Input, etc.)
│   │   │   ├── features/        # Business logic components
│   │   │   └── common/          # Shared layout components
│   │   ├── pages/               # Route-level components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API integration layer
│   │   ├── utils/               # Helper functions and utilities
│   │   ├── types/               # TypeScript type definitions
│   │   └── styles/              # Global styles and Tailwind config
│   └── public/                  # Static assets
├── backend/                     # Node.js + Express backend API
│   ├── src/
│   │   ├── controllers/         # Request/response handling
│   │   ├── middleware/          # Request processing middleware
│   │   ├── models/              # Database models and schemas
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic layer
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── types/               # TypeScript type definitions
│   └── logs/                    # Application logs (production)
└── package.json                 # Root package.json with workspace scripts
```

### Service Architecture

**Decision:** **Modular Monolith** for local deployment with clear domain boundaries.

**Rationale:**
- **MVP Speed:** Monolithic architecture allows faster development
- **Local Deployment:** Simple to run and debug locally without complex orchestration
- **Supabase Integration:** Leverages Supabase for authentication and database

**Backend Service Domains:**
1. **Auth Service** - User registration, login, email OTP verification (leverages Supabase Auth with email magic links/OTP)
2. **Booking Service** - Availability checking, appointment creation, booking management
3. **User Service** - Profile management, member dashboard, booking history
4. **Content Service** - Services, branches, blog posts management
5. **Notification Service** - Email sending with retry logic (via Supabase or email service)
6. **Review Service** - Review submission, moderation, approval workflow
7. **Admin Service** - Admin authentication, content management, booking oversight

**API Design:**
- RESTful architecture with resource-based URLs
- Consistent naming: `/api/v1/{resource}` (e.g., `/api/v1/bookings`, `/api/v1/services`)
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Supabase Auth tokens in Authorization header for protected routes
- Standardized error responses with consistent structure

**Database Architecture:**
- **PostgreSQL via Supabase:** Cloud-hosted managed database (free tier), accessed from local environment
- **Redis:** Local Redis instance for caching (or Redis Cloud free tier if preferred)
- **Supabase Auth:** Email OTP authentication (no SMS/phone required for MVP)
- **Supabase Storage:** File storage for images (service photos, blog images, facility photos)

### Testing Requirements

**Decision:** **Comprehensive testing pyramid** with emphasis on unit and integration tests covering critical flows.

**Testing Strategy:**
- **Unit Tests (Jest):** 80%+ coverage target for business logic
  - Booking availability logic
  - Authentication and authorization
  - Data validation functions
  - Utility functions
  - React components (using React Testing Library)
  
- **Integration Tests:** End-to-end API testing
  - Complete booking flows (guest and member paths)
  - Authentication flows (register, login, email OTP verification, password reset)
  - Review submission and moderation workflow
  - Multilingual content delivery
  
- **API Contract Tests:** Validate request/response schemas
  - Use Supertest for HTTP assertions
  - Verify all endpoints match API specifications
  
- **Manual Testing:** Required for:
  - Multilingual content accuracy (native speakers for each language)
  - UI/UX validation across devices
  - Accessibility compliance (WCAG AA checklist)
  - Cross-browser compatibility
  - Third-party integrations (Google Maps, Supabase Auth)

**Testing Tools:**
- **Jest:** Unit testing framework for both frontend and backend
- **React Testing Library:** Component testing with user-centric queries
- **Supertest:** HTTP assertions for API testing
- **Prisma Test Environment:** Isolated database for integration tests

### Additional Technical Assumptions and Requests

**Frontend Stack:**
- **React.js 18+:** Modern component architecture with hooks
- **Tailwind CSS 3+:** Utility-first styling for rapid UI development
- **shadcn/ui:** Accessible component library built on Radix UI primitives
- **Swiper:** Touch slider for image galleries and service browsing
- **i18next:** Internationalization framework supporting 4 languages
- **React Hook Form + Zod:** Form handling with TypeScript-first validation
- **React Router v6:** Client-side routing with nested routes and lazy loading
- **Axios:** HTTP client for API communication
- **Date-fns:** Date manipulation library for booking calendar

**Backend Stack:**
- **Node.js 18 LTS:** Long-term support version for stability
- **Express.js 4+:** Minimal, flexible web framework for RESTful APIs
- **Prisma ORM:** Type-safe database client with migrations, seeding
- **Supabase Auth SDK:** Authentication via Supabase with email OTP verification
- **Express-validator:** Request validation middleware
- **Winston or console.log:** Logging

**Database & Infrastructure:**
- **PostgreSQL 14+ via Supabase:** Cloud-hosted managed database (free tier), accessed from local environment
- **Redis:** Local Redis instance for caching
- **Supabase Auth:** Email OTP authentication (no SMS required)
- **Supabase Storage:** File storage for images

**Third-Party Integrations:**
- **Google Maps JavaScript API:** Branch location display and directions
- **Supabase Auth:** Built-in authentication with Email OTP verification
- **Email Service:** Supabase built-in email service for OTP and booking confirmations
- **VNPay:** Vietnamese payment gateway (Phase 2 - not MVP)

**Deployment & Hosting:**
- **Deployment Target:** Local development and deployment (no cloud hosting for MVP)
- **Frontend:** Local development server (Vite dev server); production build served locally
- **Backend:** Local Node.js/Express server running on localhost (e.g., http://localhost:3000)
- **Database:** Supabase cloud-hosted PostgreSQL accessed from local environment
- **Redis:** Local Redis instance (or Redis Cloud free tier)
- **Environment Management:** Local .env files for development configuration
- **Secrets Management:** Environment variables in .env files (excluded from git)

**Development Tools:**
- **TypeScript:** Strongly typed JavaScript for both frontend and backend
- **ESLint + Prettier:** Code quality and formatting consistency
- **Husky + lint-staged:** Pre-commit hooks for linting (optional)
- **Git:** Version control with GitHub, GitLab, or Bitbucket

**Build & Bundling:**
- **Vite:** Fast build tool for React frontend (dev server and production builds)
- **Code Splitting:** Lazy load routes and heavy components
- **Asset Optimization:** Image compression, lazy loading

**Security Measures:**
- **Helmet.js:** Security headers for Express
- **CORS Configuration:** Configure allowed origins
- **Rate Limiting:** express-rate-limit for API endpoints
- **Input Sanitization:** Prevent XSS and SQL injection
- **Environment Variables:** Never commit secrets, use .env files (excluded from git)
- **Supabase Auth Security:** Built-in protection for authentication flows

**Documentation Requirements:**
- **API Documentation:** Document all endpoints (Swagger/OpenAPI optional)
- **README.md:** Setup instructions, environment variables, development workflow
- **Database Schema:** ER diagram from Prisma schema
- **Setup Guide:** Step-by-step local setup instructions

---

## Epic List

### Epic 1: Foundation & Core Infrastructure
**Goal:** Establish project foundation with monorepo setup, database schema, authentication system, and basic content display. Deliver a deployable application with homepage showing services.

### Epic 2: Service Discovery & Information
**Goal:** Enable customers to browse services, view details, and explore branches with rich content. Deliver complete information architecture for decision-making.

### Epic 3: Guest Booking Flow
**Goal:** Implement end-to-end booking functionality for guest users from service selection through confirmation with email notifications.

### Epic 4: Member Experience & Authentication
**Goal:** Build member registration, login, dashboard, and enhanced booking flow with profile management and booking history.

### Epic 5: Content Management & Reviews
**Goal:** Provide blog/news section for SEO and thought leadership plus customer review system with admin moderation.

### Epic 6: Admin Portal & Management
**Goal:** Build administrative interface for managing services, branches, bookings, blog posts, and reviews with role-based access.

### Epic 7: Multilingual Support & Polish
**Goal:** Implement complete 4-language support (Vietnamese, Japanese, English, Chinese) and final UX polish for production readiness.

---

## Epic 1: Foundation & Core Infrastructure

**Expanded Goal:** Establish the complete **backend technical foundation** for the Beauty Clinic Care Website by setting up the project structure with backend API (Node.js + Express + Prisma), integrating Supabase for database and authentication, implementing database schema, creating core API endpoints, and providing seed data. This epic proves the backend architecture works end-to-end from database to API, provides the foundation for all future API development, and delivers testable API endpoints for services data.

**Phase 1 Focus:** Backend API ONLY - No frontend UI work in this epic.

### Story 1.1: Initialize Monorepo with Backend API Structure

As a developer,
I want to set up a monorepo structure with backend application and project configuration,
so that I can develop the API systematically with proper organization.

#### Acceptance Criteria
1. Repository created with monorepo structure using standard folder layout (apps/backend, apps/frontend as placeholder)
2. Backend app initialized in `apps/backend/` with Node.js + Express + TypeScript
3. Frontend placeholder folder created in `apps/frontend/` (minimal setup, not implemented in Phase 1)
4. Package.json scripts configured for running backend (`npm run dev:backend` or `npm run dev`)
5. TypeScript configured for backend with strict mode enabled
6. ESLint and Prettier configured for backend code
7. .gitignore configured to exclude node_modules, .env, dist, build directories, logs
8. README.md created with project overview, backend setup instructions, and API documentation structure
9. Backend app can start successfully on port 3000
10. Environment variables template (.env.example) created for backend configuration

### Story 1.2: Design and Implement Database Schema with Prisma

As a backend developer,
I want to design the complete database schema and set up Prisma ORM,
so that all data models are defined and migrations can be managed systematically.

#### Acceptance Criteria
1. Prisma installed and initialized with PostgreSQL provider
2. Schema file (`prisma/schema.prisma`) defines all models: User, Service, ServiceCategory, Branch, Booking, BlogPost, BlogCategory, Review
3. User model includes: id, email, phone, fullName, password (optional), role (member/admin), emailVerified, createdAt, updatedAt
4. Service model includes: id, name, description, duration, price, categoryId, images (array), featured (boolean), createdAt, updatedAt
5. Branch model includes: id, name, address, phone, operatingHours (JSON), latitude, longitude, images (array), createdAt, updatedAt
6. Booking model includes: id, userId (nullable for guests), serviceId, branchId, appointmentDate, appointmentTime, status, guestName, guestEmail, guestPhone, referenceNumber, createdAt, updatedAt
7. Proper relationships defined with foreign keys (e.g., Service belongsTo ServiceCategory, Booking belongsTo Service and Branch)
8. Indexes added for frequently queried fields (email, referenceNumber, appointmentDate)
9. Initial migration created successfully with `prisma migrate dev`
10. Prisma Client generated and importable in backend code

### Story 1.4: Integrate Supabase for Database and Authentication

As a backend developer,
I want to connect the application to Supabase for managed PostgreSQL and authentication services,
so that I can leverage cloud infrastructure without managing servers.

#### Acceptance Criteria
1. Supabase project created with free tier account
2. Environment variables configured in `.env`: SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL
3. Prisma successfully connects to Supabase PostgreSQL instance
4. Supabase Auth configured with email OTP enabled (magic link or code)
5. Supabase Auth email templates customized with clinic branding (optional for MVP)
6. Supabase Storage bucket created for images with public read access
7. Test script created to verify database connection and run basic query
8. Supabase Auth SDK (@supabase/supabase-js) installed in backend
9. Helper functions created for Supabase Auth operations (signup, login, verify OTP)
10. Documentation updated with Supabase setup instructions and environment variables

### Story 1.5: Build Express API Foundation with Core Endpoints

As a backend developer,
I want to create the Express server with routing, middleware, and initial API endpoints,
so that the frontend can communicate with the backend securely.

#### Acceptance Criteria
1. Express server configured with TypeScript in `apps/api/src/server.ts`
2. Middleware installed and configured: cors, helmet, express.json(), express-validator
3. API routing structure created: `/api/v1/services`, `/api/v1/branches`, `/api/v1/auth`, `/api/v1/bookings`
4. Health check endpoint created: `GET /api/health` returns { status: "ok", timestamp }
5. Error handling middleware created returning consistent error format: { error, message, statusCode }
6. CORS configured to allow frontend origin (localhost:5173 for development)
7. Rate limiting configured on auth endpoints (max 5 requests per minute per IP)
8. Request logging middleware added (Winston or console.log with timestamps)
9. API endpoints return proper HTTP status codes (200, 201, 400, 401, 404, 500)
10. Server starts successfully on PORT 3000 (configurable via environment variable)

### Story 1.6: Implement Services API Endpoints

As a backend developer,
I want to create RESTful API endpoints for services data,
so that the frontend can fetch and display services information.

#### Acceptance Criteria
1. `GET /api/v1/services` endpoint created returning all services with category information
2. `GET /api/v1/services/:id` endpoint created returning single service details
3. `GET /api/v1/services/featured` endpoint created returning only featured services (for homepage)
4. `GET /api/v1/services/categories` endpoint created returning all service categories
5. Services endpoint includes pagination support (query params: page, limit) with default limit=20
6. Services endpoint includes filtering by category (query param: categoryId)
7. Response includes proper data structure: { data: [...], meta: { total, page, limit } }
8. Prisma queries optimized with proper includes (include category relationship)
9. Error handling for invalid IDs (404) and database errors (500)
10. API endpoints tested with manual requests returning expected data

### Story 1.7: Create Database Seed Script with Initial Data

As a developer,
I want to populate the database with initial seed data for services and branches,
so that the application has content to display during development and testing.

#### Acceptance Criteria
1. Seed script created in `prisma/seed.ts` using Prisma Client
2. Script creates at least 3 service categories (e.g., "Facial Care", "Body Treatments", "Aesthetic Procedures")
3. Script creates at least 8 services with varied pricing, durations, and categories
4. At least 4 services marked as "featured" for homepage display
5. Script creates at least 2 branch locations with complete address and operating hours
6. Script includes placeholder image URLs for services and branches
7. Script is idempotent (can be run multiple times without duplicating data)
8. `prisma db seed` command configured in package.json
9. Seed script runs successfully and populates database with all data
10. Verification query confirms data exists and relationships are correct

### Story 1.8: Create API Testing Collection and Documentation

As a backend developer,
I want to create comprehensive API testing collection and documentation,
so that all endpoints can be tested manually and the API contract is clearly documented.

#### Acceptance Criteria
1. Postman or Insomnia collection created with all implemented endpoints (health check, services, branches)
2. Each endpoint includes example requests with proper headers, query parameters, and body data
3. Each endpoint includes example successful responses with actual data structure
4. Collection includes environment variables for base URL configuration (localhost:3000)
4. API documentation created in `docs/api/` folder with endpoint specifications
5. Documentation includes: HTTP method, endpoint path, request parameters, request body schema, response schema, error codes
6. Documentation uses clear formatting (Markdown tables or OpenAPI/Swagger format)
7. All endpoints tested manually via Postman/Insomnia and verified to return correct data
8. README.md updated with instructions on importing and using the API collection
9. Collection exported and committed to repository (e.g., `postman_collection.json`)
10. Verification checklist: All API endpoints (GET /health, GET /services, GET /services/:id, GET /services/featured, GET /branches, GET /branches/:id) return expected responses

---

## Epic 2: Service Discovery & Information

**Expanded Goal:** Build comprehensive **backend API endpoints** to support service catalog and clinic location information. Deliver RESTful APIs for services listing with category filtering, service details, branch listing, branch details, and contact form submissions. This epic provides all backend capabilities needed for customers to discover services and locations through future frontend interfaces.

**Phase 1 Focus:** Backend API ONLY - API endpoints, business logic, database queries, validation.

### Story 2.1: Enhance Services API with Advanced Filtering and Search

As a backend developer,
I want to extend the services API with filtering, searching, and sorting capabilities,
so that future frontend clients can provide rich service discovery features.

#### Acceptance Criteria
1. `GET /api/v1/services` endpoint supports query parameter `categoryId` for category filtering
2. Endpoint supports query parameter `q` for text search (searches in name and description fields)
3. Endpoint supports query parameter `featured=true` to filter only featured services
4. Endpoint supports query parameter `sort` with values: name, price-asc, price-desc, duration
5. Endpoint supports pagination with `page` and `limit` query parameters (default limit=20, max limit=100)
6. Response includes metadata: `{ data: [...], meta: { total, page, limit, totalPages } }`
7. Search is case-insensitive and uses SQL LIKE or full-text search
8. Multiple filters can be combined (e.g., `?categoryId=1&featured=true&q=facial`)
9. Invalid query parameters return 400 error with clear error messages
10. API documentation updated with all query parameters and examples

### Story 2.2: Implement Service Categories API Endpoints

As a backend developer,
I want to create API endpoints for service categories management,
so that services can be organized and filtered by category.

#### Acceptance Criteria
1. `GET /api/v1/categories` endpoint created returning all service categories
2. `GET /api/v1/categories/:id` endpoint created returning single category with its services
3. Category response includes: id, name, description, slug, serviceCount (number of services in category)
4. `GET /api/v1/categories/:id/services` endpoint returns all services in a specific category
5. Categories endpoint supports optional query param `includeServices=true` to embed service data
6. Categories ordered alphabetically by name by default
7. Response follows consistent API structure: { data: {...} } or { data: [...] }
8. Proper error handling for invalid category IDs (404)
9. API endpoints tested with Postman/Insomnia
10. API documentation updated with category endpoints

### Story 2.3: Implement Branches API with Location Data

As a backend developer,
I want to create comprehensive API endpoints for branch/location management,
so that clinic locations can be discovered and filtered.

#### Acceptance Criteria
1. `GET /api/v1/branches` endpoint created returning all branches with complete location data
2. `GET /api/v1/branches/:id` endpoint created returning single branch details
3. Branch response includes: id, name, address, phone, operatingHours (JSON), latitude, longitude, images (array), createdAt, updatedAt
4. `GET /api/v1/branches/:id/services` endpoint returns all services available at specific branch
5. Branches endpoint supports query param `includeServices=true` to embed service data
6. Optional: Endpoint supports geolocation filtering with `lat`, `lng`, and `radius` parameters (can defer to later)
7. Branches ordered by name alphabetically by default
8. Proper error handling for invalid branch IDs (404) and database errors (500)
9. Response follows consistent API structure
10. API documentation updated with branch endpoints and examples

### Story 2.4: Create Contact Form Submission API

As a backend developer,
I want to create an API endpoint for contact form submissions,
so that customer inquiries can be captured and processed.

#### Acceptance Criteria
1. ContactSubmission model added to Prisma schema with fields: id, name, email, phone, messageType, message, status, createdAt
2. `POST /api/v1/contact` endpoint created accepting: name, email, phone, messageType, message
3. Request validation ensures all required fields are present and properly formatted (email format, max lengths)
4. messageType must be one of: general_inquiry, service_question, booking_assistance, feedback, other
5. Contact submissions saved to database with status "pending"
6. Rate limiting applied: max 3 submissions per hour per IP address
7. Input sanitization to prevent XSS attacks (strip HTML tags, sanitize special characters)
8. Response returns success message: `{ success: true, message: "Thank you for contacting us. We'll respond within 24 hours." }`
9. Error handling for validation errors (400), rate limit exceeded (429), server errors (500)
10. API endpoint tested with various valid and invalid inputs

### Story 2.5: Implement Email Notification for Contact Forms

As a backend developer,
I want to send email notifications when contact forms are submitted,
so that staff can respond to customer inquiries promptly.

#### Acceptance Criteria
1. Email service integrated (Supabase email or external provider like Resend/SendGrid)
2. Email template created for contact form notifications with all submission details
3. Email sent to configured admin email address (from environment variable) after successful submission
4. Email includes: submitter name, email, phone, message type, message content, submission timestamp
5. Email sending is asynchronous (doesn't block API response)
6. Failed email sends are logged but don't cause contact submission to fail
7. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
8. Environment variable `CONTACT_NOTIFICATION_EMAIL` configured for recipient address
9. Email "from" address and "reply-to" configured properly
10. Test email sent successfully with all data populated correctly

### Story 2.6: Add Image Upload API for Services and Branches

As a backend developer,
I want to create API endpoints for uploading images to Supabase Storage,
so that service and branch images can be managed.

#### Acceptance Criteria
1. Supabase Storage bucket created for images with public read access (bucket name: "images" or "uploads")
2. `POST /api/v1/upload/image` endpoint created accepting multipart/form-data file upload
3. Endpoint validates file type (only JPEG, PNG, WebP allowed) and file size (max 5MB)
4. Images uploaded to Supabase Storage with unique filenames (e.g., UUID + original extension)
5. Endpoint returns uploaded image URL: `{ success: true, url: "https://..." }`
6. Optional: Image resizing/optimization before upload (can defer to later)
7. Error handling for invalid file types (400), file too large (413), upload failures (500)
8. Rate limiting applied: max 10 uploads per hour per IP
9. Uploaded image URLs can be used in service and branch data (stored in database)
10. API endpoint tested with various image files and edge cases

### Story 2.7: Implement Admin API for Managing Services (CRUD)

As a backend developer,
I want to create admin API endpoints for managing services (Create, Update, Delete),
so that service catalog can be maintained through the API.

#### Acceptance Criteria
1. `POST /api/v1/admin/services` endpoint created for creating new services
2. `PUT /api/v1/admin/services/:id` endpoint created for updating existing services
3. `DELETE /api/v1/admin/services/:id` endpoint created for deleting services (soft delete or hard delete)
4. All admin endpoints require authentication (check for valid Supabase Auth token in Authorization header)
5. Admin endpoints require admin role verification (user.role === 'admin')
6. Request validation for service data: required fields, data types, price > 0, duration > 0
7. Create/Update endpoints accept: name, description, categoryId, price, duration, images (array), featured (boolean)
8. Proper error responses: 401 Unauthorized, 403 Forbidden, 400 Bad Request, 404 Not Found, 500 Server Error
9. Database constraints enforced (foreign key for categoryId, unique constraints if any)
10. API endpoints tested with Postman including authentication scenarios

### Story 2.8: Implement Admin API for Managing Branches (CRUD)

As a backend developer,
I want to create admin API endpoints for managing branches (Create, Update, Delete),
so that branch information can be maintained through the API.

#### Acceptance Criteria
1. `POST /api/v1/admin/branches` endpoint created for creating new branches
2. `PUT /api/v1/admin/branches/:id` endpoint created for updating existing branches
3. `DELETE /api/v1/admin/branches/:id` endpoint created for deleting branches (soft delete recommended)
4. All admin endpoints require authentication and admin role verification
5. Create/Update endpoints accept: name, address, phone, operatingHours (JSON), latitude, longitude, images (array)
6. Operating hours validation: ensure proper JSON structure with days and time ranges
7. Geolocation validation: latitude between -90 and 90, longitude between -180 and 180
8. Proper error responses for all failure scenarios
9. Database constraints enforced
10. API endpoints tested with authentication and various input scenarios

### Story 2.9: Create Service Search with Redis Caching

As a backend developer,
I want to implement Redis caching for frequently accessed service and category data,
so that API performance improves and database load is reduced.

#### Acceptance Criteria
1. Redis client library installed and configured (ioredis or node-redis)
2. Redis connection established from backend application (local Redis instance or cloud service)
3. Cache middleware created for services endpoints: `GET /api/v1/services`, `GET /api/v1/categories`
4. Cache key strategy: `services:all`, `services:category:{id}`, `services:featured`, `categories:all`
5. Cache TTL (Time To Live) set appropriately: 5 minutes for services, 10 minutes for categories
6. Cache invalidation logic: when service/category is created, updated, or deleted, relevant cache keys are cleared
7. Cache miss scenario: if data not in cache, fetch from database and store in cache
8. Environment variable for Redis connection string: `REDIS_URL`
9. Graceful fallback: if Redis is unavailable, API still works (queries database directly)
10. Performance improvement measured: cached responses return in <50ms vs uncached ~100-200ms

### Story 2.10: Add API Versioning and Rate Limiting

As a backend developer,
I want to implement proper API versioning and rate limiting across all endpoints,
so that the API is stable, scalable, and protected from abuse.

#### Acceptance Criteria
1. All API routes use `/api/v1/` prefix for version 1
2. Rate limiting middleware implemented using `express-rate-limit` library
3. General rate limit: 100 requests per 15 minutes per IP for public endpoints
4. Auth rate limit: 5 requests per minute per IP for login/register endpoints
5. Contact form rate limit: 3 submissions per hour per IP
6. Rate limit responses include `X-RateLimit-*` headers: Limit, Remaining, Reset
7. Rate limit exceeded returns 429 status with clear error message
8. API versioning allows for future `/api/v2/` routes without breaking v1 clients
9. Documentation updated with rate limiting information
10. Rate limiting tested with multiple rapid requests to verify it works correctly

---

## Epic 3: Guest Booking Flow (Backend API)

**Expanded Goal:** Implement the complete **backend API** for guest booking functionality, including availability checking, booking creation, confirmation, and email notifications. Enable the booking system through robust API endpoints that support real-time availability queries, booking management, and automated communications. This epic delivers the core backend business logic - the foundation for customers to book beauty services online 24/7.

**Phase 1 Focus:** Backend API ONLY - Booking endpoints, availability logic, email notifications, validation.

### Story 3.1: Design Booking Database Schema and Relationships

As a backend developer,
I want to extend the database schema to support comprehensive booking management,
so that all booking data is properly structured and relational.

#### Acceptance Criteria
1. Booking model in Prisma schema includes all required fields: id, serviceId, branchId, userId (nullable), appointmentDate, appointmentTime, status, guestName, guestEmail, guestPhone, specialRequests, referenceNumber, createdAt, updatedAt
2. Booking status enum defined: pending, confirmed, completed, cancelled, no_show
3. Foreign key relationships defined: Booking belongsTo Service, Booking belongsTo Branch, Booking belongsTo User (optional)
4. Indexes created on: appointmentDate, branchId, referenceNumber, userId for optimized queries
5. Unique constraint on referenceNumber field
6. appointmentTime stored as string (HH:MM format) or Time type
7. Migration created and applied successfully
8. Test queries verify relationships work correctly (join booking with service and branch data)
9. Documentation updated with booking data model description
10. Seed script updated to include sample bookings (optional, for testing)

### Story 3.2: Implement Availability Check API

As a backend developer,
I want to create an API endpoint that returns available time slots for a given service, branch, and date,
so that customers can see real-time availability when booking.

#### Acceptance Criteria
1. `GET /api/v1/availability` endpoint created accepting query params: serviceId, branchId, date (YYYY-MM-DD format)
2. Endpoint validates all required parameters are present and properly formatted
3. Business logic generates time slots based on branch operating hours for the specified date
4. Time slots generated in appropriate increments (30 or 60 minutes based on service duration)
5. Endpoint queries existing bookings for that branch/date and marks conflicting slots as unavailable
6. Availability calculation accounts for service duration (e.g., 90-minute service blocks overlapping slots)
7. Past time slots excluded (if date is today, only future times returned)
8. Optional: Configurable buffer time between appointments (e.g., 15 minutes for cleanup)
9. Response format: `{ date: "2025-10-30", slots: [{ time: "09:00", available: true }, { time: "09:30", available: false }, ...] }`
10. Error handling: 400 for invalid params, 404 if service/branch not found, 500 for server errors

### Story 3.3: Implement Create Booking API Endpoint

As a backend developer,
I want to create an API endpoint for creating new bookings,
so that customers can schedule appointments through the API.

#### Acceptance Criteria
1. `POST /api/v1/bookings` endpoint created accepting request body: { serviceId, branchId, appointmentDate, appointmentTime, guestName, guestEmail, guestPhone, specialRequests }
2. Request validation ensures all required fields present and properly formatted (email format, phone format, date in future)
3. Business logic validates appointment time is available (not already booked)
4. Business logic validates appointment time is within branch operating hours
5. Unique booking reference number generated (format: BC-YYYYMMDD-XXXX where XXXX is random alphanumeric)
6. Booking saved to database with status "confirmed" and all provided information
7. Response returns created booking object: `{ success: true, booking: { id, referenceNumber, ...all booking data } }`
8. Concurrent booking prevention: use database transaction to check availability and create booking atomically
9. Error handling: 400 for validation errors, 409 for time slot conflict, 500 for server errors
10. Rate limiting applied: max 10 bookings per hour per IP address

### Story 3.4: Implement Get Booking by Reference Number API

As a backend developer,
I want to create an API endpoint to retrieve booking details by reference number,
so that customers can look up their appointments.

#### Acceptance Criteria
1. `GET /api/v1/bookings/:referenceNumber` endpoint created
2. Endpoint retrieves booking from database by referenceNumber (case-insensitive search recommended)
3. Response includes full booking details plus related service and branch information
4. Response format: `{ success: true, booking: { id, referenceNumber, appointmentDate, appointmentTime, service: {...}, branch: {...}, guestName, guestEmail, status, ... } }`
5. Sensitive information handled appropriately (don't expose userId or internal IDs unnecessarily)
6. Error handling: 404 if booking not found, 500 for server errors
7. Optional: Require email verification to view booking (query param `?email=xxx` must match booking email)
8. No authentication required for this endpoint (allow guest lookups)
9. Rate limiting applied to prevent brute force reference number guessing
10. API endpoint tested with valid and invalid reference numbers

### Story 3.5: Implement Booking Confirmation Email Service

As a backend developer,
I want to send automated email confirmations when bookings are created,
so that customers receive proof of their appointment and important details.

#### Acceptance Criteria
1. Email service module created with function `sendBookingConfirmation(booking)` 
2. HTML email template created for booking confirmation with professional design
3. Email template includes: booking reference number, service name, branch name & address, date & time, customer name, special requests (if any)
4. Email includes call-to-action: "Add to Calendar" link or .ics file attachment (optional for MVP)
5. Email sent immediately after successful booking creation (called from create booking endpoint)
6. Email sending is asynchronous using background job or promise (doesn't block API response)
7. Failed email sends logged to error log but don't cause booking creation to fail
8. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
9. Environment variables configured: `EMAIL_FROM`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (or Supabase email config)
10. Test email sent successfully with all booking data populated correctly

### Story 3.6: Implement Booking Cancellation API

As a backend developer,
I want to create an API endpoint for cancelling bookings,
so that customers can cancel appointments if needed.

#### Acceptance Criteria
1. `POST /api/v1/bookings/:referenceNumber/cancel` endpoint created
2. Endpoint accepts optional request body: { email, reason } for verification and feedback
3. Email verification: booking can only be cancelled if provided email matches booking email (prevents unauthorized cancellations)
4. Business logic validates booking can be cancelled (not already cancelled or completed)
5. Optional: Cancellation policy check (e.g., can't cancel within 24 hours of appointment - configurable)
6. Booking status updated to "cancelled" in database
7. Cancellation confirmation email sent to customer
8. Response returns success message: `{ success: true, message: "Your booking has been cancelled." }`
9. Error handling: 400 for invalid email/verification failure, 404 if booking not found, 409 if already cancelled, 500 for server errors
10. API endpoint tested with various scenarios (valid cancellation, already cancelled, wrong email)

### Story 3.7: Implement Booking List API for Admin/Management

As a backend developer,
I want to create API endpoints for listing and filtering bookings,
so that admins can view and manage all appointments.

#### Acceptance Criteria
1. `GET /api/v1/admin/bookings` endpoint created (requires authentication)
2. Endpoint requires admin role verification (Authorization header with Supabase Auth token)
3. Supports filtering by query params: branchId, serviceId, status, date (appointmentDate), dateFrom, dateTo
4. Supports pagination with `page` and `limit` parameters (default limit=50)
5. Supports sorting by: appointmentDate (asc/desc), createdAt (asc/desc)
6. Response includes booking data with embedded service and branch details
7. Response includes metadata: `{ data: [...], meta: { total, page, limit, totalPages } }`
8. Proper error handling: 401 Unauthorized, 403 Forbidden (non-admin), 400 Bad Request, 500 Server Error
9. Query performance optimized with database indexes
10. API endpoint tested with various filter combinations and pagination

### Story 3.8: Implement Booking Update API for Status Management

As a backend developer,
I want to create an API endpoint for updating booking status,
so that admins can mark bookings as completed, no-show, etc.

#### Acceptance Criteria
1. `PATCH /api/v1/admin/bookings/:id/status` endpoint created (requires authentication)
2. Endpoint requires admin role verification
3. Request body accepts: { status } where status is one of: pending, confirmed, completed, cancelled, no_show
4. Business logic validates status transitions (e.g., can't mark cancelled booking as completed)
5. Booking status updated in database
6. Optional: Send status update email to customer for certain status changes
7. Response returns updated booking object
8. Audit log created for status changes (who changed, when, old status, new status) - optional for MVP
9. Error handling: 401/403 for auth issues, 400 for invalid status, 404 if booking not found, 500 for server errors
10. API endpoint tested with various status transitions

### Story 3.9: Implement Booking Validation and Business Rules

As a backend developer,
I want to implement comprehensive validation and business rules for bookings,
so that the system prevents invalid bookings and maintains data integrity.

#### Acceptance Criteria
1. Validation middleware created to enforce business rules across booking endpoints
2. Rule: Appointment date must be in the future (at least tomorrow, or configurable)
3. Rule: Appointment time must be within branch operating hours for the specified day of week
4. Rule: Service must be available at the selected branch
5. Rule: Time slot must not conflict with existing bookings (accounting for service duration)
6. Rule: Email format validation (valid email syntax)
7. Rule: Phone format validation (accept various formats, normalize for storage)
8. Rule: Special requests character limit (max 500 characters)
9. All validation errors return 400 with clear error messages explaining what's wrong
10. Validation logic is unit tested with various valid and invalid inputs

### Story 3.10: Create Booking API Documentation and Testing Collection

As a backend developer,
I want to create comprehensive documentation and testing collection for all booking endpoints,
so that the booking API is well-documented and easily testable.

#### Acceptance Criteria
1. API documentation created in `docs/api/bookings.md` with all booking endpoints
2. Documentation includes: endpoint URL, HTTP method, request parameters, request body schema, response schema, error codes, examples
3. Postman/Insomnia collection updated with all booking endpoints: availability check, create booking, get booking, cancel booking, admin list/update
4. Collection includes example requests with realistic data
5. Collection includes tests/assertions for successful responses
6. Environment variables configured in collection for base URL and auth tokens
7. All booking endpoints manually tested via Postman and verified to work correctly
8. Integration test written for complete booking flow: check availability → create booking → verify booking exists → cancel booking
9. README.md updated with booking API overview and links to detailed documentation
10. Postman collection exported and committed to repository
8. Selected branch information displayed in summary sidebar/footer
9. "Next" button enabled once branch is selected
10. If arriving with `?branchId` query param, that branch is pre-selected

### Story 3.4: Implement Date and Time Picker with Availability

As a potential customer,
I want to select my preferred appointment date and time from available slots,
so that I can book a time that fits my schedule.

#### Acceptance Criteria
1. Step 3 displays calendar for date selection (using date picker library like react-day-picker or custom)
2. Calendar shows current month by default with navigation to previous/next months
3. Past dates are disabled (not selectable)
4. Calendar highlights today's date
5. Clicking date fetches available time slots for that date from API
6. Available time slots displayed as buttons (e.g., "9:00 AM", "10:30 AM", "2:00 PM")
7. Time slots shown in 30-minute or 60-minute increments based on service duration
8. Unavailable time slots are disabled/grayed out with tooltip explaining why
9. Selected date and time displayed clearly in summary sidebar/footer
10. "Next" button enabled once both date and time are selected

### Story 3.5: Build Guest Information Form

As a guest customer,
I want to provide my contact information to complete my booking,
so that the clinic can confirm my appointment and contact me if needed.

#### Acceptance Criteria
1. Step 4 displays form with fields: Full Name (required), Email (required), Phone (required), Special Requests (optional textarea)
2. All form fields have labels, placeholders, and appropriate input types
3. Real-time validation on each field (email format, phone format, required fields)
4. Inline error messages displayed below invalid fields
5. Phone number field formatted automatically (e.g., (555) 123-4567)
6. Special requests field has character limit (500 characters) with counter
7. Summary of booking displayed: service, branch, date, time, total price
8. "Confirm Booking" button at bottom of form
9. "Confirm Booking" button disabled until all required fields are valid
10. Terms and conditions checkbox (required) with link to terms page (placeholder)

### Story 3.6: Create Booking Confirmation Page

As a guest customer,
I want to see a confirmation of my booking with all details,
so that I know my appointment was successfully scheduled.

#### Acceptance Criteria
1. Confirmation page displays after successful booking submission
2. Success message with icon: "Booking Confirmed! Your appointment has been scheduled."
3. Booking reference number displayed prominently (e.g., "Reference: BC-20251028-1234")
4. Complete booking details shown: service name, branch name & address, date & time, customer name, phone, email
5. "Add to Calendar" buttons for Google Calendar, Apple Calendar, Outlook (generates .ics file)
6. Instructions: "You will receive a confirmation email at [email address]"
7. "Book Another Appointment" button returns to booking wizard
8. "Back to Home" button navigates to homepage
9. Confirmation page is shareable via URL (`/booking/confirmation/:referenceNumber`)
10. If user navigates to confirmation page without valid booking, shows appropriate message

### Story 3.7: Implement Booking API Endpoints

As a backend developer,
I want to create API endpoints for booking management,
so that the frontend can create and retrieve bookings.

#### Acceptance Criteria
1. `POST /api/v1/bookings` endpoint created accepting: serviceId, branchId, appointmentDate, appointmentTime, guestName, guestEmail, guestPhone, specialRequests
2. Request validation ensures all required fields present and properly formatted
3. Business logic validates appointment time is in future and during branch operating hours
4. Booking reference number generated (format: BC-YYYYMMDD-XXXX where XXXX is random)
5. Booking saved to database with status "confirmed" and all provided information
6. Response returns created booking object including generated referenceNumber and id
7. `GET /api/v1/bookings/:referenceNumber` endpoint created to retrieve booking by reference number
8. Error handling: validation errors (400), conflicts if time slot unavailable (409), server errors (500)
9. Rate limiting applied to prevent abuse (max 10 bookings per hour per IP)
10. API endpoints tested with various scenarios (valid bookings, invalid data, conflicts)

### Story 3.8: Implement Availability Check System

As a backend developer,
I want to implement availability checking logic,
so that customers can only book available time slots and double-bookings are prevented.

#### Acceptance Criteria
1. `GET /api/v1/availability?serviceId=X&branchId=Y&date=YYYY-MM-DD` endpoint created
2. Endpoint returns array of available time slots for specified service, branch, and date
3. Availability logic considers: branch operating hours, existing bookings, service duration
4. Time slots generated in appropriate increments (30 or 60 minutes based on service)
5. Slots marked unavailable if conflicting booking exists (accounting for service duration overlap)
6. Endpoint excludes past time slots (if date is today, only future times shown)
7. Optional: Configurable buffer time between appointments (e.g., 15 minutes for cleanup)
8. Response format: `{ date: "2025-10-28", slots: [{ time: "09:00", available: true }, ...] }`
9. Database query optimized with indexes on appointmentDate and branchId
10. Endpoint tested with various scenarios (no bookings, fully booked, partial availability)

### Story 3.9: Implement Email Notification Service

As a backend developer,
I want to send email confirmations for bookings,
so that customers receive proof of their appointment and important details.

#### Acceptance Criteria
1. Email service module created with functions for sending transactional emails
2. Supabase email service or external email provider (SendGrid, Resend) integrated
3. Booking confirmation email template created with HTML and plain text versions
4. Email includes: booking reference, service name, branch name & address, date & time, customer name
5. Email sent immediately after successful booking creation
6. Email sending is asynchronous (doesn't block booking API response)
7. Failed email sends logged but don't cause booking to fail (booking still created)
8. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
9. Email "from" address configured (e.g., bookings@beautyclinic.com)
10. Test email sent successfully with all template variables populated correctly

### Story 3.10: Add Booking Management Features (View and Basic Validation)

As a customer,
I want to view my booking confirmation using the reference number,
so that I can retrieve my appointment details anytime.

#### Acceptance Criteria
1. "View Booking" link added to navigation footer or header
2. Booking lookup page created at `/booking/lookup` route
3. Page contains form with input field for booking reference number
4. "Find Booking" button submits reference number to API
5. If booking found, displays full booking details with same layout as confirmation page
6. If booking not found, shows friendly error message: "No booking found with that reference number"
7. Booking lookup calls `GET /api/v1/bookings/:referenceNumber` endpoint
8. Booking details page shows booking status (Confirmed, Completed, Cancelled - for future use)
9. Loading state shown while fetching booking data
10. Error handling for API failures with retry option

---

## Epic 4: Member Experience & Authentication (Backend API)

**Expanded Goal:** Build comprehensive **backend API** for member registration, authentication, and profile management using Supabase Auth. Implement email OTP verification, JWT-based authentication, member booking history API, profile management endpoints, and enhanced member booking flow. Enable the foundation for personalized member experiences through robust authentication and data management APIs.

**Phase 1 Focus:** Backend API ONLY - Authentication endpoints, user management, member booking APIs, profile APIs.

### Story 4.1: Integrate Supabase Auth with Email OTP Registration

As a backend developer,
I want to integrate Supabase Auth for member registration with email OTP verification,
so that users can create secure accounts with email verification.

#### Acceptance Criteria
1. Supabase Auth SDK (@supabase/supabase-js) configured in backend with environment variables
2. `POST /api/v1/auth/register` endpoint created accepting: email, fullName, phone
3. Registration endpoint calls Supabase Auth signUp with email (passwordless with OTP)
4. User record created in application database (User table) with role="member" after email verification
5. OTP sent via email to user's provided email address (managed by Supabase)
6. Registration endpoint returns: { success: true, message: "Please check your email for verification code" }
7. User data validated: email format, phone format, fullName required
8. Duplicate email check returns appropriate error: "Email already registered"
9. Rate limiting applied: max 3 registration attempts per hour per IP
10. Error handling for Supabase Auth failures with user-friendly messages

### Story 4.2: Implement Email OTP Verification Endpoint

As a backend developer,
I want to create an endpoint for verifying email OTP codes,
so that users can complete their registration after receiving the verification code.

#### Acceptance Criteria
1. `POST /api/v1/auth/verify-otp` endpoint created accepting: email, otp
2. Endpoint calls Supabase Auth verifyOtp to validate the code
3. If OTP valid, user's emailVerified flag set to true in database
4. Supabase Auth session created and returned (access token, refresh token)
5. User profile data synced to application database if not already exists
6. Response includes: { success: true, user: {...}, session: {...} }
7. OTP codes expire after 10 minutes (managed by Supabase)
8. Invalid OTP returns error: "Invalid or expired verification code"
9. OTP is single-use only (cannot be reused)
10. Session tokens include user id and role for authorization

### Story 4.3: Build Member Registration Page with Email OTP Flow

As a potential member,
I want to register for an account with email verification,
so that I can access member benefits and track my bookings.

#### Acceptance Criteria
1. Registration page created at `/register` route
2. Form includes fields: Full Name (required), Email (required), Phone (required)
3. "Create Account" button submits registration to `POST /api/v1/auth/register`
4. After successful registration, OTP verification screen shown
5. OTP input field displayed with 6-digit code entry (numerical input with auto-tab)
6. "Verify Code" button submits OTP to `POST /api/v1/auth/verify-otp`
7. "Resend Code" button available with cooldown timer (60 seconds)
8. Success message after verification: "Account created successfully!"
9. User redirected to dashboard or booking flow after successful verification
10. Form validation with inline error messages for all fields

### Story 4.4: Implement Login and Session Management

As a registered member,
I want to log in to my account using my email,
so that I can access member features and my booking history.

#### Acceptance Criteria
1. Login page created at `/login` route
2. Login form with Email field (required)
3. "Send Login Code" button triggers `POST /api/v1/auth/login` endpoint
4. Backend endpoint calls Supabase Auth signInWithOtp for passwordless login
5. OTP sent to user's email address
6. OTP verification screen shown with 6-digit input
7. "Verify Login Code" submits to existing `POST /api/v1/auth/verify-otp` endpoint
8. Successful login creates session and stores auth tokens (localStorage or cookies)
9. User redirected to intended page or dashboard after login
10. "Forgot Password" link not needed (passwordless), but "Having trouble?" help link provided

### Story 4.5: Build Member Dashboard with Overview

As a member,
I want to see a dashboard with my upcoming appointments and quick actions,
so that I can easily manage my bookings and profile.

#### Acceptance Criteria
1. Member dashboard created at `/dashboard` route (protected, requires authentication)
2. Dashboard displays welcome message with member's name: "Welcome back, [Name]!"
3. "Upcoming Appointments" section shows next 3 upcoming bookings with details
4. Each appointment card shows: service name, branch name, date & time, reference number
5. "View All" button links to full booking history page
6. "Book New Appointment" prominent CTA button
7. Quick stats displayed: Total Bookings, Upcoming Appointments count
8. Special offers/promotions section (placeholder cards for future use)
9. Recent activity feed showing last 5 actions (bookings made, profile updates)
10. Dashboard data fetched from `GET /api/v1/members/dashboard` endpoint (needs creation)

### Story 4.6: Create Booking History Page

As a member,
I want to view my complete booking history,
so that I can track all my past and upcoming appointments.

#### Acceptance Criteria
1. Booking history page created at `/dashboard/bookings` route (protected)
2. Page displays all user's bookings in table or card layout
3. Bookings organized by status tabs: "Upcoming", "Past", "Cancelled" (for future)
4. Each booking shows: reference number, service name, branch, date & time, status
5. Bookings sorted by date (upcoming: soonest first, past: most recent first)
6. "View Details" button for each booking links to booking detail page
7. Pagination implemented for large booking lists (10 bookings per page)
8. Empty state shown if no bookings: "No bookings yet" with "Book Now" CTA
9. Data fetched from `GET /api/v1/members/bookings` endpoint (needs creation)
10. Loading state with skeleton cards while fetching data

### Story 4.7: Build Profile Management Page

As a member,
I want to update my profile information,
so that I can keep my contact details current and accurate.

#### Acceptance Criteria
1. Profile page created at `/dashboard/profile` route (protected)
2. Form displays current user information: Full Name, Email (read-only), Phone
3. "Save Changes" button submits updates to `PUT /api/v1/members/profile` endpoint
4. Email field is read-only with note: "Contact support to change email"
5. Form validation on all editable fields with inline error messages
6. Success message displayed after profile update: "Profile updated successfully"
7. Phone number format validation (same as registration)
8. "Change Password" section with button (future feature placeholder - not needed for OTP auth)
9. Profile data pre-filled from `GET /api/v1/members/profile` endpoint
10. Changes reflected immediately after save across all pages using profile data

### Story 4.8: Implement Member API Endpoints

As a backend developer,
I want to create API endpoints for member-specific data and operations,
so that members can access their personalized information.

#### Acceptance Criteria
1. `GET /api/v1/members/profile` endpoint created returning authenticated user's profile
2. `PUT /api/v1/members/profile` endpoint created for updating profile (fullName, phone)
3. `GET /api/v1/members/dashboard` endpoint created returning dashboard data (upcoming bookings, stats)
4. `GET /api/v1/members/bookings` endpoint created returning user's booking history with pagination
5. All member endpoints require authentication (validate JWT/Supabase Auth token)
6. Unauthorized requests return 401 error with appropriate message
7. Endpoints only return data belonging to authenticated user (no data leakage)
8. Profile update validates data and returns validation errors if invalid
9. Dashboard endpoint includes: upcomingBookings (array), totalBookings (count), memberSince (date)
10. All endpoints tested with authenticated and unauthenticated requests

### Story 4.9: Enhance Booking Flow for Members (Auto-fill)

As a member,
I want my information automatically filled during booking,
so that I can complete appointments faster without re-entering details.

#### Acceptance Criteria
1. Booking wizard detects if user is logged in (checks auth token)
2. If logged in, "Continue as Guest" and "Continue as Member" options shown at start
3. If "Continue as Member" selected, skip directly to Service Selection (Step 1)
4. Guest Information step (Step 4) auto-filled with member's profile data
5. Member can still edit pre-filled information if needed
6. Booking associated with member's user ID in database (userId field populated)
7. Member bookings appear automatically in booking history after creation
8. "Login to auto-fill your information" prompt shown to guests on Step 4
9. Successful member booking shows personalized confirmation: "Added to your bookings"
10. Member bookings include userId in `POST /api/v1/bookings` request

### Story 4.10: Add Protected Route Guards and Auth Context

As a frontend developer,
I want to implement authentication context and route protection,
so that member-only pages are properly secured and auth state is managed globally.

#### Acceptance Criteria
1. AuthContext created providing: user, session, login, logout, register functions
2. AuthProvider wraps entire app and makes auth state available to all components
3. useAuth hook created for easy access to auth context in components
4. Protected route wrapper component created checking authentication before rendering
5. Unauthenticated users redirected to login page with return URL parameter
6. Login page redirects to intended destination after successful authentication
7. Logout function clears session and redirects to homepage
8. Auth tokens persisted in localStorage or secure cookies
9. Token refresh handled automatically when access token expires
10. User profile data loaded on app initialization if valid session exists

---

## Epic 5: Content Management & Reviews (Backend API)

**Expanded Goal:** Build comprehensive **backend API** for blog/news content management and customer review system. Deliver RESTful APIs for blog post CRUD operations, category management, review submissions with moderation workflow, and content retrieval with filtering/search. This epic provides the backend foundation for content marketing, SEO, and customer social proof features.

**Phase 1 Focus:** Backend API ONLY - Blog endpoints, review endpoints, admin moderation APIs, content management.

### Story 5.1: Design Blog Database Schema and API Structure

As a backend developer,
I want to design the blog post data model and API structure,
so that blog content can be stored, retrieved, and managed efficiently.

#### Acceptance Criteria
1. BlogPost model already defined in Prisma schema from Epic 1 (verify completeness)
2. BlogPost includes: id, title, slug, content, excerpt, featuredImage, categoryId, authorId, published, publishedAt, createdAt, updatedAt
3. BlogCategory model includes: id, name, slug, description
4. Relationship defined: BlogPost belongsTo BlogCategory, BlogPost belongsTo User (author)
5. Indexes added on: slug (unique), published, publishedAt, categoryId
6. Migration created if schema changes needed
7. Seed data created with 3 blog categories and 5 sample blog posts
8. API endpoint structure planned: GET /api/v1/blog/posts, GET /api/v1/blog/posts/:slug, GET /api/v1/blog/categories
9. Public endpoints (read-only) separate from admin endpoints (write operations)
10. Documentation updated with blog schema and API specifications

### Story 5.2: Implement Blog API Endpoints (Public)

As a backend developer,
I want to create public API endpoints for blog content,
so that the frontend can display blog posts to visitors.

#### Acceptance Criteria
1. `GET /api/v1/blog/posts` endpoint created returning published posts with pagination
2. Endpoint supports query params: category (filter by slug), search (text search), page, limit
3. Response includes: posts array, pagination meta (total, page, totalPages, limit)
4. Posts ordered by publishedAt desc (newest first)
5. Each post includes: id, title, slug, excerpt, featuredImage, category, author (name only), publishedAt
6. `GET /api/v1/blog/posts/:slug` endpoint created returning single post details
7. Post detail includes full content, category, author info, related posts (3 from same category)
8. Draft posts (published=false) not returned by public endpoints
9. `GET /api/v1/blog/categories` endpoint created returning all categories with post counts
10. All endpoints tested and returning properly formatted data

### Story 5.3: Build Blog Listing Page

As a visitor,
I want to browse all blog posts with filtering and search,
so that I can find relevant beauty and wellness content.

#### Acceptance Criteria
1. Blog listing page created at `/blog` route
2. Posts displayed in card grid layout (3 columns desktop, 2 tablet, 1 mobile)
3. Each card shows: featured image, category badge, title, excerpt (truncated to 150 chars), publish date, "Read More" link
4. Category filter sidebar (desktop) or dropdown (mobile) with all categories
5. Search bar at top of page with placeholder "Search articles..."
6. Filtering by category updates URL query param (?category=skincare-tips)
7. Search updates URL query param (?search=facial)
8. Pagination controls at bottom (Previous, Page numbers, Next)
9. Empty state shown if no posts found with "Try different filters" message
10. Page meta tags for SEO: title, description, og:image

### Story 5.4: Create Blog Post Detail Page

As a visitor,
I want to read full blog articles with rich formatting,
so that I can learn about beauty treatments and wellness tips.

#### Acceptance Criteria
1. Blog post detail page created at `/blog/:slug` route
2. Page layout: hero image, category badge, title, author name, publish date, reading time estimate
3. Article content rendered with proper HTML formatting (headings, paragraphs, lists, images, quotes)
4. Content uses typography styles for readability (larger font, optimal line height, max-width container)
5. Table of contents generated from article headings (H2, H3) with jump links (optional, nice-to-have)
6. Related posts section at bottom showing 3 posts from same category
7. Social sharing buttons: Facebook, Twitter, LinkedIn, Copy Link
8. "Back to Blog" breadcrumb navigation at top
9. 404 page shown if blog post slug not found
10. SEO meta tags populated from post data: title, description, og:image, publish date

### Story 5.5: Implement Review Database Schema and API

As a backend developer,
I want to design the review data model and create API endpoints,
so that customer reviews can be collected and managed.

#### Acceptance Criteria
1. Review model already defined in Prisma schema from Epic 1 (verify completeness)
2. Review includes: id, serviceId, userId (nullable), customerName, email, rating (1-5), reviewText, approved, adminResponse, createdAt, updatedAt
3. Relationship: Review belongsTo Service, Review belongsTo User (optional)
4. Indexes added on: serviceId, approved, rating, createdAt
5. `POST /api/v1/reviews` endpoint created for submitting reviews
6. Endpoint accepts: serviceId, customerName, email, rating, reviewText
7. Review saved with approved=false (pending moderation)
8. `GET /api/v1/reviews?serviceId=X` endpoint returns approved reviews for service
9. Reviews ordered by createdAt desc (newest first)
10. Rate limiting: max 3 review submissions per day per email

### Story 5.6: Build Review Submission Form

As a customer,
I want to submit a review for a service I've used,
so that I can share my experience and help others make decisions.

#### Acceptance Criteria
1. Review form component created (can be embedded on service detail pages)
2. Form includes: Customer Name (required), Email (required), Rating (1-5 stars, required), Review Text (required, textarea)
3. Star rating input allows clicking 1-5 stars with visual highlight
4. Review text has character limit (500 chars) with counter
5. Form validation with inline error messages
6. "Submit Review" button submits to `POST /api/v1/reviews`
7. Success message shown: "Thank you! Your review will appear after moderation."
8. Form resets after successful submission
9. Error handling for submission failures with retry option
10. Logged-in members' name and email pre-filled (optional)

### Story 5.7: Display Reviews on Service Detail Pages

As a potential customer,
I want to read reviews from other customers on service pages,
so that I can make informed booking decisions based on others' experiences.

#### Acceptance Criteria
1. Reviews section added to service detail page (from Epic 2 Story 2.2)
2. Section displays approved reviews for the service
3. Each review shows: customer name, star rating, review text, date posted, admin response (if exists)
4. Reviews displayed in card layout with proper spacing
5. Average rating calculated and displayed prominently (e.g., "4.8 out of 5 stars from 24 reviews")
6. Star distribution chart shown (5 stars: 15, 4 stars: 7, 3 stars: 2, etc.)
7. "Write a Review" button opens review form (modal or inline)
8. Pagination or "Load More" button if more than 10 reviews
9. Empty state if no reviews: "Be the first to review this service"
10. Reviews fetched from `GET /api/v1/reviews?serviceId=X`

### Story 5.8: Create Admin Blog Management Interface

As an admin,
I want to create and manage blog posts through an admin interface,
so that I can publish content without requiring developer assistance.

#### Acceptance Criteria
1. Admin blog management page created at `/admin/blog` (protected, admin role required)
2. Page lists all blog posts (published and drafts) in table view
3. Table columns: Title, Category, Author, Status (Published/Draft), Publish Date, Actions
4. "Create New Post" button opens post editor
5. Post editor includes fields: Title, Slug (auto-generated from title, editable), Category (dropdown), Featured Image (upload), Excerpt, Content (rich text editor)
6. Rich text editor supports: headings, bold, italic, lists, links, images, quotes
7. "Save as Draft" and "Publish" buttons
8. Edit functionality opens existing post in editor
9. Delete functionality with confirmation dialog
10. All operations call admin API endpoints (to be created in next story)

### Story 5.9: Implement Admin Blog API Endpoints

As a backend developer,
I want to create protected admin API endpoints for blog management,
so that authorized admins can create, update, and delete blog posts.

#### Acceptance Criteria
1. `POST /api/v1/admin/blog/posts` endpoint created for creating posts
2. `PUT /api/v1/admin/blog/posts/:id` endpoint created for updating posts
3. `DELETE /api/v1/admin/blog/posts/:id` endpoint created for deleting posts
4. All admin blog endpoints require authentication and admin role verification
5. Post creation generates slug from title (URL-friendly, unique)
6. Published posts require: title, content, excerpt, category, featuredImage
7. Draft posts can be saved with incomplete data
8. Image upload endpoint created: `POST /api/v1/admin/upload` (uploads to Supabase Storage)
9. Validation ensures slug uniqueness (returns error if duplicate)
10. Endpoints tested with admin and non-admin users

### Story 5.10: Create Admin Review Moderation Interface

As an admin,
I want to review and moderate customer reviews,
so that I can approve quality reviews and respond to feedback.

#### Acceptance Criteria
1. Admin review moderation page created at `/admin/reviews` (protected, admin role required)
2. Page displays all reviews (approved and pending) with filtering tabs
3. Tabs: "Pending", "Approved", "All"
4. Each review shows: customer name, service name, rating, review text, date submitted
5. Actions for each review: Approve, Reject, Respond
6. "Approve" button calls `PUT /api/v1/admin/reviews/:id/approve`
7. "Reject" button calls `DELETE /api/v1/admin/reviews/:id` with confirmation
8. "Respond" opens modal with textarea for admin response, calls `PUT /api/v1/admin/reviews/:id/response`
9. Approved reviews immediately visible on service pages
10. Admin response appears below review on service pages

---

## Epic 6: Admin Portal & Management (Backend API)

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

## Epic 7: Multilingual Support & API Polish (Backend Focus)

**Expanded Goal:** Implement **backend support** for multilingual content delivery and final API refinement. Enable language-specific content retrieval, implement language-aware email notifications in 4 languages (Vietnamese, Japanese, English, Chinese), optimize API performance, complete comprehensive testing, and finalize API documentation. This epic ensures the backend is production-ready with international capabilities.

**Phase 1 Focus:** Backend API ONLY - Multilingual content APIs, language-aware emails, API optimization, testing, documentation finalization.

**Note:** Frontend i18next integration and UI translations are deferred to Phase 2.

### Story 7.1: Set Up i18next and Translation Infrastructure

As a developer,
I want to configure i18next for internationalization,
so that the application can support multiple languages with proper translation management.

#### Acceptance Criteria
1. i18next and react-i18next libraries installed in frontend app
2. i18next configured with 4 language namespaces: vi (Vietnamese), ja (Japanese), en (English), zh (Chinese)
3. Translation files created in `packages/i18n/locales/` directory structure: `{language}/translation.json`
4. i18next backend plugin configured for loading translations
5. Language detection plugin configured with fallback order: localStorage → browser language → default (Vietnamese)
6. Default language set to Vietnamese (vi)
7. Translation files organized by feature: common, auth, booking, services, profile, admin
8. useTranslation hook available throughout React app
9. Translation keys use dot notation: `booking.selectService`, `common.submit`
10. Environment supports translation hot-reload during development

### Story 7.2: Translate Core UI Components and Navigation

As a developer,
I want to translate all UI components, navigation, and common elements,
so that users can navigate the application in their preferred language.

#### Acceptance Criteria
1. Header navigation translated: Home, Services, Branches, Blog, Contact, Login, Register, Dashboard
2. Footer content translated: About, Privacy Policy, Terms of Service, Contact Info
3. Common buttons translated: Submit, Cancel, Save, Delete, Edit, Back, Next, Confirm
4. Form labels and placeholders translated for all input fields
5. Error messages and validation text translated
6. Loading states and empty states translated
7. Date and time formats localized per language (e.g., DD/MM/YYYY vs MM/DD/YYYY)
8. Currency formatting applied (Vietnamese Dong symbol: ₫)
9. Number formatting localized (comma vs period as thousand separator)
10. All shadcn/ui component text overridden with translations

### Story 7.3: Implement Language Switcher Component

As a user,
I want to easily switch between languages,
so that I can use the application in my preferred language.

#### Acceptance Criteria
1. Language switcher component created with flag icons: 🇻🇳 🇯🇵 🇬🇧 🇨🇳
2. Switcher displays current language with dropdown menu for other options
3. Clicking language option changes application language immediately
4. Selected language stored in localStorage for persistence
5. Language preference applied across all pages
6. Page content re-renders with new language without page reload
7. URL query parameter `?lang=vi` can override language preference
8. Language switcher positioned in header navigation (desktop) and mobile menu
9. Switcher accessible via keyboard navigation (tab, enter)
10. Current language visually highlighted in dropdown

### Story 7.4: Translate Booking Flow

As a customer,
I want the entire booking process available in my language,
so that I can book appointments without language barriers.

#### Acceptance Criteria
1. Booking wizard step titles translated: Service Selection, Branch Selection, Date & Time, Guest Information
2. Progress indicators translated (e.g., "Step 2 of 4")
3. Service names, descriptions, and categories translated (from database)
4. Branch names, addresses, and operating hours labels translated
5. Calendar and date picker translated: month names, day names, Today, Yesterday, Tomorrow
6. Time slot labels translated (AM/PM or 24-hour format based on locale)
7. Guest information form translated: labels, placeholders, validation messages
8. Booking summary translated: Service, Branch, Date, Time, Total Price
9. Confirmation page translated: success message, booking details, next steps
10. All booking-related error messages translated

### Story 7.5: Translate Member Pages and Dashboard

As a member,
I want my dashboard and profile pages in my chosen language,
so that I can manage my account comfortably.

#### Acceptance Criteria
1. Dashboard welcome message translated: "Welcome back, {name}!"
2. Dashboard sections translated: Upcoming Appointments, Booking History, Special Offers
3. Booking history page translated: column headers, status labels, empty states
4. Profile page form fields translated: Full Name, Email, Phone, Save Changes
5. Login and registration pages fully translated including OTP instructions
6. Email OTP instructions translated: "Enter the code sent to {email}"
7. Authentication error messages translated: Invalid code, Expired code, etc.
8. Account-related notifications translated
9. Member-only features and benefits messaging translated
10. Logout confirmation dialog translated

### Story 7.6: Translate Blog and Review Content

As a visitor,
I want to read blog posts and reviews in my language,
so that I can understand the content clearly.

#### Acceptance Criteria
1. Blog listing page translated: category filters, search placeholder, pagination
2. Blog post metadata translated: Published on, By {author}, Reading time
3. Related posts section translated
4. Review submission form translated: rating labels, character counter, submit button
5. Review display translated: customer reviews, admin responses, date formatting
6. Star rating labels translated: "5 out of 5 stars"
7. Review empty state translated: "Be the first to review"
8. Blog and review content in database supports language field for multi-language content
9. Content displays in user's selected language if translation available, falls back to default
10. "No translation available" message shown gracefully if content not translated

### Story 7.7: Implement Multilingual Email Notifications

As a customer,
I want to receive emails in my preferred language,
so that I can understand booking confirmations and notifications.

#### Acceptance Criteria
1. Email templates created for each language (vi, ja, en, zh)
2. Booking confirmation email translated for all 4 languages
3. OTP verification email translated for all 4 languages
4. Contact form acknowledgment email translated
5. Email template includes: subject line, greeting, body content, signature
6. Language determined from user's profile preference or booking language selection
7. Email service accepts language parameter: `sendEmail(to, template, data, language)`
8. Fallback to English if user's language template not available
9. Test emails sent in all 4 languages verified for correct rendering
10. Email content includes clinic contact info translated appropriately

### Story 7.8: Create Translation Management Workflow

As an admin,
I want a system for managing content translations,
so that all content can be made available in multiple languages.

#### Acceptance Criteria
1. Database schema supports translations: Service translations (name, description per language)
2. Admin interface for managing service translations (4 language tabs per service)
3. Blog post editor supports multiple language versions (separate posts or translation fields)
4. Branch information translation fields (operating hours labels, descriptions)
5. Translation status indicators: Fully translated (all 4), Partially translated (1-3), Not translated
6. Translation completeness report showing missing translations by entity type
7. Copy from default language button to assist translation workflow
8. Character encoding properly handles Vietnamese diacritics, Japanese characters, Chinese characters
9. Translation memory or glossary for consistent terminology (optional, can be manual doc)
10. Export/import translations in JSON format for external translation services

### Story 7.9: Perform Final QA and Cross-Browser Testing

As a QA tester,
I want to verify all features work correctly across browsers and languages,
so that the application is production-ready.

#### Acceptance Criteria
1. Complete feature testing checklist executed in all 4 languages
2. All user flows tested: guest booking, member registration, login, booking history, profile update
3. Cross-browser testing completed: Chrome, Firefox, Safari, Edge (latest 2 versions each)
4. Mobile responsive testing on iOS and Android devices (physical or emulator)
5. Performance testing: Lighthouse scores >90 on mobile, page load <2s
6. Accessibility testing: WCAG AA compliance verified with automated tools
7. Translation accuracy spot-checked by native speakers for each language
8. Email deliverability tested for all notification types
9. Error scenarios tested: invalid inputs, network failures, timeout handling
10. Bug log created and all critical/high priority bugs resolved

### Story 7.10: Production Readiness and Deployment Checklist

As a project manager,
I want a comprehensive production readiness checklist,
so that the application can be confidently deployed to users.

#### Acceptance Criteria
1. Security audit completed: No critical vulnerabilities, HTTPS enforced, sensitive data encrypted
2. Environment variables properly configured for production (.env.example documented)
3. Database migrations tested and ready for production deployment
4. Seed data or data migration plan prepared for initial production data
5. Monitoring and error tracking configured: Sentry, analytics, uptime monitoring
6. Backup and disaster recovery plan documented and tested
7. Performance optimization completed: Images compressed, lazy loading, caching enabled
8. SEO optimization: Meta tags, sitemap.xml, robots.txt configured
9. Legal pages created: Privacy Policy, Terms of Service, Cookie Policy (placeholder content if needed)
10. Production deployment runbook created with rollback plan

---

## Next Steps

### Checklist Results Report

**PRD Completion Status:** ✅ All 7 epics defined with 70 detailed user stories

**Epic Summary:**
1. ✅ **Epic 1: Foundation & Core Infrastructure** - 10 stories - Complete tech stack and homepage
2. ✅ **Epic 2: Service Discovery & Information** - 10 stories - Browse services, branches, contact
3. ✅ **Epic 3: Guest Booking Flow** - 10 stories - End-to-end booking for guests
4. ✅ **Epic 4: Member Experience & Authentication** - 10 stories - Registration, dashboard, enhanced booking
5. ✅ **Epic 5: Content Management & Reviews** - 10 stories - Blog system and customer reviews
6. ✅ **Epic 6: Admin Portal & Management** - 10 stories - Comprehensive admin tools
7. ✅ **Epic 7: Multilingual Support & Polish** - 10 stories - 4 languages and production readiness

**Total Story Count:** 70 user stories with detailed acceptance criteria

**Estimated Timeline:** 14-16 weeks (3.5-4 months) with 2 full-stack developers

**Key Deliverables:**
- Complete beauty clinic booking platform
- Guest and member booking flows
- Multilingual support (Vietnamese, Japanese, English, Chinese)
- Admin portal for operations management
- Blog and review systems
- Mobile-responsive design
- Production-ready MVP

### UX Expert Prompt

**Handoff to UX/Design Team:**

"Please review the Beauty Clinic Care Website PRD and create comprehensive UI/UX designs including:

1. **Design System:** Component library using shadcn/ui customized with beauty clinic brand aesthetics (calm, spa-like, premium feel)
2. **User Flows:** Detailed wireframes for guest booking, member registration/login, and booking history
3. **Key Screens:** High-fidelity mockups for homepage, service listing/detail, booking wizard (4 steps), member dashboard, admin portal
4. **Responsive Designs:** Mobile-first designs for all critical flows at 375px, 768px, and 1440px breakpoints
5. **Multilingual Considerations:** Design patterns accommodating text expansion in different languages
6. **Accessibility:** WCAG AA compliant designs with proper color contrast, focus states, and screen reader support

Priority: Start with booking flow (Epic 3) as this is the core value proposition."

### Architect Prompt

**Handoff to Technical Architecture Team:**

"Please review the Beauty Clinic Care Website PRD and create technical architecture documentation including:

1. **System Architecture:** Diagram showing frontend (React), backend (Express), database (Supabase PostgreSQL), Redis cache, and third-party integrations
2. **Database Schema:** Complete ERD with all entities, relationships, indexes from Prisma schema
3. **API Specifications:** OpenAPI/Swagger documentation for all REST endpoints (60+ endpoints across public, member, and admin APIs)
4. **Authentication Flow:** Sequence diagrams for Supabase Auth email OTP registration and login
5. **Booking System:** Architecture for availability checking, concurrent booking prevention, and notification workflows
6. **Deployment Architecture:** Local development setup documentation, environment configuration, and future cloud deployment considerations
7. **Security Design:** Authentication/authorization patterns, data encryption, rate limiting, input validation strategy
8. **Performance Strategy:** Caching strategy (Redis), image optimization, lazy loading, and code splitting approach

Technology Stack Confirmed:
- **Frontend:** React.js, Tailwind CSS, shadcn/ui, Swiper, i18next, React Router, Axios
- **Backend:** Node.js, Express.js, Prisma ORM, Supabase Auth SDK
- **Database:** PostgreSQL (Supabase), Redis
- **Testing:** Jest (80%+ coverage target)
- **Deployment:** Local development environment

Priority: Start with database schema and authentication flows as these are foundational."

---


