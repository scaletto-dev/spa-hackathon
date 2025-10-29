# API Specification by Feature - Updated from Frontend Analysis

**Generated:** October 29, 2025  
**Source:** Frontend code analysis + existing docs  
**Status:** Reconciled with FE requirements (37/42 items applied)

---

## Authentication Scopes

All endpoints include **Auth** field with one of:

-   **Public** - No authentication required
-   **Client** - Requires client user authentication (JWT token)
-   **Admin** - Requires admin role (JWT token + admin privileges)

**Migration Note:** Previous versions used ambiguous "required" - now explicit about client vs admin.

---

## 1. Authentication & Authorization

### 1.1 Client Registration

```
POST /api/v1/auth/register
```

**Auth:** Public  
**Body:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "password": "string"
}
```

**Response 201:**

```json
{
    "data": {
        "user": {
            "id": "string (UUID)",
            "name": "string",
            "email": "string",
            "role": "client"
        },
        "token": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/auth/useAuth.ts:108` (register method)  
**FE Fields:** name, email, password
**⚠️ BREAKING:** User IDs are UUIDs (string), not numbers. Entity IDs (services, branches, etc.) remain numbers.

---

### 1.2 Client Login (Email/Password)

```
POST /api/v1/auth/login
```

**Auth:** Public  
**Body:**

```json
{
    "email": "string",
    "password": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "user": {
            "id": "string (UUID)",
            "name": "string",
            "email": "string",
            "role": "client"
        },
        "token": "string",
        "expiresAt": "2025-10-29T12:00:00Z"
    }
}
```

**FE Usage:** `apps/frontend/src/auth/useAuth.ts:76` (login method)
**⚠️ BREAKING:** User IDs are UUIDs (string), not numbers.

---

### 1.3 Google OAuth Login (Client)

```
POST /api/v1/auth/google
```

**Auth:** Public  
**Body:**

```json
{
    "credential": "string (Google JWT token)",
    "provider": "google"
}
```

**Response 200:**

```json
{
    "data": {
        "user": {
            "id": "string (UUID)",
            "name": "string",
            "email": "string",
            "avatar": "string",
            "role": "client"
        },
        "token": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/auth/useAuth.ts:190` (loginWithGoogle)  
**⚠️ SECURITY (BREAKING):** Backend MUST verify Google credential server-side. FE currently parses JWT client-side (INSECURE). Backend should:

1. Verify `credential` with Google OAuth API
2. Extract user info from verified token
3. Create/update user in database
4. Return session token

**Migration:** FE sends credential → BE verifies with Google → returns user + session token

---

### 1.4 Admin Login

```
POST /api/v1/admin/auth/login
```

**Auth:** Public  
**Body:**

```json
{
    "email": "string",
    "password": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "user": {
            "id": "string (UUID)",
            "name": "string",
            "email": "string",
            "role": "admin"
        },
        "token": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/AdminLoginPage.tsx:55`  
**FE Fields:** email, password
**⚠️ BREAKING:** User IDs are UUIDs (string), not numbers.

---

### 1.5 Admin Google OAuth (with domain whitelist)

```
POST /api/v1/admin/auth/google
```

**Auth:** Public  
**Body:**

```json
{
    "credential": "string (Google JWT token)",
    "provider": "google-admin"
}
```

**Response 200:**

```json
{
    "data": {
        "user": {
            "id": "string (UUID)",
            "name": "string",
            "email": "string",
            "role": "admin"
        },
        "token": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/auth/useAuth.ts:321` (loginWithGoogleAdmin)  
**⚠️ SECURITY (BREAKING):** Backend MUST enforce domain whitelist server-side. Client-side domain check is bypassable. Backend should:

1. Verify credential with Google OAuth API
2. Extract email from verified token
3. Check email domain against server-side whitelist (env: ALLOWED_ADMIN_DOMAINS)
4. Reject if domain not whitelisted
5. Create/update admin user and return session token

**Migration:** Move domain whitelist check from FE to BE

---

### 1.6 Logout

```
POST /api/v1/auth/logout
```

**Auth:** Required (client|admin)  
**Response 200:**

```json
{
    "data": {
        "message": "Logged out successfully"
    }
}
```

**FE Usage:** `apps/frontend/src/auth/useAuth.ts:155` (logout method)

---

### 1.7 Get Profile (Client)

```
GET /api/v1/profile
```

**Auth:** Required (client)  
**Response 200:**

```json
{
    "data": {
        "id": "string (UUID)",
        "name": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string|null",
        "membershipTier": "new|silver|gold|vip",
        "totalVisits": "number",
        "totalSpent": "number",
        "dateJoined": "string (ISO 8601)",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
    }
}
```

**FE Usage:** `apps/frontend/src/client/pages/LoginPage.tsx:57` (TODO comment implies profile endpoint)  
**Notes:** Auth system implies profile endpoint exists

---

### 1.8 Update Profile (Client)

```
PATCH /api/v1/profile
```

**Auth:** Required (client)  
**Body:**

```json
{
    "name": "string (optional)",
    "phone": "string (optional)",
    "avatar": "string (optional)"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "string (UUID)",
        "name": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string|null",
        "membershipTier": "new|silver|gold|vip",
        "totalVisits": "number",
        "totalSpent": "number",
        "updatedAt": "string (ISO 8601)"
    }
}
```

**FE Usage:** Profile management implied by auth system  
**Notes:** Email cannot be updated via this endpoint (requires re-authentication)

---

## 2. Services

### 2.1 List Services

```
GET /api/v1/services
```

**Auth:** Public  
**Query Params:**

-   `page` (number, default: 1)
-   `limit` (number, default: 20)
-   `category` (string, optional: Facial|Massage|Hair|Nails|Body)
-   `active` (boolean, optional, default: true)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "category": "string",
            "description": "string",
            "duration": "string",
            "price": "number",
            "image": "string",
            "active": "boolean"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:**

-   `apps/frontend/src/store/mockDataStore.ts:116` (Service interface)
-   `apps/frontend/src/client/components/booking/BookingServiceSelect.tsx`
-   `apps/frontend/src/client/pages/ServicesPage.tsx:94` (category filter)

**Notes:** Category values: Facial|Massage|Hair|Nails|Body (explicit enum). Added `totalPages` to meta.

---

### 2.2 Get Service by ID

```
GET /api/v1/services/:id
```

**Auth:** Public  
**Response 200:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "category": "string",
        "description": "string",
        "duration": "string",
        "price": "number",
        "image": "string",
        "active": "boolean"
    }
}
```

---

## 3. Branches

### 3.1 List Branches

```
GET /api/v1/branches
```

**Auth:** Public  
**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "address": "string",
            "phone": "string",
            "email": "string",
            "hours": "string",
            "image": "string",
            "location": {
                "lat": "number",
                "lng": "number"
            },
            "services": ["string"]
        }
    ]
}
```

**FE Usage:**

-   `apps/frontend/src/store/mockDataStore.ts:18` (Branch interface)
-   `apps/frontend/src/client/components/booking/BookingBranchSelect.tsx`
    **Notes:** Location structure confirmed as `{lat, lng}` object, NOT flat fields

---

### 3.2 Get Nearby Branches

```
GET /api/v1/branches/nearby
```

**Auth:** Public  
**Query Params:**

-   `lat` (number, required)
-   `lng` (number, required)
-   `radius` (number, optional, default: 10km)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "address": "string",
            "phone": "string",
            "email": "string",
            "hours": "string",
            "image": "string",
            "location": {
                "lat": "number",
                "lng": "number"
            },
            "services": ["string"],
            "distance": "number (km)"
        }
    ]
}
```

**FE Usage:** `apps/frontend/src/client/pages/BranchMap.tsx:29` (BranchMap uses geolocation)  
**Notes:** Returns branches sorted by distance, includes `distance` field in response

---

## 4. Booking / Appointments

### 4.1 Check Availability

```
GET /api/v1/bookings/availability
```

**Auth:** Public  
**Query Params:**

-   `serviceId` (number, required)
-   `branchId` (number, required)
-   `date` (string, required, format: YYYY-MM-DD)
-   `therapistId` (number, optional)

**Response 200:**

```json
{
    "data": {
        "date": "string (YYYY-MM-DD)",
        "availableSlots": [
            {
                "time": "string (HH:mm, 24-hour format)",
                "available": "boolean",
                "therapistId": "number|null",
                "therapistName": "string|null"
            }
        ]
    }
}
```

**FE Usage:** `apps/frontend/src/client/components/booking/AvailabilityIndicator.tsx`  
**Notes:** FE shows green/yellow/red indicators based on availability. Real-time slot data needed for booking flow.

---

### 4.2 Create Booking

```
POST /api/v1/bookings
```

**Auth:** Public (guest) | Client (member)  
**Body:**

```json
{
    "customerName": "string",
    "customerEmail": "string",
    "customerPhone": "string",
    "service": "string",
    "therapist": "string",
    "branch": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:mm, 24-hour format)",
    "duration": "string",
    "price": "number",
    "notes": "string",
    "customerId": "number|null"
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "customerName": "string",
        "customerEmail": "string",
        "customerPhone": "string",
        "service": "string",
        "therapist": "string",
        "branch": "string",
        "date": "string (YYYY-MM-DD)",
        "time": "string (HH:mm)",
        "duration": "string",
        "status": "confirmed",
        "paymentStatus": "unpaid",
        "price": "number",
        "notes": "string",
        "customerId": "number|null",
        "createdAt": "string (ISO 8601)"
    }
}
```

**FE Usage:** `apps/frontend/src/client/components/booking/BookingUserInfo.tsx:12-15`  
**FE Fields:** name, email, phone, notes (from BookingUserInfo)  
**Date/Time Format:**

-   `date`: Date-only string in YYYY-MM-DD format (e.g., "2025-10-30")
-   `time`: Time-only string in HH:mm 24-hour format (e.g., "14:30")
-   `createdAt`, `updatedAt`: Full ISO 8601 timestamp with timezone

---

### 4.3 Validate Promo Code

```
POST /api/v1/bookings/validate-promo
```

**Auth:** Optional (public | client)  
**Body:**

```json
{
    "promoCode": "string",
    "serviceId": "number",
    "amount": "number"
}
```

**Response 200:**

```json
{
    "data": {
        "valid": "boolean",
        "discount": "number",
        "discountType": "percentage|fixed",
        "finalAmount": "number",
        "message": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/client/components/payment/PromoCodeInput.tsx:19`  
**Notes:** Validates promo code and returns discount calculation during checkout

---

### 4.4 Client Booking History

```
GET /api/v1/profile/bookings
```

**Auth:** Required (client)  
**Query Params:**

-   `status` (string, optional: completed|upcoming|cancelled)
-   `page` (number, default: 1)
-   `limit` (number, default: 10)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "serviceName": "string",
            "branchName": "string",
            "therapistName": "string",
            "date": "string (YYYY-MM-DD)",
            "time": "string (HH:mm)",
            "status": "confirmed|pending|completed|cancelled",
            "totalAmount": "number",
            "paymentStatus": "paid|unpaid|refunded",
            "createdAt": "string (ISO 8601)"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 45,
        "totalPages": 5
    }
}
```

**FE Usage:** Implied by auth system (client dashboard needs booking history)  
**Notes:** Returns bookings for authenticated client only

---

### 4.5 List Appointments (Admin)

```
GET /api/v1/admin/appointments
```

**Auth:** Admin  
**Query Params:**

-   `page` (number)
-   `limit` (number)
-   `branch` (string, optional)
-   `status` (string, optional: confirmed|pending|completed|cancelled)
-   `q` (string, optional - search by customer name or service)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "customerName": "string",
            "customerEmail": "string",
            "customerPhone": "string",
            "service": "string",
            "therapist": "string",
            "branch": "string",
            "date": "string",
            "time": "string",
            "duration": "string",
            "status": "confirmed|pending|completed|cancelled",
            "paymentStatus": "paid|unpaid|refunded",
            "price": "number",
            "notes": "string",
            "customerId": "number"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:**

-   `apps/frontend/src/admin/pages/Appointments.tsx:9` (useAppointments hook)
-   `apps/frontend/src/store/mockDataStore.ts:52` (Appointment interface)
-   `apps/frontend/src/admin/pages/Appointments.tsx:11` (search feature)

**Notes:** Status values are lowercase. Added `q` param for search, `totalPages` to meta.

---

### 4.6 Update Appointment Status

```
PATCH /api/v1/admin/appointments/:id
```

**Auth:** Admin  
**Body:**

```json
{
    "status": "confirmed|pending|completed|cancelled"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "number",
        "status": "string",
        "updatedAt": "2025-10-29T12:00:00Z"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Appointments.tsx:35` (handleStatusToggle)

---

### 4.7 Delete Appointment

```
DELETE /api/v1/admin/appointments/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Appointment deleted"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Appointments.tsx:28` (handleDeleteAppointment)

---

### 4.8 Bulk Delete Appointments

```
POST /api/v1/admin/appointments/bulk-delete
```

**Auth:** Admin  
**Body:**

```json
{
    "ids": ["number"]
}
```

**Response 200:**

```json
{
    "data": {
        "deleted": "number",
        "failed": ["number"]
    }
}
```

**FE Usage:** Table UI pattern suggests bulk actions  
**Notes:** Admin can select multiple appointments and delete at once

---

### 4.9 Bulk Update Appointment Status

```
POST /api/v1/admin/appointments/bulk-update
```

**Auth:** Admin  
**Body:**

```json
{
    "ids": ["number"],
    "status": "confirmed|cancelled|completed"
}
```

**Response 200:**

```json
{
    "data": {
        "updated": "number",
        "failed": ["number"]
    }
}
```

**FE Usage:** Admin table pattern for bulk operations  
**Notes:** Admin can confirm/cancel multiple appointments simultaneously

---

## 5. Customers (Admin)

### 5.1 List Customers

```
GET /api/v1/admin/customers
```

**Auth:** Admin  
**Query Params:**

-   `page` (number)
-   `limit` (number)
-   `q` (string, optional - search by name, email, or phone)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "email": "string",
            "phone": "string",
            "dateJoined": "string",
            "totalVisits": "number",
            "totalSpent": "number",
            "lastVisit": "string",
            "notes": "string",
            "avatar": "string",
            "membershipTier": "new|silver|gold|vip"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:**

-   `apps/frontend/src/store/mockDataStore.ts:40` (Customer interface)
-   `apps/frontend/src/admin/pages/Customers.tsx:148` (search feature)

**⚠️ BREAKING:** `membershipTier` changed from `New|Silver|Gold|VIP` to lowercase `new|silver|gold|vip`. Frontend can map to title case for display.

**Notes:** Added `q` param for search, `totalPages` to meta.

---

### 5.2 Create Customer

```
POST /api/v1/admin/customers
```

**Auth:** Admin  
**Body:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "notes": "string"
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "email": "string",
        "phone": "string",
        "dateJoined": "2025-10-29T12:00:00Z",
        "totalVisits": 0,
        "totalSpent": 0,
        "notes": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/components/modals/CustomerModal.tsx:29-35`

---

### 5.3 Update Customer

```
PATCH /api/v1/admin/customers/:id
```

**Auth:** Admin  
**Body:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "notes": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "email": "string",
        "phone": "string",
        "notes": "string",
        "updatedAt": "2025-10-29T12:00:00Z"
    }
}
```

---

### 5.4 Delete Customer

```
DELETE /api/v1/admin/customers/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Customer deleted"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Customers.tsx` (delete operations)

---

### 5.5 Bulk Delete Customers

```
POST /api/v1/admin/customers/bulk-delete
```

**Auth:** Admin  
**Body:**

```json
{
    "ids": ["number"]
}
```

**Response 200:**

```json
{
    "data": {
        "deleted": "number",
        "failed": ["number"]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Customers.tsx:91`  
**Notes:** Admin can select multiple customers and delete at once

---

### 5.6 Get Customer Analytics

```
GET /api/v1/admin/customers/:id/analytics
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "customerId": "number",
        "retention": "number (percentage)",
        "totalVisits": "number",
        "totalSpent": "number",
        "averageSpend": "number",
        "lastVisit": "string (ISO 8601)",
        "favoriteServices": ["string"],
        "membershipTier": "new|silver|gold|vip",
        "lifetimeValue": "number"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Customers.tsx:24` (retention: '95%' shown in UI)  
**Notes:** Analytics calculation required for retention, spending patterns

---

## 6. Staff

### 6.1 Get Available Staff (Public)

```
GET /api/v1/staff/available
```

**Auth:** Public  
**Query Params:**

-   `branchId` (number, optional)
-   `serviceId` (number, optional)
-   `date` (string, optional, format: YYYY-MM-DD)
-   `time` (string, optional, format: HH:mm)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "image": "string",
            "rating": "number",
            "specialties": ["string"],
            "available": "boolean"
        }
    ]
}
```

**FE Usage:**

-   `apps/frontend/src/client/components/booking/TherapistSelector.tsx`
-   `apps/frontend/src/client/components/booking/QuickBooking.tsx:249`

**Notes:** Public endpoint with limited fields (id, name, image, rating, specialties only). No contact info exposed.

---

### 6.2 List Staff (Public - Limited Fields)

```
GET /api/v1/staff
```

**Auth:** Public  
**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "image": "string",
            "rating": "number",
            "specialties": ["string"],
            "bio": "string"
        }
    ]
}
```

