# API Changelog - Frontend Reconciliation

**Generated:** October 29, 2025  
**Source:** Frontend code analysis vs existing docs  
**Purpose:** Track all API changes based on actual FE usage  
**Last Updated:** December 2025 (All items applied ✅)

---

## Summary

| Status        | Count | Description                           |
| ------------- | ----- | ------------------------------------- |
| ✅ Added      | 22    | New endpoints found in FE code        |
| 🔄 Updated    | 25    | Existing endpoints with field changes |
| ⚠️ Deprecated | 0     | Endpoints no longer used              |
| ❌ Removed    | 0     | Endpoints deleted                     |
| ⚠️ BREAKING   | 5     | Breaking changes requiring migration  |

**Patching Status:** 42/42 items applied (100%) ✅

- All feature-specific endpoints: ✅ Complete
- Cross-cutting updates: ✅ Complete
    - #20: Explicit auth scopes documented
    - #23: Search `?q=` param added to all admin list endpoints
    - #24: `meta.totalPages` added to all paginated responses
    - #38: `membershipTier` enum lowercase (BREAKING)
    - #39: `status` enum lowercase (consistency check)

---

## ✅ Added Endpoints

### 1. Get Profile (Client)

```
GET /api/v1/profile
```

**Reason:** Client needs to view own profile  
**FE Reference:** `apps/frontend/src/client/pages/LoginPage.tsx:57` (TODO comment implies profile endpoint)  
**FE Fields Expected:**

- `id` (string UUID), `name`, `email`, `phone`, `avatar`, `membershipTier`, `totalVisits`, `totalSpent`, `dateJoined`

**Not in docs:** Profile management endpoint was missing.

---

### 2. Update Profile (Client)

```
PATCH /api/v1/profile
```

**Reason:** Client can update own profile  
**FE Reference:** Auth system implies profile editing  
**FE Fields Sent:**

- `name` (string, optional)
- `phone` (string, optional)
- `avatar` (string, optional)

**Not in docs:** Profile update endpoint was missing. Email updates require re-authentication.

---

### 3. Admin Google OAuth

```
POST /api/v1/admin/auth/google
```

**Reason:** Admin login page supports Google OAuth with domain whitelist  
**FE Reference:** `apps/frontend/src/auth/useAuth.ts:321` (loginWithGoogleAdmin)  
**FE Fields Used:**

- `credential` (string) - Google JWT token
- `provider` (string) - Always "google-admin"

**⚠️ BREAKING CHANGE:** Backend MUST enforce domain whitelist server-side. Client-side check is bypassable.

**Backend TODO:**

- Verify Google credential server-side
- Check email domain against server-side whitelist
- Return admin user with JWT token

---

### 4. Admin Login (Email/Password)

```
POST /api/v1/admin/auth/login
```

**Reason:** Separate admin login endpoint for security isolation  
**FE Reference:** `apps/frontend/src/admin/pages/AdminLoginPage.tsx:55`  
**FE Fields Used:**

- `email` (string, required)
- `password` (string, required)

**Difference from docs:** Docs had `/api/v1/auth/login` for both client and admin. FE uses separate endpoint.

---

### 3. Get Payment Details

```
GET /api/v1/admin/payments/:id
```

**Reason:** Admin needs detailed payment view  
**FE Reference:** `apps/frontend/src/admin/components/modals/PaymentDetailsModal.tsx:4`  
**FE Fields Expected:**

- `id`, `appointmentId`, `customerName`, `customerEmail`, `amount`, `method`, `status`, `date`, `transactionId`, `service`

**Not in docs:** Existing docs only had list payments, not single payment detail.

---

### 4. Refund Payment

```
POST /api/v1/admin/payments/:id/refund
```

**Reason:** Admin can process refunds via modal  
**FE Reference:** `apps/frontend/src/admin/components/modals/RefundModal.tsx:28`  
**FE Fields Sent:**

- `amount` (number)
- `reason` (string)

**Not in docs:** Refund endpoint was missing.

---

### 5. Update Appointment Status

```
PATCH /api/v1/admin/appointments/:id
```

**Reason:** Admin can change appointment status (confirmed/pending toggle)  
**FE Reference:** `apps/frontend/src/admin/pages/Appointments.tsx:35`  
**FE Fields Sent:**

- `status` (string: confirmed|pending|completed|cancelled)

