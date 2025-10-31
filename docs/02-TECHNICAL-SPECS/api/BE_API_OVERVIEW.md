# Backend API Overview

**Project:** Beauty Clinic Care Website  
**Version:** v1  
**Base URL:** `http://localhost:3000/api/v1`  
**Health Check:** `http://localhost:3000/api/health`  

---

## Ì≥ã Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [API Conventions](#api-conventions)
- [Error Handling](#error-handling)
- [Pagination & Filtering](#pagination--filtering)
- [API Modules](#api-modules)

---

## Ì¥í Authentication & Authorization

### Auth Methods
- **JWT Tokens:** Access tokens in `Authorization: Bearer <token>` header
- **Supabase Auth:** OAuth (Google), Email/Password, OTP
- **Session:** Server-side sessions for admin

### Auth Scopes
| Scope | Description | Routes |
|-------|-------------|--------|
| **public** | No auth required | Health, Services, Branches, Blog (read), Reviews (read) |
| **client** | Authenticated user | User profile, Member dashboard, Bookings |
| **staff** | Support staff | Support conversations, Chat |
| **admin** | Admin/Super Admin | Admin panel (`/api/v1/admin/*`) |

### Middleware
```typescript
// Source: apps/backend/src/middleware/auth.middleware.ts
authenticate()       // Requires valid JWT
requireAdmin()       // Requires ADMIN or SUPER_ADMIN role
requireRole(role)    // Requires specific role
```

---

## Ì≥ê API Conventions

### Naming
- **Resources:** Plural nouns (`/services`, `/bookings`, `/branches`)
- **Fields:** camelCase (`firstName`, `createdAt`, `isActive`)
- **IDs:** String (UUID or custom format)
- **Enums:** UPPERCASE_SNAKE_CASE (`PENDING`, `COMPLETED`)

### HTTP Methods
| Method | Usage | Idempotent |
|--------|-------|------------|
| GET | Retrieve resource(s) | Yes |
| POST | Create new resource | No |
| PUT | Replace entire resource | Yes |
| PATCH | Update partial resource | No |
| DELETE | Remove resource | Yes |

### Timestamps
- **Format:** ISO 8601 with timezone (`2025-10-31T10:30:00.000Z`)
- **Fields:** `createdAt`, `updatedAt`, `timestamp`

---

## Ì¥¥ Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "phone": "Phone number required"
    }
  },
  "timestamp": "2025-10-31T10:30:00.000Z"
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## ÔøΩÔøΩ Pagination & Filtering

### Pagination (Page-based)
```
GET /api/v1/services?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  },
  "timestamp": "2025-10-31T10:30:00.000Z"
}
```

### Pagination (Cursor-based)
```
GET /api/v1/blog/posts?cursor=abc123&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "nextCursor": "def456",
    "hasMore": true,
    "limit": 10
  }
}
```

### Filtering & Sorting
```
GET /api/v1/services?categoryId=spa&featured=true&sort=price:asc
GET /api/v1/reviews?rating=5&serviceId=abc&sort=createdAt:desc
```

---

## Ì∑© API Modules

### 1. Health Check
**Base:** `/api/health`  
**Auth:** None  
**Scope:** Public

| Method | Path | Description | FE Trace |
|--------|------|-------------|----------|
| GET | `/` | Server health status | N/A |

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-31T10:30:00.000Z",
  "uptime": 123456
}
```

---

### 2. Authentication
**Base:** `/api/v1/auth`  
**Auth:** None (except logout)  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/register` | No | Register new user (email/password) | `LoginPageOTP.tsx:45` |
| POST | `/verify-otp` | No | Verify OTP code | `LoginPageOTP.tsx:78` |
| POST | `/login` | No | Login with email/password | `LoginPageOTP.tsx:112` |
| POST | `/logout` | Yes | Logout current session | `Header.tsx:89` |
| POST | `/forgot-password` | No | Request password reset | `LoginPageOTP.tsx:145` |
| POST | `/reset-password` | No | Reset password with token | `ResetPassword.tsx:34` |
| POST | `/change-password` | Yes | Change password (authenticated) | `ProfileManagement.tsx:67` |
| POST | `/admin/login` | No | Admin login | `AdminLoginPage.tsx:56` |

