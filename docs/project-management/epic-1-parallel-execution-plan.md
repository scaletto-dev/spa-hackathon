# Epic 1: Parallel Execution Plan (3 Developers)

**Project:** Beauty Clinic Care Website  
**Epic:** Epic 1 - Foundation & Core Infrastructure  
**Team Size:** 3 Developers  
**Estimated Duration:** 7-9 working days  
**Plan Created:** 2025-10-28  
**Plan Owner:** John (Product Manager)

---

## 📊 Executive Summary

This plan enables 3 developers to work in parallel on Epic 1's 10 stories, reducing completion time from ~15 days (sequential) to **7-9 days** (~40-50% time savings).

**Key Strategy:**
- Wave 0: Foundation (1 dev) - Sequential, critical path
- Wave 1-3: Parallel execution (2-3 devs) - Independent workstreams
- Wave 4: Integration (team effort) - Verification and deployment

---

## 👥 Team Structure & Roles

### 🎨 Developer 1: Frontend Specialist (FE Lead)
**Primary Skills:** React, TypeScript, Tailwind CSS, UI/UX  
**Secondary Skills:** Basic API integration, Axios

**Responsibilities:**
- All frontend stories (1.2, 1.8, 1.9)
- Frontend integration (1.10)
- UI/UX quality assurance
- Mobile responsiveness validation

**Wave Assignments:** 0 (if senior) or start at Wave 1

---

### ⚙️ Developer 2: Backend Specialist - Database Focus (BE-DB)
**Primary Skills:** Prisma ORM, PostgreSQL, Database Design, Supabase  
**Secondary Skills:** Node.js, Express.js basics

**Responsibilities:**
- Database schema design (1.3)
- Supabase integration (1.4)
- Seed data creation (1.7)
- Database performance optimization

**Wave Assignments:** Start at Wave 1

---

### 🔧 Developer 3: Backend Specialist - API Focus (BE-API)
**Primary Skills:** Node.js, Express.js, REST API, TypeScript  
**Secondary Skills:** Database queries, Prisma Client

**Responsibilities:**
- API infrastructure (1.5)
- Service endpoints (1.6)
- API security and middleware
- Error handling patterns

**Wave Assignments:** 0 (if most senior) or start at Wave 1

---

## 🌊 Detailed Wave Breakdown

---

## WAVE 0: Foundation Setup 🏗️

**Duration:** 1-1.5 days (8-12 hours)  
**Parallelism:** ❌ Sequential (1 developer only)  
**Critical Path:** ✅ YES - Blocks all other work

### Story: 1.1 - Initialize Monorepo with Frontend and Backend Apps

**Assigned To:** Most senior developer (preferably Dev 3 BE-API or external tech lead)

**Why Sequential?**
- Establishes project structure for everyone
- Prevents merge conflicts in fundamental setup
- Ensures consistent tooling configuration
- Risk: Mistakes here cascade to all future work

### Detailed Task Breakdown (10 Tasks)

#### Task 1: Create Root Monorepo Structure (1 hour)
**Subtasks:**
- [ ] Initialize root package.json with npm workspaces
- [ ] Create directory structure: apps/, packages/, docs/
- [ ] Configure workspace paths in root package.json

**Output:** Root structure ready for team

---

#### Task 2: Initialize Frontend App with Vite + React (1.5 hours)
**Subtasks:**
- [ ] Run `npm create vite@latest apps/web -- --template react-ts`
- [ ] Configure vite.config.ts with path aliases
- [ ] Set dev server to port 5173
- [ ] Add path alias configuration for shared packages
- [ ] Verify frontend starts: `npm run dev`

**Output:** Frontend app running on :5173

---

#### Task 3: Initialize Backend App with Express + TypeScript (2 hours)
**Subtasks:**
- [ ] Create apps/api directory structure with src/
- [ ] Initialize package.json with Express, TypeScript, dev dependencies
- [ ] Create basic Express server in src/server.ts (port 3000)
- [ ] Configure TypeScript with tsconfig.json (strict mode)
- [ ] Add dev script using tsx or ts-node-dev for hot reload
- [ ] Verify backend starts successfully

**Output:** Backend API running on :3000

---

#### Task 4: Create Shared Packages (1.5 hours)
**Subtasks:**
- [ ] Create packages/shared with package.json and tsconfig.json
- [ ] Create packages/config with ESLint and Prettier configs
- [ ] Create packages/utils with package.json and tsconfig.json
- [ ] Set up proper exports in each package's package.json
- [ ] Configure TypeScript project references if needed

**Output:** Shared packages ready for import

---

#### Task 5: Configure Concurrent Development Scripts (0.5 hour)
**Subtasks:**
- [ ] Install concurrently in root package.json
- [ ] Add "dev" script to run both apps simultaneously
- [ ] Add individual scripts for dev:web and dev:api
- [ ] Test concurrent startup: `npm run dev`

**Output:** Single command runs both apps

---

#### Task 6: Configure TypeScript for Monorepo (1 hour)
**Subtasks:**
- [ ] Create root tsconfig.json with shared compiler options
- [ ] Configure strict mode in all tsconfig.json files
- [ ] Set up path mapping for @shared, @packages aliases
- [ ] Ensure both apps extend base TypeScript config
- [ ] Test TypeScript compilation in both apps

**Output:** TypeScript working in all workspaces

---

#### Task 7: Set Up ESLint and Prettier (1 hour)
**Subtasks:**
- [ ] Create packages/config/eslint-config.js with TypeScript rules
- [ ] Create packages/config/.prettierrc with formatting rules
- [ ] Install ESLint and Prettier in both apps
- [ ] Configure both apps to use shared config
- [ ] Add lint and format scripts to package.json files
- [ ] Run linter to verify configuration

**Output:** Code quality tools working

---

#### Task 8: Configure .gitignore (0.5 hour) ⚠️ SECURITY CRITICAL
**Subtasks:**
- [ ] Create comprehensive .gitignore at root level
- [ ] Exclude node_modules, .env files, dist, build directories
- [ ] Exclude IDE-specific files (.vscode, .idea)
- [ ] Test: Try `git add .env` and verify rejection
- [ ] Verify git status shows no sensitive files

**Output:** Git security configured

---

#### Task 9: Create Project README (1 hour)
**Subtasks:**
- [ ] Write README.md with project overview
- [ ] Document setup instructions (npm install, environment setup)
- [ ] Add development workflow (npm run dev, npm run lint)
- [ ] Include technology stack summary
- [ ] Add troubleshooting section for common issues

**Output:** Complete setup documentation

---

#### Task 10: Verify End-to-End Functionality (1 hour)
**Subtasks:**
- [ ] Run `npm install` at root to verify workspace setup
- [ ] Start both apps concurrently: `npm run dev`
- [ ] Verify frontend accessible at http://localhost:5173
- [ ] Verify backend accessible at http://localhost:3000
- [ ] Test hot reload on both frontend and backend
- [ ] Test on Windows + one Unix variant (if possible)
- [ ] Create verification checklist in README

**Output:** ✅ Wave 0 complete, ready for team

---

### Wave 0 Success Criteria

✅ **Must Pass Before Wave 1:**
1. Both apps start successfully with single command
2. Hot reload works in both apps
3. TypeScript compiles without errors
4. Git ignores .env files (manual test passed)
5. README complete with setup instructions
6. At least one other dev can follow README and get running

⏱️ **Time Check:** If taking >1.5 days, investigate blockers immediately

---

### Wave 0 Handoff Checklist

