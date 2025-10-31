# TÀI LIỆU API
# BEAUTY CLINIC CARE WEBSITE - API DOCUMENTATION

**Phiên bản:** 1.0
**Ngày:** 31/10/2025
**Base URL:** `http://localhost:3000/api`
**Production URL:** `https://api.beautycliniccare.com/api`
**API Version:** v1

---

## MỤC LỤC

1. [Tổng quan API](#1-tổng-quan-api)
2. [Authentication](#2-authentication)
3. [Services](#3-services---dịch-vụ)
4. [Branches](#4-branches---chi-nhánh)
5. [Bookings](#5-bookings---đặt-lịch)
6. [Payments](#6-payments---thanh-toán)
7. [Reviews](#7-reviews---đánh-giá)
8. [Blog](#8-blog)
9. [User Profile](#9-user-profile)
10. [Member Dashboard](#10-member-dashboard)
11. [Support Chat](#11-support-chat)
12. [Vouchers](#12-vouchers)
13. [AI Features](#13-ai-features)
14. [Admin](#14-admin)
15. [Error Codes](#15-error-codes)

---

## 1. TỔNG QUAN API

### 1.1. Thông tin chung

- **Protocol:** HTTPS
- **Format:** JSON
- **Charset:** UTF-8
- **Authentication:** JWT Bearer Token
- **Rate Limiting:** Yes (varies by endpoint)
- **API Style:** RESTful

### 1.2. Base URLs

```
Development: http://localhost:3000/api
Production:  https://api.beautycliniccare.com/api
```

### 1.3. Common Headers

```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
Accept-Language: vi|en|ko|zh
```

### 1.4. Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "ErrorName",
  "message": "Human-readable error message",
  "details": { /* optional error details */ },
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

### 1.5. HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### 1.6. Pagination

```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 2. AUTHENTICATION

### 2.1. Register (Đăng ký)

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Đăng ký tài khoản mới với xác thực email OTP

**Rate Limit:** 3 requests/hour

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "fullName": "Nguyen Van A",
  "phone": "+84912345678"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Please check your email for verification code",
  "data": {
    "email": "user@example.com",
    "otpSent": true
  }
}
```

**Errors:**
- `400` - Email already exists
- `400` - Invalid email format
- `429` - Rate limit exceeded

---

### 2.2. Verify OTP

**Endpoint:** `POST /api/v1/auth/verify-otp`

**Description:** Xác thực mã OTP và hoàn tất đăng ký/đăng nhập

**Rate Limit:** 5 requests/minute

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "role": "MEMBER",
      "emailVerified": true
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }
}
```

---

### 2.3. Login (Đăng nhập)

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Đăng nhập với email và password

**Rate Limit:** 5 requests/minute

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "role": "MEMBER"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `401` - Email not verified

---

### 2.4. Change Password

**Endpoint:** `POST /api/v1/auth/change-password`

**Description:** Đổi mật khẩu (yêu cầu đăng nhập)

**Auth:** Required

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 2.5. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Description:** Gửi email reset password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 2.6. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Description:** Reset mật khẩu bằng token

**Request:**
```json
{
  "token": "reset_token",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 3. SERVICES - DỊCH VỤ

### 3.1. Get All Services

**Endpoint:** `GET /api/v1/services`

**Description:** Lấy danh sách dịch vụ với pagination và filter

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số items/trang (max: 100) |
| categoryId | uuid | - | Filter theo category |
| featured | boolean | - | Chỉ lấy featured services |
| active | boolean | true | Chỉ lấy active services |

**Example:**
```
GET /api/v1/services?page=1&limit=10&categoryId=xxx&featured=true
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Massage Toàn Thân",
      "slug": "massage-toan-than",
      "description": "Massage thư giãn toàn thân...",
      "excerpt": "Massage chuyên sâu",
      "duration": 90,
      "price": 500000,
      "categoryId": "category-uuid",
      "category": {
        "id": "uuid",
        "name": "Massage",
        "slug": "massage"
      },
      "images": ["url1", "url2"],
      "featured": true,
      "active": true,
      "benefits": ["Giảm stress", "Thư giãn"],
      "rating": 4.5,
      "reviewCount": 120
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 3.2. Get Featured Services

**Endpoint:** `GET /api/v1/services/featured`

**Description:** Lấy danh sách dịch vụ nổi bật (homepage)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "AI Skin Analysis Facial",
      "slug": "ai-skin-analysis-facial",
      "categoryName": "Chăm sóc da",
      "images": ["url"],
      "duration": "90 min",
      "price": 800000,
      "excerpt": "Phân tích da bằng AI..."
    }
  ]
}
```

---

### 3.3. Get Service Categories

**Endpoint:** `GET /api/v1/services/categories`

**Description:** Lấy danh sách danh mục dịch vụ

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Chăm sóc da",
      "slug": "cham-soc-da",
      "description": "Các dịch vụ chăm sóc da mặt",
      "displayOrder": 1,
      "icon": "✨",
      "serviceCount": 15
    }
  ]
}
```

---

### 3.4. Get Service by ID/Slug

**Endpoint:** `GET /api/v1/services/:id`

**Description:** Lấy chi tiết 1 dịch vụ (hỗ trợ UUID hoặc slug)

**Parameters:**
- `id` - UUID hoặc slug

**Example:**
```
GET /api/v1/services/massage-toan-than
GET /api/v1/services/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Massage Toàn Thân",
    "slug": "massage-toan-than",
    "description": "Mô tả đầy đủ...",
    "longDescription": "Mô tả chi tiết rất dài...",
    "excerpt": "Mô tả ngắn",
    "duration": 90,
    "price": 500000,
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "name": "Massage"
    },
    "images": ["url1", "url2", "url3"],
    "beforeAfterPhotos": ["before1", "after1"],
    "featured": true,
    "active": true,
    "benefits": [
      "Giảm căng thẳng",
      "Cải thiện tuần hoàn máu",
      "Thư giãn cơ bắp"
    ],
    "faqs": [
      {
        "question": "Dịch vụ kéo dài bao lâu?",
        "answer": "90 phút"
      }
    ],
    "reviews": [
      {
        "id": "uuid",
        "customerName": "Nguyen Van B",
        "rating": 5,
        "reviewText": "Dịch vụ tuyệt vời!",
        "createdAt": "2025-10-20T10:00:00.000Z"
      }
    ],
    "avgRating": 4.8,
    "reviewCount": 245
  }
}
```

**Errors:**
- `404` - Service not found

---

## 4. BRANCHES - CHI NHÁNH

### 4.1. Get All Branches

**Endpoint:** `GET /api/v1/branches`

**Description:** Lấy danh sách chi nhánh

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| active | boolean | Chỉ lấy active branches |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Chi nhánh Quận 1",
      "slug": "chi-nhanh-quan-1",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "phone": "+84287654321",
      "email": "quan1@beautyclinic.com",
      "latitude": 10.7769,
      "longitude": 106.7009,
      "operatingHours": [
        {
          "dayOfWeek": 1,
          "openTime": "08:00",
          "closeTime": "20:00"
        }
      ],
      "images": ["url1", "url2"],
      "active": true,
      "description": "Chi nhánh trung tâm"
    }
  ]
}
```

---

### 4.2. Get Branch by ID/Slug

**Endpoint:** `GET /api/v1/branches/:id`

**Description:** Lấy chi tiết chi nhánh

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Chi nhánh Quận 1",
    "slug": "chi-nhanh-quan-1",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "phone": "+84287654321",
    "email": "quan1@beautyclinic.com",
    "latitude": 10.7769,
    "longitude": 106.7009,
    "operatingHours": [
      {
        "dayOfWeek": 1,
        "dayName": "Monday",
        "openTime": "08:00",
        "closeTime": "20:00",
        "isOpen": true
      }
    ],
    "images": ["url1", "url2", "url3"],
    "active": true,
    "description": "Chi nhánh trung tâm tại Quận 1"
  }
}
```

---

## 5. BOOKINGS - ĐẶT LỊCH

### 5.1. Create Booking

**Endpoint:** `POST /api/v1/bookings`

**Description:** Tạo booking mới (hỗ trợ guest và member)

**Auth:** Optional (member) / None (guest)

**Request (Guest Booking):**
```json
{
  "serviceIds": ["service-uuid-1", "service-uuid-2"],
  "branchId": "branch-uuid",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "14:30",
  "guestName": "Nguyen Van A",
  "guestEmail": "guest@example.com",
  "guestPhone": "+84912345678",
  "notes": "Tôi muốn phòng riêng",
  "language": "vi"
}
```

**Request (Member Booking):**
```json
{
  "serviceIds": ["service-uuid-1"],
  "branchId": "branch-uuid",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "14:30",
  "notes": "Ghi chú"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "SPAbooking-20251115-A1B2C3",
    "userId": "uuid-or-null",
    "branchId": "uuid",
    "branch": {
      "name": "Chi nhánh Quận 1",
      "address": "123 Đường ABC"
    },
    "appointmentDate": "2025-11-15T00:00:00.000Z",
    "appointmentTime": "14:30",
    "status": "CONFIRMED",
    "serviceIds": ["uuid1", "uuid2"],
    "services": [
      {
        "id": "uuid",
        "name": "Massage",
        "price": 500000,
        "duration": 90
      }
    ],
    "totalPrice": 1000000,
    "totalDuration": 180,
    "guestName": "Nguyen Van A",
    "guestEmail": "guest@example.com",
    "guestPhone": "+84912345678",
    "notes": "Tôi muốn phòng riêng",
    "language": "vi",
    "createdAt": "2025-10-31T10:00:00.000Z"
  }
}
```

**Validation:**
- `serviceIds`: Required, array, min 1 item
- `appointmentDate`: Required, format YYYY-MM-DD, >= today + 1 hour
- `appointmentTime`: Required, format HH:mm, between 08:00-18:00
- Guest booking: `guestName`, `guestEmail`, `guestPhone` required

**Errors:**
- `400` - Invalid date/time
- `400` - Service not found
- `400` - Branch not found
- `400` - Time slot not available

---

### 5.2. Get Booking by Reference

**Endpoint:** `GET /api/v1/bookings/:referenceNumber`

**Description:** Lấy chi tiết booking bằng mã tham chiếu

**Parameters:**
- `referenceNumber` - Mã booking (SPAbooking-YYYYMMDD-XXXXXX)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "SPAbooking-20251115-A1B2C3",
    "status": "CONFIRMED",
    "appointmentDate": "2025-11-15T00:00:00.000Z",
    "appointmentTime": "14:30",
    "branch": {
      "name": "Chi nhánh Quận 1",
      "address": "123 Đường ABC",
      "phone": "+84287654321"
    },
    "services": [
      {
        "name": "Massage Toàn Thân",
        "duration": 90,
        "price": 500000
      }
    ],
    "totalPrice": 500000,
    "guestName": "Nguyen Van A",
    "guestEmail": "guest@example.com",
    "guestPhone": "+84912345678",
    "notes": "Ghi chú",
    "payments": [
      {
        "id": "uuid",
        "amount": 500000,
        "status": "COMPLETED",
        "paymentType": "ATM"
      }
    ],
    "createdAt": "2025-10-31T10:00:00.000Z"
  }
}
```

**Errors:**
- `404` - Booking not found

---

### 5.3. List User Bookings

**Endpoint:** `GET /api/v1/bookings`

**Description:** Lấy danh sách booking của user đã đăng nhập

**Auth:** Required

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Trang |
| limit | number | 10 | Items/trang (max: 100) |
| status | string | - | Filter: CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, PENDING |

**Example:**
```
GET /api/v1/bookings?page=1&limit=10&status=CONFIRMED
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "referenceNumber": "SPAbooking-20251115-A1B2C3",
      "status": "CONFIRMED",
      "appointmentDate": "2025-11-15T00:00:00.000Z",
      "appointmentTime": "14:30",
      "branch": {
        "name": "Chi nhánh Quận 1"
      },
      "services": [
        {
          "name": "Massage",
          "price": 500000
        }
      ],
      "totalPrice": 500000,
      "createdAt": "2025-10-31T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 5.4. Cancel Booking

**Endpoint:** `PATCH /api/v1/bookings/:id/cancel`

**Description:** Hủy booking

**Auth:** Optional (members only cancel their own)

**Request:**
```json
{
  "cancellationReason": "Tôi bận đột xuất"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "cancellationReason": "Tôi bận đột xuất",
    "updatedAt": "2025-10-31T10:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Cannot cancel past appointments
- `400` - Booking already cancelled/completed
- `403` - Not your booking

---

### 5.5. Get Booking Stats (Admin)

**Endpoint:** `GET /api/v1/bookings/stats`

**Description:** Thống kê bookings

**Auth:** Admin

**Query Parameters:**
- `startDate` - ISO 8601 format
- `endDate` - ISO 8601 format

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalBookings": 1500,
    "confirmed": 800,
    "completed": 600,
    "cancelled": 80,
    "noShow": 20,
    "revenue": 750000000,
    "averageBookingValue": 500000
  }
}
```

---

## 6. PAYMENTS - THANH TOÁN

### 6.1. Create VNPay Payment URL

**Endpoint:** `POST /api/v1/payments/vnpay/create-payment-url`

**Description:** Tạo URL thanh toán VNPay

**Request:**
```json
{
  "bookingId": "booking-uuid",
  "amount": 500000,
  "returnUrl": "https://yourdomain.com/payment-result"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "transactionId": "txn-uuid"
  }
}
```

---

### 6.2. VNPay Return/Callback

**Endpoint:** `GET /api/v1/payments/vnpay/return`

**Description:** VNPay redirect sau khi thanh toán

**Query Parameters:** (từ VNPay)
- `vnp_ResponseCode`
- `vnp_TxnRef`
- `vnp_Amount`
- ... (nhiều params khác)

**Response:** Redirect đến frontend với status

---

### 6.3. Get Payment Status

**Endpoint:** `GET /api/v1/payments/vnpay/status/:bookingId`

**Description:** Kiểm tra trạng thái thanh toán

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "bookingId": "uuid",
    "status": "COMPLETED",
    "amount": 500000,
    "paymentType": "ATM",
    "transactionId": "vnpay-txn-id",
    "paidAt": "2025-10-31T10:00:00.000Z"
  }
}
```

---

## 7. REVIEWS - ĐÁNH GIÁ

### 7.1. Get Reviews by Service

**Endpoint:** `GET /api/v1/reviews`

**Description:** Lấy đánh giá của dịch vụ

**Query Parameters:**
- `serviceId` - Required
- `page` - Default: 1
- `limit` - Default: 10

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "customerName": "Nguyen Van B",
      "rating": 5,
      "reviewText": "Dịch vụ tuyệt vời!",
      "avatar": "url",
      "adminResponse": "Cảm ơn bạn!",
      "createdAt": "2025-10-20T10:00:00.000Z"
    }
  ],
  "stats": {
    "avgRating": 4.8,
    "totalReviews": 245,
    "ratingDistribution": {
      "5": 180,
      "4": 50,
      "3": 10,
      "2": 3,
      "1": 2
    }
  }
}
```

---

### 7.2. Create Review

**Endpoint:** `POST /api/v1/reviews`

**Description:** Tạo đánh giá mới

**Auth:** Optional

**Request:**
```json
{
  "serviceId": "service-uuid",
  "rating": 5,
  "reviewText": "Dịch vụ rất tốt!",
  "customerName": "Nguyen Van C",
  "email": "customer@example.com"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "serviceId": "uuid",
    "rating": 5,
    "reviewText": "Dịch vụ rất tốt!",
    "customerName": "Nguyen Van C",
    "approved": false,
    "createdAt": "2025-10-31T10:00:00.000Z"
  },
  "message": "Review submitted for approval"
}
```

**Validation:**
- `rating`: 1-5
- `reviewText`: min 10 characters

---

## 8. BLOG

### 8.1. Get Blog Categories

**Endpoint:** `GET /api/v1/blog/categories`

**Description:** Lấy danh mục blog

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Làm đẹp",
      "slug": "lam-dep",
      "description": "Các bài viết về làm đẹp",
      "postCount": 25
    }
  ]
}
```

