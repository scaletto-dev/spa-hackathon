# ���️ BEAUTY CLINIC CARE WEBSITE - PROJECT STRUCTURE

**Project Name:** Beauty Clinic Care Website  
**Type:** Monorepo Fullstack Application  
**Date:** October 31, 2025  
**Version:** 1.0  

---

## ��� ROOT STRUCTURE

```
spa-hackathon/
├── ��� apps/                          # Application packages
│   ├── ��� backend/                   # Backend API Server
│   └── ��� frontend/                  # Frontend React SPA
│
├── ��� docs/                          # Project documentation
│   ├── ��� api/                       # API documentation
│   ├── ��� api-spec/                  # API specifications
│   ├── ��� architecture/              # Architecture docs
│   ├── ��� i18n/                      # Internationalization
│   ├── ��� prd/                       # Product requirements
│   ├── ��� project-management/        # PM documents
│   ├── ��� qa/                        # QA & testing
│   ├── ��� refactor/                  # Refactor notes
│   └── ��� stories/                   # User stories
│
├── ��� package.json                   # Root package.json (workspaces)
├── ��� README.md                      # Main project README
├── �� KIEN_TRUC_TONG_THE.md         # Vietnamese architecture doc
├── ��� API_DOCUMENTATION.md           # API docs (Vietnamese)
├── ��� DATABASE_DOCUMENTATION.md      # Database docs (Vietnamese)
└── ��� AI_FEATURES_IMPLEMENTATION_PLAN.md
```

---

## ��� BACKEND STRUCTURE (`apps/backend/`)