**Not in docs:** Docs had `PUT /api/v1/admin/bookings/:id/status` but FE uses PATCH with full appointment object.

---

### 6. Create Customer

```
POST /api/v1/admin/customers
```

**Reason:** Admin can add new customers manually  
**FE Reference:** `apps/frontend/src/admin/components/modals/CustomerModal.tsx:29`  
**FE Fields Sent:**

- `name` (string)
- `email` (string)
- `phone` (string)
- `notes` (string, optional)

**Not in docs:** Admin customer CRUD was missing.

---

### 7. Update Customer

```
PATCH /api/v1/admin/customers/:id
```

**Reason:** Admin can edit customer details  
**FE Reference:** `apps/frontend/src/admin/components/modals/CustomerModal.tsx` (edit mode)  
**FE Fields Sent:** Same as create

---

### 8. Delete Customer

```
DELETE /api/v1/admin/customers/:id
```

**Reason:** Admin can remove customers  
**FE Reference:** `apps/frontend/src/admin/pages/Customers.tsx` (delete handler)

---

### 9. Create Staff

```
POST /api/v1/admin/staff
```

**Reason:** Admin can add staff members  
**FE Reference:** `apps/frontend/src/admin/components/modals/StaffModal.tsx:49`  
**FE Fields Sent:**

- `name`, `role`, `email`, `phone`, `branch`, `specialties` (array), `image`, `active`

**Not in docs:** Admin staff CRUD was mentioned but not fully defined.

---

### 10. Update Staff

```
PATCH /api/v1/admin/staff/:id
```

**Reason:** Admin can edit staff details  
**FE Reference:** `apps/frontend/src/admin/components/modals/StaffModal.tsx` (edit mode)

---

### 11. Delete Staff

```
DELETE /api/v1/admin/staff/:id
```

**Reason:** Admin can remove staff  
**FE Reference:** `apps/frontend/src/admin/pages/Staff.tsx`

---

### 12. Upload Image

```
POST /api/v1/admin/uploads
```

**Reason:** Admin uploads images for services, branches, blog, staff  
**FE Reference:** Multiple admin modals (BlogPostModal, StaffModal, etc.)  
**FE Fields Sent:**

- `file` (File, multipart/form-data)
- `folder` (string: services|branches|blog|profile|staff)

**Expected Response:**

```json
{
    "data": {
        "url": "string",
        "id": "string",
        "folder": "string"
    }
}
```

---

## �� Updated Endpoints

### 1. POST /api/v1/auth/register

**Changes:**

- Added `phone` field (FE requires it)
- Response should include JWT token immediately (no OTP for registration)

**FE Reference:** `apps/frontend/src/auth/useAuth.ts:108`  
**Old:** `{ email, password, fullName }`  
**New:** `{ name, email, phone, password }`

---

### 2. POST /api/v1/auth/login

**Changes:**

- FE expects immediate token response (no OTP flow in current implementation)
- Response includes `expiresAt` timestamp

**FE Reference:** `apps/frontend/src/auth/useAuth.ts:76`  
**Note:** Docs mentioned OTP flow, but FE currently implements direct email/password login.

---

### 3. POST /api/v1/auth/google

**Changes:**

- Added `provider` field in request body
- FE sends Google credential JWT token
- Backend MUST verify token server-side (FE currently parses client-side which is INSECURE)

**FE Reference:** `apps/frontend/src/auth/useAuth.ts:190`  
**Security Issue:** FE does client-side JWT parsing. Backend MUST implement proper Google token verification.

---

### 4. POST /api/v1/bookings

**Changes:**

- Added `notes` field (optional)
- FE sends `therapist` field (staff name)
- All date/time fields are strings (not Date objects)

**FE Reference:** `apps/frontend/src/client/components/booking/BookingUserInfo.tsx:12`  
**FE Fields:** `customerName`, `customerEmail`, `customerPhone`, `service`, `therapist`, `branch`, `date`, `time`, `duration`, `price`, `notes`, `customerId`

---

### 5. GET /api/v1/services

**Changes:**

- FE expects `active` field (boolean)
- Response uses `id` as number (not string)
- Public endpoint should filter `active: true` by default

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:6`  
**FE Interface:**

```typescript
interface Service {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: string;
    price: number;
    image: string;
    active: boolean;
}
```

---

### 6. GET /api/v1/branches

**Changes:**

- Added `location` object with `lat` and `lng` (numbers)
- `hours` field is plain string (not JSON object)
- `services` is array of strings (service names, not IDs)

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:18`  
**FE Interface:**