**Notes:** Public staff list for display purposes only. Does not include contact info, branch, or admin fields.

---

### 6.3 List Staff (Admin)

```
GET /api/v1/admin/staff
```

**Auth:** Admin  
**Query Params:**

-   `page` (number, optional)
-   `limit` (number, optional)
-   `q` (string, optional - search by name, email, or role)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "role": "string",
            "email": "string",
            "phone": "string",
            "branch": "string",
            "specialties": ["string"],
            "image": "string",
            "rating": "number",
            "totalBookings": "number",
            "active": "boolean",
            "bio": "string"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 50,
        "totalPages": 3
    }
}
```

**FE Usage:** `apps/frontend/src/store/mockDataStore.ts:28` (Staff interface)  
**Notes:** Admin view includes all fields including contact info and stats. `specialties` must be array, not comma-separated string. Added pagination and search.

---

### 6.4 Get Staff Schedule (Admin)

```
GET /api/v1/admin/staff/:id/schedule
```

**Auth:** Admin  
**Query Params:**

-   `dateFrom` (string, required, format: YYYY-MM-DD)
-   `dateTo` (string, required, format: YYYY-MM-DD)

**Response 200:**

```json
{
    "data": {
        "staffId": "number",
        "staffName": "string",
        "schedule": [
            {
                "date": "string (YYYY-MM-DD)",
                "slots": [
                    {
                        "time": "string (HH:mm)",
                        "duration": "number (minutes)",
                        "status": "available|booked|break",
                        "appointmentId": "number|null",
                        "customerName": "string|null"
                    }
                ]
            }
        ]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Staff.tsx:64` (handleViewSchedule)  
**Notes:** Returns weekly/monthly schedule view for admin to manage staff availability

---

### 6.5 Create Staff

```
### 6.5 Create Staff
```

POST /api/v1/admin/staff

````
**Auth:** Admin
**Body:**
```json
{
  "name": "string",
  "role": "string",
  "email": "string",
  "phone": "string",
  "branch": "string",
  "specialties": ["string"],
  "image": "string",
  "bio": "string",
  "active": "boolean"
}
````

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "role": "string",
        "email": "string",
        "phone": "string",
        "branch": "string",
        "specialties": ["string"],
        "bio": "string",
        "active": "boolean",
        "createdAt": "string (ISO 8601)"
    }
}
```

---

### 6.6 Update Staff

```
PATCH /api/v1/admin/staff/:id
```

**Auth:** Admin  
**Body:** Same as create (partial)  
**Response 200:** Same as create with updatedAt

---

### 6.7 Delete Staff

```
DELETE /api/v1/admin/staff/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Staff deleted"
    }
}
```

---

### 6.8 AI Generate Staff Bio (Admin)

```
POST /api/v1/admin/staff/ai-generate-bio
```

**Auth:** Admin  
**Body:**

```json
{
    "name": "string",
    "specialties": ["string"],
    "yearsExperience": "number",
    "experience": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "bio": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Staff.tsx:102`  
**Notes:** AI integration required. Low priority feature.

---

## 7. Services (Admin CRUD)

### 7.1 List Services (Admin view)

```
GET /api/v1/admin/services
```

**Auth:** Admin  
**Query Params:**

-   `page` (number)
-   `limit` (number)
-   `active` (boolean, optional)
-   `q` (string, optional - search by name or category)

**Response:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "category": "string",
            "description": "string",
            "duration": "string",
            "price": "number",
            "image": "string",
            "active": "boolean"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**Notes:** Same as public services list but includes inactive services. Added search and totalPages.

---

### 7.2 Create Service

```
POST /api/v1/admin/services
```

**Auth:** Admin  
**Body:**

```json
{
    "name": "string",
    "category": "string",
    "description": "string",
    "duration": "string",
    "price": "number",
    "image": "string",
    "active": "boolean"
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "category": "string",
        "description": "string",
        "duration": "string",
        "price": "number",
        "image": "string",
        "active": "boolean",
        "createdAt": "2025-10-29T12:00:00Z"
    }
}
```

---

### 7.3 Update Service

```
PATCH /api/v1/admin/services/:id
```

**Auth:** Admin  
**Body:** Same as create (partial)  
**Response 200:** Same as create with updatedAt

---

### 7.4 Delete Service

```
DELETE /api/v1/admin/services/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Service deleted"
    }
}
```

---

## 8. Branches (Admin CRUD)

### 8.1 List Branches (Admin view)

```
GET /api/v1/admin/branches
```

**Auth:** Admin  
**Query Params:**

-   `page` (number, optional)
-   `limit` (number, optional)
-   `q` (string, optional - search by name or address)

**Response:**

```json
{
    "data": [
        {
            "id": "number",
            "name": "string",
            "address": "string",
            "phone": "string",
            "email": "string",
            "hours": "string",
            "image": "string",
            "location": {
                "lat": "number",
                "lng": "number"
            },
            "services": ["string"]
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 10,
        "totalPages": 1
    }
}
```

**Notes:** Same as public branches list but with pagination and search support.

---

### 8.2 Create Branch

```
POST /api/v1/admin/branches
```

**Auth:** Admin  
**Body:**

```json
{
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "hours": "string",
    "image": "string",
    "location": {
        "lat": "number",
        "lng": "number"
    },
    "services": ["string"]
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "name": "string",
        "address": "string",
        "phone": "string",
        "email": "string",
        "hours": "string",
        "image": "string",
        "location": {
            "lat": "number",
            "lng": "number"
        },
        "services": ["string"],
        "createdAt": "2025-10-29T12:00:00Z"
    }
}
```

---

### 8.3 Update Branch

```
PATCH /api/v1/admin/branches/:id
```

**Auth:** Admin  
**Body:** Same as create (partial)  
**Response 200:** Same as create with updatedAt

---

### 8.4 Delete Branch

```
DELETE /api/v1/admin/branches/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Branch deleted"
    }
}
```

---

## 9. Reviews

### 9.1 List Reviews (Public)

```
GET /api/v1/reviews
```

**Auth:** Public  
**Query Params:**

-   `serviceId` (number, optional)
-   `page` (number)
-   `limit` (number)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "customerName": "string",
            "customerAvatar": "string",
            "service": "string",
            "rating": "number",
            "comment": "string",
            "date": "string",
            "branch": "string",
            "reply": "string",
            "replyDate": "string"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:** `apps/frontend/src/store/mockDataStore.ts:69` (Review interface)

**Notes:** Added `totalPages` to pagination meta.

---

### 9.2 Create Review

```
POST /api/v1/reviews
```

**Auth:** Public | Client  
**Body:**

```json
{
    "customerName": "string",
    "customerEmail": "string",
    "service": "string",
    "rating": "number",
    "comment": "string",
    "branch": "string"
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "customerName": "string",
        "service": "string",
        "rating": "number",
        "comment": "string",
        "date": "2025-10-29T12:00:00Z",
        "branch": "string",
        "status": "pending"
    }
}
```

---

### 9.3 List Reviews (Admin)

```
GET /api/v1/admin/reviews
```

**Auth:** Admin  
**Query Params:**

-   `status` (string: pending|approved|rejected)
-   `page` (number)
-   `limit` (number)
-   `q` (string, search)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "customerName": "string",
            "service": "string",
            "rating": "number",
            "comment": "string",
            "date": "string",
            "branch": "string",
            "status": "pending|approved|rejected",
            "reply": "string|null",
            "replyDate": "string|null",
            "replied": "boolean"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Reviews.tsx:11`  
