# Frontend Booking Fix - COMPLETED ✅

## Issues Found & Fixed

### ❌ Issue 1: Using Plain `axios` Without Interceptors
**Problem:** `bookingApi.ts` imported plain `axios` instead of `axiosInstance` which has JWT token interceptors.
- JWT token NEVER sent to backend
- Backend couldn't extract `userId` from token
- Result: `userId` saved as NULL even when logged in

**Fix Applied:**
```typescript
// BEFORE ❌
import axios from 'axios';

// AFTER ✅
import axiosInstance from '../utils/axios';
```

Also fixed API_BASE URL:
```typescript
// BEFORE ❌
const API_BASE = 'http://localhost:3000/api/v1';

// AFTER ✅
const API_BASE = '/api/v1';  // Relative to baseURL in axiosInstance
```

**Files Changed:** `apps/frontend/src/services/bookingApi.ts`
- ✅ All `axios` calls → `axiosInstance` (12 total endpoints)
- ✅ Now sends JWT token in Authorization header automatically via interceptor

---

### ❌ Issue 2: Always Sending Guest Fields for Members
**Problem:** `BookingPage.tsx` always included `guestName`, `guestEmail`, `guestPhone` even for authenticated members.
- Backend received guest data for members
- Backend confused whether it's guest or member booking
- Result: fields filled but `userId` still NULL

**Fix Applied:**
```typescript
// BEFORE ❌
const payload = {
  serviceIds: bookingData.serviceIds,
  branchId: bookingData.branch.id,
  appointmentDate: bookingData.date,
  appointmentTime: convertTo24HourFormat(bookingData.time),
  guestName: bookingData.name || '',        // ❌ ALWAYS SET
  guestEmail: bookingData.email || '',      // ❌ ALWAYS SET
  guestPhone: bookingData.phone || '',      // ❌ ALWAYS SET
  notes: bookingData.notes || '',
  language: 'vi',
  paymentType: (bookingData.paymentMethod || 'CLINIC'),
};

// AFTER ✅
const accessToken = localStorage.getItem('accessToken');
const isLoggedIn = !!accessToken;

const payload: any = {
  serviceIds: bookingData.serviceIds,
  branchId: bookingData.branch.id,
  appointmentDate: bookingData.date,
  appointmentTime: convertTo24HourFormat(bookingData.time),
  notes: bookingData.notes || '',
  language: 'vi',
  paymentType: (bookingData.paymentMethod || 'CLINIC'),
};

// ✅ Only add guest fields if NOT logged in
if (!isLoggedIn) {
  payload.guestName = bookingData.name || '';
  payload.guestEmail = bookingData.email || '';
  payload.guestPhone = bookingData.phone || '';
}
```

**Files Changed:** `apps/frontend/src/client/pages/BookingPage.tsx`
- ✅ Check `localStorage.getItem('accessToken')` for authentication status
- ✅ Conditionally include guest fields only for guest bookings
- ✅ Member bookings now send ONLY required fields + JWT token via header

---

## How It Works Now

### 📋 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: BookingPage.tsx                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Check: isLoggedIn?
                    /                    \
                   /                      \
              YES (Member)            NO (Guest)
              /                            \
             ▼                              ▼
   ┌──────────────────────┐      ┌──────────────────────┐
   │ MEMBER BOOKING       │      │ GUEST BOOKING        │
   │ - NO guest fields    │      │ - guestName          │
   │ - JWT token (header) │      │ - guestEmail         │
   │ - axiosInstance      │      │ - guestPhone         │
   │                      │      │ - NO JWT token       │
   └──────────────────────┘      └──────────────────────┘
             │                              │
             └──────────────────┬───────────┘
                                ▼
                ┌────────────────────────────────────┐
                │ bookingApi.createBooking()         │
                │ - Uses axiosInstance               │
                │ - Auto-adds interceptor headers    │
                └────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────┐
        │ BACKEND: BookingController                │
        │ - Checks Authorization header            │
        │ - Extracts userId from JWT (if present)  │
        │ - Validates guest fields (if no token)   │
        └───────────────────────────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────┐
        │ DATABASE BOOKING                          │
        │                                           │
        │ MEMBER:                 GUEST:           │
        │ userId: "user-123" ✅   userId: null ✅  │
        │ guestName: null         guestName: "..." │
        │ guestEmail: null        guestEmail: "..." │
        │ guestPhone: null        guestPhone: "..." │
        └───────────────────────────────────────────┘