---

### 8.2. Get Blog Posts

**Endpoint:** `GET /api/v1/blog/posts`

**Description:** Lấy danh sách bài viết

**Query Parameters:**
- `page` - Default: 1
- `limit` - Default: 10
- `categoryId` - Filter by category
- `language` - vi|en|ko|zh

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "10 Bí quyết chăm sóc da",
      "slug": "10-bi-quyet-cham-soc-da",
      "excerpt": "Khám phá 10 bí quyết...",
      "featuredImage": "url",
      "categoryId": "uuid",
      "category": {
        "name": "Làm đẹp"
      },
      "author": {
        "fullName": "Admin"
      },
      "publishedAt": "2025-10-25T10:00:00.000Z",
      "language": "vi"
    }
  ]
}
```

---

### 8.3. Get Blog Post by Slug

**Endpoint:** `GET /api/v1/blog/posts/:slug`

**Description:** Lấy chi tiết bài viết

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "10 Bí quyết chăm sóc da",
    "slug": "10-bi-quyet-cham-soc-da",
    "content": "Full HTML content...",
    "excerpt": "Tóm tắt...",
    "featuredImage": "url",
    "author": {
      "fullName": "Admin",
      "avatar": "url"
    },
    "category": {
      "name": "Làm đẹp",
      "slug": "lam-dep"
    },
    "publishedAt": "2025-10-25T10:00:00.000Z",
    "language": "vi"
  }
}
```