**Developer completing Wave 0 must:**
- [ ] Commit all changes to main branch
- [ ] Tag commit: `epic1-wave0-complete`
- [ ] Send team message: "Wave 0 complete. Pull latest main and start Wave 1."
- [ ] Document any gotchas or workarounds in README
- [ ] Be available for questions during Wave 1 setup

---

## WAVE 1: Parallel Infrastructure Setup 🚀

**Duration:** 1-2 days (8-16 hours per dev)  
**Parallelism:** ✅ Full (3 developers)  
**Critical Path:** ⚠️ Partial - Stories 1.2, 1.3, 1.5 are all important for Wave 2

### Team Assignment

| Developer | Story | Focus Area | Est. Time |
|-----------|-------|------------|-----------|
| **Dev 1 (FE)** | 1.2 Tailwind/shadcn | Frontend styling | 1-1.5 days |
| **Dev 2 (BE-DB)** | 1.3 Prisma Schema | Database design | 1.5-2 days |
| **Dev 3 (BE-API)** | 1.5 Express API Foundation | API structure | 1-1.5 days |

---

### Story 1.2: Configure Tailwind CSS and shadcn/ui Component System

**Assigned To:** Dev 1 (Frontend Specialist)  
**Branch:** `epic1/1.2-tailwind-shadcn`  
**Dependencies:** Wave 0 complete (1.1) ✅  
**Blocks:** 1.8 (React Router), 1.9 (Homepage)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Install and Configure Tailwind CSS (1 hour)**
```bash
cd apps/web
npm install -D tailwindcss@3.4 postcss autoprefixer
npx tailwindcss init -p
```
- [ ] Install Tailwind CSS 3.4+ and dependencies
- [ ] Configure tailwind.config.js with content paths
- [ ] Set up PostCSS configuration
- [ ] Verify Tailwind builds without errors

**Task 2: Create Custom Color Palette (1 hour)**
- [ ] Define primary colors (clinic brand - soft, spa-like)
- [ ] Define secondary colors (accent colors)
- [ ] Define neutral scales (grays for text, backgrounds)
- [ ] Add colors to tailwind.config.js theme.extend
- [ ] Document color usage in README or component library

**Task 3: Set Up Global CSS (0.5 hour)**
- [ ] Create src/index.css with Tailwind directives
- [ ] Add CSS variables for theming
- [ ] Import global CSS in main.tsx
- [ ] Test: Add Tailwind class to App.tsx and verify styling

**Task 4: Install shadcn/ui CLI and Initialize (0.5 hour)**
```bash
npx shadcn-ui@latest init
```
- [ ] Run shadcn/ui initialization
- [ ] Select default configuration options
- [ ] Verify components.json created
- [ ] Verify cn() utility function created

**Task 5: Install Base Components (1 hour)**
```bash
npx shadcn-ui@latest add button card input label select
```
- [ ] Install Button component
- [ ] Install Card component
- [ ] Install Input component
- [ ] Install Label component
- [ ] Install Select component
- [ ] Verify components in src/components/ui/

**Task 6: Configure Responsive Breakpoints (0.5 hour)**
- [ ] Add breakpoints to tailwind.config.js:
  - sm: 640px (mobile)
  - md: 768px (tablet)
  - lg: 1024px (desktop)
- [ ] Document breakpoint usage
- [ ] Test responsive utility classes

**Task 7: Install and Configure Typography Plugin (0.5 hour)**
```bash
npm install -D @tailwindcss/typography
```
- [ ] Install typography plugin
- [ ] Add to tailwind.config.js plugins array
- [ ] Define custom typography styles if needed
- [ ] Test prose classes on sample content

**Task 8: Create Component Test Page (1.5 hours)**
- [ ] Create src/pages/ComponentShowcase.tsx
- [ ] Add examples of all 5 shadcn/ui components
- [ ] Style with Tailwind utilities
- [ ] Add responsive behavior examples
- [ ] Add to router temporarily for testing

**Task 9: Configure Dark Mode Architecture (1 hour)**
- [ ] Add darkMode: 'class' to tailwind.config.js
- [ ] Create theme toggle context (optional for MVP)
- [ ] Add dark: variants to key components
- [ ] Document dark mode usage (even if not implementing fully)

**Task 10: Optimize Build and Verify (1 hour)**
- [ ] Run production build: `npm run build`
- [ ] Check CSS bundle size with `du -h dist/assets/*.css`
- [ ] Verify bundle <50KB gzipped
- [ ] Test HMR works with Tailwind changes
- [ ] Document build optimization settings

**Success Criteria:**
- [ ] All 5 shadcn/ui components render correctly
- [ ] Custom colors apply throughout
- [ ] Responsive breakpoints work
- [ ] Production CSS bundle <50KB gzipped
- [ ] Component showcase page demonstrates all features

---

### Story 1.3: Design and Implement Database Schema with Prisma

**Assigned To:** Dev 2 (Backend Specialist - Database)  
**Branch:** `epic1/1.3-prisma-schema`  
**Dependencies:** Wave 0 complete (1.1) ✅  
**Blocks:** 1.4 (Supabase), 1.6 (Services API), 1.7 (Seed Data)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Install and Initialize Prisma (0.5 hour)**
```bash
cd apps/api
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```
- [ ] Install Prisma and Prisma Client
- [ ] Initialize Prisma with PostgreSQL provider
- [ ] Verify prisma/schema.prisma created
- [ ] Review initial schema structure

**Task 2: Design User Model (1 hour)**
- [ ] Create User model with all fields:
  - id (UUID, @id, @default(uuid()))
  - email (String, @unique)
  - phone (String)
  - fullName (String)
  - role (Enum: member, admin, super_admin)
  - emailVerified (Boolean, @default(false))
  - supabaseAuthId (String?, @unique)
  - language (String, @default("vi"))
  - createdAt, updatedAt
- [ ] Add @@index on email
- [ ] Document model purpose in comments

**Task 3: Design Service Models (1.5 hours)**
- [ ] Create ServiceCategory model:
  - id, name, slug (@unique), description
  - displayOrder (Int), icon (String?)
  - createdAt, updatedAt
- [ ] Create Service model:
  - id, name, slug (@unique), description, excerpt
  - duration (Int), price (Decimal)
  - categoryId (FK), images (String[])
  - featured (Boolean), active (Boolean, @default(true))
  - beforeAfterPhotos (String[]?), faqs (Json?)
  - createdAt, updatedAt
- [ ] Define relationship: Service belongs to ServiceCategory
- [ ] Add indexes on slug, featured, active

**Task 4: Design Branch Model (1 hour)**
- [ ] Create Branch model:
  - id, name, slug (@unique), address, phone, email?
  - latitude (Decimal), longitude (Decimal)
  - operatingHours (Json)
  - images (String[])
  - active (Boolean, @default(true))
  - description (String?)
  - createdAt, updatedAt
- [ ] Add @@index on slug
- [ ] Document operatingHours JSON structure

**Task 5: Design Booking Model (1.5 hours)**
- [ ] Create Booking model:
  - id, referenceNumber (String, @unique)
  - userId (String?, FK to User)
  - serviceId (String, FK to Service)
  - branchId (String, FK to Branch)
  - appointmentDate (DateTime)
  - appointmentTime (String)
  - status (Enum: confirmed, completed, cancelled, no_show)
  - guestName, guestEmail, guestPhone (String?)
  - notes (String?), language (String)
  - cancellationReason (String?)
  - createdAt, updatedAt
- [ ] Define relationships to User, Service, Branch
- [ ] Add indexes on referenceNumber, appointmentDate, userId

**Task 6: Design Blog Models (1 hour)**
- [ ] Create BlogCategory model:
  - id, name, slug (@unique), description
  - createdAt, updatedAt