```
apps/backend/
├── ��� src/                           # Backend source code
│   │
│   ├── ��� config/                    # Configuration files
│   │   ├── database.ts               # Database config
│   │   ├── logger.ts                 # Winston logger
│   │   └── redis.ts                  # Redis config
│   │
│   ├── ��� controllers/               # HTTP Request Handlers
│   │   ├── ��� admin/                 # Admin controllers
│   │   │   ├── admin.services.controller.ts
│   │   │   ├── admin.categories.controller.ts
│   │   │   ├── admin.branches.controller.ts
│   │   │   ├── admin.bookings.controller.ts
│   │   │   ├── admin.blog.controller.ts
│   │   │   └── admin.reviews.controller.ts
│   │   │
│   │   ├── auth.controller.ts        # Authentication
│   │   ├── service.controller.ts     # Services
│   │   ├── branch.controller.ts      # Branches
│   │   ├── booking.controller.ts     # Bookings
│   │   ├── payment.controller.ts     # Payments
│   │   ├── vnpay.controller.ts       # VNPay integration
│   │   ├── review.controller.ts      # Reviews
│   │   ├── blog.controller.ts        # Blog posts
│   │   ├── category.controller.ts    # Categories
│   │   ├── user.controller.ts        # User profile
│   │   ├── member.controller.ts      # Member dashboard
│   │   ├── voucher.controller.ts     # Vouchers
│   │   ├── contact.controller.ts     # Contact form
│   │   ├── support.controller.ts     # Support chat
│   │   ├── ai.controller.ts          # AI features
│   │   └── upload.controller.ts      # File upload
│   │
│   ├── ��� services/                  # Business Logic Layer
│   │   ├── auth.service.ts
│   │   ├── service.service.ts
│   │   ├── branch.service.ts
│   │   ├── booking.service.ts
│   │   ├── payment.service.ts
│   │   ├── vnpay.service.ts
│   │   ├── review.service.ts
│   │   ├── blog.service.ts
│   │   ├── category.service.ts
│   │   ├── user.service.ts
│   │   ├── member.service.ts
│   │   ├── voucher.service.ts
│   │   ├── contact.service.ts
│   │   ├── support.service.ts
│   │   ├── socket.service.ts
│   │   ├── email.service.ts
│   │   ├── ai.service.ts
│   │   └── upload.service.ts
│   │
│   ├── ��� repositories/              # Data Access Layer
│   │   ├── base.repository.ts        # Base repository pattern
│   │   ├── service.repository.ts
│   │   ├── branch.repository.ts
│   │   ├── booking.repository.ts
│   │   ├── review.repository.ts
│   │   ├── blog.repository.ts
│   │   ├── category.repository.ts
│   │   └── contact.repository.ts
│   │
│   ├── ��� routes/                    # API Routes
│   │   ├── index.ts                  # Route aggregator
│   │   ├── health.routes.ts          # Health check
│   │   ├── auth.routes.ts            # Auth endpoints
│   │   ├── services.routes.ts        # Services endpoints
│   │   ├── categories.routes.ts      # Categories endpoints
│   │   ├── branches.routes.ts        # Branches endpoints
│   │   ├── booking.routes.ts         # Booking endpoints
│   │   ├── payment.routes.ts         # Payment endpoints
│   │   ├── vnpay.routes.ts           # VNPay endpoints
│   │   ├── reviews.routes.ts         # Reviews endpoints
│   │   ├── blog.routes.ts            # Blog endpoints
│   │   ├── user.routes.ts            # User profile
│   │   ├── member.routes.ts          # Member dashboard
│   │   ├── vouchers.route.ts         # Vouchers
│   │   ├── contact.routes.ts         # Contact form
│   │   ├── support.routes.ts         # Support chat
│   │   ├── ai.routes.ts              # AI features
│   │   ├── upload.routes.ts          # File upload
│   │   └── ��� admin/                 # Admin routes
│   │
│   ├── ��� middleware/                # Express Middleware
│   │   ├── auth.middleware.ts        # JWT authentication
│   │   ├── validate.ts               # Zod validation
│   │   ├── error-handler.ts          # Global error handler
│   │   ├── rate-limiter.ts           # Rate limiting
│   │   └── logger.middleware.ts      # Request logging
│   │
│   ├── ��� validators/                # Zod Validation Schemas
│   │   ├── auth.validator.ts
│   │   ├── service.validator.ts
│   │   ├── branch.validator.ts
│   │   ├── booking.validator.ts
│   │   ├── review.validator.ts
│   │   ├── blog.validator.ts
│   │   ├── category.validator.ts
│   │   ├── contact.validator.ts
│   │   └── voucher.validator.ts
│   │
│   ├── ��� types/                     # TypeScript Types & DTOs
│   │   ├── api.ts                    # Common API types
│   │   ├── auth.ts
│   │   ├── service.ts
│   │   ├── branch.ts
│   │   ├── booking.ts
│   │   ├── review.ts
│   │   ├── blog.ts
│   │   ├── category.ts
│   │   ├── user.ts
│   │   └── contact.ts
│   │
│   ├── ��� prisma/                    # Prisma ORM
│   │   ├── schema.prisma             # Database schema (13 models)
│   │   ├── seed.ts                   # Seed data
│   │   └── ��� migrations/            # Database migrations
│   │
│   ├── ��� utils/                     # Utility Functions
│   │   ├── errors.ts                 # Custom error classes
│   │   ├── helpers.ts                # Helper functions
│   │   └── constants.ts              # Constants
│   │
│   ├── ��� templates/                 # Email templates
│   │
│   ├── ��� lib/                       # External service clients
│   │   └── supabase.ts               # Supabase client
│   │
│   └── server.ts                     # Express app entry point
│
├── ��� package.json                   # Backend dependencies
├── ��� tsconfig.json                  # TypeScript config
├── ��� jest.config.js                 # Jest config
└── ��� .env.example                   # Environment variables template
```

---

## ��� FRONTEND STRUCTURE (`apps/frontend/`)