**TODO:** Document Google OAuth flow endpoint

---

### 3. User Profile
**Base:** `/api/v1/user`  
**Auth:** Required  
**Scope:** Client

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/profile` | Yes | Get current user profile | `ProfileManagement.tsx:23`, `MemberDashboard.tsx:45` |
| PUT | `/profile` | Yes | Update user profile | `ProfileManagement.tsx:89` |

**Body (PUT):**
```json
{
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "language": "vi"
}
```

---

### 4. Member Dashboard
**Base:** `/api/v1/members`  
**Auth:** Required  
**Scope:** Client

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/dashboard` | Yes | Get member dashboard stats | `MemberDashboard.tsx:34` |
| GET | `/bookings` | Yes | Get booking history (paginated) | `BookingHistory.tsx:56` |

**Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalBookings": 12,
      "upcomingBookings": 3,
      "completedBookings": 9,
      "memberPoints": 450
    },
    "upcomingBookings": [...]
  }
}
```

---

### 5. Services
**Base:** `/api/v1/services`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | No | Get all services (paginated) | `ServicesPage.tsx:45`, `Home.tsx:78` |
| GET | `/featured` | No | Get featured services | `Home.tsx:34` |
| GET | `/categories` | No | Get service categories | `ServicesPage.tsx:23` |
| GET | `/:id` | No | Get service by ID or slug | `ServiceDetailPage.tsx:67` |

**Query Params (GET /):**
- `page`, `limit` - Pagination
- `categoryId` - Filter by category
- `featured` - Filter featured services
- `search` - Search by name/description

---

### 6. Categories
**Base:** `/api/v1/categories`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | No | Get all service categories | `ServicesPage.tsx:89` |
| GET | `/:id` | No | Get category by ID | `CategoryPage.tsx:45` |
| GET | `/:id/services` | No | Get services in category | `CategoryPage.tsx:78` |

---

### 7. Branches
**Base:** `/api/v1/branches`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | No | Get all branches (paginated) | `BranchesPage.tsx:34`, `BookingPage.tsx:56` |
| GET | `/:id` | No | Get branch by ID | `BranchDetail.tsx:23` |
| GET | `/:id/services` | No | Get services at branch | `BranchDetail.tsx:67` |

**Query Params:**
- `includeServices=true` - Include services in response

---

### 8. Bookings
**Base:** `/api/v1/bookings`  
**Auth:** Optional (guest or authenticated)  
**Scope:** Client

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/` | No | Create new booking (guest/member) | `BookingPage.tsx:234` |
| GET | `/:id` | No | Get booking by ID | `BookingDetail.tsx:45` |
| GET | `/:id/payment-status` | No | Get booking payment status | `PaymentResult.tsx:34` |
| PATCH | `/:id/cancel` | Yes | Cancel booking | `BookingHistory.tsx:123` |

**TODO:** Add `GET /bookings/reference/:referenceNumber` endpoint

**Body (POST):**
```json
{
  "serviceId": "uuid",
  "branchId": "uuid",
  "date": "2025-11-15",
  "time": "10:30",
  "guestName": "Nguyen Van A",
  "guestEmail": "email@example.com",
  "guestPhone": "0901234567",
  "notes": "Optional notes",
  "paymentMethod": "VNPAY"
}
```

---

### 9. Payments
**Base:** `/api/v1/payments`  
**Auth:** Optional  
**Scope:** Client

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/` | No | Create payment | `BookingPage.tsx:267` |
| GET | `/:id` | No | Get payment by ID | `PaymentResult.tsx:56` |
| PATCH | `/:id/status` | Yes | Update payment status | Admin only |
| GET | `/bookings/:bookingId` | No | Get payments for booking | `BookingDetail.tsx:89` |

#### VNPay Sub-routes
**Base:** `/api/v1/payments/vnpay`

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/create-payment-url` | No | Create VNPay payment URL | `BookingPage.tsx:289` |
| GET | `/return` | No | VNPay callback (success/fail) | `PaymentResult.tsx:23` |
| POST | `/ipn` | No | VNPay IPN webhook | Backend only |