**Notes:** Added `reply`, `replyDate`, `replied` fields to list response

---

### 9.4 Get Review Metrics (Admin)

```
GET /api/v1/admin/reviews/metrics
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "totalReviews": "number",
        "averageRating": "number",
        "positivePercentage": "number",
        "ratingDistribution": {
            "5": "number",
            "4": "number",
            "3": "number",
            "2": "number",
            "1": "number"
        },
        "pendingReviews": "number",
        "repliedReviews": "number"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Reviews.tsx:109-142` (248 total, 85% positive shown)  
**Notes:** Analytics for review dashboard

---

### 9.5 Update Review (Admin - Reply)

```
PATCH /api/v1/admin/reviews/:id
```

**Auth:** Admin  
**Body:**

```json
{
    "reply": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "number",
        "reply": "string",
        "replyDate": "2025-10-29T12:00:00Z"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/components/modals/ReviewReplyModal.tsx`

---

### 9.5 Delete Review

```
DELETE /api/v1/admin/reviews/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Review deleted"
    }
}
```

---

## 10. Blog Posts

### 10.1 List Blog Posts (Public)

```
GET /api/v1/blog/posts
```

**Auth:** Public  
**Query Params:**

-   `q` (string, optional - search in title/content)
-   `category` (string, optional)
-   `tags` (string, optional - comma-separated)
-   `sort` (string, optional: views|date, default: date)
-   `published` (boolean, default: true)
-   `page` (number, default: 1)
-   `limit` (number, default: 20)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "title": "string",
            "slug": "string",
            "excerpt": "string",
            "content": "string",
            "category": "string",
            "author": "string",
            "authorAvatar": "string",
            "image": "string",
            "date": "string",
            "readTime": "string",
            "views": "number",
            "published": "boolean",
            "tags": ["string"]
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:** `apps/frontend/src/store/mockDataStore.ts:82` (BlogPost interface)  
**Notes:** Added `q`, `tags`, `sort` query params for search and filtering. `tags` field is array.