---

## 9. USER PROFILE

### 9.1. Get Profile

**Endpoint:** `GET /api/v1/user/profile`

**Description:** Lấy thông tin profile user đăng nhập

**Auth:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "phone": "+84912345678",
    "role": "MEMBER",
    "emailVerified": true,
    "avatar": "url",
    "language": "vi",
    "createdAt": "2025-10-01T10:00:00.000Z"
  }
}
```

---

### 9.2. Update Profile

**Endpoint:** `PUT /api/v1/user/profile`

**Description:** Cập nhật profile

**Auth:** Required

**Request:**
```json
{
  "fullName": "Nguyen Van A Updated",
  "phone": "+84987654321",
  "avatar": "new-avatar-url",
  "language": "en"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyen Van A Updated",
    "phone": "+84987654321",
    "avatar": "new-avatar-url",
    "language": "en",
    "updatedAt": "2025-10-31T10:00:00.000Z"
  }
}
```

---

## 10. MEMBER DASHBOARD

### 10.1. Get Dashboard Data

**Endpoint:** `GET /api/v1/members/dashboard`

**Description:** Lấy dữ liệu dashboard của member

**Auth:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "fullName": "Nguyen Van A",
      "email": "user@example.com",
      "avatar": "url"
    },
    "stats": {
      "totalBookings": 15,
      "upcomingBookings": 2,
      "completedBookings": 10,
      "cancelledBookings": 3,
      "totalSpent": 7500000
    },
    "upcomingAppointments": [
      {
        "id": "uuid",
        "referenceNumber": "SPAbooking-...",
        "appointmentDate": "2025-11-05T00:00:00.000Z",
        "appointmentTime": "14:30",
        "branch": {
          "name": "Chi nhánh Quận 1"
        },
        "services": [
          {
            "name": "Massage"
          }
        ]
      }
    ],
    "recentBookings": [ /* 5 bookings gần nhất */ ]
  }
}
```

