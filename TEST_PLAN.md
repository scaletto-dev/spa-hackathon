# Testing Plan - Beauty Clinic Care Website

**Project:** Spa Hackathon - Beauty Clinic Care Website  
**Version:** 1.0  
**Date:** 2025-10-31  
**Status:** Active

---

## 📋 Executive Summary

This document outlines a comprehensive testing strategy for the Beauty Clinic Care Website, a full-stack monorepo application built with React (frontend) and Express.js (backend). The testing plan covers Unit Testing (UT), Integration Testing (IT), and end-to-end scenarios across 7 major epics.

**Project Architecture:**
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL (Supabase/Prisma)
- **Testing Framework:** Jest, React Testing Library (frontend), Supertest (backend)

---

## 🎯 Testing Scope & Objectives

### Scope
- ✅ Core business features (booking, reviews, authentication)
- ✅ API endpoints (CRUD operations, validation, error handling)
- ✅ Frontend components (forms, state management, user flows)
- ✅ Database operations (Prisma queries, migrations)
- ✅ Integration between frontend and backend

### Out of Scope
- ❌ Third-party libraries (Framer Motion, Recharts - assumed stable)
- ❌ Email delivery verification (template structure only)
- ❌ Payment gateway (VNPay) - mock testing only
- ❌ UI visual regression testing

### Key Objectives
1. Achieve **≥80% code coverage** for critical modules
2. Validate all API contracts between frontend and backend
3. Ensure data consistency across booking lifecycle
4. Validate error handling and user feedback
5. Test multilingual content rendering

---

## 📁 Module Breakdown & Test Cases

### **EPIC 1: Foundation & Core Infrastructure**

#### Module 1.1: Authentication System
**Files:** `auth.controller.ts`, `auth.service.ts`, `authMiddleware.ts`

**Unit Tests (UT):**
1. **UT-1.1.1:** JWT token generation
   - Input: Valid user ID, email
   - Expected: Token with correct payload, expiration
   - Method: Mock crypto functions

2. **UT-1.1.2:** Password hashing & comparison
   - Input: Password "123456"
   - Expected: Hash ≠ password, comparison returns true
   - Method: Mock bcrypt functions

3. **UT-1.1.3:** Token verification
   - Input: Valid token
   - Expected: Decoded payload extracted correctly
   - Input: Expired token
   - Expected: Error thrown with "Token expired"
   - Method: Spy on jwt.verify()

4. **UT-1.1.4:** Role-based access (RBAC)
   - Input: User role "ADMIN", accessing admin route
   - Expected: Access granted
   - Input: User role "GUEST", accessing admin route
   - Expected: 403 Forbidden
   - Method: Mock middleware

**Integration Tests (IT):**
1. **IT-1.1.1:** User registration flow
   - POST `/api/v1/auth/register` → User created, token returned
   - Verify: User in database, email unique validation
   - Expected Response:
     ```json
     {
       "success": true,
       "data": { "id": "uuid", "email": "user@test.com", "token": "jwt" },
       "timestamp": "ISO-8601"
     }
     ```

2. **IT-1.1.2:** User login flow
   - POST `/api/v1/auth/login` → Token returned
   - Verify: Correct credentials → success, wrong password → 401
   - Expected: Access token valid for authenticated requests

3. **IT-1.1.3:** Token refresh
   - POST `/api/v1/auth/refresh` with refresh token
   - Expected: New access token returned

---

#### Module 1.2: Database & Schema
**Files:** `schema.prisma`, `repositories/base.repository.ts`

**Unit Tests (UT):**
1. **UT-1.2.1:** Prisma model validation
   - Input: Valid user object with all required fields
   - Expected: No validation errors
   - Input: Missing required field (email)
   - Expected: Validation error thrown

2. **UT-1.2.2:** Relationship integrity
   - Input: Create booking with non-existent serviceId
   - Expected: FK constraint error
   - Method: Mock Prisma client

**Integration Tests (IT):**
1. **IT-1.2.1:** Database migration
   - Run `prisma migrate deploy`
   - Expected: Schema created, all tables exist
   - Verify table structure: columns, constraints, indexes

2. **IT-1.2.2:** Data persistence
   - Create user → Query user → Update user → Verify changes persisted
   - Expected: All operations succeed, data consistent

---

### **EPIC 2: Service Discovery & Information**