- [ ] Create BlogPost model:
  - id, title, slug (@unique), content, excerpt
  - featuredImage (String)
  - categoryId (FK), authorId (FK to User)
  - published (Boolean), publishedAt (DateTime?)
  - language (String, @default("vi"))
  - createdAt, updatedAt
- [ ] Define relationships
- [ ] Add indexes on slug, published, publishedAt

**Task 7: Design Review and Contact Models (0.5 hour)**
- [ ] Create Review model:
  - id, serviceId (FK), userId (String?, FK)
  - customerName, email, rating (Int 1-5)
  - reviewText, approved (Boolean, @default(false))
  - adminResponse (String?)
  - createdAt, updatedAt
- [ ] Create ContactSubmission model:
  - id, name, email, phone?, messageType, message
  - status (Enum: new, in_progress, resolved)
  - adminNotes (String?)
  - createdAt, updatedAt
- [ ] Add indexes

**Task 8: Define Enums and Relations (0.5 hour)**
- [ ] Create UserRole enum (member, admin, super_admin)
- [ ] Create BookingStatus enum (confirmed, completed, cancelled, no_show)
- [ ] Create MessageType enum (general, booking_inquiry, complaint, feedback)
- [ ] Create ContactStatus enum (new, in_progress, resolved)
- [ ] Verify all relationships (1-to-many, many-to-1)

**Task 9: Create Initial Migration (1 hour)**
```bash
npx prisma migrate dev --name init
```
- [ ] Run migration creation
- [ ] Review generated SQL in migrations folder
- [ ] Verify migration creates all tables correctly
- [ ] Document any migration warnings

**Task 10: Generate Prisma Client and Test (1 hour)**
```bash
npx prisma generate
```
- [ ] Generate Prisma Client
- [ ] Create test script in apps/api/src/test-db.ts
- [ ] Test basic CRUD operations
- [ ] Import Prisma Client in server.ts to verify
- [ ] Document client usage patterns

**Success Criteria:**
- [ ] All 8+ models defined with proper types
- [ ] All relationships correctly established
- [ ] Migration runs without errors
- [ ] Prisma Client generates successfully
- [ ] Can import and use PrismaClient in code

---

### Story 1.5: Build Express API Foundation with Core Endpoints

**Assigned To:** Dev 3 (Backend Specialist - API)  
**Branch:** `epic1/1.5-express-api-foundation`  
**Dependencies:** Wave 0 complete (1.1) ✅  
**Blocks:** 1.6 (Services API)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Install Express Dependencies (0.5 hour)**
```bash
cd apps/api
npm install express cors helmet express-validator express-rate-limit winston
npm install -D @types/express @types/cors
```
- [ ] Install Express and essential middleware
- [ ] Install security packages (cors, helmet)
- [ ] Install rate-limit and validator packages
- [ ] Install Winston for logging
- [ ] Install TypeScript type definitions

**Task 2: Create Express Server Structure (1 hour)**
- [ ] Create src/server.ts as main entry point
- [ ] Initialize Express app
- [ ] Configure TypeScript for Express types
- [ ] Add basic server startup logic
- [ ] Test: Run server and access http://localhost:3000

**Task 3: Configure Core Middleware (1 hour)**
- [ ] Add express.json() for body parsing
- [ ] Configure helmet for security headers
- [ ] Set up CORS to allow localhost:5173 (frontend)
- [ ] Add request logging with Winston or console
- [ ] Test middleware order and functionality

**Task 4: Create API Routing Structure (1.5 hours)**
- [ ] Create src/routes/index.ts for route aggregation
- [ ] Create src/routes/services.routes.ts (placeholder)
- [ ] Create src/routes/branches.routes.ts (placeholder)
- [ ] Create src/routes/auth.routes.ts (placeholder)
- [ ] Create src/routes/bookings.routes.ts (placeholder)
- [ ] Mount routes to /api/v1/ prefix
- [ ] Document API versioning strategy

**Task 5: Implement Health Check Endpoint (0.5 hour)**
```typescript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```
- [ ] Create health check endpoint
- [ ] Return proper JSON response
- [ ] Test endpoint with curl or Postman
- [ ] Document health check in API docs

**Task 6: Create Error Handling Middleware (1.5 hours)**
- [ ] Create src/middleware/errorHandler.ts
- [ ] Define consistent error response format:
  ```json
  { "error": "ErrorType", "message": "...", "statusCode": 400 }
  ```
- [ ] Handle different error types (validation, not found, server)
- [ ] Add error middleware to Express app
- [ ] Test error scenarios

**Task 7: Configure Rate Limiting (1 hour)**
- [ ] Create src/middleware/rateLimiter.ts
- [ ] Set up general rate limit (100 req/min)
- [ ] Set up auth-specific rate limit (5 req/min)
- [ ] Apply rate limiters to appropriate routes
- [ ] Test rate limiting with multiple requests
- [ ] Document rate limits in API docs

**Task 8: Set Up Request Validation Structure (1 hour)**
- [ ] Create src/middleware/validation.ts
- [ ] Set up express-validator helpers
- [ ] Create example validation schema
- [ ] Test validation middleware
- [ ] Document validation patterns

**Task 9: Configure HTTP Status Codes (0.5 hour)**
- [ ] Create src/utils/statusCodes.ts with constants
- [ ] Document status code usage:
  - 200 (OK), 201 (Created)
  - 400 (Bad Request), 401 (Unauthorized)
  - 404 (Not Found), 500 (Server Error)
- [ ] Use consistent status codes in all routes

**Task 10: Final API Foundation Verification (1.5 hours)**
- [ ] Server starts on PORT 3000
- [ ] Health check endpoint works
- [ ] CORS allows frontend requests
- [ ] Error handling works for 404 and 500
- [ ] Rate limiting triggers correctly
- [ ] Logging captures requests
- [ ] Create API foundation documentation
- [ ] Test with Postman/Thunder Client

**Success Criteria:**
- [ ] Express server runs successfully
- [ ] Health check returns proper response
- [ ] Error handling returns consistent format
- [ ] CORS configured for frontend
- [ ] Rate limiting works on test endpoints
- [ ] Logging captures all requests

---

### Wave 1 Sync Points

**Daily Standup Questions:**
1. What did you complete yesterday?
2. What will you complete today?
3. Any blockers or dependencies on other devs?

**Mid-Wave Check (After Day 1):**
- [ ] Dev 1: Tailwind configured? Components showing?
- [ ] Dev 2: Schema models defined? Migration created?
- [ ] Dev 3: Express running? Middleware configured?

**Wave 1 Complete Checklist:**
- [ ] All 3 stories merged to main
- [ ] No merge conflicts
- [ ] Apps still run with `npm run dev`
- [ ] Team meeting: Demo what each dev built

---

## WAVE 2: Core Features Integration 🔄

**Duration:** 1-2 days (8-16 hours per dev)  
**Parallelism:** ✅ Full (3 developers)  
**Critical Path:** ⚠️ All stories important for Wave 3

### Team Assignment

| Developer | Story | Focus Area | Est. Time | Depends On |
|-----------|-------|------------|-----------|------------|
| **Dev 1 (FE)** | 1.8 React Router | Frontend navigation | 1 day | 1.2 ✅ |
| **Dev 2 (BE-DB)** | 1.4 Supabase Integration | Database connection | 1.5 days | 1.3 ✅ |
| **Dev 3 (BE-API)** | 1.6 Services API | API endpoints | 1-1.5 days | 1.3 ✅, 1.5 ✅ |

---

### Story 1.8: Initialize React App with Routing and Layout