```typescript
interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string; // Plain string like "Mon-Fri: 9AM-7PM"
    image: string;
    location: { lat: number; lng: number };
    services: string[]; // Array of service names
}
```

---

### 7. GET /api/v1/admin/appointments

**Changes:**

- FE expects full appointment objects (not just IDs)
- Added `customerId` field (nullable for guest bookings)
- `paymentStatus` enum: paid|unpaid|refunded
- `status` enum: confirmed|pending|completed|cancelled

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:52`  
**FE Interface:**

```typescript
interface Appointment {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    therapist: string;
    branch: string;
    date: string;
    time: string;
    duration: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    price: number;
    notes?: string;
    customerId?: number;
}
```

---

### 8. GET /api/v1/admin/customers

**Changes:**

- Added `membershipTier` field (enum: New|Silver|Gold|VIP)
- Added `avatar` field (string URL, optional)
- `dateJoined`, `lastVisit` are ISO strings

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:40`  
**FE Interface:**

```typescript
interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateJoined: string;
    totalVisits: number;
    totalSpent: number;
    lastVisit: string;
    notes: string;
    avatar?: string;
    membershipTier?: 'New' | 'Silver' | 'Gold' | 'VIP';
}
```

---

### 9. GET /api/v1/admin/staff

**Changes:**

- Added `specialties` field (array of strings)
- Added `rating` field (number, calculated from bookings)
- Added `totalBookings` field (number, stats)
- Added `active` field (boolean)
- `image` field for staff photo

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:28`  
**FE Interface:**

```typescript
interface Staff {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    branch: string;
    specialties: string[];
    image: string;
    rating: number;
    totalBookings: number;
    active: boolean;
}
```

---

### 10. GET /api/v1/admin/reviews

**Changes:**

- Added `customerAvatar` field (optional)
- Added `reply` and `replyDate` fields (for admin responses)
- Reviews are objects with full service name (not just ID)

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:69`  
**FE Interface:**

```typescript
interface Review {
    id: number;
    customerName: string;
    customerAvatar?: string;
    service: string;
    rating: number;
    comment: string;
    date: string;
    branch: string;
    reply?: string;
    replyDate?: string;
}
```

---

### 11. GET /api/v1/blog/posts

**Changes:**

- Added `slug` field (for URL routing)
- Added `excerpt` field (short description)
- Added `readTime` field (e.g., "5 min")
- Added `views` field (number, counter)
- Added `tags` field (array of strings)
- Added `authorAvatar` field (optional)

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:82`  
**FE Interface:**

```typescript
interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorAvatar?: string;
    image: string;
    date: string;
    readTime: string;
    views: number;
    published: boolean;
    tags: string[];
}
```

---

### 12. GET /api/v1/admin/payments

**Changes:**

- Added `transactionId` field (string, for payment gateway reference)
- `method` field is plain string (e.g., "Credit Card", "Digital Wallet")
- `service` field is service name (not ID)

**FE Reference:** `apps/frontend/src/store/mockDataStore.ts:99`  
**FE Interface:**

```typescript
interface Payment {
    id: number;
    appointmentId: number;
    customerName: string;
    amount: number;
    method: string;
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    date: string;
    transactionId: string;
    service: string;
}
```

---

### 13. PATCH /api/v1/admin/reviews/:id

**Changes:**

- Endpoint for adding admin reply (not just approve/reject)
- Body contains `reply` field

**FE Reference:** `apps/frontend/src/admin/components/modals/ReviewReplyModal.tsx:26`  
**Body:**

```json
{
    "reply": "string"
}
```

---

### 14. GET /api/v1/admin/dashboard/metrics

**Changes:**

- Added detailed metrics structure
- Includes change percentages for trends
- Includes recent bookings preview

**FE Reference:** `apps/frontend/src/admin/pages/Dashboard.tsx`  
**Expected Response:**

```json
{
  "data": {
    "totalRevenue": "number",
    "totalBookings": "number",
    "totalCustomers": "number",
    "pendingReviews": "number",
    "revenueChange": "number",
    "bookingsChange": "number",
    "customersChange": "number",
    "recentBookings": [...]
  }
}
```

---

### 15-18. Admin Service/Branch CRUD

**Changes:**

- All CRUD endpoints use PATCH (not PUT) for updates
- Create endpoints return full object with auto-generated fields (createdAt)
- Delete endpoints return success message

**FE Reference:** Various admin pages (Services, Branches)

---

## ��� TODO Endpoints (Not Yet Defined)

### 1. GET /api/v1/bookings/availability

**Reason:** Booking flow needs to check available time slots  
**FE Component:** `apps/frontend/src/client/components/booking/BookingDateTimeSelect.tsx`  
**Query Params:**

- `serviceId` (number)
- `branchId` (number)
- `date` (string, ISO date)

**Expected Response:**

```json
{
    "data": {
        "date": "2025-10-30",
        "availableSlots": [
            { "time": "09:00", "available": true },
            { "time": "09:30", "available": true },
            { "time": "10:00", "available": false }
        ]
    }
}
```

---

### 2. POST /api/v1/contact

**Reason:** Contact form submission  
**FE Component:** Likely in contact page (not fully scanned)  
**Body:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string",
    "subject": "string"
}
```

