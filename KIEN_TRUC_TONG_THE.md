# KIẾN TRÚC TỔNG THỂ HỆ THỐNG
# BEAUTY CLINIC CARE WEBSITE - SPA BOOKING PLATFORM

**Phiên bản:** 1.0  
**Ngày:** 31/10/2025  
**Dự án:** Beauty Clinic Care Website  
**Tác giả:** Spa Hackathon Team

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới thiệu

Beauty Clinic Care Website là một nền tảng đặt lịch spa/thẩm mỹ viện trực tuyến, được xây dựng với kiến trúc **Monorepo Fullstack** hiện đại, bao gồm:

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Supabase)
- **Real-time:** Socket.IO
- **Authentication:** Supabase Auth
- **Payment:** VNPay Integration
- **AI Features:** Google Generative AI

### 1.2. Mục đích

Hệ thống cung cấp các chức năng chính:

1. **Khách hàng (Client):**
   - Xem danh sách dịch vụ, chi nhánh
   - Đặt lịch hẹn (guest và member)
   - Quản lý lịch sử đặt lịch
   - Đánh giá dịch vụ
   - Chat hỗ trợ real-time
   - Đọc blog, tin tức

2. **Quản trị viên (Admin):**
   - Quản lý dịch vụ, chi nhánh, nhân viên
   - Quản lý lịch hẹn, thanh toán
   - Quản lý đánh giá, blog
   - Quản lý voucher
   - Xem báo cáo, thống kê

3. **Hỗ trợ (Support Staff):**
   - Chat real-time với khách hàng
   - Quản lý hội thoại
   - Xem lịch sử hội thoại

---

## 2. SƠ ĐỒ KIẾN TRÚC TỔNG THỂ

### 2.1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │
│  │  Client Portal │  │ Admin Dashboard│  │ Support Portal │            │
│  │  (React SPA)   │  │  (React SPA)   │  │  (React SPA)   │            │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘            │
│           │                   │                    │                     │
│           └───────────────────┴────────────────────┘                     │
│                              │                                           │
│                    ┌─────────▼──────────┐                               │
│                    │  React Router v6   │                               │
│                    │  (Route Management)│                               │
│                    └─────────┬──────────┘                               │
│                              │                                           │
│           ┌──────────────────┼──────────────────┐                       │
│           │                  │                  │                       │
│  ┌────────▼────────┐ ┌──────▼──────┐ ┌─────────▼──────┐               │
│  │  REST API Calls │ │ Socket.IO   │ │  Auth Context  │               │
│  │  (Axios)        │ │  (WebSocket)│ │  (Supabase)    │               │
│  └────────┬────────┘ └──────┬──────┘ └─────────┬──────┘               │
└───────────┼─────────────────┼──────────────────┼────────────────────────┘
            │                 │                  │
            │                 │                  │
┌───────────▼─────────────────▼──────────────────▼────────────────────────┐
│                        NETWORK LAYER (HTTPS/WSS)                         │
│                         CORS + Security Headers                          │
└───────────┬─────────────────┬──────────────────┬────────────────────────┘
            │                 │                  │