---

### 10.2 Get Blog Post by Slug

```
GET /api/v1/blog/:slug
```

**Auth:** Public  
**Response 200:**

```json
{
    "data": {
        "id": "number",
        "title": "string",
        "slug": "string",
        "excerpt": "string",
        "content": "string",
        "category": "string",
        "author": "string",
        "authorAvatar": "string",
        "image": "string",
        "date": "string",
        "readTime": "string",
        "views": "number",
        "published": "boolean",
        "tags": ["string"]
    }
}
```

**FE Usage:** Frontend uses slug-based routing for blog posts  
**Notes:** Use slug instead of ID for SEO-friendly URLs

---

### 10.3 List Blog Posts (Admin)

---

## 10. Blog Posts

### 10.1 List Blog Posts (Public)

    "authorAvatar": "string",
    "image": "string",
    "date": "string",
    "readTime": "string",
    "views": "number",
    "published": "boolean",
    "tags": ["string"]

}
}

```

---

### 10.3 List Blog Posts (Admin)
```

GET /api/v1/admin/blog/posts

```
**Auth:** Admin
**Query Params:** Same as public, but includes unpublished
**Response:** Same as public

---

### 10.4 Create Blog Post
```

POST /api/v1/admin/blog/posts

````
**Auth:** Admin
**Body:**
```json
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "category": "string",
  "author": "string",
  "image": "string",
  "published": "boolean",
  "tags": ["string"]
}
````

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "title": "string",
        "slug": "string",
        "excerpt": "string",
        "content": "string",
        "category": "string",
        "author": "string",
        "image": "string",
        "date": "2025-10-29T12:00:00Z",
        "published": "boolean",
        "tags": ["string"]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/components/modals/BlogPostModal.tsx`

