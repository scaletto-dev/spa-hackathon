# Technical Assumptions

### Existing Frontend Implementation

**Critical Context:** The frontend application has been **fully implemented externally** and delivered as a complete, production-ready React application.

**What's Pre-Built:**
- ✅ Complete React 18.2+ application with TypeScript 5.3+
- ✅ All UI components built with shadcn/ui and Tailwind CSS 3.4+
- ✅ Full routing structure using React Router 6.20+
- ✅ All pages: Homepage, Services, Branches, Booking, Member Dashboard, Admin Portal, Blog, Contact
- ✅ Responsive design (mobile-first) with breakpoints for tablet and desktop
- ✅ Component library with reusable UI elements
- ✅ Static assets (images, icons, fonts)
- ✅ Build configuration with Vite 5.0+

**Integration Focus:**
This project focuses on:
1. **Backend API development** (primary deliverable)
2. **Integrating existing UI with backend** via Axios HTTP client
3. **State management** setup (React Context + Hooks)
4. **i18n configuration** (i18next/react-i18next with 4 languages)
5. **Authentication integration** (Supabase Auth)
6. **Form validation** (React Hook Form + Zod)

**NOT in scope:**
- ❌ Building new UI components or pages
- ❌ Major UI redesign or layout changes
- ❌ Component development from scratch

### Repository Structure: Monorepo

**Decision:** Use a **monorepo** structure to house frontend, backend, and shared code in a single repository.

**Rationale:**
- **Simplified Dependency Management:** Shared types, utilities, and i18n translations used by both frontend and backend can be managed in a single location
- **Atomic Changes:** Changes spanning frontend and backend (e.g., API contract updates) can be made in a single commit/PR
- **Easier Development:** Developers can work across full stack without switching repositories
- **Existing Frontend Integration:** Frontend code is integrated into monorepo for deployment and API connection
- **Future Scalability:** Supports future addition of worker services or mobile apps
- **Tooling:** npm workspaces for simple monorepo management

**Structure:**
```
app/
├── frontend/                    # EXISTING React + Vite application (pre-built)
│   ├── src/
│   │   ├── components/          # Pre-built UI components (shadcn/ui)
│   │   │   ├── ui/              # Basic UI elements (Button, Input, etc.)
│   │   │   ├── features/        # Business logic components
│   │   │   └── common/          # Shared layout components
│   │   ├── pages/               # Route-level components (all pre-built)
│   │   ├── hooks/               # Custom React hooks (to be implemented)
│   │   ├── services/            # API integration layer (to be implemented)
│   │   ├── utils/               # Helper functions and utilities
│   │   ├── types/               # TypeScript type definitions
│   │   ├── i18n/                # i18n configuration (to be implemented)
│   │   └── styles/              # Global styles and Tailwind config (existing)
│   └── public/                  # Static assets (existing)
├── backend/                     # Node.js + Express backend API (TO BE BUILT)
│   ├── src/
│   │   ├── controllers/         # Request/response handling
│   │   ├── middleware/          # Request processing middleware
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic layer
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── types/               # TypeScript type definitions
│   ├── prisma/                  # Prisma schema and migrations
│   └── logs/                    # Application logs (production)
├── shared/                      # Shared code between FE and BE
│   ├── types/                   # Shared TypeScript types
│   └── constants/               # Shared constants
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

