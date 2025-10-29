# API Completeness Verification - Action Items

**Priority:** CRITICAL → HIGH → MEDIUM → LOW  
**Owner:** Backend Team, Frontend Team, Both  
**Timeline:** Week 1-4

---

## Route-Level Missing APIs (Detail/List)

### ✅ COVERED Routes
- `/` - Home (no specific API needed, uses services/branches lists)
- `/services` - ✅ `GET /api/v1/services`
- `/branches` - ✅ `GET /api/v1/branches`
- `/login` - ✅ `POST /api/v1/auth/login`
- `/register` - ✅ `POST /api/v1/auth/register`
- `/admin/*` - ✅ Most CRUD endpoints exist

### ❌ MISSING Route APIs

**1. `/blog/:slug` - Blog Detail by Slug (PUBLIC)**
- Current: `GET /api/v1/blog/:id` (uses ID)
- Needed: `GET /api/v1/blog/:slug` (uses slug)
- FE Evidence: `BlogDetailPage.tsx:7` (slug lookup)
- Priority: MEDIUM
- Owner: Backend
- Action: Add slug-based endpoint OR add `slug` field to existing endpoint + add unique index

**2. `/contact` - Contact Form (PUBLIC)**
- Missing: `POST /api/v1/contact`
- FE Evidence: Route exists in `route-map.tsx`
- Priority: MEDIUM
- Owner: Backend
- Action: Implement contact form submission endpoint

**3. Client Profile Pages (Implied) (CLIENT)**
- Missing: `GET /api/v1/profile`
- Missing: `PATCH /api/v1/profile`
- FE Evidence: Auth system implies profile management
- Priority: HIGH
- Owner: Backend
- Action: Add profile CRUD endpoints

---

## Action-Level CTAs Missing APIs

### Client Booking Flow

**4. Availability Check (CRITICAL)**
- Missing: `GET /api/v1/bookings/availability`
- FE Component: `AvailabilityIndicator.tsx`
- User Action: Selects date/time, sees availability colors
- Query Params: `?serviceId=1&branchId=2&date=2025-10-30&therapistId=5`
- Response: Array of time slots with availability status
- Priority: CRITICAL
- Owner: Backend
- Estimated Effort: 3-5 days (needs scheduling logic)

**5. Staff Filtering (CRITICAL)**
- Missing: `GET /api/v1/staff/available`
- FE Component: `TherapistSelector.tsx`, `QuickBooking.tsx:249`
- User Action: Filters therapists by branch/service/date
- Query Params: `?branchId=2&serviceId=5&date=2025-10-30&time=14:00`
- Priority: CRITICAL
- Owner: Backend
- Estimated Effort: 2-3 days

**6. Promo Code Validation (MEDIUM)**
- Missing: `POST /api/v1/bookings/validate-promo`
- FE Component: `PromoCodeInput.tsx:19`
- User Action: Enters promo code, sees discount applied
- Priority: MEDIUM
- Owner: Backend
- Estimated Effort: 1-2 days

**7. Client Booking History (HIGH)**
- Missing: `GET /api/v1/profile/bookings`
- User Action: Client views past/upcoming bookings
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 1 day

### Admin CRUD Actions

**8. Bulk Delete Appointments (HIGH)**
- Missing: `POST /api/v1/admin/appointments/bulk-delete`
- FE Pattern: Table with checkboxes (standard admin pattern)
- User Action: Selects multiple rows, clicks "Delete Selected"
- Body: `{ ids: [1, 2, 3] }`
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 0.5 day per resource

**9. Bulk Delete Customers (HIGH)**
- Missing: `POST /api/v1/admin/customers/bulk-delete`
- FE Evidence: `Customers.tsx:91` (single delete exists)
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 0.5 day

**10. Bulk Update Appointment Status (MEDIUM)**
- Missing: `POST /api/v1/admin/appointments/bulk-update`
- User Action: Confirms/cancels multiple appointments at once
- Body: `{ ids: [1,2,3], status: "confirmed" }`
- Priority: MEDIUM
- Owner: Backend
- Estimated Effort: 0.5 day

**11. Staff Schedule View (HIGH)**
- Missing: `GET /api/v1/admin/staff/:id/schedule`
- FE Evidence: `Staff.tsx:64` (handleViewSchedule)
- User Action: Admin views therapist's weekly calendar
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 2-3 days (calendar logic)

**12. Customer Analytics (MEDIUM)**
- Missing: `GET /api/v1/admin/customers/:id/analytics`
- FE Evidence: `Customers.tsx:24` (retention: '95%')
- User Action: Admin views customer retention, spending patterns
- Priority: MEDIUM
- Owner: Backend
- Estimated Effort: 2 days (analytics calculation)

### Admin Analytics/Charts