```
apps/frontend/
├── ��� src/                           # Frontend source code
│   │
│   ├── ��� client/                    # CLIENT PORTAL
│   │   │
│   │   ├── ��� pages/                 # Client Pages
│   │   │   ├── Home.tsx              # Homepage (/)
│   │   │   ├── ServicesPage.tsx      # Services catalog (/services)
│   │   │   ├── ServiceDetailPage.tsx # Service detail (/services/:slug)
│   │   │   ├── BookingPage.tsx       # Booking wizard (/booking)
│   │   │   ├── BranchesPage.tsx      # Branch locator (/branches)
│   │   │   ├── BlogPage.tsx          # Blog list (/blog)
│   │   │   ├── BlogDetailPage.tsx    # Blog post (/blog/:slug)
│   │   │   ├── ContactPage.tsx       # Contact form (/contact)
│   │   │   ├── LoginPage.tsx         # Login (/login)
│   │   │   ├── RegisterPage.tsx      # Register (/register)
│   │   │   └── MemberDashboard.tsx   # Member dashboard
│   │   │
│   │   ├── ��� layouts/               # Client Layouts
│   │   │   └── ClientLayout.tsx      # Navbar + Footer wrapper
│   │   │
│   │   └── ��� components/            # Client Components
│   │       ├── ��� Home/              # Homepage sections
│   │       │   ├── Hero.tsx
│   │       │   ├── AIBanner.tsx
│   │       │   ├── BookingWidget.tsx
│   │       │   ├── Branches.tsx
│   │       │   └── Testimonials.tsx
│   │       │
│   │       ├── ��� booking/           # Booking wizard
│   │       │   ├── BookingProgress.tsx
│   │       │   ├── BookingServiceSelect.tsx
│   │       │   ├── BookingBranchSelect.tsx
│   │       │   ├── BookingDateTimeSelect.tsx
│   │       │   ├── BookingUserInfo.tsx
│   │       │   ├── BookingPayment.tsx
│   │       │   └── BookingConfirmation.tsx
│   │       │
│   │       ├── ��� services/          # Services components
│   │       ├── ��� blog/              # Blog components
│   │       ├── ��� contact/           # Contact form
│   │       └── ��� layouts/           # Navbar, Footer
│   │
│   ├── ��� admin/                     # ADMIN PORTAL
│   │   │
│   │   ├── ��� pages/                 # Admin Pages
│   │   │   ├── Dashboard.tsx         # Dashboard (/admin)
│   │   │   ├── Appointments.tsx      # Appointments (/admin/appointments)
│   │   │   ├── Services.tsx          # Services (/admin/services)
│   │   │   ├── Branches.tsx          # Branches (/admin/branches)
│   │   │   ├── Customers.tsx         # Customers (/admin/customers)
│   │   │   ├── Staff.tsx             # Staff (/admin/staff)
│   │   │   ├── Payments.tsx          # Payments (/admin/payments)
│   │   │   ├── Reviews.tsx           # Reviews (/admin/reviews)
│   │   │   ├── Blog.tsx              # Blog (/admin/blog)
│   │   │   └── Settings.tsx          # Settings (/admin/settings)
│   │   │
│   │   ├── ��� layouts/               # Admin Layouts
│   │   │   └── AdminLayout.tsx       # Admin layout (Sidebar + Header)
│   │   │
│   │   └── ��� components/            # Admin Components
│   │       ├── ��� layout/            # Layout components
│   │       │   ├── Header.tsx
│   │       │   └── Sidebar.tsx
│   │       │
│   │       ├── ��� dashboard/         # Dashboard widgets
│   │       ├── ��� modals/            # Modal dialogs
│   │       └── AIAssistant.tsx       # AI helper
│   │
│   ├── ��� support/                   # SUPPORT PORTAL
│   │   └── ��� pages/
│   │       └── SupportDashboard.tsx  # Support chat interface
│   │
│   ├── ��� components/                # SHARED COMPONENTS
│   │   ├── ��� ui/                    # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── ... (shadcn/ui components)
│   │   │
│   │   └── ��� common/                # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── ��� hooks/                     # Custom React Hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useBooking.ts             # Booking state
│   │   ├── useServices.ts            # Services data
│   │   └── useDebounce.ts            # Debounce hook
│   │
│   ├── ��� contexts/                  # React Context Providers
│   │   ├── AuthContext.tsx           # Auth state
│   │   ├── BookingContext.tsx        # Booking state
│   │   └── ThemeContext.tsx          # Theme state
│   │
│   ├── ��� store/                     # State Management
│   │   ├── authStore.ts
│   │   └── bookingStore.ts
│   │
│   ├── ��� api/                       # API Integration Layer
│   │   ├── client.ts                 # Axios instance
│   │   ├── auth.api.ts               # Auth API calls
│   │   ├── services.api.ts           # Services API calls
│   │   ├── branches.api.ts           # Branches API calls
│   │   ├── bookings.api.ts           # Bookings API calls
│   │   ├── blog.api.ts               # Blog API calls
│   │   └── ... (other API modules)
│   │
│   ├── ��� services/                  # Frontend Services
│   │   └── socket.service.ts         # Socket.IO client
│   │
│   ├── ��� types/                     # TypeScript Types
│   │   ├── auth.types.ts
│   │   ├── service.types.ts
│   │   ├── booking.types.ts
│   │   └── api.types.ts
│   │
│   ├── ��� utils/                     # Utility Functions
│   │   ├── formatters.ts             # Date, currency formatters
│   │   ├── validators.ts             # Client-side validation
│   │   └── helpers.ts                # Helper functions
│   │
│   ├── ��� i18n/                      # Internationalization
│   │   ├── config.ts                 # i18next config
│   │   └── ��� locales/               # Translation files
│   │       ├── vi.json               # Vietnamese
│   │       ├── en.json               # English
│   │       ├── ja.json               # Japanese
│   │       └── zh.json               # Chinese
│   │
│   ├── ��� routes/                    # Route Configuration
│   │   └── index.tsx                 # React Router setup
│   │
│   ├── App.tsx                       # Root app component
│   ├── index.tsx                     # React entry point
│   ├── index.css                     # Global CSS (Tailwind)
│   └── vite-env.d.ts                 # Vite types
│
├── ��� public/                        # Static assets
│   ├── favicon.ico
│   └── ��� images/
│
├── ��� package.json                   # Frontend dependencies
├── ��� vite.config.ts                 # Vite config
├── ��� tailwind.config.js             # Tailwind config
├── ��� tsconfig.json                  # TypeScript config
├── ��� postcss.config.js              # PostCSS config
├── ��� eslint.config.js               # ESLint config
├── ��� index.html                     # HTML template
└── ��� README.md                      # Frontend README
```