**Assigned To:** Dev 1 (Frontend Specialist)  
**Branch:** `epic1/1.8-react-router-layout`  
**Dependencies:** 1.2 (Tailwind/shadcn) ✅  
**Blocks:** 1.9 (Homepage)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Install React Router v6 (0.5 hour)**
```bash
cd apps/web
npm install react-router-dom@6.20
```
- [ ] Install React Router v6.20+
- [ ] Verify installation
- [ ] Review v6 documentation (if needed)

**Task 2: Set Up Router Configuration (1 hour)**
- [ ] Create src/routes/index.tsx
- [ ] Set up BrowserRouter in main.tsx
- [ ] Define route structure:
  ```tsx
  / (Home)
  /services (Services Listing)
  /services/:id (Service Detail)
  /branches (Branch Listing)
  /branches/:id (Branch Detail)
  /contact
  /blog
  /login
  /register
  ```
- [ ] Create placeholder page components

**Task 3: Create Root Layout Component (2 hours)**
- [ ] Create src/components/layout/RootLayout.tsx
- [ ] Add Outlet for nested routes
- [ ] Style basic layout structure (header + main + footer)
- [ ] Make layout responsive
- [ ] Test layout on different breakpoints

**Task 4: Build Header Component (2 hours)**
- [ ] Create src/components/layout/Header.tsx
- [ ] Add logo placeholder (text or simple SVG)
- [ ] Create navigation menu with NavLink:
  - Home, Services, Branches, Blog, Contact
- [ ] Add "Book Now" CTA button (styled with shadcn Button)
- [ ] Style with Tailwind
- [ ] Add active route highlighting

**Task 5: Create Mobile Navigation (1.5 hours)**
- [ ] Create src/components/layout/MobileNav.tsx
- [ ] Implement hamburger menu icon
- [ ] Create slide-out drawer with navigation links
- [ ] Use shadcn Sheet or Dialog component
- [ ] Add animation with Tailwind transitions
- [ ] Test on mobile viewport (320px-768px)

**Task 6: Build Footer Component (1 hour)**
- [ ] Create src/components/layout/Footer.tsx
- [ ] Add contact info placeholders:
  - Phone: (placeholder)
  - Email: (placeholder)
  - Address: (placeholder)
- [ ] Add social media links (placeholder icons)
- [ ] Add copyright text
- [ ] Style with Tailwind, make responsive

**Task 7: Create 404 Not Found Page (0.5 hour)**
- [ ] Create src/pages/NotFound.tsx
- [ ] Design friendly 404 message
- [ ] Add "Go Home" button
- [ ] Configure catch-all route
- [ ] Test with invalid URL

**Task 8: Implement Active Route Highlighting (0.5 hour)**
- [ ] Use NavLink with activeClassName
- [ ] Style active links with different color
- [ ] Test navigation and verify highlighting

**Task 9: Test Responsive Layout (1 hour)**
- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1440px, 1920px)
- [ ] Fix any layout issues
- [ ] Verify hamburger menu on mobile
- [ ] Verify full nav on desktop

**Task 10: Create Placeholder Pages (1 hour)**
- [ ] Create basic components for all routes
- [ ] Add route titles and breadcrumbs
- [ ] Ensure each page uses RootLayout
- [ ] Test navigation between all pages
- [ ] Document routing patterns

**Success Criteria:**
- [ ] All routes defined and working
- [ ] Header and Footer display on all pages
- [ ] Mobile hamburger menu works
- [ ] Active route highlighting works
- [ ] 404 page handles invalid routes
- [ ] Layout responsive on all breakpoints

---

### Story 1.4: Integrate Supabase for Database and Authentication

**Assigned To:** Dev 2 (Backend Specialist - Database)  
**Branch:** `epic1/1.4-supabase-integration`  
**Dependencies:** 1.3 (Prisma Schema) ✅  
**Blocks:** 1.7 (Seed Data)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Create Supabase Project (0.5 hour)**
- [ ] Sign up for Supabase free tier account
- [ ] Create new project: "beauty-clinic-dev"
- [ ] Set region (closest to team location)
- [ ] Save project URL and keys
- [ ] Wait for project provisioning (~2 min)

**Task 2: Configure Environment Variables (0.5 hour)**
- [ ] Create apps/api/.env file
- [ ] Add Supabase credentials:
  ```
  SUPABASE_URL=https://xxx.supabase.co
  SUPABASE_ANON_KEY=eyJxxx...
  DATABASE_URL=postgresql://postgres:[password]@xxx.supabase.co:5432/postgres
  ```
- [ ] Add .env to .gitignore (verify!)
- [ ] Create .env.example template
- [ ] Document env vars in README

**Task 3: Connect Prisma to Supabase PostgreSQL (1 hour)**
- [ ] Update DATABASE_URL in .env
- [ ] Run `npx prisma db push` to push schema to Supabase
- [ ] Verify tables created in Supabase dashboard
- [ ] Test connection with Prisma Studio: `npx prisma studio`
- [ ] Create test query to verify connectivity

**Task 4: Install Supabase JavaScript Client (0.5 hour)**
```bash
npm install @supabase/supabase-js
```
- [ ] Install Supabase client library
- [ ] Create src/lib/supabase.ts
- [ ] Initialize Supabase client with URL and key
- [ ] Export client for use in other files

**Task 5: Configure Supabase Auth (1 hour)**
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] Enable Email provider
- [ ] Configure Email OTP settings:
  - Enable "Email OTP" option
  - Set OTP expiry to 10 minutes
- [ ] Review email template (optional customization)
- [ ] Document auth flow

**Task 6: Create Supabase Storage Bucket (1 hour)**
- [ ] Go to Supabase Dashboard → Storage
- [ ] Create bucket: "images"
- [ ] Set bucket to public read access
- [ ] Create folders: services/, branches/, blog/, profile/
- [ ] Test upload from dashboard
- [ ] Document storage URL patterns

**Task 7: Create Supabase Helper Functions (2 hours)**
- [ ] Create src/lib/supabaseAuth.ts
- [ ] Implement helper functions:
  ```typescript
  - signUpWithEmail(email, fullName, phone)
  - verifyOTP(email, code)
  - signInWithEmail(email)
  - signOut()
  - getCurrentUser()
  ```
- [ ] Add error handling for each function
- [ ] Add TypeScript types for responses

**Task 8: Create Database Connection Test Script (1 hour)**
- [ ] Create src/scripts/testConnection.ts
- [ ] Test Prisma connection with simple query
- [ ] Test Supabase Auth sign up (test user)
- [ ] Test Supabase Storage upload (test file)
- [ ] Run script and verify all connections work
- [ ] Document test results

**Task 9: Update Documentation (1 hour)**
- [ ] Document Supabase setup in README
- [ ] Add environment variable instructions
- [ ] Document auth flow (email OTP process)
- [ ] Add troubleshooting section:
  - Connection errors
  - Auth errors
  - Storage upload errors
- [ ] Create team onboarding guide for Supabase

**Task 10: Integration Testing (1.5 hours)**
- [ ] Test full Prisma → Supabase PostgreSQL flow
- [ ] Test auth sign up → verify OTP → sign in flow
- [ ] Test storage upload and public URL retrieval
- [ ] Verify all environment variables work
- [ ] Test on clean machine (or ask teammate to test)
- [ ] Fix any issues discovered

**Success Criteria:**
- [ ] Supabase project created and accessible
- [ ] Prisma connected to Supabase PostgreSQL
- [ ] Supabase Auth configured with email OTP
- [ ] Storage bucket created and accessible
- [ ] Helper functions work correctly
- [ ] Documentation complete

---