**13. Dashboard Metrics - Complete Fields (HIGH)**
- Incomplete: `GET /api/v1/admin/dashboard/metrics`
- FE Evidence: `Dashboard.tsx:69-104`
- Missing Fields:
  - `bookingsChange: number`
  - `revenueChange: number`
  - `customersChange: number`
  - `aiRecommendations: number`
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 1 day (add percentage calculations)

**14. Revenue Chart Data (HIGH)**
- Missing: `GET /api/v1/admin/dashboard/revenue-chart`
- FE Evidence: `Dashboard.tsx:16-45` (hardcoded bookingData)
- User Action: Admin views 7/30/90-day revenue trend
- Query: `?period=7d|30d|90d`
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 1-2 days

**15. Service Distribution Chart (MEDIUM)**
- Missing: `GET /api/v1/admin/dashboard/service-distribution`
- FE Evidence: `Dashboard.tsx:47-66` (pie chart data)
- User Action: Admin sees which services are most popular
- Priority: MEDIUM
- Owner: Backend
- Estimated Effort: 1 day

**16. Payment Revenue Trend (HIGH)**
- Missing: `GET /api/v1/admin/payments/revenue-trend`
- FE Evidence: `Payments.tsx:17-52` (hardcoded revenueData)
- User Action: Admin views payment trends + method distribution
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 1-2 days

**17. Review Metrics (MEDIUM)**
- Missing: `GET /api/v1/admin/reviews/metrics`
- FE Evidence: `Reviews.tsx:109-142` (248 total, 85% positive)
- User Action: Admin sees review analytics summary
- Priority: MEDIUM
- Owner: Backend
- Estimated Effort: 1 day

### AI Features

**18. AI Blog Content Generator (LOW)**
- Missing: `POST /api/v1/admin/blog/ai-generate`
- FE Evidence: `Blog.tsx:57` (handleAIContentGenerator)
- User Action: Admin generates blog post draft using AI
- Priority: LOW (nice-to-have)
- Owner: Backend + AI/ML Team
- Estimated Effort: 3-5 days (AI integration)

**19. AI Staff Bio Generator (LOW)**
- Missing: `POST /api/v1/admin/staff/ai-generate-bio`
- FE Evidence: `Staff.tsx:102-103`
- User Action: Admin generates professional bio for therapist
- Priority: LOW
- Owner: Backend + AI/ML Team
- Estimated Effort: 2-3 days

### Location Features

**20. Nearby Branch Search (MEDIUM)**
- Missing: `GET /api/v1/branches/nearby`
- FE Evidence: `BranchMap.tsx:29` (Google Maps comment)
- User Action: Client finds nearest branch by location
- Query: `?lat=10.762622&lng=106.660172&radius=5000`
- Priority: MEDIUM
- Owner: Backend (geo-spatial queries)
- Estimated Effort: 2-3 days

---

## Upload/Export/Bulk Endpoints Missing

### Upload Endpoints

**21. Image Upload with Folder Routing (CRITICAL)**
- Current: `POST /api/v1/admin/uploads`
- Needed: `POST /api/v1/admin/uploads/:folder`
- FE Evidence: All admin modals (Services, Branches, Blog, Staff) upload images
- Folders: `services`, `branches`, `blog`, `staff`, `profile`
- Priority: CRITICAL
- Owner: Backend
- Action: Add folder parameter, organize storage by folder
- Estimated Effort: 1 day

**Fix Required:**
```typescript
// Current (generic)
POST /api/v1/admin/uploads

// Needed (folder-specific)
POST /api/v1/admin/uploads/services
POST /api/v1/admin/uploads/branches
POST /api/v1/admin/uploads/blog
POST /api/v1/admin/uploads/staff
POST /api/v1/admin/uploads/profile
```

### Export Endpoints

**22. Payment Report Export (HIGH)**
- Missing: `GET /api/v1/admin/payments/export`
- FE Evidence: `Payments.tsx:112` (handleExportReport)
- User Action: Admin exports payment data to CSV/Excel
- Query: `?format=csv|excel&dateFrom=2025-01-01&dateTo=2025-10-30&status=paid`
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 2 days (file generation)

**23. Generic Export Pattern (MEDIUM)**
- Recommend: Add export to all major admin resources
- Pattern: `GET /api/v1/admin/{resource}/export?format=csv|excel`
- Resources: appointments, customers, staff, reviews, blog, payments
- Priority: MEDIUM (after individual export endpoints)
- Owner: Backend
- Estimated Effort: 0.5 day per resource

---

## Auth/Scope Issues

### Clarification Needed

**24. Public vs Client vs Admin Scope (HIGH)**
- Issue: Some endpoints don't specify auth requirement
- Examples:
  - `GET /api/v1/services` - should be PUBLIC
  - `GET /api/v1/branches` - should be PUBLIC
  - `GET /api/v1/blog` - should be PUBLIC
  - `GET /api/v1/staff` - which one? Public list vs admin management?