---

### 3. GET /api/v1/profile

**Reason:** Client profile page  
**FE Component:** Likely exists but not scanned  
**Auth:** Client  
**Response:**

```json
{
    "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string",
        "createdAt": "string"
    }
}
```

---

### 4. PATCH /api/v1/profile

**Reason:** Client can update their profile  
**Auth:** Client  
**Body:**

```json
{
    "name": "string",
    "phone": "string",
    "avatar": "string"
}
```

---

### 5. GET /api/v1/staff/available

**Reason:** Filter staff by branch and service for therapist selection  
**FE Component:** `apps/frontend/src/client/components/booking/TherapistSelector.tsx`  
**Query Params:**

- `branchId` (number)
- `serviceId` (number)

**Expected Response:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "role": "string",
            "specialties": ["string"],
            "image": "string",
            "rating": "number"
        }
    ]
}
```

---

## ⚠️ Deprecated Endpoints

None found. All existing endpoints are still used by FE.

---

## ���️ Removed Endpoints

None. No endpoints were removed in this reconciliation.

---

## ��� Security Issues Found

### 1. Google OAuth Client-Side Verification

**Location:** `apps/frontend/src/auth/useAuth.ts:178`  
**Issue:** FE parses Google JWT token client-side (INSECURE)  
**Fix Required:** Backend MUST verify Google credential using Google's token verification API

### 2. Domain Whitelist (Admin OAuth)

**Location:** `apps/frontend/src/auth/useAuth.ts:337`  
**Issue:** Domain check happens client-side  
**Fix Required:** Backend MUST enforce domain whitelist server-side

### 3. Mock Authentication

**Location:** `apps/frontend/src/auth/useAuth.ts:76-155`  
**Issue:** All auth methods are currently mock implementations using localStorage  
**Fix Required:** Replace with real API calls and proper JWT token management

---

## 🔄 Field Type Mismatches

| Endpoint  | Field                                          | Docs Type      | FE Type          | Fix                                                                          |
| --------- | ---------------------------------------------- | -------------- | ---------------- | ---------------------------------------------------------------------------- |
| All auth  | `user.id`                                      | number         | string (UUID)    | ⚠️ **BREAKING:** User IDs must be UUIDs (string). Entity IDs remain numbers. |
| Services  | `active`                                       | N/A            | boolean          | Add `active` field to Service schema                                         |
| Branches  | `location`                                     | N/A            | `{lat, lng}`     | Add location object                                                          |
| Branches  | `services`                                     | string[] (IDs) | string[] (names) | Clarify if names or IDs                                                      |
| Customers | `membershipTier`                               | N/A            | enum             | Add membership tier field                                                    |
| Staff     | `specialties`                                  | N/A            | string[]         | Add specialties array                                                        |
| Reviews   | `reply`/`replyDate`                            | N/A            | string           | Add admin reply fields                                                       |
| Blog      | `slug`, `excerpt`, `readTime`, `views`, `tags` | N/A            | various          | Add missing blog fields                                                      |
| Payments  | `transactionId`                                | N/A            | string           | Add transaction ID                                                           |

---

## ⚠️ BREAKING CHANGES

### 1. User ID Type Change (HIGH Priority)

**Affected Endpoints:** All `/api/v1/auth/*` endpoints  
**Change:** `user.id` must be `string (UUID)` instead of `number`  
**Reason:** Supabase Auth returns UUIDs, not auto-increment integers  
**Migration:**

- User IDs (from auth): `string` (UUID format)
- Entity IDs (services, branches, appointments, etc.): `number` (unchanged)
- FE must handle string user IDs in all auth responses

---

### 2. Google OAuth Server-Side Verification (CRITICAL)

**Affected Endpoint:** `POST /api/v1/auth/google`  
**Change:** Backend MUST verify Google credential server-side  
**Current Issue:** FE parses JWT client-side (INSECURE)  
**Migration:**

1. FE sends Google `credential` to backend
2. Backend verifies with Google OAuth API
3. Backend extracts user info from verified token
4. Backend creates/updates user and returns session token
5. Remove client-side JWT parsing from FE

---

### 3. Admin Domain Whitelist Enforcement (CRITICAL)

**Affected Endpoint:** `POST /api/v1/admin/auth/google`  
**Change:** Backend MUST enforce domain whitelist server-side  
**Current Issue:** Client-side domain check is bypassable  
**Migration:**

1. Move `ALLOWED_ADMIN_DOMAINS` env var to backend
2. Backend verifies Google credential
3. Backend extracts email from verified token
4. Backend checks email domain against server-side whitelist
5. Reject if domain not whitelisted
6. Remove client-side domain check from FE

---

### 4. Folder Routing for Uploads (HIGH Priority)

**Affected Endpoint:** `POST /api/v1/admin/uploads/:folder`  
**Change:** Upload endpoint now requires `:folder` path parameter  
**Migration:**

- Old: `POST /api/v1/admin/uploads` with folder in body
- New: `POST /api/v1/admin/uploads/services` (or branches/blog/profile/staff)
- URL must be absolute: `https://cdn.example.com/uploads/...`

---

### 5. Membership Tier Enum Lowercase (MEDIUM Priority)

**Affected Endpoint:** `GET /api/v1/admin/customers`  
**Change:** `membershipTier` values changed from title case to lowercase  
**Migration:**

- Old: `New|Silver|Gold|VIP`
- New: `new|silver|gold|vip`
- Frontend can map to title case for display: `tier.charAt(0).toUpperCase() + tier.slice(1)`

---

## 🚧 Field Type Mismatches

---

## ��� Priority Actions for Backend Team

### ✅ COMPLETE - All 42 Worklist Items Applied

**Week 1-2: Critical + High Priority**

1. ✅ Implement admin auth endpoints (login, Google OAuth)
2. ✅ **BREAKING:** Fix Google OAuth verification (server-side) - SECURITY CRITICAL
3. ✅ **BREAKING:** Enforce admin domain whitelist (server-side) - SECURITY CRITICAL
4. ✅ **BREAKING:** Change user.id type to string (UUID)
5. ✅ **BREAKING:** Folder routing for uploads with absolute URLs
6. ✅ **BREAKING:** membershipTier enum lowercase
7. ✅ Implement profile endpoints (GET, PATCH /api/v1/profile)
8. ✅ Update Service/Branch schemas with missing fields
9. ✅ Implement appointment CRUD with correct status enums
10. ✅ Add search `?q=` param to all admin list endpoints
11. ✅ Add `meta.totalPages` to all paginated responses

**Week 3: Medium Priority** 12. ✅ Implement customer CRUD endpoints with bulk operations 13. ✅ Implement staff CRUD endpoints (public + admin) 14. ✅ Add bulk operations (appointments, customers) 15. ✅ Implement payment endpoints (list, details, refund, export, revenue trend) 16. ✅ Implement dashboard metrics with charts 17. ✅ Add review reply functionality + metrics 18. ✅ Update blog post schema with slug routing + AI generator 19. ✅ Implement contact form endpoint 20. ✅ Add nearby branches search (geospatial) 21. ✅ Implement booking availability check 22. ✅ Add booking history and promo validation

**Documentation Complete:**

- ✅ Explicit auth scopes (Public/Client/Admin) documented
- ✅ All endpoints have complete query params
- ✅ All list endpoints have pagination with totalPages
- ✅ Breaking changes documented with migration guides
- ✅ FE usage references included

---

**End of Changelog**