### Story 1.6: Implement Services API Endpoints

**Assigned To:** Dev 3 (Backend Specialist - API)  
**Branch:** `epic1/1.6-services-api`  
**Dependencies:** 1.3 (Prisma Schema) ✅, 1.5 (Express Foundation) ✅  
**Blocks:** 1.10 (Integration)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Create Service Routes File (0.5 hour)**
- [ ] Create src/routes/services.routes.ts
- [ ] Set up Express Router
- [ ] Define route structure:
  - GET /api/v1/services
  - GET /api/v1/services/featured
  - GET /api/v1/services/:id
  - GET /api/v1/services/categories
- [ ] Export router and mount in main routes

**Task 2: Create Service Controller Structure (1 hour)**
- [ ] Create src/controllers/services.controller.ts
- [ ] Create controller functions:
  - getAllServices()
  - getFeaturedServices()
  - getServiceById()
  - getServiceCategories()
- [ ] Add proper request/response typing
- [ ] Add basic error handling

**Task 3: Implement GET /services Endpoint (2 hours)**
- [ ] Create service in src/services/service.service.ts
- [ ] Implement Prisma query for all services
- [ ] Add pagination support:
  ```typescript
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  ```
- [ ] Add category filter:
  ```typescript
  where: { categoryId: req.query.categoryId }
  ```
- [ ] Include category relationship in query
- [ ] Return proper response format:
  ```json
  {
    "data": [...],
    "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
  }
  ```
- [ ] Test with Postman

**Task 4: Implement GET /services/featured Endpoint (0.5 hour)**
- [ ] Add Prisma query filtering featured=true
- [ ] Return services in same format as GET /services
- [ ] Test endpoint returns only featured services

**Task 5: Implement GET /services/:id Endpoint (1 hour)**
- [ ] Parse id from req.params
- [ ] Query Prisma with findUnique()
- [ ] Include category relationship
- [ ] Handle 404 if service not found
- [ ] Return single service object
- [ ] Test with valid and invalid IDs

**Task 6: Implement GET /services/categories Endpoint (1 hour)**
- [ ] Create Prisma query for all categories
- [ ] Include _count to get service count per category
- [ ] Order by displayOrder
- [ ] Return array of categories
- [ ] Test endpoint

**Task 7: Add Request Validation (1 hour)**
- [ ] Create src/validators/services.validators.ts
- [ ] Add validation for query params:
  - page: must be positive integer
  - limit: must be 1-100
  - categoryId: must be valid UUID
- [ ] Add validation for :id param (must be UUID)
- [ ] Apply validators to routes
- [ ] Test validation with invalid inputs

**Task 8: Optimize Prisma Queries (1.5 hours)**
- [ ] Add proper includes for relationships
- [ ] Use select to limit returned fields if needed
- [ ] Verify indexes are being used (check query plan)
- [ ] Test query performance with sample data
- [ ] Document query optimization notes

**Task 9: Add Error Handling (1 hour)**
- [ ] Wrap controller functions in try-catch
- [ ] Handle Prisma errors (not found, connection, etc.)
- [ ] Return consistent error format
- [ ] Test error scenarios:
  - Invalid ID format
  - Service not found
  - Database connection error
- [ ] Log errors with Winston

**Task 10: Create API Tests and Documentation (1.5 hours)**
- [ ] Test all endpoints manually with Postman/Thunder Client
- [ ] Create Postman collection (export as JSON)
- [ ] Test pagination edge cases
- [ ] Test category filtering
- [ ] Document all endpoints in README:
  - URL, method, params, response format
  - Example requests and responses
- [ ] Verify all 10 acceptance criteria met

**Success Criteria:**
- [ ] GET /services returns paginated services
- [ ] GET /services/featured returns only featured
- [ ] GET /services/:id returns single service or 404
- [ ] GET /services/categories returns all categories
- [ ] Pagination works correctly
- [ ] Category filtering works
- [ ] Validation prevents invalid requests
- [ ] Errors return consistent format
- [ ] All endpoints tested and working

---

### Wave 2 Sync Points

**Daily Standup:**
- Dev 1: Router setup progress? Layout done?
- Dev 2: Supabase connection working? Auth configured?
- Dev 3: How many endpoints done? Any query issues?

**Dependency Check:**
- Dev 3 may need sample data from Dev 2 (Story 1.3 schema)
- If Dev 2 is blocked, Dev 3 can use hardcoded test data temporarily

**Wave 2 Complete Checklist:**
- [ ] All 3 stories merged
- [ ] Frontend has working navigation
- [ ] Backend has Supabase connection
- [ ] Services API returns data
- [ ] Team demo of Wave 2 features

---

## WAVE 3: Data & UI Completion 🎨

**Duration:** 1 day (8 hours per dev)  
**Parallelism:** ⚠️ Partial (2 developers active)  
**Critical Path:** ✅ Both stories needed for Wave 4

### Team Assignment

| Developer | Story | Focus Area | Est. Time | Depends On |
|-----------|-------|------------|-----------|------------|
| **Dev 1 (FE)** | 1.9 Homepage + Featured Services | UI implementation | 1 day | 1.8 ✅, 1.2 ✅ |
| **Dev 2 (BE-DB)** | 1.7 Database Seed | Data population | 0.5-1 day | 1.3 ✅, 1.4 ✅ |
| **Dev 3 (BE-API)** | 💤 Rest / Code Review | Support | - | - |

**Note:** Dev 3 can take a break, or help with:
- Code review for Stories 1.7 and 1.9
- Bug fixes from previous waves
- Documentation improvements
- Start researching Epic 2

---

### Story 1.9: Build Homepage with Hero Section and Featured Services

**Assigned To:** Dev 1 (Frontend Specialist)  
**Branch:** `epic1/1.9-homepage`  
**Dependencies:** 1.8 (React Router) ✅, 1.2 (Tailwind) ✅  
**Blocks:** 1.10 (Integration)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Create Homepage Component Structure (0.5 hour)**
- [ ] Create src/pages/Home.tsx
- [ ] Set up component structure (Hero + Services sections)
- [ ] Add to router configuration
- [ ] Verify route renders

**Task 2: Build Hero Section Layout (1.5 hours)**
- [ ] Create HeroSection component
- [ ] Add background image placeholder (gradient or solid color)
- [ ] Add headline text: "Chào mừng đến với [Clinic Name]"
- [ ] Add subheadline/tagline
- [ ] Add prominent "Đặt Lịch Ngay" (Book Now) button
- [ ] Style with Tailwind:
  - Full viewport height on desktop (h-screen)
  - 60vh on mobile (md:h-screen)
- [ ] Make responsive

**Task 3: Style Hero Section (1 hour)**
- [ ] Use shadcn Button for CTA
- [ ] Add gradient overlay on background image
- [ ] Center-align content
- [ ] Add subtle animation (fade-in on load)
- [ ] Test on different screen sizes
- [ ] Optimize for mobile (text size, spacing)

**Task 4: Create Service Card Component (1.5 hours)**
- [ ] Create src/components/ServiceCard.tsx
- [ ] Design card layout:
  - Service image (placeholder or from data)
  - Service name (h3)
  - Brief description (truncate to 2 lines)
  - Duration (e.g., "60 phút")
  - Price (e.g., "500.000 ₫")
  - "Xem Thêm" (Learn More) button
- [ ] Use shadcn Card component as base
- [ ] Style with Tailwind
- [ ] Make card hoverable (shadow, scale)

**Task 5: Build Featured Services Grid (1 hour)**
- [ ] Create FeaturedServices section component
- [ ] Add section title: "Dịch Vụ Nổi Bật"
- [ ] Create responsive grid:
  - 1 column on mobile (<768px)
  - 2 columns on tablet (768-1024px)
  - 4 columns on desktop (>1024px)