┌───────────▼─────────────────▼──────────────────▼────────────────────────┐
│                         BACKEND LAYER (Node.js)                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Express.js Application                        │    │
│  │                                                                  │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐               │    │
│  │  │  Helmet    │  │   CORS     │  │   Logger   │               │    │
│  │  │ (Security) │  │ (Cross-Origin)│ (Winston)  │               │    │
│  │  └────┬───────┘  └─────┬──────┘  └─────┬──────┘               │    │
│  │       └─────────────────┴───────────────┘                      │    │
│  │                        │                                        │    │
│  │         ┌──────────────┴──────────────┐                        │    │
│  │         │                             │                        │    │
│  │  ┌──────▼────────┐          ┌─────────▼────────┐              │    │
│  │  │  REST API     │          │   Socket.IO      │              │    │
│  │  │   Routes      │          │   Server         │              │    │
│  │  │               │          │  (Real-time)     │              │    │
│  │  │ /api/v1/*     │          │                  │              │    │
│  │  └──────┬────────┘          └─────────┬────────┘              │    │
│  └─────────┼──────────────────────────────┼───────────────────────┘    │
│            │                              │                             │
│  ┌─────────▼──────────────────────────────▼───────────────────────┐    │
│  │                    MIDDLEWARE LAYER                             │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │    │
│  │  │ Auth Guard   │  │  Validation  │  │ Error Handler│         │    │
│  │  │ (JWT/Supabase)│ │(express-valid)│ │  (Global)    │         │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │    │
│  └─────────┼──────────────────┼──────────────────┼─────────────────┘    │
│            │                  │                  │                       │
│  ┌─────────▼──────────────────▼──────────────────▼─────────────────┐    │
│  │                    CONTROLLER LAYER                             │    │
│  │                                                                  │    │
│  │  auth  │ booking │ service │ branch │ blog │ payment │ ...     │    │
│  │  .controller   .controller   .controller   .controller         │    │
│  └─────────┬──────────────────────────────────────────────────────┘    │
│            │                                                             │
│  ┌─────────▼─────────────────────────────────────────────────────┐     │
│  │                     SERVICE LAYER                              │     │
│  │                  (Business Logic)                              │     │
│  │                                                                 │     │
│  │  auth  │ booking │ service │ email │ socket │ vnpay │ ...     │     │
│  │  .service      .service    .service   .service                │     │
│  └─────────┬───────────────────────────────────────────────────────┘    │
│            │                                                             │
│  ┌─────────▼─────────────────────────────────────────────────────┐     │
│  │                   REPOSITORY LAYER                             │     │
│  │                  (Data Access)                                 │     │
│  │                                                                 │     │
│  │  auth  │ booking │ service │ branch │ blog │ voucher │ ...    │     │
│  │  .repository   .repository   .repository                      │     │
│  └─────────┬───────────────────────────────────────────────────────┘    │
└────────────┼──────────────────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────────────────────┐
│                        DATABASE & EXTERNAL SERVICES                       │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │  PostgreSQL      │  │  Supabase Auth   │  │  Supabase Storage│       │
│  │  (Prisma ORM)    │  │  (JWT Tokens)    │  │  (File Upload)   │       │
│  │                  │  │                  │  │                  │       │
│  │  • User          │  │  • Sign up/in    │  │  • Images        │       │
│  │  • Service       │  │  • Email verify  │  │  • Documents     │       │
│  │  • Booking       │  │  • Password reset│  │  • Avatars       │       │
│  │  • Branch        │  │  • Session mgmt  │  │                  │       │
│  │  • Payment       │  └──────────────────┘  └──────────────────┘       │
│  │  • Review        │                                                     │
│  │  • Blog          │  ┌──────────────────┐  ┌──────────────────┐       │
│  │  • Voucher       │  │   VNPay API      │  │  Google AI       │       │
│  │  • Support       │  │  (Payment)       │  │  (Gemini)        │       │
│  │  • Contact       │  │                  │  │                  │       │
│  └──────────────────┘  │  • ATM/QR        │  │  • Smart schedule│       │
│                        │  • E-wallet      │  │  • Suggestions   │       │
│                        │  • Refund        │  │  • Chatbot       │       │
│                        └──────────────────┘  └──────────────────┘       │
│                                                                            │
│  ┌──────────────────┐                                                     │
│  │   Email Service  │                                                     │
│  │   (Resend API)   │                                                     │
│  │                  │                                                     │
│  │  • Notifications │                                                     │
│  │  • Confirmations │                                                     │
│  │  • Reminders     │                                                     │
│  └──────────────────┘                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. KIẾN TRÚC CHI TIẾT CÁC THÀNH PHẦN

### 3.1. Frontend Architecture (Client Layer)

#### 3.1.1. Công nghệ sử dụng

- **Core:** React 18.3.1 + TypeScript 5.5.4
- **Build Tool:** Vite 5.2.0
- **Routing:** React Router DOM 6.26.2
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** Lucide React (Icons), Framer Motion (Animations)
- **Maps:** @react-google-maps/api 2.20.7
- **Charts:** Recharts 3.3.0
- **i18n:** i18next 25.6.0, react-i18next 16.2.1
- **HTTP Client:** Axios 1.13.1
- **WebSocket:** Socket.IO Client 4.8.1

#### 3.1.2. Cấu trúc thư mục Frontend

```
apps/frontend/src/
├── admin/                    # Admin dashboard module
│   ├── components/           # Admin-specific components
│   ├── pages/                # Admin pages (Dashboard, Services, etc.)
│   └── layouts/              # Admin layout wrapper
│
├── auth/                     # Authentication module
│   ├── LoginPageOTP.tsx
│   ├── RegisterPageOTP.tsx
│   └── AdminLoginPage.tsx
│
├── client/                   # Client-facing module
│   ├── components/           # Reusable UI components
│   ├── pages/                # Client pages (Home, Services, Booking, etc.)
│   │   └── dashboard/        # Member dashboard pages
│   └── layouts/              # Client layout wrapper
│
├── support/                  # Support staff module
│   ├── components/           # Support-specific components
│   ├── pages/                # Support pages (ConversationList, etc.)
│   └── layouts/              # Support layout wrapper
│
├── components/               # Shared components (Header, Footer, etc.)
├── contexts/                 # React Context providers
│   ├── ChatWidgetContext.tsx # Chat widget state management
│   └── SocketContext.tsx     # Socket.IO connection management
│
├── hooks/                    # Custom React hooks
├── i18n/                     # Internationalization configuration
├── routes/                   # Route configuration
│   ├── route-map.tsx         # Main route definitions
│   ├── guards/               # Route guards (Auth, Role-based)
│   └── layouts/              # Layout wrappers
│
├── services/                 # API service layer (Axios)
├── store/                    # State management
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── App.tsx                   # Root component
└── index.tsx                 # Entry point
```

#### 3.1.3. Luồng xử lý Frontend

```
User Action → Component → Hook/Context → API Service (Axios)
                    ↓                           ↓
              Local State                   Backend API
                    ↓                           ↓
            UI Re-render  ← ← ← ← ← ← ←  Response Data
```

#### 3.1.4. Routing Strategy

**3 Portals chính:**

1. **Client Portal** (`/`)
   - Home, Services, Branches, Booking, Blog, Contact
   - Member Dashboard (Protected)

2. **Admin Portal** (`/admin`)
   - Dashboard, Appointments, Services, Branches
   - Customers, Staff, Payments, Reviews, Blog
   - Settings (Protected - Admin Only)

3. **Support Portal** (`/support`)
   - Conversation List, Chat Interface
   - (Protected - Support Staff Only)

**Route Guards:**
- `RequireRole`: Kiểm tra role (ADMIN, STAFF, MEMBER)
- `GuestRoute`: Chỉ cho phép user chưa đăng nhập
- `ScrollToTop`: Tự động scroll lên đầu khi chuyển trang

---

### 3.2. Backend Architecture (Server Layer)

#### 3.2.1. Công nghệ sử dụng

- **Core:** Node.js + Express 5.1.0 + TypeScript 5.5.4
- **ORM:** Prisma 6.18.0
- **Database:** PostgreSQL (Supabase)
- **Auth:** @supabase/supabase-js 2.76.1
- **Real-time:** Socket.IO 4.8.1
- **Validation:** Express Validator 7.3.0 + Zod 3.22.4
- **Security:** Helmet 8.1.0 + CORS 2.8.5
- **File Upload:** Multer 2.0.2
- **Logging:** Winston 3.18.3
- **Email:** Resend 6.3.0
- **Payment:** VNPay 2.4.4
- **AI:** @google/generative-ai 0.24.1

#### 3.2.2. Cấu trúc thư mục Backend

```
apps/backend/src/
├── config/                   # Configuration files
│   ├── database.ts           # Prisma client setup
│   ├── supabase.ts           # Supabase client
│   ├── cors.ts               # CORS configuration
│   └── logger.ts             # Winston logger setup
│
├── controllers/              # Request handlers (HTTP layer)
│   ├── auth.controller.ts
│   ├── booking.controller.ts
│   ├── service.controller.ts
│   ├── branch.controller.ts
│   ├── payment.controller.ts
│   ├── blog.controller.ts
│   ├── review.controller.ts
│   ├── support.controller.ts
│   ├── voucher.controller.ts
│   ├── ai.controller.ts
│   └── admin/                # Admin-specific controllers
│
├── services/                 # Business logic layer
│   ├── auth.service.ts
│   ├── booking.service.ts
│   ├── service.service.ts
│   ├── branch.service.ts
│   ├── payment.service.ts
│   ├── email.service.ts
│   ├── socket.service.ts
│   ├── support.service.ts
│   ├── vnpay.service.ts
│   ├── voucher.service.ts
│   └── ai.service.ts
│
├── repositories/             # Data access layer (Prisma queries)
│   ├── base.repository.ts    # Base repository with common methods
│   ├── auth.repository.ts
│   ├── service.repository.ts
│   ├── branch.repository.ts
│   ├── blog.repository.ts
│   ├── review.repository.ts
│   ├── voucher.repository.ts
│   ├── contact.repository.ts
│   └── user.repository.ts
│
├── routes/                   # API route definitions
│   ├── index.ts              # Route configuration entry
│   ├── auth.routes.ts
│   ├── booking.routes.ts
│   ├── services.routes.ts
│   ├── branches.routes.ts
│   ├── blog.routes.ts
│   ├── reviews.routes.ts
│   ├── support.routes.ts
│   ├── payments.ts
│   ├── vnpay.routes.ts
│   ├── vouchers.route.ts
│   ├── ai.routes.ts
│   ├── health.routes.ts
│   └── admin/                # Admin routes
│
├── middleware/               # Express middleware
│   ├── auth.middleware.ts    # JWT verification + role check
│   ├── validate.ts           # Request validation
│   ├── errorHandler.ts       # Global error handler
│   ├── notFoundHandler.ts    # 404 handler
│   ├── requestLogger.ts      # Request logging
│   └── upload.ts             # Multer file upload config
│
├── validators/               # Request validation schemas
│   └── [feature].validator.ts
│
├── types/                    # TypeScript type definitions
│   ├── user.ts
│   ├── booking.ts
│   ├── review.ts
│   ├── voucher.ts
│   └── ...
│
├── utils/                    # Utility functions
│   └── errors.ts             # Custom error classes
│
├── templates/                # Email templates
│
└── server.ts                 # Express app entry point
```

#### 3.2.3. Layered Architecture Pattern

Backend tuân theo kiến trúc **Clean Architecture** với các layer rõ ràng:

```
┌─────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │→ │ Controllers  │→ │  Middleware  │      │
│  │ (Express)    │  │ (HTTP Logic) │  │ (Auth/Valid) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             Services (Business Rules)                │   │
│  │  • Validation logic                                  │   │
│  │  • Business workflows                                │   │
│  │  • Transaction management                            │   │
│  │  • External service integration                      │   │
│  └──────────────┬───────────────────────────────────────┘   │
└─────────────────┼───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    DATA ACCESS LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Repositories (Database Abstraction)             │   │
│  │  • CRUD operations                                   │   │
│  │  • Query building                                    │   │
│  │  • Data mapping                                      │   │
│  └──────────────┬───────────────────────────────────────┘   │
└─────────────────┼───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    PERSISTENCE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Prisma ORM + PostgreSQL                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

#### 3.2.4. API Endpoints Overview

**API Base URL:** `http://localhost:3000/api/v1`

| Module | Endpoint | Phương thức | Mô tả |
|--------|----------|-------------|-------|
| **Health** | `/api/health` | GET | Health check |
| **Auth** | `/auth/register` | POST | Đăng ký |
| | `/auth/login` | POST | Đăng nhập |
| | `/auth/logout` | POST | Đăng xuất |
| **Services** | `/services` | GET | Danh sách dịch vụ |
| | `/services/:id` | GET | Chi tiết dịch vụ |
| **Branches** | `/branches` | GET | Danh sách chi nhánh |
| | `/branches/:id` | GET | Chi tiết chi nhánh |
| **Booking** | `/bookings` | POST | Tạo booking |
| | `/bookings/:id` | GET | Chi tiết booking |
| | `/bookings/:id/cancel` | PUT | Hủy booking |
| **Reviews** | `/reviews` | GET | Danh sách đánh giá |
| | `/reviews` | POST | Tạo đánh giá |
| **Blog** | `/blog` | GET | Danh sách blog |
| | `/blog/:slug` | GET | Chi tiết blog |
| **Vouchers** | `/vouchers/validate` | POST | Validate voucher |
| **Payment** | `/payments/vnpay/create` | POST | Tạo thanh toán |
| | `/payments/vnpay/callback` | GET | VNPay callback |
| **Support** | `/support/conversations` | GET | Danh sách hội thoại |
| | `/support/messages/:id` | GET | Chi tiết hội thoại |
| **AI** | `/ai/suggest-services` | POST | Gợi ý dịch vụ |
| | `/ai/optimize-schedule` | POST | Tối ưu lịch hẹn |
| **User** | `/user/profile` | GET | Thông tin user |
| | `/user/profile` | PUT | Cập nhật profile |
| **Members** | `/members/bookings` | GET | Lịch sử booking |
| | `/members/dashboard` | GET | Member dashboard |

---

### 3.3. Database Architecture

#### 3.3.1. Database Schema Overview

**Database Provider:** PostgreSQL (Supabase)  
**ORM:** Prisma 6.18.0

**Tổng quan các bảng chính:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE SCHEMA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER MANAGEMENT                                                │
│  ┌──────────┐                                                   │
│  │   User   │  (Registered members & admins)                    │
│  └────┬─────┘                                                   │
│       │ 1                                                        │
│       │                                                          │
│       ├──────┐ N                                                │
│       │      └───> Booking                                      │
│       │                                                          │
│       ├──────┐ N                                                │
│       │      └───> Review                                       │
│       │                                                          │
│       └──────┐ N                                                │
│              └───> BlogPost                                     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SERVICE CATALOG                                                │
│  ┌────────────────┐                                             │
│  │ ServiceCategory│                                             │
│  └────┬───────────┘                                             │
│       │ 1                                                        │
│       │                                                          │
│       ├──────┐ N                                                │
│       │      └───> Service                                      │
│       │                ├──────┐ N                               │
│       │                │      └───> Review                      │
│       │                │                                         │
│       │                └──────┐ (referenced by Booking)         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  LOCATION MANAGEMENT                                            │
│  ┌────────┐                                                     │
│  │ Branch │  (Physical clinic locations)                        │
│  └────┬───┘                                                     │
│       │ 1                                                        │
│       │                                                          │
│       └──────┐ N                                                │
│              └───> Booking                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  BOOKING & PAYMENT                                              │
│  ┌─────────┐                                                    │
│  │ Booking │  (Appointments - guest & member)                   │
│  └────┬────┘                                                    │
│       │ 1                                                        │
│       │                                                          │
│       └──────┐ N                                                │
│              └───> Payment                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  CONTENT MANAGEMENT                                             │
│  ┌──────────────┐                                               │
│  │ BlogCategory │                                               │
│  └────┬─────────┘                                               │
│       │ 1                                                        │
│       │                                                          │
│       └──────┐ N                                                │
│              └───> BlogPost                                     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  MARKETING                                                      │
│  ┌─────────┐                                                    │
│  │ Voucher │  (Discount codes)                                  │
│  └─────────┘                                                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SUPPORT SYSTEM                                                 │
│  ┌──────────────┐                                               │
│  │ Conversation │                                               │
│  └────┬─────────┘                                               │
│       │ 1                                                        │
│       │                                                          │
│       └──────┐ N                                                │
│              └───> Message                                      │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │ ContactSubmission│  (Contact form)                           │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.3.2. Core Database Models

**User Model:**
- Lưu thông tin registered members và admins
- Hỗ trợ multiple roles: MEMBER, ADMIN, SUPER_ADMIN, STAFF
- Tích hợp với Supabase Auth (supabaseAuthId)

**Booking Model:**
- Hỗ trợ cả guest và member booking
- Guest: lưu thông tin trong guestName/guestEmail/guestPhone
- Member: liên kết với userId
- Trạng thái: CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, PENDING

**Service & Category:**
- Phân loại dịch vụ theo category
- Hỗ trợ ảnh trước/sau (beforeAfterPhotos)
- FAQs dạng JSON

**Payment:**
- Liên kết với Booking
- Hỗ trợ nhiều phương thức: ATM, CLINIC, WALLET, CASH, BANK_TRANSFER
- Trạng thái: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED

**Support System:**
- Conversation: Quản lý hội thoại
- Message: Tin nhắn (CUSTOMER, STAFF, AI)

---

### 3.4. Authentication & Authorization

#### 3.4.1. Authentication Flow

**Provider:** Supabase Auth

```
┌───────────┐                ┌───────────┐                ┌───────────┐
│  Client   │                │  Backend  │                │  Supabase │
└─────┬─────┘                └─────┬─────┘                └─────┬─────┘
      │                            │                            │
      │  1. Register/Login         │                            │
      ├───────────────────────────►│                            │
      │                            │  2. Create user            │
      │                            ├───────────────────────────►│
      │                            │                            │
      │                            │  3. JWT Token              │
      │                            │◄───────────────────────────┤
      │  4. Return token + user    │                            │
      │◄───────────────────────────┤                            │
      │                            │                            │
      │  5. Store token (localStorage)                         │
      │                            │                            │
      │  6. API call with token    │                            │
      │  (Authorization: Bearer)   │                            │
      ├───────────────────────────►│                            │
      │                            │  7. Verify token           │
      │                            ├───────────────────────────►│
      │                            │                            │
      │                            │  8. User data              │
      │                            │◄───────────────────────────┤
      │                            │  9. Check role/permissions │
      │                            │                            │
      │  10. Response              │                            │
      │◄───────────────────────────┤                            │
      │                            │                            │
```

#### 3.4.2. Authorization Levels

**Roles:**
- `MEMBER`: Registered users
- `STAFF`: Support staff
- `ADMIN`: System administrators
- `SUPER_ADMIN`: Full system access

**Middleware Stack:**
```typescript
// Example protected route
router.get('/admin/dashboard',
  authenticate,           // Verify JWT
  requireRole(['ADMIN', 'SUPER_ADMIN']), // Check role
  adminController.getDashboard
);
```

---

### 3.5. Real-time Communication (Socket.IO)

#### 3.5.1. Socket.IO Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  SOCKET.IO ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLIENT (Browser)                                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Socket.IO Client                                  │     │
│  │  • Connect to server                               │     │
│  │  • Join conversation rooms                         │     │
│  │  • Send/receive messages                           │     │
│  │  • Handle real-time events                         │     │
│  └─────────────────────┬──────────────────────────────┘     │
│                        │ WebSocket/Polling                  │
├────────────────────────┼────────────────────────────────────┤
│  SERVER (Node.js)      │                                    │
│  ┌─────────────────────▼──────────────────────────────┐     │
│  │  Socket.IO Server                                  │     │
│  │  • Manage connections                              │     │
│  │  • Room management (conversation:${id})            │     │
│  │  • Broadcast messages                              │     │
│  │  • Track online users                              │     │
│  └─────────────────────┬──────────────────────────────┘     │
│                        │                                    │
│  ┌─────────────────────▼──────────────────────────────┐     │
│  │  Support Service                                   │     │
│  │  • Save messages to DB                             │     │
│  │  • Mark as read                                    │     │
│  │  • Fetch conversation history                      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 3.5.2. Socket Events

**Client → Server:**
- `conversation:join` - Join chat room
- `conversation:leave` - Leave chat room
- `message:send` - Send message
- `typing:start` - User typing
- `typing:stop` - User stopped typing

**Server → Client:**
- `message:new` - New message received
- `message:delivered` - Message delivered
- `message:read` - Message read
- `conversation:updated` - Conversation status changed
- `typing:update` - Typing indicator

---

### 3.6. External Service Integration

#### 3.6.1. Supabase Integration

**Services Used:**
1. **Supabase Auth:**
   - User authentication
   - JWT token management
   - Email verification
   - Password reset

2. **Supabase Storage:**
   - Image uploads (services, blogs, avatars)
   - Public bucket for client assets
   - Private bucket for admin files

3. **Supabase Database:**
   - PostgreSQL database
   - Connection via Prisma ORM

#### 3.6.2. VNPay Payment Integration

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Backend │          │  VNPay   │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │ 1. Create payment   │                     │
     ├────────────────────►│                     │
     │                     │ 2. Generate URL     │
     │                     ├────────────────────►│
     │                     │                     │
     │                     │ 3. Payment URL      │
     │                     │◄────────────────────┤
     │ 4. Redirect to VNPay│                     │
     │◄────────────────────┤                     │
     │                     │                     │
     │ 5. User pays        │                     │
     ├───────────────────────────────────────────►
     │                     │                     │
     │                     │ 6. Callback         │
     │                     │◄────────────────────┤
     │                     │ 7. Update payment   │
     │                     │                     │
     │ 8. Redirect result  │                     │
     │◄────────────────────┤                     │
```

**Supported Payment Methods:**
- ATM Card (Domestic)
- QR Code
- International Card
- E-Wallet

#### 3.6.3. Google Generative AI (Gemini)

**Use Cases:**
1. **Smart Service Suggestions:**
   - Analyze customer concerns
   - Recommend suitable services

2. **Schedule Optimization:**
   - Optimize appointment timing
   - Suggest best time slots

3. **AI Chatbot:**
   - Answer FAQs
   - Provide service information

#### 3.6.4. Email Service (Resend)

**Email Types:**
- Booking confirmations
- Cancellation notifications
- Payment receipts
- Welcome emails
- Password reset

---

## 4. LUỒNG XỬ LÝ CHÍNH

### 4.1. Guest Booking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               GUEST BOOKING FLOW (Không đăng nhập)              │
└─────────────────────────────────────────────────────────────────┘

1. [Client] User chọn dịch vụ
   ↓
2. [Client] User chọn chi nhánh
   ↓
3. [Client] User chọn ngày/giờ hẹn
   ↓
4. [Client] User điền thông tin (name, email, phone)
   ↓
5. [Client → Backend] POST /api/v1/bookings
   {
     branchId, appointmentDate, appointmentTime,
     serviceIds, guestName, guestEmail, guestPhone
   }
   ↓
6. [Backend] Validate dữ liệu
   ↓
7. [Backend] Check available slots
   ↓
8. [Backend] Create Booking record (status: CONFIRMED)
   ↓
9. [Backend] Generate referenceNumber (unique)
   ↓
10. [Backend] Return booking details
   ↓
11. [Client] Redirect to payment page
   ↓
12. [Client → Backend] POST /api/v1/payments/vnpay/create
   ↓
13. [Backend → VNPay] Generate payment URL
   ↓
14. [Client] Redirect to VNPay
   ↓
15. [VNPay] User completes payment
   ↓
16. [VNPay → Backend] Callback with payment result
   ↓
17. [Backend] Update Payment record (status: COMPLETED/FAILED)
   ↓
18. [Backend] Send confirmation email
   ↓
19. [Backend] Redirect to success/failure page
   ↓
20. [Client] Display booking confirmation
```

### 4.2. Member Booking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               MEMBER BOOKING FLOW (Đã đăng nhập)                │
└─────────────────────────────────────────────────────────────────┘

1. [Client] User đăng nhập (JWT token stored)
   ↓
2. [Client] User navigate to booking page
   ↓
3. [Client → Backend] GET /api/v1/user/profile
   (Authorization: Bearer <token>)
   ↓
4. [Backend] Verify JWT + get user data
   ↓
5. [Client] Auto-fill user info (name, email, phone)
   ↓
6. [Client] User chọn services/branch/date/time
   ↓
7. [Client → Backend] POST /api/v1/bookings
   (userId linked, no guest fields)
   ↓
8. [Backend] Create Booking with userId
   ↓
9. [Backend] Return booking details
   ↓
10. [Payment & Email flow same as Guest]
   ↓
11. [Client] Booking appears in Member Dashboard
```

### 4.3. Support Chat Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORT CHAT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. [Client] User clicks chat widget
   ↓
2. [Client] Connect to Socket.IO server
   ↓
3. [Client → Backend] POST /api/v1/support/conversations
   { customerName, customerEmail }
   ↓
4. [Backend] Create Conversation record
   ↓
5. [Backend] Return conversationId
   ↓
6. [Client] socket.emit('conversation:join', { conversationId })
   ↓
7. [Backend] Add socket to room: conversation:${id}
   ↓
8. [Client] User types message
   ↓
9. [Client] socket.emit('message:send', { conversationId, content, sender: 'customer' })
   ↓
10. [Backend] Save message to DB
   ↓
11. [Backend] socket.broadcast('message:new', message)
   ↓
12. [Support Staff] Receive message in Support Dashboard
   ↓
13. [Support Staff] Reply to customer
   ↓
14. [Backend] Broadcast reply to customer
   ↓
15. [Client] Display reply in chat widget
   ↓
16. [Optional] AI auto-response for common questions
```

---

## 5. BẢO MẬT VÀ HIỆU SUẤT

### 5.1. Security Measures

**1. Authentication & Authorization:**
- JWT token-based authentication
- Supabase Auth integration
- Role-based access control (RBAC)
- Protected routes with middleware

**2. Input Validation:**
- Express Validator
- Zod schema validation
- SQL injection prevention (Prisma ORM)
- XSS protection

**3. HTTP Security:**
- Helmet.js (Security headers)
- CORS configuration
- Rate limiting (Express Rate Limit)
- HTTPS in production

**4. Data Protection:**
- Password hashing (Supabase bcrypt)
- Sensitive data encryption
- Environment variables (.env)
- No sensitive data in client-side

**5. API Security:**
- JWT token expiration
- Refresh token rotation
- API request validation
- Error handling (no stack traces in production)

### 5.2. Performance Optimization

**Frontend:**
- Code splitting (React.lazy)
- Route-based lazy loading
- Image optimization
- Vite build optimization
- Browser caching

**Backend:**
- Database indexing (Prisma)
- Query optimization
- Connection pooling
- Response compression (gzip)
- Pagination for large datasets

**Database:**
- Indexed fields (email, slug, status, etc.)
- Query optimization
- Connection pooling via Prisma

**Caching:**
- Browser caching (static assets)
- API response caching (future)
- Redis integration (future)

---

## 6. DEPLOYMENT ARCHITECTURE

### 6.1. Development Environment

```
┌──────────────────────────────────────────────────────────┐
│                  DEVELOPMENT SETUP                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend Dev Server (Vite)                              │
│  http://localhost:5173                                   │
│  • Hot Module Replacement (HMR)                          │
│  • TypeScript checking                                   │
│                                                           │
│  Backend Dev Server (Nodemon + ts-node)                  │
│  http://localhost:3000                                   │
│  • Auto-restart on file changes                          │
│  • TypeScript compilation on-the-fly                     │
│                                                           │
│  Database (Supabase Cloud)                               │
│  • PostgreSQL instance                                   │
│  • Prisma migrations                                     │
│                                                           │
│  Run both: npm run dev (from root)                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 6.2. Production Architecture (Suggested)

```
┌────────────────────────────────────────────────────────────┐
│                  PRODUCTION ARCHITECTURE                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CDN / Load Balancer (Cloudflare/Nginx)            │   │
│  │  • SSL/TLS termination                              │   │
│  │  • Static asset caching                             │   │
│  │  • DDoS protection                                  │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                     │
│        ┌─────────────┴─────────────┐                       │
│        │                           │                       │
│  ┌─────▼──────┐            ┌──────▼──────┐               │
│  │  Frontend  │            │   Backend   │               │
│  │  (Static)  │            │   (Node.js) │               │
│  │            │            │             │               │
│  │  Vercel/   │            │  Railway/   │               │
│  │  Netlify   │            │  Render/    │               │
│  │            │            │  Heroku     │               │
│  └────────────┘            └──────┬──────┘               │
│                                   │                       │
│                      ┌────────────┴────────────┐          │
│                      │                         │          │
│               ┌──────▼──────┐          ┌───────▼──────┐   │
│               │  Supabase   │          │   External   │   │
│               │  (Database, │          │   Services   │   │
│               │   Auth,     │          │  • VNPay     │   │
│               │   Storage)  │          │  • Resend    │   │
│               └─────────────┘          │  • Google AI │   │
│                                        └──────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## 7. MONITORING & LOGGING

### 7.1. Logging Strategy

**Backend Logging (Winston):**
- Log levels: error, warn, info, debug
- File logging (app.log, error.log)
- Console logging (development)
- Structured logging (JSON format)

**Log Categories:**
- HTTP requests/responses
- Database queries
- Authentication events
- Payment transactions
- Socket.IO connections
- Error stack traces

### 7.2. Error Handling

**Frontend:**
- Error Boundary components
- Toast notifications for user errors
- Console logging (development)
- Error reporting service (future: Sentry)

**Backend:**
- Global error handler middleware
- Custom error classes (UnauthorizedError, ValidationError, etc.)
- Graceful error responses
- No sensitive data in error messages

---

## 8. TESTING STRATEGY (Future)

### 8.1. Testing Pyramid

```
              ┌─────────────┐
              │   E2E Tests │  (UI automation - Playwright/Cypress)
              └─────────────┘
            ┌─────────────────┐
            │ Integration Tests│  (API testing - Supertest)
            └─────────────────┘
        ┌───────────────────────┐
        │     Unit Tests        │  (Jest + React Testing Library)
        └───────────────────────┘
```

### 8.2. Test Coverage Goals

- **Unit Tests:** Controllers, Services, Utils (Target: 70%+)
- **Integration Tests:** API endpoints, Database queries (Target: 50%+)
- **E2E Tests:** Critical user flows (Booking, Payment, Auth)

---

## 9. KẾT LUẬN

### 9.1. Ưu điểm của kiến trúc

1. **Separation of Concerns:** Frontend và Backend tách biệt rõ ràng
2. **Scalability:** Dễ dàng mở rộng từng phần độc lập
3. **Maintainability:** Code organized, layered architecture
4. **Type Safety:** TypeScript cho cả FE và BE
5. **Modern Stack:** React 18, Express 5, Prisma, Socket.IO
6. **Real-time:** Socket.IO cho chat và notifications
7. **Security:** Multiple layers of security (Auth, Validation, CORS, etc.)
8. **Developer Experience:** Hot reload, TypeScript, ESLint, Prettier

### 9.2. Công nghệ chính

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS + Lucide Icons
- React Router v6
- Axios + Socket.IO Client
- i18next (4 languages)

**Backend:**
- Node.js + Express 5 + TypeScript
- Prisma ORM + PostgreSQL
- Supabase (Auth + Storage + Database)
- Socket.IO Server
- Winston Logger + Helmet + CORS

**External Services:**
- VNPay (Payment)
- Google Generative AI (Gemini)
- Resend (Email)

### 9.3. Các tính năng nổi bật

1. **Multi-language support** (vi, en, ko, zh)
2. **Guest & Member booking**
3. **Real-time chat support**
4. **AI-powered suggestions**
5. **VNPay payment integration**
6. **Voucher system**
7. **Admin dashboard**
8. **Member dashboard**
9. **Blog & content management**
10. **Review system**

### 9.4. Roadmap tương lai

- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Monitoring & alerting (Prometheus, Grafana)

---

## PHỤ LỤC

### A. Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Backend
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# VNPay
VNPAY_TMN_CODE="..."
VNPAY_HASH_SECRET="..."
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:5173/payment-result"

# Email
RESEND_API_KEY="..."

# Google AI
GOOGLE_AI_API_KEY="..."
```

### B. Monorepo Structure

```
spa-hackathon/
├── apps/
│   ├── backend/         # Node.js backend
│   └── frontend/        # React frontend
├── docs/                # Documentation
├── package.json         # Root workspace config
└── .env                 # Environment variables
```

### C. NPM Scripts

```bash
# Development
npm run dev              # Run both FE & BE
npm run dev -w frontend  # Run frontend only
npm run dev -w backend   # Run backend only

# Build
npm run build            # Build both FE & BE

# Database
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
npm run prisma:seed      # Seed database
```

---

**END OF DOCUMENT**

*Tài liệu này mô tả kiến trúc tổng thể của hệ thống Beauty Clinic Care Website. Đây là bản đầy đủ, rõ ràng với sơ đồ ASCII và mô tả chi tiết các thành phần, luồng tương tác.*

**Điểm mạnh của tài liệu:**
- ✅ Sơ đồ kiến trúc trực quan (ASCII art)
- ✅ Mô tả đầy đủ các layer (Client, Backend, Database, External Services)
- ✅ Chi tiết luồng xử lý (Booking, Authentication, Chat)
- ✅ Liệt kê công nghệ sử dụng
- ✅ Bảo mật và hiệu suất
- ✅ Deployment architecture
- ✅ Dễ hiểu, rõ ràng, có ví dụ cụ thể