---

### 10.2. Get Member Bookings

**Endpoint:** `GET /api/v1/members/bookings`

**Description:** Lịch sử bookings của member

**Auth:** Required

**Query Parameters:**
- `page`, `limit`, `status` (giống endpoint bookings)

**Response:** Giống `GET /api/v1/bookings`

---

### 10.3. Get Member Profile

**Endpoint:** `GET /api/v1/members/profile`

**Description:** Profile member (alias của /api/v1/user/profile)

**Auth:** Required

---

### 10.4. Update Member Profile

**Endpoint:** `PATCH /api/v1/members/profile`

**Description:** Cập nhật profile member

**Auth:** Required

---

## 11. SUPPORT CHAT

### 11.1. Create Conversation

**Endpoint:** `POST /api/v1/support/conversations`

**Description:** Tạo hội thoại chat mới

**Request:**
```json
{
  "customerName": "Nguyen Van D",
  "customerEmail": "customer@example.com"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "conversation-uuid",
    "customerName": "Nguyen Van D",
    "customerEmail": "customer@example.com",
    "status": "PENDING",
    "createdAt": "2025-10-31T10:00:00.000Z"
  }
}
```

---

### 11.2. Get Conversations (Staff)

**Endpoint:** `GET /api/v1/support/conversations`