- [ ] Map ServiceCard for each service
- [ ] Add proper spacing (gap-4, gap-6)

**Task 6: Set Up Axios API Client (1 hour)**
- [ ] Create src/lib/api.ts
- [ ] Configure Axios instance:
  ```typescript
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
  });
  ```
- [ ] Add error interceptor for 4xx/5xx
- [ ] Export API client
- [ ] Test basic GET request

**Task 7: Implement Data Fetching (1.5 hours)**
- [ ] Use useState and useEffect in Home component
- [ ] Fetch featured services:
  ```typescript
  const response = await api.get('/api/v1/services/featured');
  setServices(response.data.data);
  ```
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Update service cards with real data

**Task 8: Create Loading State (0.5 hour)**
- [ ] Create skeleton cards using shadcn Skeleton
- [ ] Show 4 skeleton cards in grid while loading
- [ ] Add loading spinner alternative
- [ ] Test by adding delay to API call

**Task 9: Create Error State (0.5 hour)**
- [ ] Design error message component
- [ ] Add "Retry" button
- [ ] Display friendly error message
- [ ] Test by breaking API endpoint
- [ ] Handle no data case (empty array)

**Task 10: Polish and Responsive Testing (1.5 hours)**
- [ ] Add proper spacing and typography hierarchy
- [ ] Ensure colors match Tailwind palette
- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1440px, 1920px)
- [ ] Verify images load correctly
- [ ] Test with real data from backend
- [ ] Fix any visual issues

**Success Criteria:**
- [ ] Homepage component created and renders
- [ ] Hero section full-viewport on desktop, 60vh mobile
- [ ] Featured services fetch from API successfully
- [ ] Service cards display: image, name, description, duration, price
- [ ] Grid responsive: 1 col mobile, 2 tablet, 4 desktop
- [ ] Loading state shows skeleton cards
- [ ] Error state shows retry button
- [ ] "Learn More" links to service detail (placeholder)
- [ ] Homepage visually polished and responsive
- [ ] Real data displays correctly

---

### Story 1.7: Create Database Seed Script with Initial Data

**Assigned To:** Dev 2 (Backend Specialist - Database)  
**Branch:** `epic1/1.7-database-seed`  
**Dependencies:** 1.3 (Prisma Schema) ✅, 1.4 (Supabase) ✅  
**Blocks:** 1.10 (Integration)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Set Up Seed Script Structure (0.5 hour)**
- [ ] Create prisma/seed.ts
- [ ] Import PrismaClient
- [ ] Create main() async function
- [ ] Add error handling and cleanup
- [ ] Configure package.json:
  ```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
  ```

**Task 2: Create Service Categories Data (1 hour)**
- [ ] Define 3+ service categories:
  - "Chăm Sóc Da Mặt" (Facial Care)
  - "Điều Trị Cơ Thể" (Body Treatments)
  - "Thẩm Mỹ" (Aesthetic Procedures)
- [ ] Add displayOrder, slugs, icons
- [ ] Create with Prisma:
  ```typescript
  await prisma.serviceCategory.createMany({ data: categories });
  ```
- [ ] Log created categories

**Task 3: Create Services Data (2 hours)**
- [ ] Define 8+ services with varied data:
  - Anti-Aging Facial (500.000 ₫, 60 min)
  - Deep Tissue Massage (700.000 ₫, 90 min)
  - Laser Hair Removal (1.200.000 ₫, 45 min)
  - Hydrating Facial (400.000 ₫, 60 min)
  - etc.
- [ ] Assign categoryId to each service
- [ ] Add descriptions (Vietnamese)
- [ ] Mark 4 services as featured=true
- [ ] Add placeholder image URLs (use placeholder.com or similar)
- [ ] Create with Prisma
- [ ] Verify relationships

**Task 4: Create Branch Locations Data (1.5 hours)**
- [ ] Define 2+ branches:
  - Branch 1: Downtown (Trung Tâm)
  - Branch 2: Westside (Phía Tây)
- [ ] Add complete addresses (Vietnamese)
- [ ] Add coordinates (lat/lng - real or placeholder)
- [ ] Define operating hours JSON:
  ```json
  {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" },
    ...
  }
  ```
- [ ] Add phone numbers, emails
- [ ] Add placeholder images
- [ ] Create with Prisma

**Task 5: Add Placeholder Image URLs (0.5 hour)**
- [ ] Use placeholder image service:
  - https://placehold.co/600x400/png?text=Service+1
  - Or use Unsplash placeholder API
- [ ] Add 2-3 images per service
- [ ] Add 1-2 images per branch
- [ ] Verify URLs are accessible

**Task 6: Make Seed Script Idempotent (1 hour)**
- [ ] Check if data already exists before creating
- [ ] Use upsert instead of create where appropriate:
  ```typescript
  await prisma.serviceCategory.upsert({
    where: { slug: 'facial-care' },
    update: {},
    create: { ... }
  });
  ```
- [ ] Or delete existing data first (for dev environment)
- [ ] Add flag to control behavior
- [ ] Test running seed multiple times

**Task 7: Add Seed Data Validation (0.5 hour)**
- [ ] Verify all required fields present
- [ ] Check foreign key relationships valid
- [ ] Validate data types (prices, durations)
- [ ] Add console logs for progress
- [ ] Handle validation errors gracefully

**Task 8: Create Verification Queries (1 hour)**
- [ ] After seeding, run verification queries:
  ```typescript
  const categoryCount = await prisma.serviceCategory.count();
  const serviceCount = await prisma.service.count();
  const branchCount = await prisma.branch.count();
  console.log(`Created: ${categoryCount} categories, ${serviceCount} services, ${branchCount} branches`);
  ```
- [ ] Check featured services count
- [ ] Verify relationships (services have categories)
- [ ] Log success message

**Task 9: Run and Test Seed Script (1 hour)**
- [ ] Run seed command: `npx prisma db seed`
- [ ] Verify output shows all data created
- [ ] Check Supabase dashboard for data
- [ ] Test in Prisma Studio: `npx prisma studio`
- [ ] Run seed again to test idempotency
- [ ] Fix any errors

**Task 10: Document Seed Script (0.5 hour)**
- [ ] Add comments to seed.ts explaining data
- [ ] Document how to run seed in README
- [ ] Document how to reset data:
  ```bash
  npx prisma migrate reset
  npx prisma db seed
  ```
- [ ] Add troubleshooting tips
- [ ] Document placeholder image sources

**Success Criteria:**
- [ ] Seed script in prisma/seed.ts
- [ ] Creates 3+ service categories
- [ ] Creates 8+ services with varied data
- [ ] 4+ services marked as featured
- [ ] Creates 2+ branches with full info
- [ ] Placeholder images added
- [ ] Script is idempotent (can run multiple times)
- [ ] `prisma db seed` command works
- [ ] Verification confirms data exists
- [ ] Relationships correct (services→categories)

---

### Wave 3 Sync Points

**Mid-Wave Check:**
- [ ] Dev 1: Homepage loading data from API?
- [ ] Dev 2: Seed script running? Data in Supabase?
- [ ] Dev 3: Any code review feedback for team?

**Wave 3 Complete:**
- [ ] Homepage displays featured services with real data
- [ ] Database has seed data for testing
- [ ] Ready for full integration testing

---

## WAVE 4: Integration & Verification ✅

**Duration:** 0.5 day (4 hours)  
**Parallelism:** 🤝 Team effort (all 3 developers)  
**Critical Path:** ✅ Final gate before Epic 1 complete

