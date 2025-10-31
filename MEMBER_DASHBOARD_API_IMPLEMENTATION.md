# Member Dashboard APIs - Implementation Complete ✅

## Overview
Implemented backend APIs for member dashboard with booking history, stats, and profile management.

---

## APIs Implemented

### 1. GET /api/v1/members/dashboard
**Purpose:** Fetch member dashboard overview with stats and upcoming bookings

**Authentication:** Required (Bearer token)

**Request:**
```http
GET /api/v1/members/dashboard
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
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
    "upcomingBookings": [
      {
        "id": "uuid",
        "referenceNumber": "SPAbooking-20251031-ABC123",
        "serviceName": "AI Skin Analysis Facial",
        "branchName": "Chi nhánh Trung tâm",
        "appointmentDate": "2025-11-15T10:00:00.000Z",
        "appointmentTime": "10:00",
        "status": "confirmed",
        "serviceImage": "https://..."
      }
    ]
  },
  "timestamp": "2025-10-31T03:02:29.663Z"
}
```

---

### 2. GET /api/v1/members/bookings
**Purpose:** Fetch member booking history with pagination and filters

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Records per page
- `status` (optional, default: 'all') - Filter by status: CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, all
- `dateFrom` (optional) - Filter from date (YYYY-MM-DD)
- `dateTo` (optional) - Filter to date (YYYY-MM-DD)

**Request:**
```http
GET /api/v1/members/bookings?page=1&limit=10&status=all
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "referenceNumber": "SPAbooking-20251031-ABC123",
      "serviceName": "AI Skin Analysis Facial",
      "branchName": "Chi nhánh Trung tâm",
      "appointmentDate": "2025-11-15T10:00:00.000Z",
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
  },
  "timestamp": "2025-10-31T03:02:29.663Z"
}
```

---

### 3. GET /api/v1/members/profile
**Purpose:** Fetch member profile information

**Authentication:** Required (Bearer token)

**Request:**
```http
GET /api/v1/members/profile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "+84912345678",
    "avatar": "https://...",
    "language": "vi",
    "emailVerified": true,
    "createdAt": "2024-06-15T08:30:00.000Z"
  },
  "timestamp": "2025-10-31T03:02:29.663Z"
}
```

---

### 4. PATCH /api/v1/members/profile
**Purpose:** Update member profile information

**Authentication:** Required (Bearer token)

**Request Body (all optional):**
```json
{
  "fullName": "New Name",
  "phone": "+84912345678",
  "avatar": "https://...",
  "language": "en"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "New Name",
    "phone": "+84912345678",
    "avatar": "https://...",
    "language": "en"
  },
  "timestamp": "2025-10-31T03:02:29.663Z"
}
```

---

## Files Created/Modified

### Backend

#### 1. `apps/backend/src/services/member.service.ts` (NEW)
- `getMemberDashboard()` - Get stats and upcoming bookings
- `getMemberBookings()` - Get paginated booking history with filters
- `getMemberProfile()` - Get member profile
- `updateMemberProfile()` - Update member profile
- Helper method: `mapBookingStatus()` - Map DB status to API status

#### 2. `apps/backend/src/controllers/member.controller.ts` (NEW)
- `getDashboard()` - Handle GET /api/v1/members/dashboard
- `getBookings()` - Handle GET /api/v1/members/bookings
- `getProfile()` - Handle GET /api/v1/members/profile
- `updateProfile()` - Handle PATCH /api/v1/members/profile

#### 3. `apps/backend/src/routes/member.routes.ts` (NEW)
- Routes configuration with authentication middleware
- All routes require JWT token (Bearer token authentication)

#### 4. `apps/backend/src/routes/index.ts` (MODIFIED)
- Added import: `import memberRoutes from './member.routes';`
- Added route registration: `app.use('/api/v1/members', memberRoutes);`

### Frontend

