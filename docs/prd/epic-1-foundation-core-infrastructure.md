# Epic 1: Foundation & Core Infrastructure

**Expanded Goal:** Establish the complete technical foundation for the Beauty Clinic Care Website by setting up a monorepo with frontend (React + Tailwind + shadcn/ui) and backend (Node.js + Express + Prisma), integrating Supabase for database and authentication, and delivering a functional homepage displaying services. This epic proves the entire tech stack works end-to-end from database to UI, provides the deployment foundation for all future work, and delivers immediate user value with an attractive homepage showcasing the clinic's services.

### Story 1.1: Initialize Monorepo with Frontend and Backend Apps

As a developer,
I want to set up a monorepo structure with separate frontend and backend applications,
so that I can develop and manage both codebases efficiently in a single repository.

#### Acceptance Criteria
1. Repository created with monorepo structure using standard folder layout (apps/, packages/, prisma/, docs/)
2. Frontend app initialized in `apps/web/` with Vite + React + TypeScript
3. Backend app initialized in `apps/api/` with Node.js + Express + TypeScript
4. Shared packages created: `packages/types/`, `packages/config/`, `packages/utils/`
5. Package.json scripts configured for running both apps concurrently (e.g., `npm run dev`)
6. TypeScript configured for both apps with strict mode enabled
7. ESLint and Prettier configured with shared config in `packages/config/`
8. .gitignore configured to exclude node_modules, .env, dist, build directories
9. README.md created with project overview and setup instructions
10. Both apps can start successfully (frontend on :5173, backend on :3000)

### Story 1.2: Configure Tailwind CSS and shadcn/ui Component System

As a frontend developer,
I want to set up Tailwind CSS and shadcn/ui with a customizable design system,
so that I can build consistent, accessible UI components rapidly.

#### Acceptance Criteria
1. Tailwind CSS 3+ installed and configured in frontend app with PostCSS
2. Tailwind config includes custom color palette (primary, secondary, accent, neutral scales)
3. shadcn/ui CLI installed and initialized with default configuration
4. At least 5 base components installed from shadcn/ui: Button, Card, Input, Label, Select
5. Global CSS file configured with Tailwind directives and CSS variables for theming
6. Typography plugin installed and configured for consistent text styling
7. Responsive breakpoints configured matching requirements (mobile <768px, tablet 768-1024px, desktop >1024px)
8. Test page created demonstrating all installed components rendering correctly
9. Dark mode support configured (optional for MVP but architecture in place)
10. Build process generates optimized CSS bundle <50KB gzipped

### Story 1.3: Design and Implement Database Schema with Prisma

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

### Story 1.8: Initialize React App with Routing and Layout

As a frontend developer,
I want to set up React Router and create the base application layout,
so that I can navigate between pages and maintain consistent UI structure.

#### Acceptance Criteria
1. React Router v6 installed and configured in frontend app
2. Main routes defined: `/` (Home), `/services`, `/services/:id`, `/branches`, `/branches/:id`, `/contact`, `/blog`, `/login`, `/register`
3. Root layout component created with header (navigation + language switcher placeholder) and footer
4. Header includes logo placeholder, main navigation menu, and "Book Now" CTA button
5. Header responsive: full navigation on desktop, hamburger menu on mobile
6. Footer includes contact information placeholders, social media links placeholders, copyright
7. Layout applies to all routes using React Router Outlet pattern
8. 404 Not Found page created for invalid routes
9. Navigation links properly highlight active route
10. Layout renders correctly on mobile (320px), tablet (768px), and desktop (1280px) breakpoints

### Story 1.9: Build Homepage with Hero Section and Featured Services

As a potential customer,
I want to see an attractive homepage with hero banner and featured services,
so that I can quickly understand the clinic's offerings and book an appointment.

#### Acceptance Criteria
1. Homepage component created at `apps/web/src/pages/Home.tsx`
2. Hero section includes: background image placeholder, headline text, subheadline, prominent "Book Now" button
3. Hero section is full-viewport height on desktop, 60vh on mobile
4. Featured services section displays services in grid layout (4 columns desktop, 2 tablet, 1 mobile)
5. Service cards show: image, service name, brief description (truncated to 2 lines), duration, price
6. Service cards include "Learn More" button linking to service detail page (placeholder)
7. Homepage fetches featured services from API using Axios (`GET /api/v1/services/featured`)
8. Loading state displayed while fetching services (skeleton cards or spinner)
9. Error state displayed if API fetch fails with retry button
10. Homepage is visually polished with proper spacing, typography hierarchy, and mobile responsiveness

### Story 1.10: Connect Frontend to Backend and Deploy Locally

As a developer,
I want to connect the React frontend to the Express backend and verify end-to-end functionality,
so that the complete application stack works locally and is ready for feature development.

#### Acceptance Criteria
1. Frontend environment variables configured: VITE_API_BASE_URL=http://localhost:3000
2. Axios instance created in `apps/web/src/lib/api.ts` with base URL configuration
3. API client includes error interceptor for handling 4xx and 5xx responses
4. Frontend successfully fetches and displays data from backend API
5. CORS configured correctly allowing frontend to make API requests
6. Both frontend and backend can be started with single command (`npm run dev` from root)
7. README.md updated with complete local setup instructions (prerequisites, installation, running)
8. Environment variable template files created (.env.example) for both apps
9. Verification checklist completed: homepage loads, featured services display, navigation works, API calls succeed
10. Initial deployment successful with homepage fully functional showing real data from database

---