#### Module 2.1: Services API
**Files:** `services.controller.ts`, `services.service.ts`, `services.repository.ts`

**Unit Tests (UT):**
1. **UT-2.1.1:** Get all services with pagination
   - Input: page=1, limit=10
   - Expected: 10 services returned, pagination metadata correct
   - Input: page=999
   - Expected: Empty array, total=0

2. **UT-2.1.2:** Service filtering
   - Input: categoryId="hair-care"
   - Expected: Only "hair-care" services returned
   - Method: Mock repository.findByCategory()

3. **UT-2.1.3:** Search functionality
   - Input: searchText="massage"
   - Expected: Services with "massage" in name/description
   - Input: searchText="xyz123"
   - Expected: Empty array

4. **UT-2.1.4:** Service price validation
   - Input: price=-100
   - Expected: Validation error "Price must be positive"
   - Input: price=5500000
   - Expected: Service created successfully

**Integration Tests (IT):**
1. **IT-2.1.1:** GET `/api/v1/services`
   - Expected Response:
     ```json
     {
       "success": true,
       "data": [
         {
           "id": "uuid",
           "name": "Massage 60 min",
           "price": 500000,
           "duration": "60",
           "category": "massage"
         }
       ],
       "meta": { "page": 1, "limit": 10, "total": 45 }
     }
     ```

2. **IT-2.1.2:** GET `/api/v1/services/:id`
   - Expected: Single service with full details
   - Include related data: category, ratings, reviews count

3. **IT-2.1.3:** Search API `/api/v1/services/search?q=spa`
   - Expected: Matching services in results

---

#### Module 2.2: Branches API
**Files:** `branches.controller.ts`, `branches.service.ts`

**Unit Tests (UT):**
1. **UT-2.2.1:** Operating hours validation
   - Input: openTime="09:00", closeTime="18:00"
   - Expected: Valid
   - Input: openTime="18:00", closeTime="09:00"
   - Expected: Error "Close time must be after open time"

2. **UT-2.2.2:** Nearby branch calculation
   - Input: lat=10.7769, lng=106.6966 (Ho Chi Minh), radius=5km
   - Expected: Only branches within 5km returned
   - Method: Mock geospatial calculation

**Integration Tests (IT):**
1. **IT-2.2.1:** GET `/api/v1/branches`
   - Expected: All branches with address, phone, hours

2. **IT-2.2.2:** GET `/api/v1/branches/nearby?lat=X&lng=Y&radius=5`
   - Expected: Branches sorted by distance

---

### **EPIC 3: Guest Booking Flow**

#### Module 3.1: Booking API
**Files:** `booking.controller.ts`, `booking.service.ts`, `booking.repository.ts`

**Unit Tests (UT):**
1. **UT-3.1.1:** Appointment time validation
   - Input: time="09:00" (within 08:00-18:00)
   - Expected: Valid
   - Input: time="07:00" (before 08:00)
   - Expected: Error "Appointments must be between 08:00 and 18:00"

2. **UT-3.1.2:** Booking date validation
   - Input: date = tomorrow, time valid
   - Expected: Valid
   - Input: date = past date
   - Expected: Error "Cannot book past dates"
   - Input: date = 2 years in future
   - Expected: Error "Cannot book more than 1 year in advance"

3. **UT-3.1.3:** Therapist availability check
   - Input: therapistId="123", date="2025-11-15", time="10:00"
   - If slot free: Expected: Valid
   - If slot taken: Expected: Error "Therapist not available"
   - Method: Query therapist bookings for that time

4. **UT-3.1.4:** Price calculation with promo
   - Input: services=[service1(500k), service2(300k)], promoCode="SAVE20"
   - subtotal = 800k
   - discount = 160k (20%)
   - tax = (800k - 160k) * 0.08 = 51.2k
   - total = 691.2k
   - Expected: All calculations correct

5. **UT-3.1.5:** Service availability
   - Input: Booking service that's disabled
   - Expected: Error "Service no longer available"

**Integration Tests (IT):**
1. **IT-3.1.1:** POST `/api/v1/bookings` - Guest booking
   - Payload:
     ```json
     {
       "serviceIds": ["service-uuid"],
       "branchId": "branch-uuid",
       "appointmentDate": "2025-11-15",
       "appointmentTime": "10:00",
       "guestName": "John Doe",
       "guestEmail": "john@example.com",
       "guestPhone": "0901234567",
       "paymentType": "ATM"
     }
     ```
   - Expected Response:
     ```json
     {
       "success": true,
       "data": {
         "id": "booking-uuid",
         "referenceNumber": "BEA123456",
         "status": "CONFIRMED",
         "totalPrice": 540000
       }
     }
     ```
   - Verify: Booking in database, email queued, therapist availability updated

