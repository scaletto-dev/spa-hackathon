# Exact Changes Made - Booking Frontend Fix

## File 1: `apps/frontend/src/services/bookingApi.ts`

### Change 1.1: Update Imports (Line 1-3)
```diff
- import axios from 'axios';
+ import axiosInstance from '../utils/axios';

- const API_BASE = 'http://localhost:3000/api/v1';
+ const API_BASE = '/api/v1';
```

### Change 1.2: Replace All axios Calls (12 endpoints)

**All Changed Patterns:**
```diff
- const response = await axios.get(`${API_BASE}/...`);
+ const response = await axiosInstance.get(`${API_BASE}/...`);
```

**Affected Functions:**
1. `getFeaturedServices()` - Line 62
2. `getBranches()` - Line 73
3. `getBranchById()` - Line 84
4. `verifyOTP()` - Line 95
5. `sendOTP()` - Line 106
6. `createBooking()` - Line 117 ⭐ **CRITICAL**
7. `sendBookingConfirmationEmail()` - Line 128
8. `getBookingByReference()` - Line 139
9. `createPayment()` - Line 169
10. `getPaymentById()` - Line 185
11. `getPaymentsByBooking()` - Line 196
12. `updatePaymentStatus()` - Line 211

---

## File 2: `apps/frontend/src/client/pages/BookingPage.tsx`

### Change 2.1: Update handleSubmitBooking Function (Line 104-144)

**Before:**
```typescript
const handleSubmitBooking = async () => {
    try {
        if (!bookingData.branch || !bookingData.date || !bookingData.time || !bookingData.serviceIds) {
            toast.error('Thông tin đặt lịch chưa đầy đủ');
            return;
        }

        // Build payload according to API spec
        const payload = {
            serviceIds: bookingData.serviceIds,
            branchId: bookingData.branch.id,
            appointmentDate: bookingData.date,
            appointmentTime: convertTo24HourFormat(bookingData.time),
            guestName: bookingData.name || '',           // ❌ ALWAYS
            guestEmail: bookingData.email || '',         // ❌ ALWAYS
            guestPhone: bookingData.phone || '',         // ❌ ALWAYS
            notes: bookingData.notes || '',
            language: 'vi',
            paymentType: (bookingData.paymentMethod as '...') || 'CLINIC',
        };

        console.log('Submitting booking with payload:', payload);
        toast.info('Đang xử lý đặt lịch...');

        const response = await createBooking(payload);
        console.log('Booking created successfully:', response);

        toast.success(`Đặt lịch thành công! Mã tham chiếu: #${response.referenceNumber}`);
    } catch (error) {
        console.error('Error submitting booking:', error);
        toast.error('Đặt lịch thất bại. Vui lòng thử lại.');
    }
};
```

**After:**
```typescript
const handleSubmitBooking = async () => {
    try {
        if (!bookingData.branch || !bookingData.date || !bookingData.time || !bookingData.serviceIds) {
            toast.error('Thông tin đặt lịch chưa đầy đủ');
            return;
        }

        // ✅ CHECK IF LOGGED IN
        const accessToken = localStorage.getItem('accessToken');
        const isLoggedIn = !!accessToken;

        // Build payload according to API spec
        const payload: any = {
            serviceIds: bookingData.serviceIds,
            branchId: bookingData.branch.id,
            appointmentDate: bookingData.date,
            appointmentTime: convertTo24HourFormat(bookingData.time),
            notes: bookingData.notes || '',
            language: 'vi',
            paymentType: (bookingData.paymentMethod as 'ATM' | 'CLINIC' | 'WALLET' | 'CASH' | 'BANK_TRANSFER') || 'CLINIC',
        };

        // ✅ ONLY ADD GUEST FIELDS IF NOT LOGGED IN
        if (!isLoggedIn) {
            payload.guestName = bookingData.name || '';
            payload.guestEmail = bookingData.email || '';
            payload.guestPhone = bookingData.phone || '';
        }

        console.log('Submitting booking with payload:', payload);
        console.log('Is logged in:', isLoggedIn);  // ✅ NEW DEBUG LOG
        toast.info('Đang xử lý đặt lịch...');

        const response = await createBooking(payload);
        console.log('Booking created successfully:', response);

        toast.success(`Đặt lịch thành công! Mã tham chiếu: #${response.referenceNumber}`);
    } catch (error) {
        console.error('Error submitting booking:', error);
        toast.error('Đặt lịch thất bại. Vui lòng thử lại.');
    }
};
```

**Key Changes:**
- ✅ Line ~107: Added `const accessToken = localStorage.getItem('accessToken');`
- ✅ Line ~108: Added `const isLoggedIn = !!accessToken;`
- ✅ Line ~111-121: Removed hardcoded guest fields from main payload
- ✅ Line ~123-128: Added conditional block `if (!isLoggedIn) { ... }`
- ✅ Line ~132: Added debug log `console.log('Is logged in:', isLoggedIn);`

---

## Summary of Changes

| File | Type | Change | Purpose |
|------|------|--------|---------|
| bookingApi.ts | Import | `axios` → `axiosInstance` | Add JWT interceptor |
| bookingApi.ts | Config | Full URL → Relative URL | Work with any baseURL |
| bookingApi.ts | API Calls | 12 functions: `axios.` → `axiosInstance.` | Send JWT token |
| BookingPage.tsx | Logic | Add `isLoggedIn` check | Know if user authenticated |
| BookingPage.tsx | Payload | Conditionally add guest fields | Separate member/guest logic |

---

## Impact Analysis

### Before Fix
```
Scenario: User logged in, clicks "Book"
├─ Frontend sends: payload with guestName/Email/Phone
├─ Frontend sends: NO Authorization header (axios doesn't have interceptor)
├─ Backend receives: userId = undefined, guestName/Email/Phone = set
├─ Backend logic: "Guest booking detected" (because no userId)
└─ Database: Saves booking with userId = NULL ❌
```

### After Fix
```
Scenario: User logged in, clicks "Book"
├─ Frontend checks: localStorage.accessToken exists
├─ Frontend sends: payload WITHOUT guestName/Email/Phone
├─ Frontend sends: Authorization header with JWT token (axiosInstance interceptor)
├─ Backend receives: userId = extracted from JWT ✅, guestName/Email/Phone = undefined
├─ Backend logic: "Member booking detected"
└─ Database: Saves booking with userId = "user-id" ✅
```

---

## Testing Checklist

After deploying these changes:

- [ ] Clear browser cache/localStorage
- [ ] Test Guest Booking:
  - [ ] User NOT logged in
  - [ ] Fill booking form
  - [ ] Check Network tab: NO "Authorization" header
  - [ ] Check payload: HAS guestName, guestEmail, guestPhone
  - [ ] Verify DB: userId = null, guestName = filled ✅

- [ ] Test Member Booking:
  - [ ] User logs in
  - [ ] Fill booking form
  - [ ] Check Network tab: HAS "Authorization: Bearer ..." header
  - [ ] Check payload: NO guestName, guestEmail, guestPhone
  - [ ] Verify DB: userId = user-id-from-jwt ✅, guestName = null

---

## Rollback Plan

If issues occur, rollback is simple:

1. Revert `bookingApi.ts` to use plain `axios`
2. Revert `BookingPage.tsx` to always send guest fields
3. This brings behavior back to original (but broken)

However, the root issue would still exist - properly fixing requires these changes.