---

### 10. Reviews
**Base:** `/api/v1/reviews`  
**Auth:** None  
**Scope:** Public (read), Client (write)

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | No | Get all approved reviews | `ReviewsPage.tsx:34`, `ServiceDetailPage.tsx:123` |
| POST | `/` | No | Create new review (pending) | `WriteReviewModal.tsx:67` |
| GET | `/:id` | No | Get review by ID | `ReviewDetail.tsx:23` |
| GET | `/service/:serviceId/rating` | No | Get service rating summary | `ServiceDetailPage.tsx:89` |

**Query Params (GET /):**
- `serviceId` - Filter by service
- `rating` - Filter by rating (1-5)
- `sort` - Sort order (`createdAt:desc`)

---

### 11. Blog
**Base:** `/api/v1/blog`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/posts` | No | Get all published posts | `BlogPage.tsx:45` |
| GET | `/posts/:slug` | No | Get post by slug | `BlogDetailPage.tsx:34` |
| GET | `/categories` | No | Get blog categories | `BlogPage.tsx:23` |

**Query Params (GET /posts):**
- `page`, `limit` - Pagination
- `categoryId` - Filter by category
- `search` - Search by title/content

---

### 12. Vouchers
**Base:** `/api/v1/vouchers`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/active` | No | Get all active vouchers | `BookingPage.tsx:178` |
| GET | `/code/:code` | No | Get voucher by code | `BookingPage.tsx:195` |
| POST | `/validate` | No | Validate voucher & calculate discount | `BookingPage.tsx:212` |

**Body (POST /validate):**
```json
{
  "code": "SUMMER2025",
  "purchaseAmount": 500000
}
```

---

### 13. Contact
**Base:** `/api/v1/contact`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/` | No | Submit contact form | `ContactPage.tsx:89` |

**Body:**
```json
{
  "name": "Nguyen Van A",
  "email": "email@example.com",
  "phone": "0901234567",
  "subject": "Inquiry",
  "message": "Message text"
}
```

---

### 14. AI Features
**Base:** `/api/v1/ai`  
**Auth:** None  
**Scope:** Public

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/chat` | No | Send message to AI chatbot | `ChatWidget.tsx:67` |
| POST | `/skin-analysis` | No | Analyze skin & recommend services | `QuizPage.tsx:123` |
| POST | `/suggest-timeslot` | No | AI booking time suggestions | `BookingPage.tsx:145` |

**TODO:** Add request/response specs for each endpoint

---

### 15. Support Chat
**Base:** `/api/v1/support`  
**Auth:** Required (staff role)  
**Scope:** Staff

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/conversations` | Yes | Get all conversations | `ConversationList.tsx:34` |
| GET | `/conversations/:id` | Yes | Get conversation by ID | `ChatRoom.tsx:45` |
| POST | `/conversations` | Yes | Create new conversation | `ConversationList.tsx:78` |
| PATCH | `/conversations/:id` | Yes | Update conversation | `ChatRoom.tsx:123` |
| POST | `/conversations/:id/assign` | Yes | Assign conversation to staff | `ConversationList.tsx:156` |
| POST | `/conversations/:id/close` | Yes | Close conversation | `ChatRoom.tsx:189` |
| DELETE | `/conversations/:id` | Yes | Delete conversation | `ConversationList.tsx:201` |
| POST | `/conversations/bulk-delete` | Yes | Bulk delete conversations | `ConversationList.tsx:234` |
| GET | `/conversations/:id/messages` | Yes | Get messages in conversation | `ChatRoom.tsx:67` |
| POST | `/messages` | Yes | Send message | `ChatRoom.tsx:145` |
| GET | `/conversations/:id/ai-suggestions` | Yes | Get AI reply suggestions | `ChatRoom.tsx:201` |
| GET | `/statistics` | Yes | Get support statistics | `SupportDashboard.tsx:34` |

---

### 16. Upload
**Base:** `/api/v1/upload`  
**Auth:** Required  
**Scope:** Client/Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| POST | `/` | Yes | Upload image to Supabase Storage | `BlogPostModal.tsx:89`, `ServiceForm.tsx:123` |

**Body:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://supabase.co/storage/...",
    "filename": "image.jpg"
  }
}
```