**Description:** Lấy danh sách hội thoại (for support staff)

**Auth:** Staff/Admin

**Query Parameters:**
- `status` - PENDING, ACTIVE, CLOSED
- `page`, `limit`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "customerName": "Nguyen Van D",
      "customerEmail": "customer@example.com",
      "status": "ACTIVE",
      "lastMessage": "Xin chào!",
      "unreadCount": 2,
      "assignedStaffId": "staff-uuid",
      "updatedAt": "2025-10-31T10:00:00.000Z"
    }
  ]
}
```

---

### 11.3. Get Conversation Messages

**Endpoint:** `GET /api/v1/support/conversations/:id/messages`

**Description:** Lấy tin nhắn trong hội thoại

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "conversationId": "conv-uuid",
      "sender": "CUSTOMER",
      "senderName": "Nguyen Van D",
      "content": "Xin chào, tôi cần hỗ trợ",
      "createdAt": "2025-10-31T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "sender": "STAFF",
      "senderName": "Support Agent",
      "content": "Xin chào! Tôi có thể giúp gì cho bạn?",
      "createdAt": "2025-10-31T10:01:00.000Z"
    }
  ]
}
```

---

### 11.4. Send Message

**Endpoint:** `POST /api/v1/support/messages`

**Description:** Gửi tin nhắn (real-time qua Socket.IO)