---

## ��� DOCUMENTATION STRUCTURE (`docs/`)

```
docs/
├── ��� README.md                      # Documentation index
├── ��� prd.md                         # Product Requirements Document
├── ��� brief.md                       # Project Brief
│
├── ��� architecture/                  # Architecture Documentation
│   ├── index.md
│   ├── high-level-architecture.md    # High-level design
│   ├── api-specification.md          # API specs
│   ├── data-models.md                # Database models
│   ├── components.md                 # Component architecture
│   ├── tech-stack.md                 # Technology stack
│   ├── coding-convention-be.md       # Backend conventions
│   ├── BACKEND_REFACTOR_PROPOSAL.md
│   └── REFACTOR_COMPLETED_TEMPLATE.md
│
├── ��� prd/                           # Product Requirements
│   ├── index.md
│   ├── goals-and-background-context.md
│   ├── requirements.md
│   ├── epic-list.md
│   ├── epic-1-foundation-core-infrastructure.md
│   ├── epic-2-service-discovery-information.md
│   ├── epic-3-guest-booking-flow-backend-api.md
│   ├── epic-4-member-experience-authentication-backend-api.md
│   ├── epic-5-content-management-reviews-backend-api.md
│   ├── epic-6-admin-portal-management-backend-api.md
│   └── epic-7-multilingual-support-api-polish-backend-focus.md
│
├── ��� stories/                       # User Stories
│   ├── 1.1.initialize-monorepo.md
│   ├── 1.2.setup-prisma-supabase.md
│   ├── 1.3.design-database-schema.md
│   ├── 1.4.implement-supabase-auth.md
│   ├── 1.5.build-express-api-foundation.md
│   └── ... (50+ story files)
│
├── ��� api/                           # API Documentation
│   ├── README.md
│   ├── branches.md
│   ├── categories.md
│   └── contact.md
│
├── ��� api-spec/                      # API Specifications
│   ├── README.md
│   ├── openapi.yml                   # OpenAPI spec
│   ├── api-by-screens.md
│   ├── by-feature.updated.md
│   ├── USAGE.md
│   └── VERIFICATION-SUMMARY.md
│
├── ��� project-management/            # Project Management
│   ├── api-endpoints-summary.md      # API endpoints tracking
│   └── ... (sprint planning, backlogs)
│
├── ��� qa/                            # QA & Testing
│   ├── ��� assessments/
│   └── ��� gates/
│
├── ��� refactor/                      # Refactoring Notes
│
└── ��� i18n/                          # i18n Documentation
    └── README.md
```

---

## ���️ DATABASE MODELS (13 Tables)

