# Frontend Booking Logic - Issue Found ⚠️

## Problem: userId NOT Saved for Authenticated Members

### Root Cause
Frontend **đã không** xử lí chính xác 2 trường hợp booking. Khi bạn đang nhập (logged in) nhưng `userId` vẫn lưu là `NULL`.

---

## 📍 Issue Analysis

### Current Flow (BUGGY):

```typescript
// File: apps/frontend/src/services/bookingApi.ts (Line 115)
export const createBooking = async (payload: CreateBookingPayload): Promise<BookingResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/bookings`, payload);  // ❌ PLAIN AXIOS
    return response.data.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};
```

**Problem:**
- Line 30-42: `CreateBookingPayload` interface có `userId?: string` nhưng **KHÔNG bao giờ được set**
- Line 115: Dùng plain `axios` **KHÔNG có interceptors** → không gửi JWT token
- File `BookingPage.tsx` (Line 129): Gọi `createBooking(payload)` nhưng `payload` không chứa `userId`

---

### Payload Being Sent (Line 116-128 in BookingPage.tsx):

```typescript
const payload = {
  serviceIds: bookingData.serviceIds,
  branchId: bookingData.branch.id,
  appointmentDate: bookingData.date,
  appointmentTime: convertTo24HourFormat(bookingData.time),
  guestName: bookingData.name || '',        // ❌ ALWAYS SET (nhầm với guest)
  guestEmail: bookingData.email || '',      // ❌ ALWAYS SET
  guestPhone: bookingData.phone || '',      // ❌ ALWAYS SET
  notes: bookingData.notes || '',
  language: 'vi',
  paymentType: (bookingData.paymentMethod || 'CLINIC'),
  // ❌ userId KHÔNG ĐƯỢC INCLUDE (frontend quên)
  // ❌ JWT Token KHÔNG ĐƯỢC GỬI (axios không có interceptor)
};
```

---

## 🔧 The Fix

### Issue 1: Axios Instance Not Using Interceptors

**Current:**
```typescript
// apps/frontend/src/services/bookingApi.ts
import axios from 'axios';
const response = await axios.post(`${API_BASE}/bookings`, payload);  // ❌
```

**Should be:**
```typescript
// apps/frontend/src/services/bookingApi.ts
import axiosInstance from '../utils/axios';  // ✅ Has interceptors
const response = await axiosInstance.post(`/bookings`, payload);  // ✅
```

---

### Issue 2: Frontend Sends guestName/guestEmail/guestPhone Even for Members

**Current (BookingPage.tsx):**
```typescript
// Line 116-128
const payload = {
  // ... other fields
  guestName: bookingData.name || '',        // ❌ Set for everyone
  guestEmail: bookingData.email || '',      // ❌ Set for everyone
  guestPhone: bookingData.phone || '',      // ❌ Set for everyone
};
```

**Should be:**
```typescript
// Check if authenticated
const isLoggedIn = localStorage.getItem('accessToken') !== null;

const payload = {
  serviceIds: bookingData.serviceIds,
  branchId: bookingData.branch.id,
  appointmentDate: bookingData.date,
  appointmentTime: convertTo24HourFormat(bookingData.time),
  notes: bookingData.notes || '',
  language: 'vi',
  paymentType: (bookingData.paymentMethod || 'CLINIC'),
  
  // ✅ Only set guest fields if NOT logged in
  ...(isLoggedIn ? {} : {
    guestName: bookingData.name || '',
    guestEmail: bookingData.email || '',
    guestPhone: bookingData.phone || '',
  }),
};
```

---

## 🔑 Backend expects:

### For Member (Authenticated):
```typescript
// Request Header
Authorization: Bearer <jwt_token>

// Request Body (NO guest fields needed)
{
  serviceIds: ["..."],
  branchId: "...",
  appointmentDate: "2025-11-15",
  appointmentTime: "14:30",
  notes: "...",
  language: "vi",
  paymentType: "ATM"
  // Backend tự extract userId từ JWT token
}

// Database saves:
{
  userId: "user-id-from-token",  // ✅ SET
  guestName: null,
  guestEmail: null,
  guestPhone: null,
}
```

### For Guest (NOT Authenticated):
```typescript
// Request Header
(NO Authorization header)

// Request Body (MUST have guest fields)
{
  serviceIds: ["..."],
  branchId: "...",
  appointmentDate: "2025-11-15",
  appointmentTime: "14:30",
  guestName: "Nguyen A",
  guestEmail: "nguyen@example.com",
  guestPhone: "+84912345678",
  notes: "...",
  language: "vi",
  paymentType: "ATM"
}

// Database saves:
{
  userId: null,
  guestName: "Nguyen A",
  guestEmail: "nguyen@example.com",
  guestPhone: "+84912345678",
}
```

---

## 📋 Implementation Checklist

### File 1: `apps/frontend/src/services/bookingApi.ts`

**Changes needed:**
1. ✅ Import `axiosInstance` instead of plain `axios`
2. ✅ Update `createBooking()` to use `axiosInstance`
3. ✅ Update all other API calls to use `axiosInstance`

### File 2: `apps/frontend/src/client/pages/BookingPage.tsx`

**Changes needed:**
1. ✅ Check if user is logged in (via `localStorage.getItem('accessToken')`)
2. ✅ Only include guest fields if NOT logged in
3. ✅ Remove hardcoded `guestName`, `guestEmail`, `guestPhone` for members

### File 3: Update `BookingUserInfo.tsx` component (if needed)

**Check if:**
- Pre-fills member data from context/Redux
- Disables editing for logged-in users
- Shows different UI for guest vs member

---

## Summary Table

| Scenario | Current Behavior | Expected Behavior | Issue |
|----------|------------------|-------------------|-------|
| **Member (logged in) books** | Sends `guestName/Email/Phone` always | Should send JWT token header + empty guest fields | ❌ Frontend sends guest data + no token |
| **Guest books** | Sends `guestName/Email/Phone` | Should send guest data + no token | ✅ Works correctly |
| **API receives request** | `req.user?.id` = undefined | Should be set from JWT | ❌ Token not sent |
| **DB saves** | `userId = null` | Should have user ID | ❌ Null saved |

---

## Next Steps

1. Fix `bookingApi.ts` to use `axiosInstance`
2. Fix `BookingPage.tsx` to conditionally send guest fields
3. Test with logged-in user → verify `userId` is saved in DB
4. Test with guest user → verify guest fields are saved
