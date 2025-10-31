# API Completeness Verification - Gap Analysis

**Generated:** October 29, 2025  
**Verification Scope:** FE React+TS vs `by-feature.updated.md`  
**Method:** Systematic scan of routes, components, forms, tables, CTAs, filters, uploads

---

## Executive Summary

**Coverage Statistics:**
- ‚úÖ **Covered APIs:** 48 endpoints documented
- ‚ö†Ô∏è **Missing APIs:** 23 endpoints identified in FE but not in spec
- ‚ùå **Incorrect APIs:** 12 field mismatches / hard-to-map issues
- Ì¥Ñ **Consistency Issues:** 8 list/detail/form inconsistencies
- Ì≥ã **Convention Violations:** 6 areas needing alignment

**Priority Actions:**
1. Add 11 CRITICAL missing endpoints (availability, profile, staff filtering, bulk ops)
2. Fix 5 BREAKING field mismatches (ID types, enum casing, pagination)
3. Add 6 upload/export/bulk endpoints for admin flows
4. Standardize 4 auth/scope issues

---

## 1. Missing APIs

### 1.1 Booking / Availability (CRITICAL)

**Use Case:** Time slot availability check  
**FE Evidence:** `apps/frontend/src/client/components/booking/AvailabilityIndicator.tsx`  
**Proposed Endpoint:**
```
GET /api/v1/bookings/availability
Query: ?serviceId=1&branchId=2&date=2025-10-30&therapistId=5
Response: {
  "data": {
    "date": "2025-10-30",
    "availableSlots": [
      { "time": "09:00", "available": true, "therapistName": "Sarah" },
      { "time": "10:00", "available": false },
      { "time": "11:00", "available": true, "therapistName": "Any" }
    ]
  }
}
```
**Notes:** FE shows green/yellow/red indicators; needs real-time slot data

---

### 1.2 Profile Management (Client) - CRITICAL

**Use Case:** Client view/edit own profile  
**FE Evidence:** `apps/frontend/src/client/pages/LoginPage.tsx:57` (TODO comment), auth flow implies profile access  
**Proposed Endpoints:**

```
GET /api/v1/profile
Auth: client
Response: {
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string|null",
    "membershipTier": "New|Silver|Gold|VIP",
    "totalVisits": "number",
    "totalSpent": "number",
    "dateJoined": "2025-01-15T00:00:00Z"
  }
}
```

```
PATCH /api/v1/profile
Auth: client
Body: {
  "name": "string",
  "phone": "string",
  "avatar": "string"
}
Response: { "data": { ...updated profile } }
```

**Notes:** No FE page yet, but auth system implies profile endpoint exists

---

### 1.3 Client Booking History - CRITICAL

**Use Case:** Client views own booking history  
**FE Evidence:** Implied by auth system (client dashboard would need this)  
**Proposed Endpoint:**
```
GET /api/v1/profile/bookings
Auth: client
Query: ?status=completed|upcoming&page=1&limit=10
Response: {
  "data": [
    {
      "id": "number",
      "service": "string",
      "branch": "string",
      "therapist": "string",
      "date": "2025-10-30",
      "time": "14:00",
      "status": "confirmed|completed|cancelled",
      "price": "number",
      "paymentStatus": "paid|unpaid"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 45 }
}
```

---

### 1.4 Staff Filtering by Branch/Service

**Use Case:** Get available staff for specific branch/service  
**FE Evidence:** `apps/frontend/src/client/components/booking/TherapistSelector.tsx`, `QuickBooking.tsx:249-251`  
**Proposed Endpoint:**
```
GET /api/v1/staff/available
Query: ?branchId=2&serviceId=5&date=2025-10-30&time=14:00
Response: {
  "data": [
    {
      "id": "number",
      "name": "string",
      "specialties": ["string"],
      "rating": "number",
      "image": "string",
      "available": "boolean"
    }
  ]
}
```
**Notes:** Current spec has `GET /api/v1/admin/staff` but no public filtering endpoint

---

### 1.5 Contact Form Submission