---

### 17. Admin - Dashboard
**Base:** `/api/v1/admin/dashboard`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/stats` | Yes | Get dashboard statistics | `Dashboard.tsx:34` |
| GET | `/revenue` | Yes | Get revenue data | `Dashboard.tsx:67` |
| GET | `/bookings/recent` | Yes | Get recent bookings | `Dashboard.tsx:89` |

---

### 18. Admin - Appointments
**Base:** `/api/v1/admin/appointments`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all appointments (paginated) | `Appointments.tsx:45` |
| GET | `/:id` | Yes | Get appointment by ID | `Appointments.tsx:123` |
| POST | `/` | Yes | Create new appointment | `Appointments.tsx:178` |
| PUT | `/:id` | Yes | Update appointment | `Appointments.tsx:234` |
| PATCH | `/:id/status` | Yes | Update appointment status | `Appointments.tsx:289` |
| DELETE | `/:id` | Yes | Delete appointment | `Appointments.tsx:345` |

---

### 19. Admin - Services
**Base:** `/api/v1/admin/services`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all services | `Services.tsx:34` |
| GET | `/:id` | Yes | Get service by ID | `Services.tsx:89` |
| POST | `/` | Yes | Create new service | `ServiceModal.tsx:123` |
| PUT | `/:id` | Yes | Update service | `ServiceModal.tsx:178` |
| DELETE | `/:id` | Yes | Delete service | `Services.tsx:234` |

---

### 20. Admin - Branches
**Base:** `/api/v1/admin/branches`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all branches | `Branches.tsx:34` |
| GET | `/:id` | Yes | Get branch by ID | `Branches.tsx:89` |
| POST | `/` | Yes | Create new branch | `BranchModal.tsx:123` |
| PUT | `/:id` | Yes | Update branch | `BranchModal.tsx:178` |
| DELETE | `/:id` | Yes | Delete branch | `Branches.tsx:234` |

---

### 21. Admin - Customers
**Base:** `/api/v1/admin/customers`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all customers (paginated) | `Customers.tsx:45` |
| GET | `/:id` | Yes | Get customer by ID | `Customers.tsx:123` |
| GET | `/:id/bookings` | Yes | Get customer bookings | `Customers.tsx:178` |
| POST | `/` | Yes | Create customer manually | `CustomerModal.tsx:89` |
| PUT | `/:id` | Yes | Update customer | `CustomerModal.tsx:145` |
| DELETE | `/:id` | Yes | Delete customer | `Customers.tsx:234` |

---

### 22. Admin - Staff
**Base:** `/api/v1/admin/staff`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all staff members | `Staff.tsx:34` |
| GET | `/:id` | Yes | Get staff by ID | `Staff.tsx:89` |
| POST | `/` | Yes | Create new staff | `StaffModal.tsx:123` |
| PUT | `/:id` | Yes | Update staff | `StaffModal.tsx:178` |
| DELETE | `/:id` | Yes | Delete staff | `Staff.tsx:234` |

**TODO:** Add endpoints for staff schedule management

---

### 23. Admin - Payments
**Base:** `/api/v1/admin/payments`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all payments (paginated) | `Payments.tsx:45` |
| GET | `/stats` | Yes | Get payment statistics | `Payments.tsx:23` |
| GET | `/:id` | Yes | Get payment by ID | `Payments.tsx:123` |
| PATCH | `/:id/status` | Yes | Update payment status | `Payments.tsx:178` |
| DELETE | `/:id` | Yes | Delete payment | `Payments.tsx:234` |

---

### 24. Admin - Reviews
**Base:** `/api/v1/admin/reviews`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all reviews (including pending) | `Reviews.tsx:45` |
| GET | `/stats` | Yes | Get review statistics | `Reviews.tsx:23` |
| GET | `/:id` | Yes | Get review by ID | `Reviews.tsx:123` |
| PATCH | `/:id/approve` | Yes | Approve review | `Reviews.tsx:178` |
| PATCH | `/:id/reject` | Yes | Reject review | `Reviews.tsx:201` |
| PUT | `/:id` | Yes | Update review | `ReviewModal.tsx:89` |
| DELETE | `/:id` | Yes | Delete review | `Reviews.tsx:234` |

---

### 25. Admin - Blog
**Base:** `/api/v1/admin/blog`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/posts` | Yes | Get all blog posts (including drafts) | `Blog.tsx:45` |
| GET | `/posts/:id` | Yes | Get post by ID | `Blog.tsx:123` |
| POST | `/posts` | Yes | Create new post | `BlogPostModal.tsx:89` |
| PUT | `/posts/:id` | Yes | Update post | `BlogPostModal.tsx:178` |
| DELETE | `/posts/:id` | Yes | Delete post | `Blog.tsx:234` |
| PATCH | `/posts/:id/publish` | Yes | Publish post | `Blog.tsx:267` |
| PATCH | `/posts/:id/unpublish` | Yes | Unpublish post | `Blog.tsx:289` |