- Action: Add explicit `Auth: public|client|admin` to ALL endpoints in spec
- Priority: HIGH
- Owner: Both teams (spec review)
- Estimated Effort: 1 hour (spec update)

**25. Staff Endpoint Ambiguity (HIGH)**
- Issue: Confusing - is staff endpoint public or admin?
- Current Spec: `GET /api/v1/admin/staff` (admin only)
- FE Needs: Public endpoint to filter available therapists
- Proposed:
  - `GET /api/v1/staff` (PUBLIC - limited fields: id, name, image, rating, specialties)
  - `GET /api/v1/staff/available` (PUBLIC - filtered by branch/service/date)
  - `GET /api/v1/admin/staff` (ADMIN - full CRUD)
- Priority: HIGH
- Owner: Backend
- Estimated Effort: 1 day

**26. Google OAuth Security (CRITICAL)**
- Issue: FE does client-side JWT parsing (INSECURE)
- FE Evidence: `useAuth.ts:178`
- Current Flow: FE parses Google JWT → stores user
- Correct Flow: FE sends credential → BE verifies with Google → returns session token
- Priority: CRITICAL
- Owner: Backend
- Action: Implement server-side Google OAuth verification
- Estimated Effort: 2-3 days

**27. Admin Domain Whitelist (CRITICAL)**
- Issue: Admin domain check done client-side (bypassable)
- FE Evidence: `useAuth.ts:337`
- Current: FE checks `email.endsWith('@allowed-domain.com')`
- Correct: BE enforces domain whitelist
- Priority: CRITICAL
- Owner: Backend
- Estimated Effort: 0.5 day

---

## Summary by Priority

### CRITICAL (Week 1)
1. Availability check endpoint (booking flow blocker)
2. Staff filtering endpoint (booking flow blocker)
3. Upload folder routing (all admin modals need this)
4. Google OAuth security fix
5. Admin domain whitelist enforcement

**Total Effort:** 8-12 days

### HIGH (Week 2)
6. Profile endpoints (GET, PATCH)
7. Client booking history
8. Bulk delete appointments/customers
9. Staff schedule view
10. Dashboard metrics (complete fields)
11. Revenue chart data
12. Payment revenue trend
13. Payment export
14. Auth scope clarification
15. Staff endpoint ambiguity resolution

**Total Effort:** 12-16 days

### MEDIUM (Week 3-4)
16. Promo code validation
17. Bulk update appointments
18. Customer analytics
19. Service distribution chart
20. Review metrics
21. Contact form submission
22. Blog by slug
23. Nearby branch search
24. Generic export pattern

**Total Effort:** 12-15 days

### LOW (Future)
25. AI blog generator
26. AI staff bio generator

**Total Effort:** 5-8 days

---

## Implementation Checklist

### Backend Team
- [ ] Week 1: Implement 5 CRITICAL endpoints
- [ ] Week 1: Fix 2 CRITICAL security issues
- [ ] Week 2: Implement 10 HIGH priority endpoints
- [ ] Week 2: Fix 12 field type mismatches
- [ ] Week 3: Implement 9 MEDIUM priority endpoints
- [ ] Week 4: Add pagination/sorting/filtering to all list endpoints
- [ ] Week 4: Document all query parameters

### Frontend Team
- [ ] Week 1: Update auth flow to use server-side verification
- [ ] Week 2: Add pagination UI components
- [ ] Week 2: Implement API envelope unwrapping
- [ ] Week 3: Add bulk action UI (checkboxes + buttons)
- [ ] Week 3: Add export buttons to admin tables
- [ ] Week 4: Replace all mock data with real API calls

### Both Teams
- [ ] Week 1: Review and agree on field types (IDs, enums, dates)
- [ ] Week 2: Agree on pagination/sorting/filtering conventions
- [ ] Week 3: Integration testing (FE ↔ BE)
- [ ] Week 4: End-to-end testing all workflows

---

## Risk Assessment

### High Risk
- **Availability check logic:** Complex scheduling/conflict detection
- **Google OAuth:** Third-party integration, security critical
- **Geo-spatial queries:** May need PostGIS or similar

### Medium Risk
- **Analytics calculations:** Performance concerns with large datasets
- **File uploads:** Storage limits, CDN integration
- **AI features:** Third-party API costs/quotas

### Low Risk
- **CRUD endpoints:** Standard patterns
- **Bulk operations:** Simple batch processing
- **Export endpoints:** CSV generation is straightforward

---

## Success Criteria

✅ All CRITICAL endpoints implemented (booking flow works end-to-end)  
✅ All HIGH priority endpoints implemented (admin workflows complete)  
✅ All field type mismatches fixed (FE maps to BE 1:1)  
✅ Security issues resolved (Google OAuth, admin whitelist)  
✅ Pagination, sorting, filtering working across all list endpoints  
✅ 0 mock data remaining in FE (all real API calls)  
✅ Integration tests passing for all major workflows

**Target Completion:** End of Week 4