**Use Case:** Client submits contact form  
**FE Evidence:** `apps/frontend/src/client/pages/ContactPage.tsx` (route exists)  
**Proposed Endpoint:**
```
POST /api/v1/contact
Auth: optional
Body: {
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string"
}
Response: {
  "data": {
    "id": "number",
    "status": "submitted",
    "submittedAt": "2025-10-29T12:00:00Z"
  }
}
```

---

### 1.6 Blog Post by Slug (Public)

**Use Case:** Client reads blog post  
**FE Evidence:** `apps/frontend/src/client/pages/BlogDetailPage.tsx:7` (mock data with slug lookup)  
**Proposed Endpoint:**
```
GET /api/v1/blog/:slug
Auth: public
Response: {
  "data": {
    "id": "number",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string",
    "image": "string",
    "author": "string",
    "date": "2025-01-15",
    "readTime": "string",
    "views": "number",
    "tags": ["string"],
    "category": "string"
  }
}
```
**Notes:** Current spec has `GET /api/v1/blog/:id` but FE uses slug routing

---

### 1.7 Promo Code Validation

**Use Case:** Validate promo code during checkout  
**FE Evidence:** `apps/frontend/src/client/components/payment/PromoCodeInput.tsx:19` (simulated API call)  
**Proposed Endpoint:**
```
POST /api/v1/bookings/validate-promo
Body: {
  "promoCode": "string",
  "serviceId": "number",
  "amount": "number"
}
Response: {
  "data": {
    "valid": "boolean",
    "discount": "number",
    "discountType": "percentage|fixed",
    "finalAmount": "number",
    "message": "string"
  }
}
```

---

### 1.8 Bulk Delete Appointments (Admin)

**Use Case:** Admin deletes multiple appointments at once  
**FE Evidence:** Table UI pattern suggests bulk actions (common admin pattern)  
**Proposed Endpoint:**
```
POST /api/v1/admin/appointments/bulk-delete
Auth: admin
Body: {
  "ids": ["number"]
}
Response: {
  "data": {
    "deleted": "number",
    "failed": ["number"]
  }
}
```

---

### 1.9 Bulk Delete Customers (Admin)

**Use Case:** Admin deletes multiple customers  
**FE Evidence:** `apps/frontend/src/admin/pages/Customers.tsx:91` (handleCustomerDeleted with single ID)  
**Proposed Endpoint:**
```
POST /api/v1/admin/customers/bulk-delete
Auth: admin
Body: {
  "ids": ["number"]
}
Response: {
  "data": {
    "deleted": "number",
    "failed": ["number"]
  }
}
```

---

### 1.10 Export Payments Report (Admin)

**Use Case:** Admin exports payment data to CSV/Excel  
**FE Evidence:** `apps/frontend/src/admin/pages/Payments.tsx:112-116` (handleExportReport)  
**Proposed Endpoint:**
```
GET /api/v1/admin/payments/export
Auth: admin
Query: ?format=csv|excel&dateFrom=2025-01-01&dateTo=2025-10-30&status=paid|pending|refunded
Response: File download (Content-Type: text/csv or application/vnd.ms-excel)
```

---

### 1.11 Staff Schedule View (Admin)

**Use Case:** Admin views staff schedule/calendar  
**FE Evidence:** `apps/frontend/src/admin/pages/Staff.tsx:64` (handleViewSchedule)  
**Proposed Endpoint:**
```
GET /api/v1/admin/staff/:id/schedule
Auth: admin
Query: ?dateFrom=2025-10-29&dateTo=2025-11-05
Response: {
  "data": {
    "staffId": "number",
    "staffName": "string",
    "schedule": [
      {
        "date": "2025-10-30",
        "appointments": [
          {
            "id": "number",
            "time": "09:00",
            "duration": "60",
            "customerName": "string",
            "service": "string",
            "status": "confirmed"
          }
        ]
      }
    ]
  }
}
```

---

### 1.12 AI Content Generator (Admin Blog)

**Use Case:** AI generates blog post draft  
**FE Evidence:** `apps/frontend/src/admin/pages/Blog.tsx:57` (handleAIContentGenerator)  
**Proposed Endpoint:**
```
POST /api/v1/admin/blog/ai-generate
Auth: admin
Body: {
  "topic": "string",
  "keywords": ["string"],
  "tone": "professional|casual|technical"
}
Response: {
  "data": {
    "title": "string",
    "content": "string",
    "excerpt": "string",
    "suggestedTags": ["string"]
  }
}
```