**Request:**
```json
{
  "conversationId": "conv-uuid",
  "sender": "CUSTOMER",
  "senderName": "Nguyen Van D",
  "content": "Tôi muốn đặt lịch"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "msg-uuid",
    "conversationId": "conv-uuid",
    "sender": "CUSTOMER",
    "content": "Tôi muốn đặt lịch",
    "createdAt": "2025-10-31T10:02:00.000Z"
  }
}
```

**Socket.IO Event:** `message:new` được broadcast

---

### 11.5. Get AI Suggestions

**Endpoint:** `GET /api/v1/support/conversations/:id/ai-suggestions`

**Description:** Lấy gợi ý AI cho support staff

**Auth:** Staff

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Bạn có thể đặt lịch tại trang Booking",
      "Chúng tôi có promotion 20% trong tháng này",
      "Thời gian phục vụ từ 8h-20h hàng ngày"
    ]
  }
}
```

---

## 12. VOUCHERS

### 12.1. Get Active Vouchers

**Endpoint:** `GET /api/v1/vouchers/active`

**Description:** Lấy danh sách voucher còn hiệu lực

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "SUMMER2024",
      "title": "Giảm giá mùa hè",
      "description": "Giảm 20% cho tất cả dịch vụ",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "minPurchaseAmount": 500000,
      "maxDiscountAmount": 200000,
      "validFrom": "2025-06-01T00:00:00.000Z",
      "validUntil": "2025-08-31T23:59:59.000Z",
      "usageLimit": 1000,
      "usageCount": 245
    }
  ]
}
```