#### `apps/frontend/src/api/adapters/member.ts` (MODIFIED)
- **Replaced mock functions with real API calls:**
  - `getMemberDashboard()` - Now calls real API
  - `getMemberBookings()` - Now calls real API with params
  - `getMemberProfile()` - Now calls real API
  - `updateMemberProfile()` - Now calls real API
- Changed from plain `fetch` to `axiosInstance` (has JWT interceptor)
- Updated API base URL to relative `/api/v1`

---

## Booking Status Mapping

Database status → API response:
| Database | API |
|----------|-----|
| CONFIRMED | confirmed |
| COMPLETED | completed |
| CANCELLED | cancelled |
| NO_SHOW | no_show |
| PENDING | confirmed |

---

## Member Points Calculation

Points = Total Spent ÷ 100,000 VND (1 point per 100k VND)

Example:
- Booking 1: 500,000 VND = 5 points
- Booking 2: 300,000 VND = 3 points
- **Total: 450,000 VND = 4 points**

---

## Key Features

### Dashboard Stats
- ✅ **totalBookings** - All bookings (any status)
- ✅ **upcomingBookings** - Future confirmed bookings
- ✅ **completedBookings** - Completed bookings
- ✅ **memberPoints** - Loyalty points (1 point per 100k VND)

### Upcoming Bookings
- ✅ Only shows confirmed bookings in future
- ✅ Sorted by date (earliest first)
- ✅ Limited to next 5 bookings
- ✅ Includes service image

### Booking History
- ✅ Pagination support (page, limit)
- ✅ Filter by status (confirmed, completed, cancelled, no_show, all)
- ✅ Filter by date range (dateFrom, dateTo)
- ✅ Sorted by date (newest first)
- ✅ Service details included

---

## Authentication Flow

```
Frontend Request
  ↓
axiosInstance interceptor adds Authorization header
  ↓
Backend optionalAuthenticate middleware (for booking routes)
  ↓
Backend authenticate middleware (for member routes) ← REQUIRED
  ↓
req.user object populated with user data
  ↓
Service layer queries with userId
  ↓
Response sent back
```

---

## Error Handling

| Status | Error | Message |
|--------|-------|---------|
| 401 | Unauthorized | Authentication required |
| 400 | ValidationError | Invalid page/limit values |
| 404 | NotFoundError | Member not found |
| 500 | Internal Server Error | Service error |

---

## Testing Checklist

- [ ] GET /api/v1/members/dashboard - Returns stats and upcoming bookings
- [ ] GET /api/v1/members/bookings - Returns paginated history
- [ ] GET /api/v1/members/bookings?status=completed - Filters by status
- [ ] GET /api/v1/members/bookings?dateFrom=2025-11-01 - Filters by date
- [ ] GET /api/v1/members/profile - Returns user profile
- [ ] PATCH /api/v1/members/profile - Updates profile
- [ ] Without token - Returns 401 error
- [ ] Invalid token - Returns 401 error
- [ ] Valid token but no account - Returns 404 error

---

## Frontend Integration

The frontend now uses real APIs instead of mock data:

```typescript
// BEFORE (Mock)
const dashboard = await getMemberDashboard(); // Returns mock data

// AFTER (Real)
const dashboard = await getMemberDashboard(); // Calls real API
// GET /api/v1/members/dashboard
// Automatically includes JWT token via axiosInstance interceptor
```

---

## Next Steps (Optional)

1. Add special offers API (currently frontend doesn't fetch from backend)
2. Add member points redemption API
3. Add booking cancellation from member dashboard
4. Add booking rescheduling API
5. Add member's reviews listing
6. Add referral points tracking

---

## Summary

✅ **Completed:**
- Backend service layer (member.service.ts)
- Backend controller (member.controller.ts)
- Backend routes (member.routes.ts)
- Route registration in app
- Frontend API adapter (real calls instead of mock)
- All middleware configured (authenticate)
- Error handling
- Type definitions

**Status: READY TO TEST** 🎉