---

### 10.5 Update Blog Post

```
PATCH /api/v1/admin/blog/posts/:id
```

**Auth:** Admin  
**Body:** Same as create (partial)  
**Response 200:** Same as create with updatedAt

---

### 10.6 Delete Blog Post

```
DELETE /api/v1/admin/blog/posts/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "message": "Blog post deleted"
    }
}
```

---

### 10.7 AI Generate Blog Content

```
POST /api/v1/admin/blog/ai-generate
```

**Auth:** Admin  
**Body:**

```json
{
  "topic": "string",
  "keywords": ["string"] (optional),
  "tone": "professional|casual|friendly" (optional, default: professional)
}
```

**Response 200:**

```json
{
    "data": {
        "title": "string",
        "slug": "string",
        "excerpt": "string",
        "content": "string (markdown)",
        "suggestedCategory": "string",
        "suggestedTags": ["string"]
    }
}
```

**FE Usage:** AI content generation feature for blog posts  
**Notes:** Uses AI to generate blog post content. Editor can review and modify before publishing.

---

## 11. Payments (Admin)

### 11.1 List Payments

```
GET /api/v1/admin/payments
```

**Auth:** Admin  
**Query Params:**

-   `status` (string: completed|pending|refunded|failed)
-   `dateFrom` (string, ISO date)
-   `dateTo` (string, ISO date)
-   `page` (number)
-   `limit` (number)
-   `q` (string, optional - search by customer name or transaction ID)

