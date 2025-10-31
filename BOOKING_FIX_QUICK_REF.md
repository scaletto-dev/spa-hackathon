# Quick Reference: Frontend Booking Fix

## 🔴 Problems Found

1. **JWT Token Not Sent** - Frontend used plain `axios` without interceptors
2. **Always Sending Guest Data** - Member bookings included guest fields even when logged in

## 🟢 Solutions Applied

### Fix 1: Use axiosInstance with Interceptors
```typescript
// ❌ WRONG (before)
import axios from 'axios';
const response = await axios.post(`${API_BASE}/bookings`, payload);

// ✅ CORRECT (after)
import axiosInstance from '../utils/axios';
const response = await axiosInstance.post(`/bookings`, payload);
```

**File:** `apps/frontend/src/services/bookingApi.ts`
- Changed all 12 API endpoints
- Now automatically sends JWT token in Authorization header

---

### Fix 2: Conditionally Send Guest Fields

```typescript
// ❌ WRONG (before)
const payload = {
  serviceIds: [...],
  branchId: "...",
  guestName: bookingData.name || '',      // Always sent
  guestEmail: bookingData.email || '',    // Always sent
  guestPhone: bookingData.phone || '',    // Always sent
};

// ✅ CORRECT (after)
const isLoggedIn = !!localStorage.getItem('accessToken');
const payload: any = {
  serviceIds: [...],
  branchId: "...",
  // Only add guest fields for guests
  ...(isLoggedIn ? {} : {
    guestName: bookingData.name || '',
    guestEmail: bookingData.email || '',
    guestPhone: bookingData.phone || '',
  }),
};
```

**File:** `apps/frontend/src/client/pages/BookingPage.tsx`
- Updated `handleSubmitBooking()` function

---

## 📊 Result

### Member Booking (Logged In)
```
Frontend Request:
  Authorization: Bearer <JWT_TOKEN> ✅
  Body: { serviceIds, branchId, appointmentDate, ... }  (NO guest fields)

Backend Result:
  userId: "user-id-from-token" ✅
  guestName, guestEmail, guestPhone: null
```

### Guest Booking (Not Logged In)
```
Frontend Request:
  (NO Authorization header)
  Body: { serviceIds, branchId, guestName, guestEmail, guestPhone, ... }

Backend Result:
  userId: null
  guestName: "Guest Name" ✅
  guestEmail: "guest@email.com" ✅
  guestPhone: "+84912345678" ✅
```

---

## ✅ How to Test

1. **Member Test:**
   - Login → Go to booking → Fill form → Check DevTools Network tab
   - Look for `Authorization: Bearer ...` header
   - Query DB: Should have `userId` set, `guestName` = null

2. **Guest Test:**
   - Incognito/Clear LocalStorage → Go to booking → Fill form
   - Check DevTools Network tab for NO Authorization header
   - Query DB: Should have `userId` = null, `guestName` filled

---

## 🔧 Technical Details

### What axiosInstance Does
Located in `apps/frontend/src/utils/axios.ts`:
- ✅ Auto-adds `Authorization: Bearer <token>` if `localStorage.accessToken` exists
- ✅ Handles token refresh on 401 responses
- ✅ Clears tokens on auth failure

### Why This Matters
- Backend extracts `userId` from JWT token header: `req.user?.id`
- Backend checks if guest fields present if no JWT
- Without JWT + with guest fields → causes confusion in backend logic
- Now: Clean separation between member (via JWT) and guest (via fields)