2. **IT-3.1.2:** GET `/api/v1/bookings/:referenceNumber`
   - Expected: Booking details returned with service info

3. **IT-3.1.3:** Booking with promo code
   - Create booking with valid promo
   - Expected: Discount applied, total price reduced
   - Use invalid promo
   - Expected: Error "Invalid promo code"

4. **IT-3.1.4:** Payment state consistency
   - Create booking with ATM payment
   - Payment status = PENDING
   - After VNPay callback: Payment status = PAID
   - Verify: Booking status updated to CONFIRMED

5. **IT-3.1.5:** Double booking prevention
   - Therapist has 1 available slot at 10:00
   - User 1 books slot 1 (should succeed)
   - User 2 attempts same slot (should fail with "Not available")
   - Verify race condition handled

---

#### Module 3.2: Email Notifications
**Files:** `email.service.ts`, `booking-confirmation.template.ts`

**Unit Tests (UT):**
1. **UT-3.2.1:** Email template rendering
   - Input: Booking data with services, branch, date
   - Expected: Template renders without errors
   - Verify: HTML valid, variables interpolated correctly

2. **UT-3.2.2:** Email validation
   - Input: email="test@example.com"
   - Expected: Valid
   - Input: email="invalid.email"
   - Expected: Error "Invalid email format"

**Integration Tests (IT):**
1. **IT-3.2.1:** Booking confirmation email sent
   - Create booking
   - Verify: Email queued/sent
   - Check: Recipient, subject, content correct

---

### **EPIC 4: Member Experience & Authentication**

#### Module 4.1: User Profile API
**Files:** `users.controller.ts`, `users.service.ts`

**Unit Tests (UT):**
1. **UT-4.1.1:** Profile update validation
   - Input: Update phone="0901234567" (valid)
   - Expected: Updated
   - Input: phone="invalid" 
   - Expected: Error "Invalid phone format"

2. **UT-4.1.2:** Profile picture upload
   - Input: File size=5MB (valid)
   - Expected: Accepted
   - Input: File size=50MB
   - Expected: Error "File too large (max 10MB)"

**Integration Tests (IT):**
1. **IT-4.1.1:** GET `/api/v1/profile` (authenticated)
   - Expected: User profile data returned
   - If not authenticated: 401 Unauthorized

2. **IT-4.1.2:** PATCH `/api/v1/profile`
   - Update profile fields
   - Verify: Changes persisted in database

3. **IT-4.1.3:** User booking history
   - GET `/api/v1/bookings` (authenticated)
   - Expected: User's bookings only (not other users')

---

### **EPIC 5: Content Management & Reviews**

#### Module 5.1: Reviews API
**Files:** `review.controller.ts`, `review.service.ts`, `review.repository.ts`

**Unit Tests (UT):**
1. **UT-5.1.1:** Review rating validation
   - Input: rating=5 (valid)
   - Expected: Accepted
   - Input: rating=6
   - Expected: Error "Rating must be 1-5"
   - Input: rating=-1
   - Expected: Error "Rating must be 1-5"

2. **UT-5.1.2:** Review text length
   - Input: text="Good service" (valid)
   - Expected: Accepted
   - Input: text="" (empty)
   - Expected: Error "Review text required"
   - Input: text = 5000+ characters
   - Expected: Error "Review too long (max 5000)"

3. **UT-5.1.3:** Review moderation status
   - Input: New review
   - Expected: status="PENDING" (awaiting approval)
   - Admin approves → status="APPROVED" → visible publicly

4. **UT-5.1.4:** Rating statistics calculation
   - Input: 10 reviews (7×5⭐, 2×4⭐, 1×3⭐)
   - Expected:
     - averageRating = (7×5 + 2×4 + 1×3) / 10 = 4.6
     - distribution: {5: 7, 4: 2, 3: 1, 2: 0, 1: 0}
     - totalReviews = 10

5. **UT-5.1.5:** Verified purchase badge
   - Input: User with completed booking for service
   - Expected: Review marked as verified
   - Input: User without booking
   - Expected: Review not verified