**Response 200:**

```json
{
    "data": [
        {
            "id": "number",
            "appointmentId": "number",
            "customerName": "string",
            "amount": "number",
            "method": "string",
            "status": "completed|pending|refunded|failed",
            "date": "string",
            "transactionId": "string",
            "service": "string"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    }
}
```

**FE Usage:** `apps/frontend/src/store/mockDataStore.ts:99` (Payment interface)

**Notes:** Added `q` param for search, `totalPages` to meta.

---

### 11.2 Get Payment Details

```
GET /api/v1/admin/payments/:id
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "id": "number",
        "appointmentId": "number",
        "customerName": "string",
        "customerEmail": "string",
        "amount": "number",
        "method": "string",
        "status": "string",
        "date": "string",
        "transactionId": "string",
        "service": "string"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/components/modals/PaymentDetailsModal.tsx`

---

### 11.3 Refund Payment

```
POST /api/v1/admin/payments/:id/refund
```

**Auth:** Admin  
**Body:**

```json
{
    "amount": "number",
    "reason": "string"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "number",
        "status": "refunded",
        "refundAmount": "number",
        "refundReason": "string",
        "refundDate": "2025-10-29T12:00:00Z"
    }
}
```

**FE Usage:** `apps/frontend/src/admin/components/modals/RefundModal.tsx:28-30`

---

### 11.4 Export Payment Report

```
GET /api/v1/admin/payments/export
```

**Auth:** Admin  
**Query Params:**