---

### 26. Admin - Categories
**Base:** `/api/v1/admin/categories`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/service` | Yes | Get all service categories | `Services.tsx:67` |
| POST | `/service` | Yes | Create service category | `CategoryModal.tsx:89` |
| PUT | `/service/:id` | Yes | Update service category | `CategoryModal.tsx:123` |
| DELETE | `/service/:id` | Yes | Delete service category | `Services.tsx:178` |
| GET | `/blog` | Yes | Get all blog categories | `Blog.tsx:89` |
| POST | `/blog` | Yes | Create blog category | `BlogCategoryModal.tsx:67` |
| PUT | `/blog/:id` | Yes | Update blog category | `BlogCategoryModal.tsx:123` |
| DELETE | `/blog/:id` | Yes | Delete blog category | `Blog.tsx:201` |

---

### 27. Admin - Contacts
**Base:** `/api/v1/admin/contacts`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all contact submissions | `Contacts.tsx:34` (MISSING PAGE) |
| GET | `/:id` | Yes | Get contact by ID | `Contacts.tsx:89` (MISSING PAGE) |
| PATCH | `/:id/status` | Yes | Update contact status | `Contacts.tsx:123` (MISSING PAGE) |
| DELETE | `/:id` | Yes | Delete contact | `Contacts.tsx:178` (MISSING PAGE) |

**TODO:** Create admin Contacts page in FE

---

### 28. Admin - Vouchers
**Base:** `/api/v1/admin/vouchers`  
**Auth:** Required (admin)  
**Scope:** Admin

| Method | Path | Auth | Description | FE Trace |
|--------|------|------|-------------|----------|
| GET | `/` | Yes | Get all vouchers | Admin vouchers page (MISSING) |
| GET | `/:id` | Yes | Get voucher by ID | Admin vouchers page (MISSING) |
| POST | `/` | Yes | Create new voucher | Admin vouchers page (MISSING) |
| PUT | `/:id` | Yes | Update voucher | Admin vouchers page (MISSING) |
| DELETE | `/:id` | Yes | Delete voucher | Admin vouchers page (MISSING) |

**TODO:** Create admin Vouchers CRUD page

---

## Ì≥ù Notes & TODOs

### Missing Endpoints (flagged from FE usage)
1. `GET /api/v1/bookings/reference/:referenceNumber` - Get booking by reference number
2. Admin Vouchers CRUD endpoints frontend page
3. Admin Contacts management frontend page
4. Staff schedule management endpoints
5. Google OAuth callback endpoint documentation

### Inconsistencies to Fix
1. Some admin endpoints use PUT, some use PATCH - standardize to PATCH for partial updates
2. Error response format varies in some controllers - enforce single format
3. Pagination: mix of page-based and cursor-based - document both clearly

### Security Notes
- Rate limiting applied to: `/auth/*`, `/upload/*`
- Admin routes require authentication + admin role check
- File uploads restricted to images (jpg, png, webp)
- XSS protection via helmet middleware
- SQL injection prevented by Prisma ORM

---

**Last Updated:** 2025-10-31  
**Source:** Generated from `apps/backend/src/routes/*` and `apps/frontend/src/*`