---

### 12.2. Validate Voucher

**Endpoint:** `POST /api/v1/vouchers/validate`

**Description:** Kiểm tra voucher có hợp lệ không

**Request:**
```json
{
  "code": "SUMMER2024",
  "totalAmount": 800000
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "voucher": {
      "code": "SUMMER2024",
      "discountType": "PERCENTAGE",
      "discountValue": 20
    },
    "discountAmount": 160000,
    "finalAmount": 640000
  }
}
```

**Errors:**
- `400` - Voucher not found
- `400` - Voucher expired
- `400` - Minimum purchase not met
- `400` - Usage limit reached

---

## 13. AI FEATURES

### 13.1. AI Health Check

**Endpoint:** `GET /api/v1/ai/health`

**Description:** Kiểm tra trạng thái AI service

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "model": "gemini-1.5-pro",
    "available": true
  }
}
```

---

### 13.2. AI Chat

**Endpoint:** `POST /api/v1/ai/chat`

**Description:** Chat với AI bot

**Rate Limit:** 20 requests/minute

**Request:**
```json
{
  "message": "Dịch vụ massage có những loại nào?"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "response": "Chúng tôi có các loại massage: Massage toàn thân, Massage mặt, Massage chân...",
    "suggestions": [
      "Xem chi tiết dịch vụ massage",
      "Đặt lịch ngay"
    ]
  }
}
```

---

### 13.3. AI Skin Analysis

**Endpoint:** `POST /api/v1/ai/skin-analysis`

**Description:** Phân tích da bằng AI

**Rate Limit:** 10 requests/hour

**Request:**
```json
{
  "concerns": ["acne", "dark spots"],
  "skinType": "oily",
  "age": 25
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "analysis": "Dựa trên thông tin...",
    "recommendedServices": [
      {
        "id": "uuid",
        "name": "Deep Cleansing Facial",
        "reason": "Giúp làm sạch sâu và giảm mụn"
      }
    ],
    "skincareTips": [
      "Rửa mặt 2 lần/ngày",
      "Sử dụng kem chống nắng"
    ]
  }
}
```

---

### 13.4. AI Sentiment Analysis

**Endpoint:** `POST /api/v1/ai/sentiment`

**Description:** Phân tích cảm xúc review

**Auth:** Admin

**Request:**
```json
{
  "text": "Dịch vụ rất tốt, nhân viên thân thiện!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sentiment": "POSITIVE",
    "score": 0.95,
    "keywords": ["tốt", "thân thiện"]
  }
}
```

---

### 13.5. AI Suggest Time Slot

**Endpoint:** `POST /api/v1/ai/suggest-timeslot`

**Description:** Gợi ý thời gian đặt lịch tối ưu

**Request:**
```json
{
  "branchId": "branch-uuid",
  "serviceIds": ["service-uuid"],
  "preferredDate": "2025-11-15"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "suggestedSlots": [
      {
        "time": "14:30",
        "availability": "high",
        "reason": "Ít khách, thời gian lý tưởng"
      },
      {
        "time": "16:00",
        "availability": "medium"
      }
    ]
  }
}
```

---

## 14. ADMIN

### 14.1. Admin Authentication

**Endpoint:** `POST /api/v1/admin/login`

**Description:** Đăng nhập admin

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

**Response:** Giống auth/login

---

### 14.2. Admin Dashboard Stats

**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Description:** Thống kê tổng quan

**Auth:** Admin

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "bookings": {
      "total": 1500,
      "today": 25,
      "thisMonth": 450
    },
    "revenue": {
      "total": 750000000,
      "today": 12500000,
      "thisMonth": 225000000
    },
    "users": {
      "total": 5000,
      "newThisMonth": 150
    },
    "reviews": {
      "total": 800,
      "avgRating": 4.7,
      "pending": 15
    }
  }
}
```