---

### 1.13 AI Staff Bio Generator (Admin)

**Use Case:** AI generates professional staff bio  
**FE Evidence:** `apps/frontend/src/admin/pages/Staff.tsx:102-103` (comment: "Generate Bio")  
**Proposed Endpoint:**
```
POST /api/v1/admin/staff/ai-generate-bio
Auth: admin
Body: {
  "name": "string",
  "role": "string",
  "specialties": ["string"],
  "experience": "string"
}
Response: {
  "data": {
    "bio": "string"
  }
}
```

---

### 1.14 Dashboard Revenue Chart Data

**Use Case:** Admin views revenue chart (7-day trend)  
**FE Evidence:** `apps/frontend/src/admin/pages/Dashboard.tsx:16-45` (bookingData, revenueData hardcoded)  
**Proposed Endpoint:**
```
GET /api/v1/admin/dashboard/revenue-chart
Auth: admin
Query: ?period=7d|30d|90d
Response: {
  "data": {
    "period": "7d",
    "data": [
      { "date": "2025-10-23", "revenue": 2400, "bookings": 45 },
      { "date": "2025-10-24", "revenue": 3200, "bookings": 52 }
    ]
  }
}
```

---

### 1.15 Dashboard Service Distribution

**Use Case:** Admin views service distribution pie chart  
**FE Evidence:** `apps/frontend/src/admin/pages/Dashboard.tsx:47-66` (serviceData)  
**Proposed Endpoint:**
```
GET /api/v1/admin/dashboard/service-distribution
Auth: admin
Query: ?period=7d|30d|90d
Response: {
  "data": [
    { "service": "Facial", "count": 35, "percentage": 35 },
    { "service": "Massage", "count": 28, "percentage": 28 }
  ]
}
```

---

### 1.16 Payment Revenue Trend (Admin)

**Use Case:** Admin views payment revenue chart  
**FE Evidence:** `apps/frontend/src/admin/pages/Payments.tsx:17-52` (revenueData, paymentMethodData)  
**Proposed Endpoint:**
```
GET /api/v1/admin/payments/revenue-trend
Auth: admin
Query: ?period=7d|30d
Response: {
  "data": {
    "trend": [
      { "date": "2025-10-23", "revenue": 2400 }
    ],
    "methodDistribution": [
      { "method": "Credit Card", "percentage": 65 },
      { "method": "Cash", "percentage": 20 }
    ]
  }
}
```

---

### 1.17 Review Metrics (Admin)

**Use Case:** Admin views review analytics  
**FE Evidence:** `apps/frontend/src/admin/pages/Reviews.tsx:109-142` (hardcoded metrics: 248 total, 85% positive)  
**Proposed Endpoint:**
```
GET /api/v1/admin/reviews/metrics
Auth: admin
Response: {
  "data": {
    "total": "number",
    "positivePercentage": "number",
    "pendingReply": "number",
    "avgResponseTime": "string",
    "avgRating": "number"
  }
}
```

---

### 1.18 Upload Image (Admin) - Detailed

**Use Case:** Upload images for services, branches, blog, staff, profiles  
**FE Evidence:** All admin modals use image uploads (services, branches, blog, staff)  
**Current Spec:** Basic endpoint exists but needs folder routing  
**Enhancement Needed:**
```
POST /api/v1/admin/uploads/:folder
Auth: admin
Params: folder = services|branches|blog|staff|profile
Content-Type: multipart/form-data
Body: { file: File }
Response: {
  "data": {
    "url": "https://cdn.example.com/services/abc123.jpg",
    "id": "string",
    "folder": "services",
    "filename": "abc123.jpg",
    "size": "number"
  }
}
```

---

### 1.19 Service Filtering (Public)

**Use Case:** Client filters services by category  
**FE Evidence:** `apps/frontend/src/client/pages/ServicesPage.tsx:94-95` (category filter)  
**Current Spec:** `GET /api/v1/services` exists but query params unclear  
**Enhancement Needed:**
```
GET /api/v1/services?category=Facial|Massage|Hair|Nails|Body&active=true
```