```

---

## Test Cases

### ✅ Test 1: Member Booking (Logged In)

**Setup:**
- User logs in → `localStorage.accessToken` set
- Navigate to booking page
- Select services, branch, date, time
- Fill info form (auto-filled from login)
- Click confirm

**Request Sent:**
```http
POST /api/v1/bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "serviceIds": ["svc-001"],
  "branchId": "branch-001",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "14:30",
  "notes": "...",
  "language": "vi",
  "paymentType": "CLINIC"
}
```

**Expected DB Result:**
```json
{
  "userId": "user-id-from-token",  // ✅ SAVED
  "guestName": null,
  "guestEmail": null,
  "guestPhone": null
}
```

---

### ✅ Test 2: Guest Booking (NOT Logged In)

**Setup:**
- User NOT logged in → no `localStorage.accessToken`
- Navigate to booking page
- Select services, branch, date, time
- Fill guest info (name, email, phone)
- Click confirm

**Request Sent:**
```http
POST /api/v1/bookings
(NO Authorization header)
Content-Type: application/json

{
  "serviceIds": ["svc-001"],
  "branchId": "branch-001",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "14:30",
  "guestName": "Nguyen Thi A",
  "guestEmail": "nguyen@example.com",
  "guestPhone": "+84912345678",
  "notes": "...",
  "language": "vi",
  "paymentType": "CLINIC"
}
```

**Expected DB Result:**
```json
{
  "userId": null,  // ✅ NULL
  "guestName": "Nguyen Thi A",  // ✅ SAVED
  "guestEmail": "nguyen@example.com",  // ✅ SAVED
  "guestPhone": "+84912345678"  // ✅ SAVED
}
```

---

## Files Changed

### 1. `apps/frontend/src/services/bookingApi.ts`
- ✅ Import: `axiosInstance` instead of plain `axios`
- ✅ API_BASE: Changed to relative URL `/api/v1`
- ✅ All 12 API functions: Updated to use `axiosInstance`
  - `getFeaturedServices()`
  - `getBranches()`
  - `getBranchById()`
  - `verifyOTP()`
  - `sendOTP()`
  - `createBooking()` ← **CRITICAL**
  - `sendBookingConfirmationEmail()`
  - `getBookingByReference()`
  - `createPayment()`
  - `getPaymentById()`
  - `getPaymentsByBooking()`
  - `updatePaymentStatus()`

### 2. `apps/frontend/src/client/pages/BookingPage.tsx`
- ✅ Added: `isLoggedIn` check in `handleSubmitBooking()`
- ✅ Changed: Payload now conditionally includes guest fields
- ✅ Added: Console logs for debugging

---

## Verification Steps

To verify the fix works:

1. **Member Booking Test:**
   ```bash
   # 1. Open browser DevTools (F12)
   # 2. Login with member account
   # 3. Go to booking page
   # 4. Fill booking form
   # 5. Check Network tab before submit
   # 6. Look for Authorization header with "Bearer ..."
   # 7. Check Request payload (NO guest fields)
   # 8. After submit, query DB:
   
   SELECT id, referenceNumber, "userId", "guestName" FROM "Booking" 
   WHERE "referenceNumber" = 'SPAbooking-...' 
   LIMIT 1;
   
   # Should show: userId = <user-id>, guestName = null
   ```

2. **Guest Booking Test:**
   ```bash
   # 1. Open new incognito window
   # 2. Clear all localStorage
   # 3. Go to booking page (NOT logged in)
   # 4. Fill booking form with guest info
   # 5. Check Network tab before submit
   # 6. Look for NO Authorization header
   # 7. Check Request payload (HAS guest fields)
   # 8. After submit, query DB:
   
   SELECT id, referenceNumber, "userId", "guestName", "guestEmail" FROM "Booking" 
   WHERE "referenceNumber" = 'SPAbooking-...' 
   LIMIT 1;
   
   # Should show: userId = null, guestName = "...", guestEmail = "..."
   ```

---

## Summary

| Issue | Root Cause | Fix | Result |
|-------|-----------|-----|--------|
| **Member userId = NULL** | Using plain `axios` without JWT interceptor | Import `axiosInstance` | ✅ JWT sent, userId saved |
| **Always sending guest fields** | Unconditional payload fields | Check `isLoggedIn` before adding guest fields | ✅ Clean separation of member/guest |
| **Wrong API_BASE URL** | Hardcoded full URL | Use relative URL + axiosInstance baseURL | ✅ Cleaner, works with any domain |

**Status: READY FOR TESTING** 🎉