**Integration Tests (IT):**
1. **IT-5.1.1:** GET `/api/v1/reviews?page=1&limit=6`
   - Expected: Paginated approved reviews
   - Response includes: stats (avg rating, distribution, total)
   ```json
   {
     "success": true,
     "data": [...reviews],
     "meta": {"page": 1, "limit": 6, "total": 248, "totalPages": 42},
     "stats": {
       "averageRating": 4.8,
       "totalReviews": 248,
       "ratingDistribution": {5: 200, 4: 40, 3: 5, 2: 2, 1: 1}
     }
   }
   ```

2. **IT-5.1.2:** POST `/api/v1/reviews` (authenticated)
   - Create review for service with completed booking
   - Expected: Review created with status PENDING
   - Verify: Notification sent to admin

3. **IT-5.1.3:** Duplicate review prevention
   - User creates 2 reviews for same service
   - Expected: Error "You already reviewed this service"
   - Or: Second review replaces first

4. **IT-5.1.4:** Admin review moderation
   - GET `/api/v1/admin/reviews` → Pending reviews listed
   - PATCH `/api/v1/admin/reviews/:id/approve` → Approved
   - PATCH `/api/v1/admin/reviews/:id/reject` → Rejected
   - Expected: Review visibility/status updated accordingly

---

#### Module 5.2: Blog/News API
**Files:** `blog.controller.ts`, `blog.service.ts`

**Unit Tests (UT):**
1. **UT-5.2.1:** Blog post validation
   - Input: Valid title, content, tags
   - Expected: Accepted
   - Input: title="" (empty)
   - Expected: Error "Title required"

2. **UT-5.2.2:** SEO metadata
   - Input: slug="beauty-tips-2025"
   - Expected: Slug unique, formatted correctly

**Integration Tests (IT):**
1. **IT-5.2.1:** GET `/api/v1/blog/posts`
   - Expected: Published posts paginated

2. **IT-5.2.2:** GET `/api/v1/blog/posts/:slug`
   - Expected: Single post with content

---

### **EPIC 6: Admin Portal & Management**

#### Module 6.1: Admin Dashboard APIs
**Files:** `admin.controller.ts`, admin services

**Unit Tests (UT):**
1. **UT-6.1.1:** Admin authorization
   - Input: Non-admin user accessing admin endpoint
   - Expected: 403 Forbidden
   - Input: Admin user
   - Expected: Access granted

2. **UT-6.1.2:** Statistics calculation
   - Input: Bookings from past 30 days
   - Expected: Count, revenue, averages calculated correctly

**Integration Tests (IT):**
1. **IT-6.1.1:** GET `/api/v1/admin/dashboard/stats`
   - Expected:
     ```json
     {
       "totalBookings": 250,
       "totalRevenue": 125000000,
       "completedBookings": 240,
       "pendingBookings": 10,
       "averageRating": 4.8
     }
     ```

2. **IT-6.1.2:** Service management
   - POST create, PATCH update, DELETE service
   - Verify: Changes reflected in API

3. **IT-6.1.3:** Therapist management
   - Assign therapist to branch
   - Update availability
   - Verify: Reflected in booking flow

---

### **EPIC 7: Multilingual Support**

#### Module 7.1: i18n System
**Files:** `i18n/` resources, translation middleware

**Unit Tests (UT):**
1. **UT-7.1.1:** Language detection
   - Input: Accept-Language="vi-VN"
   - Expected: Vietnamese content returned
   - Input: Accept-Language="ja-JP"
   - Expected: Japanese content returned

2. **UT-7.1.2:** Missing translation fallback
   - Input: Text with missing Vietnamese translation
   - Expected: Falls back to English

**Integration Tests (IT):**
1. **IT-7.1.1:** Content in all 4 languages
   - Verify: Services, branches, blog posts available in VI, EN, JA, ZH

---

## 🔄 Frontend Testing Strategy

### Module: Booking Flow Components

#### Component Tests with React Testing Library

**Test Suite: BookingPayment Component**

1. **UT-F1:** Calculate total price with tax
   ```
   Given: Service price 5,000,000 VND
   When: Tax (8%) applied
   Then: Total = 5,400,000 VND
   ```

2. **UT-F2:** Display payment methods
   ```
   Given: User on payment step
   Then: ATM, E-Wallet, Pay at Clinic options visible
   When: User selects ATM
   Then: VNPay description shown
   ```