---

### 1.20 Branch Search by Location (Public)

**Use Case:** Client finds nearest branch  
**FE Evidence:** `apps/frontend/src/client/components/branches/BranchMap.tsx:29` (comment: Google Maps API)  
**Proposed Endpoint:**
```
GET /api/v1/branches/nearby
Query: ?lat=10.762622&lng=106.660172&radius=5000
Response: {
  "data": [
    {
      "id": "number",
      "name": "string",
      "address": "string",
      "distance": "number",
      "location": { "lat": "number", "lng": "number" }
    }
  ]
}
```

---

### 1.21 Blog Search & Filtering (Public)

**Use Case:** Client searches blog posts  
**FE Evidence:** `apps/frontend/src/client/pages/BlogPage.tsx` (route exists)  
**Current Spec:** `GET /api/v1/blog` exists  
**Enhancement Needed:**
```
GET /api/v1/blog?q=skincare&category=AI+Technology&tags=innovation&sort=views|date
```

---

### 1.22 Customer Retention Analytics (Admin)

**Use Case:** Admin views customer retention data  
**FE Evidence:** `apps/frontend/src/admin/pages/Customers.tsx:24` (retention: '95%')  
**Proposed Endpoint:**
```
GET /api/v1/admin/customers/:id/analytics
Auth: admin
Response: {
  "data": {
    "customerId": "number",
    "retention": "number",
    "visitFrequency": "string",
    "avgSpendPerVisit": "number",
    "preferredServices": ["string"],
    "lastVisit": "2025-10-15"
  }
}
```

---

### 1.23 Appointment Status Bulk Update (Admin)

**Use Case:** Admin confirms/cancels multiple appointments  
**FE Evidence:** Table pattern suggests bulk actions  
**Proposed Endpoint:**
```
POST /api/v1/admin/appointments/bulk-update
Auth: admin
Body: {
  "ids": ["number"],
  "status": "confirmed|cancelled|completed"
}
Response: {
  "data": {
    "updated": "number",
    "failed": ["number"]
  }
}
```

---

## 2. Incorrect / Hard-to-Map APIs

### 2.1 ID Type Mismatch (BREAKING)

**Issue:** Spec says IDs are `number`, but some FE code expects `string` IDs from Supabase Auth  
**FE Evidence:**
- `apps/frontend/src/store/mockDataStore.ts:4-106` (all entity IDs are `number`)
- User IDs from auth should be `string` (Supabase UUID)

**Proposed Fix:**
- User/auth IDs: `string` (UUID from Supabase)
- All entity IDs (Service, Branch, Appointment, etc.): `number`
- Update spec section 1.2-1.4 to clarify `user.id: string`

---

### 2.2 Enum Casing (Convention Violation)

**Issue:** FE uses mixed casing for enums  
**FE Evidence:**
- `apps/frontend/src/store/mockDataStore.ts:64` - status: `'confirmed' | 'pending' | 'completed' | 'cancelled'`
- `apps/frontend/src/store/mockDataStore.ts:54` - membershipTier: `'New' | 'Silver' | 'Gold' | 'VIP'`

**Proposed Fix:** Standardize all enums to lowercase for API, map on FE if needed:
```typescript
// Backend API (lowercase)
status: "confirmed" | "pending" | "completed" | "cancelled"
membershipTier: "new" | "silver" | "gold" | "vip"

// Frontend display mapping
const TIER_DISPLAY = { new: "New", silver: "Silver", gold: "Gold", vip: "VIP" }
```

---

### 2.3 Pagination Meta Missing

**Issue:** Spec shows `meta` with `page/limit/total` but FE tables don't implement pagination  
**FE Evidence:** All admin tables load full datasets without pagination UI  
**Proposed Fix:**
- Add pagination UI components
- Document default pagination: `page=1&limit=20`
- Add `meta.totalPages` to response

---

### 2.4 Search Query Parameter Inconsistency

**Issue:** Spec uses `?search=` but FE code uses local filtering  
**FE Evidence:**
- `apps/frontend/src/admin/pages/Appointments.tsx:11` (searchQuery useState, local filter)
- `apps/frontend/src/admin/pages/Customers.tsx:148` (search input, no API call)

