# Frontend Route Map

**Project:** Beauty Clinic Care Website  
**Router:** React Router v6 (createBrowserRouter)  
**Source:** `apps/frontend/src/routes/route-map.tsx`  

---

## ��� Table of Contents

- [Route Tree Overview](#route-tree-overview)
- [Client Routes (Public)](#client-routes-public)
- [Auth Routes](#auth-routes)
- [Member Dashboard (Protected)](#member-dashboard-protected)
- [Support Dashboard (Protected)](#support-dashboard-protected)
- [Admin Panel (Protected)](#admin-panel-protected)
- [Route Guards](#route-guards)
- [CTA Mapping](#cta-mapping)

---

## ��� Route Tree Overview

```
/                                 (ClientLayout)
├── /                            Home
├── /services                    ServicesPage
│   └── /services/:id            ServiceDetailPage
├── /reviews                     ReviewsPage
├── /booking                     BookingPage
│   ├── /booking/detail          BookingDetail
│   └── /booking/payment-result  PaymentResult
├── /branches                    BranchesPage
├── /blog                        BlogPage
│   └── /blog/:slug              BlogDetailPage
├── /quiz                        QuizPage
├── /form-showcase               FormShowcasePage
└── /contact                     ContactPage

/login                           LoginPageOTP (GuestRoute)
/register                        RegisterPageOTP (GuestRoute)
/admin/login                     AdminLoginPage (GuestRoute)

/dashboard                       (ClientLayout + RequireRole: client)
├── /dashboard                   MemberDashboard
├── /dashboard/bookings          BookingHistory
└── /dashboard/profile           ProfileManagement

/support                         SupportLogin

/support-dashboard               (SupportLayout + RequireRole: staff)
├── /support-dashboard           ConversationList
└── /support-dashboard/chat/:id  ChatRoom

/admin                           (AdminLayout + RequireRole: admin)
├── /admin                       Dashboard
├── /admin/appointments          Appointments
├── /admin/services              AdminServices
├── /admin/branches              AdminBranches
├── /admin/customers             Customers
├── /admin/staff                 Staff
├── /admin/payments              Payments
├── /admin/reviews               AdminReviews
├── /admin/blog                  AdminBlog
└── /admin/settings              Settings

/*                               Navigate to /
```

---

## �� Client Routes (Public)

**Layout:** `ClientLayout` (with Navbar + Footer)  
**Guard:** None  
**Lazy:** Yes (all components lazy loaded with Suspense)

| Path | Component | Params | Title | Breadcrumbs | API Calls |
|------|-----------|--------|-------|-------------|-----------|
| `/` | `Home` | - | Home | Home | `/api/v1/services/featured`, `/api/v1/services` |
| `/services` | `ServicesPage` | - | Services | Home > Services | `/api/v1/services`, `/api/v1/categories` |
| `/services/:id` | `ServiceDetailPage` | `:id` (UUID/slug) | Service Detail | Home > Services > [Service Name] | `/api/v1/services/:id`, `/api/v1/reviews` |
| `/reviews` | `ReviewsPage` | - | Reviews | Home > Reviews | `/api/v1/reviews` |
| `/booking` | `BookingPage` | - | Book Appointment | Home > Booking | `/api/v1/services`, `/api/v1/branches`, `/api/v1/bookings` (POST) |
| `/booking/detail` | `BookingDetail` | - | Booking Detail | Home > Booking > Detail | `/api/v1/bookings/:id` |
| `/booking/payment-result` | `PaymentResult` | Query: `vnp_*` | Payment Result | Home > Booking > Payment | `/api/v1/payments/vnpay/return` |
| `/branches` | `BranchesPage` | - | Branches | Home > Branches | `/api/v1/branches` |
| `/blog` | `BlogPage` | - | Blog | Home > Blog | `/api/v1/blog/posts`, `/api/v1/blog/categories` |
| `/blog/:slug` | `BlogDetailPage` | `:slug` | Blog Post | Home > Blog > [Post Title] | `/api/v1/blog/posts/:slug` |
| `/quiz` | `QuizPage` | - | Skin Analysis Quiz | Home > Quiz | `/api/v1/ai/skin-analysis` (POST) |
| `/form-showcase` | `FormShowcasePage` | - | Form Components | Home > Forms | N/A (demo page) |
| `/contact` | `ContactPage` | - | Contact Us | Home > Contact | `/api/v1/contact` (POST) |

**Navigation CTAs:**
- Home Hero CTA: "Đặt lịch ngay" → `/booking`
- Service Card: "Book Now" → `/booking?serviceId=xxx`
- Navbar Links: Logo → `/`, Services → `/services`, Blog → `/blog`, Contact → `/contact`

---

## ��� Auth Routes

**Layout:** Standalone (No layout wrapper)  
**Guard:** `GuestRoute` (redirects authenticated users to `/dashboard`)  
**Lazy:** Yes

| Path | Component | Params | API Calls | Redirect After Success |
|------|-----------|--------|-----------|------------------------|
| `/login` | `LoginPageOTP` | - | `/api/v1/auth/login`, `/api/v1/auth/verify-otp` | `/dashboard` |
| `/register` | `RegisterPageOTP` | - | `/api/v1/auth/register`, `/api/v1/auth/verify-otp` | `/dashboard` |
| `/admin/login` | `AdminLoginPage` | - | `/api/v1/auth/admin/login` | `/admin` |

**CTAs:**
- "Đăng nhập" (Header) → `/login`
- "Đăng ký" (Header) → `/register`
- "Forgot Password?" → TODO: Add `/forgot-password` route

---

## ��� Member Dashboard (Protected)

**Layout:** `ClientLayout` (reuses client nav/footer)  
**Guard:** `RequireRole('client')` - Requires authenticated user  
**Lazy:** Yes

| Path | Component | Params | Title | API Calls |
|------|-----------|--------|-------|-----------|
| `/dashboard` | `MemberDashboard` | - | My Dashboard | `/api/v1/members/dashboard` |
| `/dashboard/bookings` | `BookingHistory` | - | My Bookings | `/api/v1/members/bookings` |
| `/dashboard/profile` | `ProfileManagement` | - | My Profile | `/api/v1/user/profile` (GET, PUT) |

**Navigation:**
- Sidebar/Tabs: Dashboard, Bookings, Profile, Logout
- Actions: "Book Again" → `/booking?serviceId=xxx`

---

## ��� Support Dashboard (Protected)

**Layout:** `SupportLayout`  
**Guard:** `RequireRole('staff')` - Requires staff role  
**Lazy:** Yes

| Path | Component | Params | Title | API Calls |
|------|-----------|--------|-------|-----------|
| `/support` | `SupportLogin` | - | Support Login | `/api/v1/auth/login` (staff credentials) |
| `/support-dashboard` | `ConversationList` | - | Conversations | `/api/v1/support/conversations` |
| `/support-dashboard/chat/:conversationId` | `ChatRoom` | `:conversationId` (UUID) | Chat Room | `/api/v1/support/conversations/:id/messages`, `/api/v1/support/messages` (POST) |

**Socket.IO:** Real-time message updates

---

## ���️ Admin Panel (Protected)

**Layout:** `AdminLayout` (Sidebar + Header)  
**Guard:** `RequireRole('admin')` - Requires ADMIN or SUPER_ADMIN role  
**Lazy:** Yes

| Path | Component | Params | Title | Sidebar Icon | API Calls |
|------|-----------|--------|-------|--------------|-----------|
| `/admin` | `Dashboard` | - | Dashboard | ��� | `/api/v1/admin/dashboard/stats`, `/api/v1/admin/dashboard/revenue` |
| `/admin/appointments` | `Appointments` | - | Appointments | ��� | `/api/v1/admin/appointments` |
| `/admin/services` | `AdminServices` | - | Services | �� | `/api/v1/admin/services` |
| `/admin/branches` | `AdminBranches` | - | Branches | ��� | `/api/v1/admin/branches` |
| `/admin/customers` | `Customers` | - | Customers | ��� | `/api/v1/admin/customers` |
| `/admin/staff` | `Staff` | - | Staff | ���‍��� | `/api/v1/admin/staff` |
| `/admin/payments` | `Payments` | - | Payments | ��� | `/api/v1/admin/payments`, `/api/v1/admin/payments/stats` |
| `/admin/reviews` | `AdminReviews` | - | Reviews | ⭐ | `/api/v1/admin/reviews`, `/api/v1/admin/reviews/stats` |
| `/admin/blog` | `AdminBlog` | - | Blog | ��� | `/api/v1/admin/blog/posts` |
| `/admin/settings` | `Settings` | - | Settings | ⚙️ | `/api/v1/user/profile` (admin profile) |

**Missing Admin Pages:**
- `/admin/contacts` - MISSING (Contact submissions management)
- `/admin/vouchers` - MISSING (Voucher CRUD)

**Sidebar Navigation:** Fixed left sidebar with collapse toggle

---

## ���️ Route Guards

### 1. `GuestRoute`
**Purpose:** Redirects authenticated users away from login/register pages  
**Redirect:** Authenticated users → `/dashboard`  
**Used in:** `/login`, `/register`, `/admin/login`

### 2. `RequireRole(role: 'client' | 'staff' | 'admin')`
**Purpose:** Protects routes by user role  
**Redirect:** Unauthorized → `/login` (with `redirectTo` param)  
**Implementation:** Checks `user.role` from auth context

**Roles:**
- `client`: Member dashboard (`/dashboard/*`)
- `staff`: Support dashboard (`/support-dashboard/*`)
- `admin`: Admin panel (`/admin/*`)

### 3. `ScrollToTop`
**Purpose:** Scrolls to top on route change  
**Used in:** ClientLayout, AdminLayout

---

## ��� CTA Mapping

### Homepage CTAs
| Button | Location | Action | Target Route |
|--------|----------|--------|--------------|
| "Đặt lịch ngay" | Hero section | Navigate | `/booking` |
| Service Card "Xem chi tiết" | Featured Services | Navigate | `/services/:id` |
| "Xem tất cả dịch vụ" | Services section | Navigate | `/services` |

### Services Page CTAs
| Button | Action | Target |
|--------|--------|--------|
| "Book Now" | Navigate with serviceId | `/booking?serviceId=xxx` |
| "Xem chi tiết" | Navigate | `/services/:id` |

### Service Detail Page CTAs
| Button | Action | Target |
|--------|--------|--------|
| "Đặt lịch ngay" | Navigate with serviceId | `/booking?serviceId=xxx` |
| "Viết đánh giá" | Open modal | `WriteReviewModal` → POST `/api/v1/reviews` |

### Booking Flow CTAs
| Button | Step | Action |
|--------|------|--------|
| "Next" | Steps 1-5 | Progress to next step (local state) |
| "Back" | Steps 2-6 | Return to previous step |
| "Submit" | Step 6 | POST `/api/v1/bookings` → Redirect `/booking/detail` |
| "Thanh toán VNPay" | Step 5 | POST `/api/v1/payments/vnpay/create-payment-url` → Redirect VNPay |

### Admin Panel CTAs
| Button | Page | Action | API |
|--------|------|--------|-----|
| "Create New" | All list pages | Open modal/form | POST `/api/v1/admin/{resource}` |
| "Edit" | All list pages | Open edit modal | PUT `/api/v1/admin/{resource}/:id` |
| "Delete" | All list pages | Confirm → Delete | DELETE `/api/v1/admin/{resource}/:id` |
| "Approve" | Reviews | Update status | PATCH `/api/v1/admin/reviews/:id/approve` |
| "Publish" | Blog | Publish post | PATCH `/api/v1/admin/blog/posts/:id/publish` |

---

## �� Cross-References

- **API Documentation:** See [BE_API_OVERVIEW.md](../api/BE_API_OVERVIEW.md)
- **Screen-API Mapping:** See [api-by-screens.updated.md](../api-spec/api-by-screens.updated.md)

---

**Last Updated:** 2025-10-31  
**Source:** Generated from `apps/frontend/src/routes/route-map.tsx`