### Team Assignment

| Developer | Story | Focus Area | Est. Time |
|-----------|-------|------------|-----------|
| **Dev 1** | 1.10 Integration (Lead) | Frontend-Backend connection | 2-3 hours |
| **Dev 2** | 1.10 Support + Testing | Backend verification | 1-2 hours |
| **Dev 3** | 1.10 Support + Testing | End-to-end testing | 1-2 hours |

---

### Story 1.10: Connect Frontend to Backend and Deploy Locally

**Assigned To:** Dev 1 (Lead), Dev 2 & 3 (Support)  
**Branch:** `epic1/1.10-integration`  
**Dependencies:** ALL previous stories ✅  
**Blocks:** None (Epic 1 complete!)

#### Detailed Task Breakdown (10 Tasks)

**Task 1: Configure Frontend Environment Variables (0.5 hour)**  
**Owner:** Dev 1
- [ ] Create apps/web/.env
- [ ] Add: `VITE_API_BASE_URL=http://localhost:3000`
- [ ] Create apps/web/.env.example template
- [ ] Update .gitignore to exclude .env
- [ ] Document env vars in README

**Task 2: Verify Axios Configuration (0.5 hour)**  
**Owner:** Dev 1
- [ ] Review src/lib/api.ts
- [ ] Verify base URL uses VITE_API_BASE_URL
- [ ] Test error interceptor
- [ ] Add request logging (console.log for debugging)
- [ ] Test with curl or Postman first

**Task 3: Verify CORS Configuration (0.5 hour)**  
**Owner:** Dev 2
- [ ] Check Express CORS config allows http://localhost:5173
- [ ] Test preflight OPTIONS requests
- [ ] Fix any CORS errors in browser console
- [ ] Document CORS setup

**Task 4: Test Frontend→Backend Connection (1 hour)**  
**Owners:** Dev 1 & Dev 2
- [ ] Start both apps: `npm run dev`
- [ ] Open frontend: http://localhost:5173
- [ ] Open browser DevTools → Network tab
- [ ] Verify homepage fetches from /api/v1/services/featured
- [ ] Check response status 200
- [ ] Verify data displays on homepage
- [ ] Fix any connection errors

**Task 5: Test Full Data Flow (1 hour)**  
**Owners:** All 3 devs
- [ ] Frontend fetches featured services from API
- [ ] API queries database via Prisma
- [ ] Database returns seed data
- [ ] Data displays correctly on homepage
- [ ] Images load (placeholder URLs work)
- [ ] Click "Learn More" navigates (even if placeholder)
- [ ] Test on different browsers (Chrome, Firefox, Safari)

**Task 6: Test All Navigation Routes (0.5 hour)**  
**Owner:** Dev 1 & Dev 3
- [ ] Test each route in React Router:
  - / (Home) ✅
  - /services (placeholder)
  - /branches (placeholder)
  - /contact (placeholder)
  - /blog (placeholder)
  - /login (placeholder)
  - /register (placeholder)
- [ ] Verify 404 page for invalid routes
- [ ] Verify header/footer on all pages

**Task 7: Update Root README (1 hour)**  
**Owner:** Dev 2
- [ ] Update README.md with complete setup instructions:
  1. Prerequisites (Node.js 20, npm 10+)
  2. Clone repo
  3. Install: `npm install`
  4. Set up environment variables (both apps)
  5. Set up Supabase project
  6. Run migrations: `npx prisma migrate dev`
  7. Seed data: `npx prisma db seed`
  8. Start: `npm run dev`
- [ ] Add troubleshooting section
- [ ] Add technology stack summary
- [ ] Add project structure overview

**Task 8: Create Environment Templates (0.5 hour)**  
**Owner:** Dev 3
- [ ] Create apps/api/.env.example:
  ```
  PORT=3000
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_anon_key
  DATABASE_URL=your_database_url
  ```
- [ ] Create apps/web/.env.example:
  ```
  VITE_API_BASE_URL=http://localhost:3000
  ```
- [ ] Document how to copy and configure

**Task 9: Run Complete Verification Checklist (1 hour)**  
**Owners:** All 3 devs (divide and conquer)

**Frontend Verification (Dev 1):**
- [ ] Homepage loads without errors
- [ ] Featured services display with images
- [ ] Navigation works between pages
- [ ] Mobile responsive (test on DevTools mobile view)
- [ ] Loading states show correctly
- [ ] Error handling works (test by stopping backend)

**Backend Verification (Dev 2):**
- [ ] Health check: GET /api/health returns OK
- [ ] Services API: GET /api/v1/services returns data
- [ ] Featured API: GET /api/v1/services/featured returns data
- [ ] Categories API: GET /api/v1/services/categories returns data
- [ ] Pagination works
- [ ] Error handling returns proper format
- [ ] Logs show requests

**Database Verification (Dev 3):**
- [ ] Prisma Studio shows all seed data: `npx prisma studio`
- [ ] All tables populated (ServiceCategory, Service, Branch)
- [ ] Relationships correct (services have categories)
- [ ] Queries execute fast (<100ms)

**Task 10: Team Demo and Handoff (1 hour)**  
**Owners:** All 3 devs

**Demo Preparation:**
- [ ] Dev 1: Prepare frontend demo
- [ ] Dev 2: Prepare backend/database demo
- [ ] Dev 3: Prepare documentation review

**Demo Checklist:**
- [ ] Show homepage loading featured services
- [ ] Show responsive design on mobile
- [ ] Show API requests in Network tab
- [ ] Show database data in Prisma Studio
- [ ] Walk through README setup instructions
- [ ] Discuss any issues encountered

**Handoff Actions:**
- [ ] Merge all changes to main branch
- [ ] Tag release: `git tag epic1-complete`
- [ ] Create Epic 1 completion report
- [ ] Archive Wave notes
- [ ] Celebrate! 🎉

**Success Criteria:**
- [ ] Frontend env vars configured
- [ ] Axios successfully calls backend API
- [ ] Frontend displays data from backend
- [ ] CORS allows requests
- [ ] Both apps start with `npm run dev`
- [ ] README has complete setup instructions
- [ ] .env.example files created
- [ ] Homepage fully functional with real data
- [ ] All navigation routes working
- [ ] Verification checklist 100% complete

---

## 📅 GANTT CHART: Epic 1 Timeline