```
Database: PostgreSQL (Supabase)
ORM: Prisma

Core Models:
├── User                              # Members & Admins
├── ServiceCategory                   # Service categories
├── Service                           # Beauty services
├── Branch                            # Clinic locations
├── Booking                           # Appointments (guest + member)
├── Payment                           # Payment records
├── Review                            # Customer reviews
├── BlogCategory                      # Blog categories
├── BlogPost                          # Blog articles
├── Voucher                           # Discount codes
├── SupportConversation               # Support chats
├── SupportMessage                    # Chat messages
└── ContactSubmission                 # Contact form submissions

Enums:
├── UserRole                          # MEMBER, ADMIN, SUPPORT
├── BookingStatus                     # CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
├── PaymentStatus                     # PENDING, COMPLETED, FAILED, REFUNDED
├── PaymentType                       # ATM, CREDIT_CARD, E_WALLET, CASH
├── SupportStatus                     # OPEN, IN_PROGRESS, RESOLVED, CLOSED
└── SupportMessageType                # CUSTOMER, STAFF, SYSTEM
```

---

## ��� KEY FEATURES

### Client Features
- ✅ Service Catalog with Categories
- ✅ Branch Locator with Google Maps
- ✅ Booking Wizard (6 steps)
- ✅ Guest & Member Booking
- ✅ Payment Integration (VNPay)
- ✅ Reviews & Ratings
- ✅ Blog & News
- ✅ Contact Form
- ✅ Real-time Chat Support
- ✅ Member Dashboard
- ✅ Multilingual (vi/en/ja/zh)

### Admin Features
- ✅ Dashboard with Charts
- ✅ Appointment Management
- ✅ Service Management
- ✅ Branch Management
- ✅ Customer Management
- ✅ Staff Management
- ✅ Payment Management
- ✅ Review Moderation
- ✅ Blog Management
- ✅ Voucher Management
- ✅ AI Assistant

### AI Features
- ✅ AI Chatbot (Gemini)
- ✅ Skin Analysis
- ✅ Sentiment Analysis
- ✅ Blog Auto-generation
- ✅ Support Suggestions
- ⏳ Smart Time Slot Selection
- ⏳ Demand Forecasting

---

## ���️ TECHNOLOGY STACK

### Frontend
- React 18.2+
- TypeScript 5.3+
- Vite 5.0+
- TailwindCSS 3.4+
- React Router v6
- Axios 1.6+
- i18next 23.7+
- Socket.IO Client
- Recharts (Charts)
- Framer Motion (Animations)

### Backend
- Node.js 20 LTS
- Express.js 4.18+
- TypeScript 5.3+
- Prisma 5.7+
- PostgreSQL 15+ (Supabase)
- Redis 7.2+
- Supabase Auth
- Socket.IO
- Winston (Logging)
- Jest + Supertest (Testing)

### External Services
- Supabase (Database, Auth, Storage)
- Google Generative AI (Gemini)
- VNPay (Payment)
- Google Maps API
- Resend/SMTP (Email)

---

## ��� PROJECT METRICS

- **Total Lines of Code**: ~50,000+
- **Backend API Endpoints**: 62
- **Frontend Pages**: 30+
- **Database Tables**: 13
- **Documentation Files**: 100+
- **Test Coverage**: 80%+ (Backend)
- **Languages Supported**: 4 (vi/en/ja/zh)

---

## ��� DEVELOPMENT STATUS

### ✅ Completed
- [x] Backend API Development (95%)
- [x] Database Schema & Migrations
- [x] Authentication System
- [x] Repository Pattern Implementation
- [x] API Documentation
- [x] Frontend UI Components
- [x] Client Portal Pages
- [x] Admin Portal Pages
- [x] Basic AI Features

### ⏳ In Progress
- [ ] Frontend-Backend Integration
- [ ] AI Features Enhancement
- [ ] i18n Translation Files
- [ ] End-to-end Testing
- [ ] Performance Optimization

### ��� Planned
- [ ] Production Deployment
- [ ] Mobile App (React Native)
- [ ] Advanced AI Features
- [ ] Analytics Dashboard
- [ ] Marketing Automation

---

**Generated:** October 31, 2025  
**Tool:** Project Structure Generator