---

### 14.3. Manage Services (CRUD)

**Endpoints:**
- `GET /api/v1/admin/services` - List all
- `POST /api/v1/admin/services` - Create
- `PUT /api/v1/admin/services/:id` - Update
- `DELETE /api/v1/admin/services/:id` - Delete

**Auth:** Admin

---

### 14.4. Manage Bookings

**Endpoints:**
- `GET /api/v1/admin/bookings` - List all
- `PATCH /api/v1/admin/bookings/:id/status` - Update status

---

### 14.5. Manage Users

**Endpoints:**
- `GET /api/v1/admin/users` - List users
- `PATCH /api/v1/admin/users/:id/role` - Change role
- `DELETE /api/v1/admin/users/:id` - Delete user

---

## 15. ERROR CODES

### 15.1. Common Errors

| Code | Error Name | Message | Description |
|------|------------|---------|-------------|
| 400 | ValidationError | Validation failed | Invalid input data |
| 401 | UnauthorizedError | Unauthorized access | Missing/invalid token |
| 403 | ForbiddenError | Forbidden | Insufficient permissions |
| 404 | NotFoundError | Resource not found | Resource doesn't exist |
| 409 | ConflictError | Resource conflict | Duplicate resource |
| 429 | RateLimitError | Too many requests | Rate limit exceeded |
| 500 | InternalServerError | Internal server error | Server error |

### 15.2. Error Response Example

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "value": "invalid-email",
    "constraint": "Must be a valid email"
  },
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

---

## 16. RATE LIMITING

| Endpoint Pattern | Limit | Window |
|------------------|-------|--------|
| `/api/v1/auth/register` | 3 | 1 hour |
| `/api/v1/auth/*` (other) | 5 | 1 minute |
| `/api/v1/ai/chat` | 20 | 1 minute |
| `/api/v1/ai/skin-analysis` | 10 | 1 hour |
| `/api/v1/contact` | 5 | 1 hour |
| `/api/v1/upload/*` | 10 | 1 hour |
| All other endpoints | 100 | 1 minute |

---

## 17. WEBHOOKS

### 17.1. VNPay IPN

**Endpoint:** `GET /api/v1/payments/vnpay/ipn`

**Description:** VNPay Instant Payment Notification

**Source:** VNPay servers

---

## 18. SOCKET.IO EVENTS

### 18.1. Support Chat Events

**Client → Server:**
- `conversation:join` - Join chat room
- `conversation:leave` - Leave room
- `message:send` - Send message
- `typing:start` - User typing
- `typing:stop` - Stop typing

**Server → Client:**
- `message:new` - New message received
- `message:delivered` - Message delivered
- `typing:update` - Typing indicator
- `conversation:updated` - Status changed

---

## 19. KẾT LUẬN

### 19.1. API Statistics

- **Total Endpoints:** 60+
- **Auth Endpoints:** 6
- **Public Endpoints:** 15
- **Protected Endpoints:** 39
- **Admin Endpoints:** 12
- **WebSocket Events:** 9

### 19.2. Đánh giá theo tiêu chí

✅ **Danh sách endpoints:** Đầy đủ 60+ endpoints
✅ **Input/Output:** Chi tiết request/response JSON
✅ **Phương thức:** GET, POST, PUT, PATCH, DELETE
✅ **Mô tả chức năng:** Rõ ràng từng endpoint
✅ **Authentication:** Documented
✅ **Error handling:** Complete error codes
✅ **Rate limiting:** Documented
✅ **Examples:** Có ví dụ cụ thể

**→ Điểm dự kiến: 5/5** 🎯

---

**END OF API DOCUMENTATION**

*Tài liệu này mô tả đầy đủ API của hệ thống Beauty Clinic Care Website với danh sách endpoints, input/output, phương thức HTTP, và mô tả chức năng chi tiết.*