```
Day 1 (Monday)
==============
WAVE 0: Foundation
┌─────────────────────────────────────────────────┐
│ Dev 1/3 (Senior): Story 1.1 Monorepo Setup     │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 2: Idle/Research                            │ [░░░░░░░░░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
│ Dev 3: Idle/Research                            │ [░░░░░░░░░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘

Day 2 (Tuesday)
===============
WAVE 0 Complete → WAVE 1 Begins
┌─────────────────────────────────────────────────┐
│ Dev 1 (FE): Story 1.2 Tailwind/shadcn [Start]  │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
│ Dev 2 (BE-DB): Story 1.3 Prisma Schema [Start] │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
│ Dev 3 (BE-API): Story 1.5 Express API [Start]  │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘

Day 3 (Wednesday)
=================
WAVE 1 Continues
┌─────────────────────────────────────────────────┐
│ Dev 1 (FE): Story 1.2 Tailwind/shadcn [Done]   │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 2 (BE-DB): Story 1.3 Prisma Schema [80%]   │ [████████████████░░░░]
└─────────────────────────────────────────────────┘
│ Dev 3 (BE-API): Story 1.5 Express API [Done]   │ [████████████████████]
└─────────────────────────────────────────────────┘

Day 4 (Thursday)
================
WAVE 1 Complete → WAVE 2 Begins
┌─────────────────────────────────────────────────┐
│ Dev 1 (FE): Story 1.8 React Router [Start]     │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
│ Dev 2 (BE-DB): Story 1.4 Supabase [Start]      │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
│ Dev 3 (BE-API): Story 1.6 Services API [Start] │ [████████░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘

Day 5 (Friday)
==============
WAVE 2 Continues
┌─────────────────────────────────────────────────┐
│ Dev 1 (FE): Story 1.8 React Router [Done]      │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 2 (BE-DB): Story 1.4 Supabase [80%]        │ [████████████████░░░░]
└─────────────────────────────────────────────────┘
│ Dev 3 (BE-API): Story 1.6 Services API [90%]   │ [██████████████████░░]
└─────────────────────────────────────────────────┘

Day 6 (Monday - Week 2)
=======================
WAVE 2 Complete → WAVE 3 Begins
┌─────────────────────────────────────────────────┐
│ Dev 1 (FE): Story 1.9 Homepage [Start→Done]    │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 2 (BE-DB): Story 1.7 Seed Data [Start→Done]│ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 3 (BE-API): Code Review / Rest             │ [▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░]
└─────────────────────────────────────────────────┘

Day 7 (Tuesday)
===============
WAVE 3 Complete → WAVE 4 Integration
┌─────────────────────────────────────────────────┐
│ Dev 1: Story 1.10 Integration [Lead]           │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 2: Story 1.10 Support + Testing            │ [████████████████████]
└─────────────────────────────────────────────────┘
│ Dev 3: Story 1.10 Support + Testing            │ [████████████████████]
└─────────────────────────────────────────────────┘

Day 8+ (Wednesday+)
===================
🎉 EPIC 1 COMPLETE! → Begin Epic 2
┌─────────────────────────────────────────────────┐
│ Team: Epic 2 Planning & Story 2.1              │ [████░░░░░░░░░░░░░░░░]
└─────────────────────────────────────────────────┘
```

---

## Legend

```
████ - Active work
░░░░ - Idle/waiting
▓▓▓▓ - Support/review work
```

---

## 📊 Detailed Timeline by Developer

### Developer 1 (Frontend Specialist)

```
Day 1:   [░░░░] Wait for Wave 0 (or do Wave 0 if senior)
Day 2-3: [████] Story 1.2 Tailwind/shadcn (1-1.5 days)
Day 4-5: [████] Story 1.8 React Router (1 day)
Day 6:   [████] Story 1.9 Homepage (1 day)
Day 7:   [████] Story 1.10 Integration (Lead, 0.5 day)
─────────────────────────────────────────────────────
Total:   6.5-7 days of work
```

### Developer 2 (Backend - Database)

```
Day 1:   [░░░░] Wait for Wave 0
Day 2-3: [████] Story 1.3 Prisma Schema (1.5-2 days)
Day 4-5: [████] Story 1.4 Supabase (1.5 days)
Day 6:   [████] Story 1.7 Seed Data (0.5-1 day)
Day 7:   [████] Story 1.10 Support (0.5 day)
─────────────────────────────────────────────────────
Total:   5-6 days of work
```

### Developer 3 (Backend - API)

```
Day 1:   [████] Story 1.1 Monorepo (if senior, 1-1.5 days)
Day 2-3: [████] Story 1.5 Express API (1-1.5 days)
Day 4-5: [████] Story 1.6 Services API (1-1.5 days)
Day 6:   [▓▓▓▓] Code Review / Rest
Day 7:   [████] Story 1.10 Support (0.5 day)
─────────────────────────────────────────────────────
Total:   5-6 days of work
```

---

## 🎯 Critical Path Analysis

**Longest Path (Critical):**
```
1.1 (1.5d) → 1.3 (2d) → 1.4 (1.5d) → 1.7 (1d) → 1.10 (0.5d) = 6.5 days
```

**Parallel Paths:**
- Path A: 1.1 → 1.2 → 1.8 → 1.9 → 1.10 = 5.5 days
- Path B: 1.1 → 1.5 → 1.6 → 1.10 = 4.5 days

**Result:** Epic 1 completion in **7-9 working days** (accounting for integration time and buffers)

---

## 🚨 Risk Mitigation Plan

### Wave 0 Risks

**Risk:** Monorepo setup takes longer than 1.5 days  
**Impact:** Blocks entire team  
**Mitigation:**
- Assign most senior developer
- Allocate 2 days if needed (10% buffer)
- Have backup developer available for questions

### Wave 1-2 Risks

**Risk:** Merge conflicts when integrating 3 parallel branches  
**Impact:** Delays Wave completion  
**Mitigation:**
- Daily pull from main and merge locally
- Use clear branch naming: epic1/1.2-tailwind
- Review PRs promptly (same day)

**Risk:** Dev 3 (Services API) blocked waiting for schema  
**Impact:** Dev 3 idle time  
**Mitigation:**
- Dev 3 can use hardcoded test data initially
- Dev 2 shares schema early (even before migration)
- Dev 3 can start API structure without data queries

### Wave 3-4 Risks

**Risk:** Frontend-backend integration fails  
**Impact:** Cannot complete Epic 1  
**Mitigation:**
- Test API endpoints independently first (Postman)
- Test CORS early
- Have all 3 devs available for debugging

---

## 📞 Communication Plan

### Daily Standup (15 minutes, 9:00 AM)

**Format:**
1. Each dev answers:
   - What did I complete yesterday?
   - What will I complete today?
   - Any blockers?
2. Identify dependencies
3. Adjust timeline if needed

**Example:**
```
Dev 1: "Completed Tailwind setup (1.2). Today: Start React Router (1.8). No blockers."
Dev 2: "Prisma schema 80% done (1.3). Today: Finish migration, start Supabase (1.4). No blockers."
Dev 3: "Express API done (1.5). Today: Start Services API (1.6). Need schema from Dev 2."
Action: Dev 2 shares schema file with Dev 3 immediately.
```

### Wave Completion Meetings (30 minutes)

**After each wave:**
- Demo what each dev built
- Verify integration between stories
- Identify any issues to fix
- Plan next wave assignments

### Slack/Discord Updates

**Channel: #epic1-progress**
- Post when starting a story
- Post when completing a story
- Post if blocked (immediate ping)
- Share helpful resources/tips

---

## ✅ Success Metrics

**Epic 1 Complete When:**
- [ ] All 10 stories merged to main
- [ ] `npm run dev` starts both apps
- [ ] Homepage displays featured services from database
- [ ] All acceptance criteria met (100/100)
- [ ] No critical bugs
- [ ] README complete and tested by non-dev
- [ ] Team demo successful

**Team Velocity:**
- Target: 7-9 days for 10 stories
- Actual: ___ days (track for future planning)
- Stories per dev-day: ~0.4-0.5 (10 stories / 3 devs / 7 days)

---

## 🎉 Wave Completion Celebrations

After each wave, celebrate small wins:
- Wave 1: "Infrastructure complete! 🏗️"
- Wave 2: "Core features working! 🔄"
- Wave 3: "UI looking beautiful! 🎨"
- Wave 4: "Epic 1 DONE! Ship it! 🚀"

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-28  
**Owner:** John (Product Manager)  
**Next Review:** After Epic 1 completion

---

## 📎 Quick Reference Links

- **PRD:** `docs/prd/epic-1-foundation-core-infrastructure.md`
- **Architecture:** `docs/architecture/`
- **Stories:** `docs/stories/1.*.md` (when created)
- **Git Strategy:** TBD (see next section)

---

**END OF PARALLEL EXECUTION PLAN**