-   `format` (string, required: csv|excel)
-   `dateFrom` (string, optional, format: YYYY-MM-DD)
-   `dateTo` (string, optional, format: YYYY-MM-DD)
-   `status` (string, optional: completed|pending|refunded|failed)

**Response 200:**

-   Content-Type: `text/csv` or `application/vnd.ms-excel`
-   File download

**FE Usage:** `apps/frontend/src/admin/pages/Payments.tsx:112-116` (handleExportReport)  
**Notes:** File generation required. Returns CSV or Excel file with payment data.

---

### 11.5 Get Payment Revenue Trend

```
GET /api/v1/admin/payments/revenue-trend
```

**Auth:** Admin  
**Query Params:**

-   `period` (string, optional: 7d|30d|90d, default: 30d)

**Response 200:**

```json
{
    "data": {
        "revenueData": {
            "labels": ["2025-10-01", "2025-10-02", "..."],
            "values": [2500000, 3000000, 2750000, "..."]
        },
        "paymentMethodData": [
            {
                "name": "Credit Card",
                "value": 45000000,
                "percentage": 60
            },
            {
                "name": "Cash",
                "value": 22500000,
                "percentage": 30
            },
            {
                "name": "Digital Wallet",
                "value": 7500000,
                "percentage": 10
            }
        ]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Payments.tsx:17-52` (revenueData, paymentMethodData hardcoded)  
**Notes:** Returns revenue trend and payment method distribution for charts

---

## 12. Dashboard (Admin)

### 12.1 Get Dashboard Metrics

```
GET /api/v1/admin/dashboard/metrics
```

**Auth:** Admin  
**Response 200:**

```json
{
    "data": {
        "totalRevenue": "number",
        "revenueChange": "number (percentage, e.g., 12.5 for +12.5%)",
        "totalBookings": "number",
        "bookingsChange": "number (percentage)",
        "totalCustomers": "number",
        "customersChange": "number (percentage)",
        "aiRecommendations": "number",
        "pendingReviews": "number",
        "recentBookings": [
            {
                "id": "number",
                "customerName": "string",
                "service": "string",
                "date": "string",
                "status": "string"
            }
        ]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Dashboard.tsx:69-104`  
**Notes:** Added `bookingsChange`, `revenueChange`, `customersChange` (percentage values), `aiRecommendations`

---

### 12.2 Get Revenue Chart Data

```
GET /api/v1/admin/dashboard/revenue-chart
```

**Auth:** Admin  
**Query Params:**

-   `period` (string, optional: 7d|30d|90d, default: 7d)

**Response 200:**

```json
{
    "data": {
        "labels": ["2025-10-23", "2025-10-24", "..."],
        "bookings": [15, 18, 22, 19, 25, 30, 28],
        "revenue": [3750000, 4500000, 5500000, 4750000, 6250000, 7500000, 7000000]
    }
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Dashboard.tsx:16-45` (bookingData, revenueData hardcoded)  
**Notes:** Returns time-series data for charts. Supports 7/30/90-day periods.

---

### 12.3 Get Service Distribution

```
GET /api/v1/admin/dashboard/service-distribution
```

**Auth:** Admin  
**Query Params:**

-   `period` (string, optional: 7d|30d|90d, default: 30d)

**Response 200:**

```json
{
    "data": [
        {
            "name": "string (service name)",
            "value": "number (booking count)",
            "percentage": "number (percentage of total)"
        }
    ]
}
```

**FE Usage:** `apps/frontend/src/admin/pages/Dashboard.tsx:47-66` (pie chart data)  
**Notes:** Shows which services are most popular

---

## 13. Contact Form

### 13.1 Submit Contact Form

```
POST /api/v1/contact
```