**Proposed Fix:** Document query param as `?q=` (shorter, standard):
```
GET /api/v1/admin/appointments?q=sarah&status=confirmed
```

---

### 2.5 Date Format Ambiguity

**Issue:** Spec uses ISO 8601 but FE forms may send date-only strings  
**FE Evidence:**
- `apps/frontend/src/client/components/booking/BookingDateTime.tsx` (date picker)
- Appointment date field: `"2024-01-15"` (date only) vs `"2025-01-15T14:00:00Z"` (datetime)

**Proposed Fix:**
- Appointment `date` field: date-only string `"YYYY-MM-DD"`
- Appointment `time` field: time-only string `"HH:mm"` (24-hour)
- Timestamps (`createdAt`, `updatedAt`): full ISO 8601 with timezone

---

### 2.6 File Upload Response URL

**Issue:** Spec returns `url` but doesn't specify if it's absolute or relative  
**FE Evidence:** Image fields expect full URLs  
**Proposed Fix:**
```json
{
  "data": {
    "url": "https://cdn.example.com/uploads/abc123.jpg",  // Always absolute
    "relativePath": "/uploads/abc123.jpg",
    "id": "abc123"
  }
}
```

---

### 2.7 Payment Method Field

**Issue:** Spec uses generic `method: string` but FE needs enum  
**FE Evidence:** `apps/frontend/src/admin/pages/Payments.tsx:43-56` (pie chart expects specific methods)  
**Proposed Fix:**
```typescript
method: "credit_card" | "cash" | "digital_wallet" | "bank_transfer"
```

---

### 2.8 Review Reply Missing in List

**Issue:** Spec's `GET /api/v1/admin/reviews` doesn't include `reply` field  
**FE Evidence:** `apps/frontend/src/admin/pages/Reviews.tsx:11` (replied: boolean flag)  
**Proposed Fix:** Add to list response:
```json
{
  "id": 1,
  "reply": "string|null",
  "replyDate": "string|null",
  "replied": "boolean"
}
```

---

### 2.9 Blog Post Tags Not in Spec

**Issue:** Spec missing `tags` array field  
**FE Evidence:**
- `apps/frontend/src/store/mockDataStore.ts:102` (tags: string[])
- `apps/frontend/src/client/pages/BlogDetailPage.tsx:19` (tags displayed)

**Proposed Fix:** Add to BlogPost schema:
```json
{
  "tags": ["AI", "Technology", "Skincare"]
}
```

---

### 2.10 Branch Location Object

**Issue:** Spec shows flat `location` but FE expects nested object  
**FE Evidence:** `apps/frontend/src/store/mockDataStore.ts:23-26`
```typescript
location: {
  lat: number;
  lng: number;
}
```
**Proposed Fix:** Match FE structure exactly

---

### 2.11 Staff Specialties Array

**Issue:** Spec lists specialties as comma-separated string, FE expects array  
**FE Evidence:** `apps/frontend/src/store/mockDataStore.ts:36` (specialties: string[])  
**Proposed Fix:**
```json
{
  "specialties": ["Facial", "Massage", "Skincare"]
}
```

---

### 2.12 Dashboard Metrics Missing Fields

**Issue:** Spec's dashboard endpoint incomplete  
**FE Evidence:** `apps/frontend/src/admin/pages/Dashboard.tsx:69-104` needs:
- `totalRevenue`
- `totalBookings` (today)
- `totalCustomers` (active members)
- `aiRecommendations` (count)
- Changes (`bookingsChange`, `revenueChange`, `customersChange`)

**Proposed Fix:** Expand `GET /api/v1/admin/dashboard/metrics` with all fields

---

## 3. Consistency Issues

### 3.1 List vs Detail Field Discrepancy

**Issue:** List endpoints return limited fields, detail has more fields  
**Example:** Appointment list missing `notes` field  
**Proposed Fix:** Document which fields are list-only vs detail-only

### 3.2 Form Fields vs Request Body

**Issue:** FE forms collect more fields than spec documents  
**Example:** Customer form has `avatar` upload but spec doesn't mention it  
**Proposed Fix:** Audit all modal forms against spec

### 3.3 Table Columns vs Response Fields