3. **IT-F1:** Submit booking with correct total
   ```
   Given: Subtotal 5,000,000, Tax 400,000, Total 5,400,000
   When: User clicks "Confirm"
   Then: API called with paymentAmount=5,400,000
   ```

**Test Suite: BookingConfirmation Component**

1. **UT-F3:** Display booking summary
   ```
   Given: Booking data (date, time, service, branch)
   Then: All details displayed correctly
   ```

2. **UT-F4:** Show total with tax breakdown
   ```
   Given: Booking confirmation
   Then: Show Subtotal + Tax + Total
   Verify: Total = Subtotal + Tax
   ```

**Test Suite: ReviewsPage**

1. **IT-F2:** Load reviews with stats in single API call
   ```
   Given: User navigates to /reviews
   When: Page loads
   Then: Single API call to GET /api/v1/reviews
   And: Stats included in response (average rating, distribution)
   And: Both paginated reviews and stats displayed
   ```

2. **UT-F5:** Filter reviews by rating
   ```
   Given: Filter dropdown with 1-5 stars
   When: User selects 5 stars
   Then: Only 5-star reviews shown
   ```

---

## 📊 Testing Coverage Targets

| Module | UT Coverage | IT Coverage | Overall |
|--------|-------------|-------------|---------|
| Authentication | 90% | 95% | 92% |
| Bookings | 85% | 90% | 87% |
| Reviews | 80% | 85% | 82% |
| Services | 85% | 90% | 87% |
| Payment | 80% | 90% | 85% |
| Frontend Components | 80% | 80% | 80% |
| **Total Target** | **85%** | **88%** | **86%** |

---

## 🛠️ Testing Tools & Setup

### Backend
```json
{
  "jest": "^29.0.0",
  "supertest": "^6.0.0",
  "@types/jest": "^29.0.0"
}
```

**Commands:**
```bash
npm run test                 # Run all tests
npm run test:coverage       # Coverage report
npm run test:watch         # Watch mode
npm run test -- booking    # Test specific module
```

### Frontend
```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "vitest": "^0.34.0"
}
```

**Commands:**
```bash
npm run test:ui            # UI mode
npm run test:coverage      # Coverage
```

---

## 📅 Testing Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Preparation** | Week 1 | Setup test infrastructure, create test data |
| **Unit Testing** | Week 2-3 | Write UT for core modules (auth, booking, reviews) |
| **Integration Testing** | Week 3-4 | Test API endpoints, database interactions |
| **Regression Testing** | Week 4 | Test critical user flows (bug fixes) |
| **UAT** | Week 5 | User acceptance testing with stakeholders |

---

## ✅ Pass Criteria

- ✅ All critical features have ≥80% code coverage
- ✅ 100% of API endpoints tested (requests + responses)
- ✅ All validation rules tested (valid + invalid inputs)
- ✅ Payment flow tested end-to-end
- ✅ No critical bugs found
- ✅ Performance acceptable (API <500ms, UI <1s load)
- ✅ Error messages clear and actionable

---

## 🐛 Bug Tracking Template

When issues found during testing:

```
Bug ID: BUG-001
Title: Booking confirmation total doesn't include tax
Module: BookingConfirmation
Severity: Critical
Steps to Reproduce:
  1. Select service (5,500,000 VND)
  2. Go to payment step (shows tax calculation: +440,000)
  3. Confirm booking
Expected: Total 5,940,000 (with tax)
Actual: Total 5,500,000 (without tax)
Affected Files: BookingConfirmation.tsx
Status: Fixed ✅
```

---

## 📝 Test Case Template

For future test implementation:

```
TC-[EPIC]-[MODULE]-[ID]
Title: [What is being tested]
Module: [Module name]
Type: UT / IT / E2E
Priority: Critical / High / Medium / Low

**Setup:**
- [Preconditions]

**Steps:**
1. [Action 1]
2. [Action 2]

**Expected Result:**
- [Expected outcome 1]
- [Expected outcome 2]

**Actual Result:**
- [Actual outcome] (fill after execution)

**Status:** PASS / FAIL
```

---

## 📖 References

- API Specification: `/docs/api-spec/`
- Architecture: `/docs/architecture.md`
- Database Schema: `/apps/backend/src/prisma/schema.prisma`
- Frontend Structure: `/docs/FRONTEND_STRUCTURE.md`

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-31  
**Next Review:** After Unit Testing Phase