**Auth:** Public  
**Body:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "string (optional)",
    "subject": "string",
    "message": "string"
}
```

**Response 201:**

```json
{
    "data": {
        "id": "number",
        "status": "submitted",
        "message": "Your message has been received. We will contact you soon."
    }
}
```

**FE Usage:** `apps/frontend/src/route-map.tsx` (route exists: /contact)  
**Notes:** Public endpoint for contact form submissions. Email notification sent to admin.

---

## 14. File Upload

### 14.1 Upload Image

```
POST /api/v1/admin/uploads/:folder
```

**Auth:** Admin  
**Content-Type:** multipart/form-data  
**Path Params:**

-   `folder` (string, required: services|branches|blog|profile|staff)

**Body:**

-   `file` (File, required)

**Response 201:**

```json
{
    "data": {
        "url": "string (absolute URL: https://cdn.example.com/uploads/...)",
        "relativePath": "string (/uploads/services/abc123.jpg)",
        "id": "string (abc123)",
        "folder": "string (services|branches|blog|profile|staff)",
        "filename": "string",
        "size": "number (bytes)",
        "mimeType": "string"
    }
}
```

**FE Usage:** Image uploads in admin modals (services, branches, blog, staff, profile)  
**Notes:**

-   Folder routing organizes uploads by resource type
-   URL must be absolute (full https:// path) for FE display
-   Supports images only (jpg, png, webp)
-   Max file size: 5MB

---

## Common Response Envelopes

### Success Response

```json
{
    "data": {
        /* entity or array */
    },
    "meta": {
        /* pagination info if applicable */
    }
}
```

### Error Response

```json
{
    "error": {
        "message": "string",
        "code": "string",
        "details": {}
    }
}
```

---

## Field Standards

-   **IDs**: All IDs are numbers (frontend uses `number` type)
-   **Dates**: ISO 8601 strings (`"2025-10-29T12:00:00Z"`)
-   **Money**: Numbers (price, amount, totalSpent)
-   **Booleans**: `true|false` (active, published)
-   **Enums**: Lowercase strings with pipe (status: "confirmed|pending|completed|cancelled")
-   **Arrays**: Camel case (`services`, `specialties`, `tags`)

---

## Missing / TODO Endpoints

1. **Availability Check**

    - `GET /api/v1/bookings/availability` - Check time slots
    - FE needs: service, branch, date → returns available time slots

2. **Contact Form**

    - `POST /api/v1/contact` - Submit contact form
    - FE likely has form but not visible in current scan

3. **Profile Management (Client)**

    - `GET /api/v1/profile` - Get client profile
    - `PATCH /api/v1/profile` - Update client profile
    - `GET /api/v1/profile/bookings` - Get client's bookings

4. **Therapist Selection**

    - FE has `TherapistSelector.tsx` component
    - Needs: `GET /api/v1/staff/available` - Filter by branch/service

5. **Payment Methods**
    - FE has `BookingPayment.tsx` and `InlinePaymentMethod.tsx`
    - Needs: Payment gateway integration endpoints

---

**End of API Specification**

---

## 8. Member Profile & Dashboard

### 8.1 Get Member Dashboard Overview (NEW)

```
GET /api/v1/members/dashboard
```

**Auth:** Client  
**Description:** Fetch member dashboard data including stats, upcoming bookings, and special offers

**Response 200:**

```json
{
    "data": {
        "stats": {
            "totalBookings": "number",
            "upcomingBookings": "number",
            "completedBookings": "number",
            "memberPoints": "number"
        },
        "upcomingBookings": [
            {
                "id": "string",
                "referenceNumber": "string",
                "serviceName": "string",
                "branchName": "string",
                "appointmentDate": "string (ISO 8601)",
                "appointmentTime": "string (HH:MM)",
                "status": "confirmed|completed|cancelled|no_show",
                "serviceImage": "string (optional)"
            }
        ],
        "specialOffers": [
            {
                "id": "string",
                "title": "string",
                "description": "string",
                "discountPercent": "number",
                "validUntil": "string (ISO 8601)",
                "imageUrl": "string (optional)"
            }
        ]
    }
}
```

**FE Usage:** `apps/frontend/src/client/pages/dashboard/MemberDashboard.tsx:24`  
**FE Adapter:** `apps/frontend/src/api/adapters/member.ts:getMemberDashboard()`  
**Status:** Mock adapter implemented (Phase 1-A1)

**TODO:**

-   [ ] Define memberPoints calculation logic
-   [ ] Clarify if specialOffers are personalized or global
-   [ ] Limit upcomingBookings to next 3 appointments
-   [ ] Add memberSince field to stats

---

### 8.2 Get Member Profile

```
GET /api/v1/members/profile
```

**Auth:** Client  
**Response 200:**

```json
{
    "data": {
        "id": "string (UUID)",
        "email": "string",
        "fullName": "string",
        "phone": "string",
        "language": "vi|ja|en|zh",
        "createdAt": "string (ISO 8601)"
    }
}
```

**FE Usage:** TBD (Phase 1-A3)  
**Status:** Not yet wired

---

### 8.3 Update Member Profile

```
PUT /api/v1/members/profile
```

**Auth:** Client  
**Body:**

```json
{
    "fullName": "string",
    "phone": "string",
    "language": "vi|ja|en|zh (optional)"
}
```

**Response 200:**

```json
{
    "data": {
        "id": "string (UUID)",
        "email": "string (read-only)",
        "fullName": "string",
        "phone": "string",
        "language": "vi|ja|en|zh",
        "updatedAt": "string (ISO 8601)"
    }
}
```

**FE Usage:** TBD (Phase 1-A3)  
**Status:** Not yet wired

---

### 8.4 Get Member Booking History

```
GET /api/v1/members/bookings
```

**Auth:** Client  
**Query Params:**

-   `page` (number, default: 1)
-   `limit` (number, default: 10)
-   `status` (string, optional): `confirmed|completed|cancelled|no_show`
-   `dateFrom` (ISO 8601, optional)
-   `dateTo` (ISO 8601, optional)

**Response 200:**

```json
{
    "data": [
        {
            "id": "string",
            "referenceNumber": "string",
            "serviceName": "string",
            "branchName": "string",
            "appointmentDate": "string (ISO 8601)",
            "appointmentTime": "string (HH:MM)",
            "status": "confirmed|completed|cancelled|no_show",
            "serviceImage": "string (optional)",
            "createdAt": "string (ISO 8601)"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 42,
        "totalPages": 5
    }
}
```

**FE Usage:** `apps/frontend/src/client/pages/dashboard/BookingHistory.tsx:26`  
**FE Adapter:** `apps/frontend/src/api/adapters/member.ts:getMemberBookings()`  
**Status:** ✅ Mock adapter implemented (Phase 1-A2 COMPLETE)

**Features Implemented**:

-   Status filter tabs (all, confirmed, completed, cancelled)
-   Pagination controls with prev/next buttons
-   Responsive design (table on desktop, cards on mobile)
-   Empty states per filter
-   Auto-reset to page 1 on filter change
-   Loading states

---
