# API Mapping by Frontend Screens

**Generated:** October 29, 2025
**Purpose:** Map API endpoints to specific frontend screens for implementation reference
**Status:** Complete coverage of all screens

---

## Table of Contents

### Client Screens

1. [Home Page](#1-home-page)
2. [Services Page](#2-services-page)
3. [Booking Page](#3-booking-page)
4. [Branches Page](#4-branches-page)
5. [Blog Page](#5-blog-page)
6. [Blog Detail Page](#6-blog-detail-page)
7. [Contact Page](#7-contact-page)
8. [Login/Register Pages](#8-loginregister-pages)

### Admin Screens

9. [Admin Login](#9-admin-login)
10. [Dashboard](#10-dashboard)
11. [Appointments Management](#11-appointments-management)
12. [Services Management](#12-services-management)
13. [Branches Management](#13-branches-management)
14. [Customers Management](#14-customers-management)
15. [Staff Management](#15-staff-management)
16. [Reviews Management](#16-reviews-management)
17. [Blog Management](#17-blog-management)
18. [Payments Management](#18-payments-management)
19. [Settings](#19-settings)

---

## Client Screens

### 1. Home Page

**Route:** `/`
**File:** `apps/frontend/src/client/pages/Home.tsx`

#### API Endpoints

| Endpoint                 | Method | Purpose                   | Priority |
| ------------------------ | ------ | ------------------------- | -------- |
| `GET /api/v1/services`   | GET    | Display featured services | HIGH     |
| `GET /api/v1/branches`   | GET    | Show nearby branches      | HIGH     |
| `GET /api/v1/reviews`    | GET    | Show testimonials         | MEDIUM   |
| `GET /api/v1/blog/posts` | GET    | Display latest blog posts | LOW      |

#### Request Examples

```typescript
// Featured Services
GET /api/v1/services?featured=true&limit=6
Response: {
  data: [
    {
      id: number,
      name: string,
      category: string,
      description: string,
      duration: string,
      price: number,
      image: string,
      featured: boolean
    }
  ]
}

// Nearby Branches
GET /api/v1/branches/nearby?lat=40.7128&lng=-74.006&radius=10
Response: {
  data: [
    {
      id: number,
      name: string,
      address: string,
      distance: number,
      image: string
    }
  ]
}

// Testimonials (5-star reviews only)
GET /api/v1/reviews?page=1&limit=3&rating=5&sortBy=date&sortOrder=desc
Response: {
  data: [
    {
      id: number,
      customerName: string,
      customerAvatar: string,
      rating: number,
      comment: string,
      serviceName: string,
      branchName: string,
      date: string,
      verified: boolean
    }
  ],
  stats: {
    totalReviews: number,
    averageRating: number
  }
}

// Note: Home page shows only 5-star verified reviews for testimonials section
// Links to /reviews page for full reviews list
```

---

### 2. Services Page

**Route:** `/services`
**File:** `apps/frontend/src/client/pages/ServicesPage.tsx`

#### API Endpoints

| Endpoint                   | Method | Purpose                        | Priority |
| -------------------------- | ------ | ------------------------------ | -------- |
| `GET /api/v1/services`     | GET    | List all services with filters | HIGH     |
| `GET /api/v1/services/:id` | GET    | Get service details            | HIGH     |

#### Request Examples

```typescript
// List Services (with category filter)
GET /api/v1/services?category=Facial&active=true
Response: {
  data: [
    {
      id: number,
      name: string,
      category: string,
      description: string,
      duration: string,
      price: number,
      image: string,
      active: boolean
    }
  ]
}

// Service Details
GET /api/v1/services/1
Response: {
  data: {
    id: 1,
    name: "AI Skin Analysis Facial",
    category: "Facial",
    description: "...",
    duration: "60 min",
    price: 150,
    image: "...",
    active: true,
    benefits: ["..."],
    suitableFor: ["..."]
  }
}
```

#### Frontend Features

-   Category filtering (All, Facial, Body, Laser, Anti-Aging)
-   Service cards with image, title, price, duration
-   "Book Now" button → redirects to booking page

---

### 3. Booking Page

**Route:** `/booking`
**File:** `apps/frontend/src/client/pages/BookingPage.tsx`

#### API Endpoints

| Endpoint                               | Method | Purpose                      | Priority |
| -------------------------------------- | ------ | ---------------------------- | -------- |
| `GET /api/v1/services`                 | GET    | Service selection dropdown   | HIGH     |
| `GET /api/v1/branches`                 | GET    | Branch selection             | HIGH     |
| `GET /api/v1/staff/available`          | GET    | Filter available therapists  | CRITICAL |
| `GET /api/v1/bookings/availability`    | GET    | Check time slot availability | CRITICAL |
| `POST /api/v1/bookings`                | POST   | Create booking               | CRITICAL |
| `POST /api/v1/bookings/validate-promo` | POST   | Validate promo code          | MEDIUM   |

#### Request Examples

```typescript
// Check Availability (CRITICAL)
GET /api/v1/bookings/availability?serviceId=1&branchId=2&date=2025-10-30&therapistId=5
Response: {
  data: {
    date: "2025-10-30",
    availableSlots: [
      { time: "09:00", available: true, therapistName: "Sarah" },
      { time: "10:00", available: false },
      { time: "11:00", available: true, therapistName: "Emma" }
    ]
  }
}

// Get Available Staff
GET /api/v1/staff/available?branchId=2&serviceId=1&date=2025-10-30
Response: {
  data: [
    {
      id: number,
      name: string,
      specialties: ["Facial", "Skin Analysis"],
      rating: 4.9,
      image: string,
      available: boolean
    }
  ]
}

// Create Booking
POST /api/v1/bookings
Auth: Client (optional for guest booking)
Body: {
  serviceId: 1,
  branchId: 2,
  therapistId: 5,
  date: "2025-10-30",
  time: "14:00",
  customerName: "John Doe",
  customerEmail: "john@email.com",
  customerPhone: "+1234567890",
  notes: "First time visit",
  promoCode?: "WELCOME10",
  paymentMethod: "card" | "clinic" | "wallet"
}
Response: {
  data: {
    id: number,
    bookingNumber: "BK-2025-001",
    status: "pending" | "confirmed",
    qrCode: string,
    totalAmount: number,
    discount: number,
    ...
  }
}

// Validate Promo Code
POST /api/v1/bookings/validate-promo
Body: {
  code: "WELCOME10",
  serviceId: 1,
  totalAmount: 150
}
Response: {
  data: {
    valid: boolean,
    discountType: "percentage" | "fixed",
    discountValue: number,
    finalAmount: number,
    message: string
  }
}
```

#### Frontend Features

-   **Quick Booking** mode (fast 3-step flow)
-   **Full Booking** mode (detailed information)
-   AI-powered time slot recommendation
-   Real-time availability indicator (green/yellow/red)
-   Therapist selection with photos and ratings
-   Payment method selection (card, clinic, wallet)
-   Promo code validation
-   Booking confirmation modal with QR code

---

### 4. Branches Page

**Route:** `/branches`
**File:** `apps/frontend/src/client/pages/BranchesPage.tsx`

#### API Endpoints

| Endpoint                      | Method | Purpose                            | Priority |
| ----------------------------- | ------ | ---------------------------------- | -------- |
| `GET /api/v1/branches`        | GET    | List all branches                  | HIGH     |
| `GET /api/v1/branches/nearby` | GET    | Find nearby branches (geolocation) | MEDIUM   |

#### Request Examples

```typescript
// List All Branches
GET /api/v1/branches
Response: {
  data: [
    {
      id: number,
      name: string,
      address: string,
      phone: string,
      email: string,
      hours: string,
      image: string,
      location: { lat: number, lng: number },
      services: string[]
    }
  ]
}

// Nearby Branches
GET /api/v1/branches/nearby?lat=40.7128&lng=-74.006&radius=10
Response: {
  data: [
    {
      id: number,
      name: string,
      address: string,
      distance: number, // in km
      location: { lat: number, lng: number }
    }
  ]
}
```

#### Frontend Features

-   Interactive map showing all branch locations
-   Branch cards with details (address, phone, hours, services)
-   Click on map marker → highlight branch card
-   "Book Now" button → redirects to booking page with pre-selected branch

---

### 5. Blog Page

**Route:** `/blog`
**File:** `apps/frontend/src/client/pages/BlogPage.tsx`

#### API Endpoints

| Endpoint                 | Method | Purpose                      | Priority |
| ------------------------ | ------ | ---------------------------- | -------- |
| `GET /api/v1/blog/posts` | GET    | List blog posts with filters | HIGH     |

#### Request Examples

```typescript
// List Blog Posts
GET /api/v1/blog/posts?category=Skincare&page=1&limit=9
Response: {
  data: [
    {
      id: number,
      title: string,
      slug: string,
      excerpt: string,
      image: string,
      author: string,
      date: string,
      category: string,
      readTime: string,
      views: number,
      tags: string[]
    }
  ],
  meta: {
    page: 1,
    limit: 9,
    total: 45,
    totalPages: 5
  }
}
```

#### Frontend Features

-   Category filter buttons (All, Skincare Tips, Laser Technology, AI Trends, Clinic Updates)
-   Blog grid with card layout
-   Sidebar with popular topics and recent posts
-   Hero section with featured post

---

### 6. Blog Detail Page

**Route:** `/blog/:slug`
**File:** `apps/frontend/src/client/pages/BlogDetailPage.tsx`

#### API Endpoints

| Endpoint                 | Method | Purpose               | Priority |
| ------------------------ | ------ | --------------------- | -------- |
| `GET /api/v1/blog/:slug` | GET    | Get blog post by slug | HIGH     |

#### Request Examples

```typescript
// Get Blog Post by Slug
GET /api/v1/blog/top-10-skincare-tips-for-radiant-skin
Response: {
  data: {
    id: number,
    title: string,
    slug: string,
    content: string, // Full markdown/HTML content
    excerpt: string,
    image: string,
    author: string,
    date: string,
    readTime: string,
    views: number,
    tags: string[],
    category: string,
    relatedPosts: [
      { id, title, slug, image, excerpt }
    ]
  }
}
```

#### Frontend Features

-   Full blog post content rendering
-   Author information
-   Social share buttons
-   Related posts section
-   Comments section (future feature)

---

### 7. Contact Page

**Route:** `/contact`
**File:** `apps/frontend/src/client/pages/ContactPage.tsx`

#### API Endpoints

| Endpoint               | Method | Purpose             | Priority |
| ---------------------- | ------ | ------------------- | -------- |
| `POST /api/v1/contact` | POST   | Submit contact form | MEDIUM   |

#### Request Examples

```typescript
// Submit Contact Form
POST /api/v1/contact
Auth: Optional (can be guest)
Body: {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
}
Response: {
  data: {
    id: number,
    status: "submitted",
    submittedAt: string,
    ticketNumber: "CONTACT-2025-001"
  }
}
```

#### Frontend Features

-   Contact form with validation
-   Contact information display (phone, email, address)
-   Support features cards (secure payments, privacy, 24/7 support)

---

### 8. Login/Register Pages

**Routes:** `/login`, `/register`**Files:**

-   `apps/frontend/src/client/pages/LoginPageOTP.tsx`
-   `apps/frontend/src/client/pages/RegisterPageOTP.tsx`

#### API Endpoints

| Endpoint                       | Method | Purpose                       | Priority |
| ------------------------------ | ------ | ----------------------------- | -------- |
| `POST /api/v1/auth/register`   | POST   | Client registration           | HIGH     |
| `POST /api/v1/auth/login`      | POST   | Client login (email/password) | HIGH     |
| `POST /api/v1/auth/google`     | POST   | Google OAuth login            | HIGH     |
| `POST /api/v1/auth/send-otp`   | POST   | Send OTP code (future)        | LOW      |
| `POST /api/v1/auth/verify-otp` | POST   | Verify OTP code (future)      | LOW      |

#### Request Examples

```typescript
// Register
POST /api/v1/auth/register
Body: {
  name: string,
  email: string,
  phone: string,
  password: string
}
Response: {
  data: {
    user: {
      id: string, // UUID
      name: string,
      email: string,
      role: "client"
    },
    token: string,
    expiresAt: string
  }
}

// Login
POST /api/v1/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      role: "client"
    },
    token: string,
    expiresAt: string
  }
}

// Google OAuth (SECURITY: Backend must verify)
POST /api/v1/auth/google
Body: {
  credential: string, // Google JWT token
  provider: "google"
}
Response: {
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      avatar: string,
      role: "client"
    },
    token: string
  }
}
```

#### Frontend Features

-   Email/password login
-   Google OAuth login
-   Registration form
-   OTP verification (planned)
-   Remember me checkbox
-   Password strength indicator

---

## Admin Screens

### 9. Admin Login

**Route:** `/admin/login`
**File:** `apps/frontend/src/admin/pages/AdminLoginPage.tsx`

#### API Endpoints

| Endpoint                         | Method | Purpose                                    | Priority |
| -------------------------------- | ------ | ------------------------------------------ | -------- |
| `POST /api/v1/admin/auth/login`  | POST   | Admin login                                | HIGH     |
| `POST /api/v1/admin/auth/google` | POST   | Admin Google OAuth (with domain whitelist) | HIGH     |

#### Request Examples

```typescript
// Admin Login
POST /api/v1/admin/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      role: "admin",
      permissions: string[]
    },
    token: string,
    expiresAt: string
  }
}

// Admin Google OAuth (SECURITY: Server-side domain whitelist)
POST /api/v1/admin/auth/google
Body: {
  credential: string,
  provider: "google"
}
Response: {
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      avatar: string,
      role: "admin",
      permissions: string[]
    },
    token: string
  }
}
// ⚠️ Backend MUST verify email domain is in whitelist
// Allowed domains: ['admin.beautyclinic.com', 'manager.beautyclinic.com']
```

---

### 10. Dashboard

**Route:** `/admin`
**File:** `apps/frontend/src/admin/pages/Dashboard.tsx`

#### API Endpoints

| Endpoint                                           | Method | Purpose                 | Priority |
| -------------------------------------------------- | ------ | ----------------------- | -------- |
| `GET /api/v1/admin/dashboard/metrics`              | GET    | Get dashboard metrics   | HIGH     |
| `GET /api/v1/admin/dashboard/revenue-chart`        | GET    | Revenue over time data  | HIGH     |
| `GET /api/v1/admin/dashboard/service-distribution` | GET    | Service popularity data | MEDIUM   |

#### Request Examples

```typescript
// Dashboard Metrics
GET /api/v1/admin/dashboard/metrics?period=today
Auth: Admin
Response: {
  data: {
    totalBookingsToday: {
      value: 47,
      change: "+12%"
    },
    activeMembers: {
      value: 1284,
      change: "+8%"
    },
    revenueThisWeek: {
      value: 12450,
      change: "+15%"
    },
    aiRecommendations: {
      value: 23
    }
  }
}

// Revenue Chart Data
GET /api/v1/admin/dashboard/revenue-chart?period=week
Auth: Admin
Response: {
  data: [
    { name: "Mon", bookings: 45, revenue: 5400 },
    { name: "Tue", bookings: 52, revenue: 6240 },
    { name: "Wed", bookings: 48, revenue: 5760 },
    { name: "Thu", bookings: 61, revenue: 7320 },
    { name: "Fri", bookings: 70, revenue: 8400 },
    { name: "Sat", bookings: 85, revenue: 10200 },
    { name: "Sun", bookings: 58, revenue: 6960 }
  ]
}

// Service Distribution
GET /api/v1/admin/dashboard/service-distribution
Auth: Admin
Response: {
  data: [
    { name: "Facial", value: 35, percentage: 35 },
    { name: "Massage", value: 28, percentage: 28 },
    { name: "Hair", value: 20, percentage: 20 },
    { name: "Nails", value: 17, percentage: 17 }
  ]
}
```

#### Frontend Features

-   4 metric cards with change indicators
-   Revenue line chart (bookings over time)
-   Service distribution pie chart
-   AI insights panel with recommendations
-   Real-time updates

---

### 11. Appointments Management

**Route:** `/admin/appointments`
**File:** `apps/frontend/src/admin/pages/Appointments.tsx`

#### API Endpoints

| Endpoint                                      | Method | Purpose                               | Priority |
| --------------------------------------------- | ------ | ------------------------------------- | -------- |
| `GET /api/v1/admin/appointments`              | GET    | List appointments with search/filters | HIGH     |
| `POST /api/v1/admin/appointments`             | POST   | Create new appointment                | HIGH     |
| `PATCH /api/v1/admin/appointments/:id`        | PATCH  | Update appointment status             | HIGH     |
| `DELETE /api/v1/admin/appointments/:id`       | DELETE | Cancel appointment                    | HIGH     |
| `POST /api/v1/admin/appointments/bulk-delete` | POST   | Bulk cancel appointments              | MEDIUM   |
| `POST /api/v1/admin/appointments/bulk-update` | POST   | Bulk update status                    | MEDIUM   |

#### Request Examples

```typescript
// List Appointments (with filters)
GET /api/v1/admin/appointments?search=Sarah&branch=Downtown&status=confirmed&date=2025-10-30&page=1&limit=20
Auth: Admin
Response: {
  data: [
    {
      id: number,
      bookingNumber: string,
      customerName: string,
      customerEmail: string,
      customerPhone: string,
      service: string,
      therapist: string,
      branch: string,
      date: string,
      time: string,
      status: "pending" | "confirmed" | "completed" | "cancelled",
      totalAmount: number,
      paymentStatus: "paid" | "unpaid" | "refunded"
    }
  ],
  meta: { page, limit, total, totalPages }
}

// Create Appointment
POST /api/v1/admin/appointments
Auth: Admin
Body: {
  customerId?: number, // Optional if existing customer
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  serviceId: number,
  branchId: number,
  therapistId: number,
  date: string,
  time: string,
  notes?: string
}
Response: {
  data: {
    id: number,
    bookingNumber: string,
    status: "confirmed",
    ...
  }
}

// Update Status
PATCH /api/v1/admin/appointments/123
Auth: Admin
Body: {
  status: "confirmed" | "completed" | "cancelled"
}
Response: {
  data: { id, status, updatedAt }
}

// Bulk Delete
POST /api/v1/admin/appointments/bulk-delete
Auth: Admin
Body: {
  ids: [1, 2, 3]
}
Response: {
  data: {
    deleted: 3,
    success: true
  }
}
```

#### Frontend Features

-   Search by customer name or service
-   Filter by branch, status, date
-   Quick status toggle (pending ↔ confirmed)
-   New booking modal
-   Bulk selection and actions
-   AI prediction banner (high demand prediction)
-   Export to CSV (future)

---

### 12. Services Management

**Route:** `/admin/services`
**File:** `apps/frontend/src/admin/pages/Services.tsx`

#### API Endpoints

| Endpoint                            | Method | Purpose           | Priority |
| ----------------------------------- | ------ | ----------------- | -------- |
| `GET /api/v1/admin/services`        | GET    | List all services | HIGH     |
| `POST /api/v1/admin/services`       | POST   | Create service    | HIGH     |
| `PATCH /api/v1/admin/services/:id`  | PATCH  | Update service    | HIGH     |
| `DELETE /api/v1/admin/services/:id` | DELETE | Delete service    | HIGH     |

#### Request Examples

```typescript
// List Services
GET /api/v1/admin/services?category=Facial&active=true
Auth: Admin
Response: {
  data: [
    {
      id: number,
      name: string,
      category: string,
      description: string,
      duration: string,
      price: number,
      image: string,
      active: boolean,
      createdAt: string,
      updatedAt: string
    }
  ]
}

// Create Service
POST /api/v1/admin/services
Auth: Admin
Body: {
  name: string,
  category: string,
  description: string,
  duration: string,
  price: number,
  image: string,
  active: boolean
}
Response: {
  data: { id, ...service }
}

// Update Service
PATCH /api/v1/admin/services/1
Auth: Admin
Body: {
  name?: string,
  price?: number,
  active?: boolean,
  ...
}
Response: {
  data: { id, ...updatedService }
}

// Delete Service
DELETE /api/v1/admin/services/1
Auth: Admin
Response: {
  data: { success: true }
}
```

#### Frontend Features

-   Service cards with image, category, duration, price
-   Visibility toggle (eye icon)
-   Edit service button
-   Add new service button
-   AI suggestion banner (AI service description generator)
-   Category badges

---

### 13. Branches Management

**Route:** `/admin/branches`
**File:** `apps/frontend/src/admin/pages/Branches.tsx`

#### API Endpoints

| Endpoint                            | Method | Purpose           | Priority |
| ----------------------------------- | ------ | ----------------- | -------- |
| `GET /api/v1/admin/branches`        | GET    | List all branches | HIGH     |
| `POST /api/v1/admin/branches`       | POST   | Create branch     | HIGH     |
| `PATCH /api/v1/admin/branches/:id`  | PATCH  | Update branch     | HIGH     |
| `DELETE /api/v1/admin/branches/:id` | DELETE | Delete branch     | HIGH     |

#### Request Examples

```typescript
// List Branches
GET /api/v1/admin/branches
Auth: Admin
Response: {
  data: [
    {
      id: number,
      name: string,
      address: string,
      phone: string,
      email: string,
      hours: string,
      image: string,
      location: { lat: number, lng: number },
      status: "open" | "closed" | "maintenance",
      performance: string, // e.g., "+18%"
      createdAt: string
    }
  ]
}

// Create Branch
POST /api/v1/admin/branches
Auth: Admin
Body: {
  name: string,
  address: string,
  phone: string,
  email: string,
  hours: string,
  image: string,
  location: { lat: number, lng: number },
  status: "open"
}
Response: {
  data: { id, ...branch }
}

// Update Branch
PATCH /api/v1/admin/branches/1
Auth: Admin
Body: {
  name?: string,
  status?: "open" | "closed",
  ...
}
Response: {
  data: { id, ...updatedBranch }
}
```

#### Frontend Features

-   Branch cards with image, address, phone, hours
-   Status indicator (open/closed with animated dot)
-   Performance badge (trending up icon with percentage)
-   Edit info button
-   View map button
-   Add new branch button

---

### 14. Customers Management

**Route:** `/admin/customers`
**File:** `apps/frontend/src/admin/pages/Customers.tsx`

#### API Endpoints

| Endpoint                                    | Method | Purpose                    | Priority |
| ------------------------------------------- | ------ | -------------------------- | -------- |
| `GET /api/v1/admin/customers`               | GET    | List customers with search | HIGH     |
| `POST /api/v1/admin/customers`              | POST   | Create customer            | HIGH     |
| `PATCH /api/v1/admin/customers/:id`         | PATCH  | Update customer            | HIGH     |
| `DELETE /api/v1/admin/customers/:id`        | DELETE | Delete customer            | HIGH     |
| `GET /api/v1/admin/customers/:id/analytics` | GET    | Customer analytics         | MEDIUM   |
| `POST /api/v1/admin/customers/bulk-delete`  | POST   | Bulk delete customers      | LOW      |

#### Request Examples

```typescript
// List Customers
GET /api/v1/admin/customers?search=Sarah&tier=VIP&status=active&page=1&limit=20
Auth: Admin
Response: {
  data: [
    {
      id: number,
      name: string,
      email: string,
      phone: string,
      avatar?: string,
      bookings: number,
      tier: "New" | "Silver" | "Gold" | "VIP",
      status: "active" | "inactive",
      retention: string, // e.g., "95%"
      totalSpent: number,
      lastVisit: string,
      createdAt: string
    }
  ],
  meta: { page, limit, total }
}

// Create Customer
POST /api/v1/admin/customers
Auth: Admin
Body: {
  name: string,
  email: string,
  phone: string,
  tier?: string
}
Response: {
  data: { id, ...customer }
}

// Customer Analytics
GET /api/v1/admin/customers/123/analytics
Auth: Admin
Response: {
  data: {
    customerId: 123,
    totalBookings: 24,
    totalSpent: 2880,
    averageSpent: 120,
    lastVisit: "2025-10-25",
    favoriteServices: ["Facial", "Massage"],
    retentionRate: 95,
    lifetimeValue: 3200,
    bookingHistory: [
      { date, service, amount, status }
    ]
  }
}
```

#### Frontend Features

-   Customer table with avatar, name, email, phone
-   Search by name or email
-   Filter by tier (VIP, Gold, Silver, New)
-   Membership tier badges with gradient colors
-   View details button → customer detail modal
-   Edit button → customer edit modal
-   Delete button with confirmation
-   Bulk selection and delete
-   Customer analytics view

---

### 15. Staff Management

**Route:** `/admin/staff`
**File:** `apps/frontend/src/admin/pages/Staff.tsx`

#### API Endpoints

| Endpoint                                   | Method | Purpose               | Priority |
| ------------------------------------------ | ------ | --------------------- | -------- |
| `GET /api/v1/admin/staff`                  | GET    | List staff members    | HIGH     |
| `POST /api/v1/admin/staff`                 | POST   | Create staff          | HIGH     |
| `PATCH /api/v1/admin/staff/:id`            | PATCH  | Update staff          | HIGH     |
| `DELETE /api/v1/admin/staff/:id`           | DELETE | Delete staff          | HIGH     |
| `GET /api/v1/admin/staff/:id/schedule`     | GET    | View staff schedule   | MEDIUM   |
| `POST /api/v1/admin/staff/ai-generate-bio` | POST   | AI generate staff bio | LOW      |

#### Request Examples

```typescript
// List Staff
GET /api/v1/admin/staff?branch=Downtown&specialization=Facial&status=available
Auth: Admin
Response: {
  data: [
    {
      id: number,
      name: string,
      email: string,
      phone: string,
      avatar?: string,
      specialization: string,
      branch: string,
      rating: number,
      status: "available" | "on-leave" | "busy",
      bio?: string,
      experience: string,
      certifications: string[],
      createdAt: string
    }
  ]
}

// Create Staff
POST /api/v1/admin/staff
Auth: Admin
Body: {
  name: string,
  email: string,
  phone: string,
  avatar?: string,
  specialization: string,
  branchId: number,
  bio?: string,
  experience: string,
  certifications: string[]
}
Response: {
  data: { id, ...staff }
}

// Staff Schedule
GET /api/v1/admin/staff/5/schedule?date=2025-10-30
Auth: Admin
Response: {
  data: {
    staffId: 5,
    staffName: "Emma Wilson",
    date: "2025-10-30",
    workingHours: "09:00-17:00",
    appointments: [
      {
        time: "10:00",
        duration: "60 min",
        customer: "Sarah J.",
        service: "Facial"
      }
    ],
    availableSlots: ["09:00", "14:00", "15:00"]
  }
}

// AI Generate Bio
POST /api/v1/admin/staff/ai-generate-bio
Auth: Admin
Body: {
  name: string,
  specialization: string,
  experience: string,
  certifications: string[]
}
Response: {
  data: {
    bio: string // AI-generated professional bio
  }
}
```

#### Frontend Features

-   Staff cards with photo, name, specialization, branch
-   Rating display (stars)
-   Status indicator (available, on-leave, busy)
-   Edit button
-   View schedule button
-   Delete button
-   Add new therapist button
-   AI suggestion banner (AI bio generator)

---

### 16. Reviews Management

**Route:** `/admin/reviews`
**File:** `apps/frontend/src/admin/pages/Reviews.tsx`

#### API Endpoints

| Endpoint                            | Method | Purpose                    | Priority |
| ----------------------------------- | ------ | -------------------------- | -------- |
| `GET /api/v1/admin/reviews`         | GET    | List all reviews           | HIGH     |
| `PATCH /api/v1/admin/reviews/:id`   | PATCH  | Reply to review            | HIGH     |
| `DELETE /api/v1/admin/reviews/:id`  | DELETE | Delete review              | MEDIUM   |
| `GET /api/v1/admin/reviews/metrics` | GET    | Review metrics & sentiment | MEDIUM   |

#### Request Examples

```typescript
// List Reviews
GET /api/v1/admin/reviews?sentiment=positive&replied=false&page=1&limit=20
Auth: Admin
Response: {
  data: [
    {
      id: number,
      customerId: number,
      customerName: string,
      customerAvatar?: string,
      rating: number,
      service: string,
      comment: string,
      sentiment: "positive" | "neutral" | "negative",
      replied: boolean,
      reply?: string,
      date: string,
      createdAt: string
    }
  ],
  meta: { page, limit, total }
}

// Reply to Review
PATCH /api/v1/admin/reviews/123
Auth: Admin
Body: {
  reply: string
}
Response: {
  data: {
    id: 123,
    replied: true,
    reply: string,
    repliedAt: string
  }
}

// Review Metrics
GET /api/v1/admin/reviews/metrics?period=month
Auth: Admin
Response: {
  data: {
    totalReviews: 156,
    averageRating: 4.7,
    sentimentBreakdown: {
      positive: 85,
      neutral: 10,
      negative: 5
    },
    sentimentPercentage: {
      positive: 85,
      neutral: 10,
      negative: 5
    },
    changeFromLastPeriod: "+12%",
    topServices: [
      { service: "Facial", averageRating: 4.9, count: 45 }
    ]
  }
}
```

#### Frontend Features

-   Review cards with customer photo, rating, comment
-   Sentiment indicator (color-coded badges)
-   Reply button → opens reply modal
-   Delete button
-   AI sentiment analysis banner
-   Metrics cards (average rating, sentiment breakdown)
-   Filter by sentiment (positive, neutral, negative)
-   Filter by reply status

---

### 17. Blog Management

**Route:** `/admin/blog`
**File:** `apps/frontend/src/admin/pages/Blog.tsx`

#### API Endpoints

| Endpoint                              | Method | Purpose                  | Priority |
| ------------------------------------- | ------ | ------------------------ | -------- |
| `GET /api/v1/admin/blog/posts`        | GET    | List all blog posts      | HIGH     |
| `POST /api/v1/admin/blog/posts`       | POST   | Create blog post         | HIGH     |
| `PATCH /api/v1/admin/blog/posts/:id`  | PATCH  | Update blog post         | HIGH     |
| `DELETE /api/v1/admin/blog/posts/:id` | DELETE | Delete blog post         | HIGH     |
| `POST /api/v1/admin/blog/ai-generate` | POST   | AI generate blog content | LOW      |

#### Request Examples

```typescript
// List Blog Posts
GET /api/v1/admin/blog/posts?status=published&category=Skincare&page=1
Auth: Admin
Response: {
  data: [
    {
      id: number,
      title: string,
      slug: string,
      excerpt: string,
      content: string,
      image: string,
      status: "draft" | "published",
      author: string,
      category: string,
      tags: string[],
      views: number,
      date: string,
      createdAt: string,
      updatedAt: string
    }
  ],
  meta: { page, limit, total }
}

// Create Blog Post
POST /api/v1/admin/blog/posts
Auth: Admin
Body: {
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  image: string,
  status: "draft" | "published",
  category: string,
  tags: string[]
}
Response: {
  data: { id, ...post }
}

// Update Blog Post
PATCH /api/v1/admin/blog/posts/1
Auth: Admin
Body: {
  title?: string,
  content?: string,
  status?: "draft" | "published",
  ...
}
Response: {
  data: { id, ...updatedPost }
}

// AI Generate Content
POST /api/v1/admin/blog/ai-generate
Auth: Admin
Body: {
  topic: string,
  keywords: string[],
  tone: "professional" | "casual" | "educational",
  length: "short" | "medium" | "long"
}
Response: {
  data: {
    title: string,
    content: string,
    excerpt: string,
    suggestedTags: string[]
  }
}
```

#### Frontend Features

-   Blog post cards with image, title, excerpt
-   Status badge (published/draft)
-   View count display
-   Edit button
-   Delete button
-   Toggle publish/draft button (eye icon)
-   New post button → opens blog post modal
-   AI content generator button
-   Filter by status and category

---

### 18. Payments Management

**Route:** `/admin/payments`
**File:** `apps/frontend/src/admin/pages/Payments.tsx`

#### API Endpoints

| Endpoint                                   | Method | Purpose                  | Priority |
| ------------------------------------------ | ------ | ------------------------ | -------- |
| `GET /api/v1/admin/payments`               | GET    | List all payments        | HIGH     |
| `GET /api/v1/admin/payments/:id`           | GET    | Payment details          | HIGH     |
| `POST /api/v1/admin/payments/:id/refund`   | POST   | Process refund           | HIGH     |
| `GET /api/v1/admin/payments/revenue-trend` | GET    | Revenue trend chart data | MEDIUM   |
| `GET /api/v1/admin/payments/export`        | GET    | Export payments to CSV   | LOW      |

#### Request Examples

```typescript
// List Payments
GET /api/v1/admin/payments?status=paid&dateFrom=2025-10-01&dateTo=2025-10-31&page=1
Auth: Admin
Response: {
  data: [
    {
      id: string, // e.g., "BK-2024-001"
      date: string,
      customer: string,
      amount: number,
      status: "paid" | "pending" | "refunded",
      service: string,
      paymentMethod: "card" | "cash" | "wallet",
      transactionId?: string
    }
  ],
  meta: { page, limit, total }
}

// Payment Details
GET /api/v1/admin/payments/BK-2024-001
Auth: Admin
Response: {
  data: {
    id: "BK-2024-001",
    bookingId: number,
    customer: {
      name: string,
      email: string,
      phone: string
    },
    service: string,
    therapist: string,
    branch: string,
    date: string,
    time: string,
    amount: number,
    discount: number,
    tax: number,
    totalAmount: number,
    status: "paid" | "pending" | "refunded",
    paymentMethod: string,
    transactionId: string,
    paidAt?: string,
    refundedAt?: string,
    refundReason?: string
  }
}

// Process Refund
POST /api/v1/admin/payments/BK-2024-001/refund
Auth: Admin
Body: {
  reason: string,
  amount: number // Can be partial refund
}
Response: {
  data: {
    id: "BK-2024-001",
    status: "refunded",
    refundAmount: number,
    refundedAt: string,
    refundReason: string
  }
}

// Revenue Trend
GET /api/v1/admin/payments/revenue-trend?period=week
Auth: Admin
Response: {
  data: [
    { name: "Mon", revenue: 2400 },
    { name: "Tue", revenue: 3200 },
    { name: "Wed", revenue: 2800 },
    { name: "Thu", revenue: 3600 },
    { name: "Fri", revenue: 4200 },
    { name: "Sat", revenue: 5100 },
    { name: "Sun", revenue: 3800 }
  ]
}

// Export Payments
GET /api/v1/admin/payments/export?dateFrom=2025-10-01&dateTo=2025-10-31&format=csv
Auth: Admin
Response: CSV file download
```

#### Frontend Features

-   Revenue line chart (weekly trend)
-   Payment method distribution pie chart
-   Transaction table with status badges
-   View details button → payment details modal
-   Refund button → refund modal
-   Export button (CSV download)
-   Filter by status, date range
-   Search by customer name or transaction ID

---

### 19. Settings

**Route:** `/admin/settings`
**File:** `apps/frontend/src/admin/pages/Settings.tsx`

#### API Endpoints

| Endpoint                       | Method | Purpose              | Priority |
| ------------------------------ | ------ | -------------------- | -------- |
| `GET /api/v1/admin/settings`   | GET    | Get system settings  | MEDIUM   |
| `PATCH /api/v1/admin/settings` | PATCH  | Update settings      | MEDIUM   |
| `GET /api/v1/profile`          | GET    | Get admin profile    | MEDIUM   |
| `PATCH /api/v1/profile`        | PATCH  | Update admin profile | MEDIUM   |

#### Request Examples

```typescript
// Get Settings
GET /api/v1/admin/settings
Auth: Admin
Response: {
  data: {
    businessHours: {
      monday: { open: "09:00", close: "18:00" },
      // ... other days
    },
    bookingSettings: {
      maxAdvanceDays: 30,
      minAdvanceHours: 2,
      cancelPolicyHours: 24,
      maxBookingsPerDay: 10
    },
    notificationSettings: {
      emailNotifications: boolean,
      smsNotifications: boolean,
      reminderHours: 24
    },
    paymentSettings: {
      currency: "USD",
      taxRate: 0.1,
      acceptedMethods: ["card", "cash", "wallet"]
    }
  }
}

// Update Settings
PATCH /api/v1/admin/settings
Auth: Admin
Body: {
  bookingSettings?: { ... },
  notificationSettings?: { ... },
  ...
}
Response: {
  data: { ...updatedSettings }
}

// Get Profile
GET /api/v1/profile
Auth: Admin
Response: {
  data: {
    id: string,
    name: string,
    email: string,
    phone: string,
    avatar?: string,
    role: "admin",
    permissions: string[]
  }
}

// Update Profile
PATCH /api/v1/profile
Auth: Admin
Body: {
  name?: string,
  phone?: string,
  avatar?: string,
  password?: string
}
Response: {
  data: { ...updatedProfile }
}
```

#### Frontend Features

-   Business hours configuration
-   Booking settings (advance days, cancellation policy)
-   Notification preferences
-   Payment settings
-   Admin profile management
-   Password change
-   System preferences

---

## Additional Endpoints

### Profile Management (Client)

| Endpoint                       | Method | Purpose               | Priority |
| ------------------------------ | ------ | --------------------- | -------- |
| `GET /api/v1/profile`          | GET    | Get client profile    | HIGH     |
| `PATCH /api/v1/profile`        | PATCH  | Update client profile | HIGH     |
| `GET /api/v1/profile/bookings` | GET    | Get booking history   | HIGH     |

```typescript
// Get Profile
GET /api/v1/profile
Auth: Client
Response: {
  data: {
    id: string,
    name: string,
    email: string,
    phone: string,
    avatar?: string,
    membershipTier: "New" | "Silver" | "Gold" | "VIP",
    totalVisits: number,
    totalSpent: number,
    dateJoined: string
  }
}

// Booking History
GET /api/v1/profile/bookings?status=completed&page=1&limit=10
Auth: Client
Response: {
  data: [
    {
      id: number,
      service: string,
      branch: string,
      therapist: string,
      date: string,
      time: string,
      status: "confirmed" | "completed" | "cancelled",
      price: number,
      paymentStatus: "paid" | "unpaid"
    }
  ],
  meta: { page, limit, total }
}
```

---

## File Upload

| Endpoint                             | Method | Purpose       | Priority |
| ------------------------------------ | ------ | ------------- | -------- |
| `POST /api/v1/admin/uploads/:folder` | POST   | Upload images | HIGH     |

```typescript
// Upload Image
POST /api/v1/admin/uploads/services
Auth: Admin
Content-Type: multipart/form-data
Body: FormData with file
Response: {
  data: {
    url: string,
    filename: string,
    size: number,
    mimeType: string
  }
}

// Supported folders: services, branches, staff, blog, customers
```

---

## Summary Statistics

| Category   | Screens | Endpoints | Priority Breakdown           |
| ---------- | ------- | --------- | ---------------------------- |
| **Client** | 8       | 22        | HIGH: 15, MEDIUM: 5, LOW: 2  |
| **Admin**  | 11      | 48        | HIGH: 35, MEDIUM: 10, LOW: 3 |
| **Total**  | 19      | 70        | HIGH: 50, MEDIUM: 15, LOW: 5 |

---

## Implementation Priority

### Week 1 (CRITICAL)

1. Authentication endpoints (login, register, OAuth)
2. Booking flow (availability, create booking, validate promo)
3. Services & Branches (public list endpoints)
4. Dashboard metrics
5. Appointments management (CRUD)

### Week 2 (HIGH)

1. Customer management (CRUD)
2. Staff management (CRUD + availability filter)
3. Reviews management
4. Payment management
5. Blog management (CRUD)

### Week 3 (MEDIUM)

1. Profile management (client & admin)
2. Dashboard charts (revenue, service distribution)
3. Review metrics & sentiment
4. Staff schedule view
5. Customer analytics

### Week 4 (NICE TO HAVE)

1. AI features (bio generator, content generator)
2. Bulk operations
3. Export features
4. Settings management
5. Advanced analytics

---

## Notes

1. **Authentication:** All admin endpoints require `Authorization: Bearer <token>` header
2. **User IDs:** User IDs are **UUIDs (string)**, entity IDs (services, branches, etc.) are **numbers**
3. **Security:** Google OAuth must be verified server-side, domain whitelist must be enforced server-side
4. **Pagination:** Use `page` and `limit` query params, return `meta` object with pagination info
5. **File Uploads:** Use multipart/form-data, support common image formats (jpg, png, webp)
6. **Error Handling:** Return consistent error format with `error.message` and `error.code`
7. **Mock Data:** Frontend currently uses mock data in `useStore.ts` and `mockDataStore.ts` - needs replacement

---

**Last Updated:** October 29, 2025
**Status:** ✅ Complete - Ready for backend implementation

---

## Screen: `/dashboard/bookings` (Booking History)

**Auth**: Required (Bearer token, member role)

**Component**: `src/client/pages/dashboard/BookingHistory.tsx`

**Adapter**: `src/api/adapters/member.ts:getMemberBookings()`

#### Endpoints Required:

##### GET `/api/v1/members/bookings`

**Description**: Fetch paginated member booking history with status filters

**Request**:

```http
GET /api/v1/members/bookings?page=1&limit=10&status=all HTTP/1.1
Authorization: Bearer <access_token>
```

**Query Parameters**:

-   `page` (number, optional, default: 1): Page number for pagination
-   `limit` (number, optional, default: 10): Items per page
-   `status` (string, optional, default: 'all'): Filter by status
    -   Values: 'all' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
-   `dateFrom` (ISO 8601, optional): Filter bookings from this date
-   `dateTo` (ISO 8601, optional): Filter bookings until this date

**Response**: `200 OK`

```json
{
    "data": [
        {
            "id": "1",
            "referenceNumber": "BCW-2025-000123",
            "serviceName": "AI Skin Analysis Facial",
            "branchName": "Chi nhánh Trung tâm",
            "appointmentDate": "2025-11-05T10:00:00Z",
            "appointmentTime": "10:00",
            "status": "confirmed",
            "serviceImage": "https://..."
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 12,
        "totalPages": 2
    }
}
```

**Error Responses**:

-   `401 Unauthorized`: Invalid/expired token
-   `403 Forbidden`: Not a member account
-   `400 Bad Request`: Invalid query parameters

**Frontend Usage**:

-   File: `src/client/pages/dashboard/BookingHistory.tsx:26`
-   Hook: `useEffect` on page load and filter/page change
-   Loading state: Yes
-   Error handling: Console log + fallback UI
-   Pagination: Client-side controls (prev/next buttons)
-   Filters: Status tabs (All, Upcoming, Completed, Cancelled)

**Features**:

-   ✅ Status filter tabs
-   ✅ Pagination with page controls
-   ✅ Responsive table (desktop) and cards (mobile)
-   ✅ Empty state with "Book First Appointment" CTA
-   ✅ Status badges with icons
-   ✅ Back to Dashboard link
-   ✅ Loading spinner
-   ✅ Auto-reset to page 1 when filter changes

**TODO/Notes**:

-   [ ] Date range filter UI (dateFrom/dateTo params supported but not wired)
-   [ ] Export to PDF/CSV functionality
-   [ ] Booking detail modal/page
-   [ ] Rebook/reschedule actions for past bookings

---

---

## Screen: Profile Management (`/dashboard/profile`)

**Component:** `apps/frontend/src/client/pages/dashboard/ProfileManagement.tsx`
**Protected:** Yes (Client role required)

### Endpoints Used

#### 1. GET /api/v1/members/profile

**Purpose:** Fetch member profile information on page load

**Request:**

```http
GET /api/v1/members/profile
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "data": {
        "id": "string (UUID)",
        "email": "string",
        "fullName": "string",
        "phone": "string",
        "language": "vi|ja|en|zh",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
    }
}
```

**Frontend Usage:**

-   File: `ProfileManagement.tsx:26`
-   Adapter: `apps/frontend/src/api/adapters/member.ts:getMemberProfile()`
-   Hook: `useEffect()` on mount

---

#### 2. PUT /api/v1/members/profile

**Purpose:** Update member profile information

**Request:**

```http
PUT /api/v1/members/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "string",
  "phone": "string",
  "language": "vi|ja|en|zh" (optional)
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

**Frontend Usage:**

-   File: `ProfileManagement.tsx:43`
-   Adapter: `apps/frontend/src/api/adapters/member.ts:updateMemberProfile()`
-   Trigger: Form submit event

---

### Features Implemented

-   ✅ Read-only email field with note "Contact support to change email"
-   ✅ Editable full name field (required)
-   ✅ Editable phone field (required)
-   ✅ Language selector (vi/ja/en/zh with flag emojis)
-   ✅ Save button with loading state
-   ✅ Success toast notification (3 seconds auto-hide)
-   ✅ Error handling with validation messages
-   ✅ "Member since" display with createdAt date
-   ✅ "Last updated" display with updatedAt date
-   ✅ Cancel button to return to dashboard
-   ✅ Back navigation link to dashboard
-   ✅ Loading spinner during data fetch
-   ✅ Error state with retry button

---

### TODO / Backend Notes

1. **Email Change Flow:**

    - Frontend shows read-only email with support message
    - Backend should provide separate endpoint for email change (requires re-authentication)
    - Consider: `POST /api/v1/members/profile/change-email` with verification flow

2. **Validation Rules:**

    - `fullName`: Min 2 chars, max 100 chars, UTF-8 support (Vietnamese, Japanese, Chinese names)
    - `phone`: Support international formats, consider regex validation
    - `language`: Enum only (vi|ja|en|zh), reject invalid values

3. **Security:**

    - Verify JWT token before allowing profile updates
    - Rate limit PUT endpoint (e.g., max 5 updates per hour per user)
    - Log profile changes for audit trail

4. **Future Enhancement:**

    - Profile picture upload
    - Email/SMS preferences
    - Password change form
    - Delete account option

---

---

## Screen: Service Detail Page (`/services/:id`)

**Component:** `apps/frontend/src/client/pages/ServiceDetailPage.tsx`
**Protected:** No (Public)

### Endpoints Used

#### 1. GET /api/v1/services/:id

**Purpose:** Fetch detailed service information including description, images, benefits, FAQs

**Request:**

```http
GET /api/v1/services/1
```

**Response 200:**

```json
{
    "data": {
        "id": 1,
        "name": "AI Skin Analysis Facial",
        "category": "Facial",
        "description": "Short description",
        "longDescription": "Full multi-paragraph description",
        "excerpt": "Brief summary",
        "duration": "60 min",
        "price": 150,
        "image": "string (main image URL)",
        "images": ["string (gallery URLs)"],
        "beforeAfterPhotos": [
            {
                "before": "string (URL)",
                "after": "string (URL)"
            }
        ],
        "benefits": ["string (benefit list)"],
        "faqs": [
            {
                "question": "string",
                "answer": "string"
            }
        ],
        "averageRating": 4.8,
        "totalReviews": 127,
        "active": true
    }
}
```

**Frontend Usage:**

-   File: `ServiceDetailPage.tsx:40`
-   Adapter: `apps/frontend/src/api/adapters/services.ts:getServiceDetail()`
-   Hook: `useEffect()` on mount and when `id` param changes

---

#### 2. GET /api/v1/services/:id/related

**Purpose:** Fetch related services for recommendations

**Request:**

```http
GET /api/v1/services/1/related
```

**Response 200:**

```json
{
    "data": [
        {
            "id": 2,
            "name": "Hydrafacial Treatment",
            "category": "Facial",
            "excerpt": "Short description",
            "duration": "45 min",
            "price": 180,
            "image": "string (URL)"
        }
    ]
}
```

**Frontend Usage:**

-   File: `ServiceDetailPage.tsx:41`
-   Adapter: `apps/frontend/src/api/adapters/services.ts:getRelatedServices()`
-   Display: Related services carousel at bottom

---

### Features Implemented

-   ✅ Image gallery with thumbnail navigation
-   ✅ Main service information (name, category, price, duration)
-   ✅ Star rating display with review count
-   ✅ "Book Now" CTA button (navigates to /booking with pre-filled service)
-   ✅ Long description section with proper formatting
-   ✅ Benefits list with checkmark icons
-   ✅ Before/After photo comparison (if available)
-   ✅ Expandable FAQ accordion
-   ✅ Related services carousel with click-to-navigate
-   ✅ Loading state with spinner
-   ✅ Error state with retry option
-   ✅ Back to services list link
-   ✅ Responsive design (mobile + desktop)
-   ✅ Smooth animations with Framer Motion

---

### TODO / Backend Notes

1. **Image Optimization:**

    - Serve multiple resolutions (thumbnail, medium, full)
    - Consider CDN integration for faster loading
    - Lazy load gallery images

2. **Related Services Algorithm:**

    - Current: Manual mapping per service
    - Future: ML-based recommendations based on category, price range, user history

3. **SEO:**

    - Add meta tags (title, description, og:image)
    - Structured data (Schema.org ServiceSchema)
    - Canonical URLs

4. **Analytics:**

    - Track service detail views
    - Track "Book Now" clicks
    - A/B test different layouts

## Screen: Public Reviews Display (`/reviews`)

**Route:**`/reviews`

**Component:**`apps/frontend/src/client/pages/ReviewsPage.tsx`

**Status:** ✅ IMPLEMENTED (Phase 2-C)

### API Endpoints

#### 1. GET /api/v1/reviews

**Purpose:** Fetch paginated reviews with filtering and sorting

**Request Params:**

```typescript

interfaceReviewsParams {

    page?: number; // Default: 1

    limit?: number; // Default: 6

    serviceId?: number; // Filter by specific service

    rating?: number; // Filter by rating (1-5)

    sortBy?: 'date' | 'rating'; // Default: 'date'

    sortOrder?: 'asc' | 'desc'; // Default: 'desc'

}

```

**Response:**

```typescript

interfaceReviewsResponse {

    data: Review[];

    meta: {

        page: number;

        limit: number;

        total: number;

        totalPages: number;

    };

    stats: {

        averageRating: number; // e.g., 4.8

        totalReviews: number; // e.g., 12

        ratingDistribution: {

            // Count per rating

            5: number;

            4: number;

            3: number;

            2: number;

            1: number;

        };

    };

}


interfaceReview {

    id: number;

    customerName: string;

    customerAvatar: string;

    rating: number; // 1-5

    comment: string;

    service: string;

    branch: string;

    date: string; // ISO format

    verified: boolean; // Verified purchase badge

    reply?: string; // Admin reply (optional)

    replyDate?: string; // ISO format (optional)

}

```

**Mock Implementation:** ✅ `apps/frontend/src/api/adapters/reviews.ts`

---

#### 2. POST /api/v1/reviews

**Purpose:** Submit a new review (authenticated users)

**Request Body:**

```typescript

interfaceCreateReviewRequest {

    serviceId: number;

    rating: number; // 1-5, required

    comment: string; // Min 10 chars, max 500 chars

}

```

**Response:**

```typescript

interfaceCreateReviewResponse {

    success: boolean;

    message: string;

    review: Review;

}

```

**Authentication:** Requires JWT token in Authorization header

**Validation:**

-   Rating: Must be 1-5
-   Comment: Min 10 chars, max 500 chars
-   ServiceId: Must exist in services table
-   User: Must have completed booking for this service (verified purchase)

**Mock Implementation:** ✅ `apps/frontend/src/client/components/reviews/WriteReviewModal.tsx`

---

### Features Implemented

-   ✅ Stats summary section:

    -   Average rating (large display with stars)
    -   Total review count
    -   Rating distribution bars (clickable filters)

-   ✅ Filter buttons:

    -   "All" reviews
    -   Filter by rating (5⭐, 4⭐, 3⭐, 2⭐, 1⭐)
    -   Active state visual feedback

-   ✅ Sort dropdown:

    -   Sort by date (newest first)
    -   Sort by rating (highest first)

-   ✅ Review cards (2-column grid):

    -   Customer avatar
    -   Customer name with verified badge
    -   Star rating
    -   Review comment
    -   Service name
    -   Branch location with pin icon
    -   Date in Vietnamese format
    -   Admin reply thread (if exists)

-   ✅ Pagination controls:

    -   Previous/Next buttons
    -   Page number buttons (1, 2, 3...)
    -   Disabled state when at boundaries
    -   Scroll to top on page change

-   ✅ Write Review button in header
-   ✅ Write Review Modal:

    -   5-star rating selector with hover effect
    -   Comment textarea (10-500 chars)
    -   Service name display (if from service detail page)
    -   Form validation
    -   Success state with auto-close
    -   Loading state with spinner

-   ✅ Write Review button on Service Detail page
-   ✅ Reviews menu added to main navigation header
-   ✅ Loading state with spinner
-   ✅ Empty state when no reviews match filter
-   ✅ Responsive design (mobile single-column)
-   ✅ Smooth animations with Framer Motion

---

### TODO / Backend Notes

1.**Review Submission:**

    - Verify user has completed booking for the service before allowing review

    - Prevent duplicate reviews (1 review per user per service)

    - Auto-mark as verified if booking confirmed

    - Send email notification to admin on new review

2.**Moderation:**

    - Add approval workflow for reviews

    - Profanity filter

    - Spam detection

    - Report review feature

3.**Admin Reply:**

    - Endpoint:`POST /api/v1/reviews/:id/reply`

    - Only admins can reply

    - Email notification to customer when reply posted

4.**Filtering & Search:**

    - Add text search in review comments

    - Filter by branch

    - Filter by date range

    - Sort by helpfulness (upvotes)

5.**Analytics:**

    - Track review submission rate

    - Average response time for admin replies

    - Most reviewed services

    - Review sentiment analysis

6.**Gamification:**

    - Badge for first review

    - Points system for detailed reviews

    - Top reviewer leaderboard

---
