# Epic 1: Foundation & Core Infrastructure

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