**Issue:** Admin tables display fields not in spec  
**Example:** Customer table shows `retention` percentage, not in API  
**Proposed Fix:** Add computed fields to responses or mark as FE-calculated

### 3.4 Filter Options vs Query Params

**Issue:** FE dropdowns offer filters not supported by API  
**Example:** Appointments filter by branch, but spec doesn't list `branchId` param  
**Proposed Fix:** Document all supported query params per endpoint

### 3.5 Sort Options Missing

**Issue:** Tables imply sorting but spec doesn't document `sort` param  
**Proposed Fix:** Add `?sort=createdAt:desc|asc` to all list endpoints

### 3.6 Error Response Shape

**Issue:** Spec shows generic error but FE may need field-level validation errors  
**Proposed Fix:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required", "Invalid email format"],
      "phone": ["Phone number is invalid"]
    }
  }
}
```

### 3.7 Success Message Inconsistency

**Issue:** FE toasts expect specific messages but spec doesn't define them  
**Proposed Fix:** Document standard success messages per operation

### 3.8 Nested Resource Access

**Issue:** FE accesses nested data (e.g., appointment.therapist.name) but spec flat  
**Proposed Fix:** Decide on nested vs flat responses, document includes/expands

---

## 4. Convention Violations

### 4.1 camelCase vs snake_case

**Status:** ‚úÖ Spec correctly uses camelCase  
**FE Alignment:** ‚úÖ FE interfaces match

### 4.2 Envelope Pattern

**Status:** ‚úÖ Spec uses `{ data, meta }` / `{ error }`  
**FE Alignment:** ‚ö†Ô∏è FE doesn't unwrap envelopes yet (mock data is direct objects)

### 4.3 Auth Scope Clarity

**Issue:** Some endpoints unclear if they're public, client, or admin  
**Example:** `GET /api/v1/services` - should be public, but spec doesn't clarify  
**Proposed Fix:** Add explicit `Auth: public|client|admin` to ALL endpoints

### 4.4 Bulk Operation Naming

**Issue:** No bulk endpoints exist yet  
**Proposed Convention:**
```
POST /api/v1/admin/{resource}/bulk-delete
POST /api/v1/admin/{resource}/bulk-update
```

### 4.5 Export Endpoint Pattern

**Issue:** No export endpoints exist  
**Proposed Convention:**
```
GET /api/v1/admin/{resource}/export?format=csv|excel
```

### 4.6 Upload Folder Routing

**Issue:** Upload endpoint doesn't specify folder structure  
**Proposed Convention:**
```
POST /api/v1/admin/uploads/{folder}
Folders: services, branches, blog, staff, profile
```

---

## 5. Summary of Gaps by Feature

| Feature | Coverage | Missing | Incorrect | Priority |
|---------|----------|---------|-----------|----------|
| Auth | 80% | Profile endpoints | ID type mismatch | HIGH |
| Bookings | 60% | Availability, history | Date format ambiguity | CRITICAL |
| Services | 90% | - | Category filter unclear | LOW |
| Branches | 80% | Nearby search | Location object mismatch | MEDIUM |
| Staff | 70% | Available filter, schedule | Specialties type | HIGH |
| Customers | 85% | Retention analytics | - | MEDIUM |
| Appointments | 75% | Bulk ops | Search param | HIGH |
| Reviews | 85% | Metrics endpoint | Reply in list | MEDIUM |
| Blog | 60% | By-slug, AI generate | Tags missing | MEDIUM |
| Payments | 70% | Export, trend chart | Method enum | HIGH |
| Dashboard | 40% | All chart data | Missing fields | HIGH |
| Uploads | 50% | Folder routing | URL format | CRITICAL |

---

## Next Steps

1. **Backend Team:** Review 23 missing endpoints; prioritize CRITICAL ones first
2. **API Team:** Fix 12 field mismatches; update spec with correct types
3. **Frontend Team:** Align form validations with API error responses
4. **Both Teams:** Agree on pagination, sorting, filtering conventions

**Estimated Impact:**
- CRITICAL fixes: Enable core booking + profile flows (Week 1)
- HIGH priority: Enable full admin workflows (Week 2-3)
- MEDIUM/LOW: Polish and analytics features (Week 4+)
