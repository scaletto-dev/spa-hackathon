# Booking Flow - Quick Test Guide

## Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- Resend API key configured in `.env`

## Test Scenario: Complete Booking Flow

### Step 1: Service Selection
1. Navigate to Booking page
2. See list of featured services with prices and durations
3. Click to select 1-2 services (e.g., "Swedish Massage" + "Facial")
4. Verify services are highlighted and selected
5. Click "Continue" → should go to Step 2

### Step 2: Branch Selection
1. See list of all branches
2. Select any branch (e.g., "Downtown Branch")
3. Branch info displays address, phone
4. Click "Continue" → should go to Step 3

### Step 3: Date & Time Selection
1. See calendar widget
2. Try to select today's date → should be disabled (greyed out)
3. Select tomorrow's date → should be enabled
4. Choose a time slot (e.g., "2:00 PM")
5. Click "Continue" → should go to Step 4

### Step 4: User Information & Summary
1. **Not Logged In**: Email field is editable
   - Fill in: Name, Email, Phone
   - Verify summary shows:
     - Services: "Swedish Massage + Facial"
     - Branch: "Downtown Branch"
     - Date: "Thứ sáu, Tháng 10, Ngày 31, 2025" (Vietnamese format)
     - Time: "2:00 PM"
     - Price: Formatted as Vietnamese Dong (₫)
     - Duration: Combined duration of all services

2. **Logged In**: Email field is read-only
   - Email pre-filled from user profile
   - Try to edit email → should not be possible
   - Summary displays same as above

3. Click "Continue" → should go to Step 5

### Step 5: Confirmation
1. Review all booking details
2. See booking reference number (e.g., "SPAbooking-20251031-A1B2C3")
3. Click "✓ Confirm Booking"

### Expected API Calls

#### Call 1: Create Booking
```
POST http://localhost:3000/api/v1/bookings
Payload: {
  "serviceIds": ["service-id-1", "service-id-2"],
  "branchId": "branch-id",
  "appointmentDate": "2025-10-31",
  "appointmentTime": "14:00",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "0123456789",
  "language": "vi"
}
Response: {
  "id": "booking-uuid",
  "referenceNumber": "SPAbooking-20251031-A1B2C3",
  "status": "CONFIRMED",
  "appointmentDate": "2025-10-31",
  "appointmentTime": "14:00",
  "totalPrice": 1500000
}
```

#### Call 2: Send Confirmation Email
```
POST http://localhost:3000/api/v1/bookings/{booking-id}/send-confirmation
Payload: {
  "email": "john@example.com"
}
Response: {
  "success": true,
  "data": {
    "message": "Confirmation email sent to john@example.com"
  }
}
```

### Expected User Notifications

1. **Step 3 Error** (if date in past):
   ```
   Toast Error: "Ngày hẹn phải là ngày trong tương lai"
   ```

2. **Step 4 Error** (if email invalid):
   ```
   Toast Error: "Email không hợp lệ"
   ```

3. **Booking Processing**:
   ```
   Toast Info: "Đang xử lý đặt lịch..."
   ```

4. **Email Sending** (optional, if email works):
   ```
   Toast Success: "Email xác nhận đã được gửi đến john@example.com"
   ```

5. **Final Success**:
   ```
   Toast Success: "Đặt lịch thành công! Mã tham chiếu: #SPAbooking-20251031-A1B2C3"
   ```

## Testing Email Reception

### If Resend API Key is configured:
1. Check your email inbox (should receive within 1-2 minutes)
2. Email should contain:
   - ✅ Subject: "Xác nhận đặt lịch - Mã tham chiếu #SPAbooking-..."
   - ✅ Guest name greeting
   - ✅ Reference number in header
   - ✅ Appointment date and time
   - ✅ All services listed
   - ✅ Branch information
   - ✅ Total price in Vietnamese Dong
   - ✅ Guest contact info
   - ✅ Important notes for guests

### If Resend API Key is NOT configured:
1. Check backend console logs
2. Should see: `⚠️ Email service not configured. Booking confirmation email will not be sent.`
3. Booking still succeeds (email is non-critical)
4. Frontend shows success message anyway

## Testing Email Read-Only Feature

### Scenario 1: Logged Out User
1. Make sure you're NOT logged in
2. Go to Booking Step 4
3. Email field should be editable
4. Try typing in email → should work

### Scenario 2: Logged In User
1. Login to the app (e.g., via /login or auth flow)
2. Go to Booking Step 4
3. Email field should show your profile email
4. Email field should be disabled (greyed out)
5. Try clicking on email field → should not be focusable
6. Try typing in email field → should not work

## Testing Multiple Services

1. Select 3 different services in Step 1
2. Note prices: Service A ($100) + Service B ($150) + Service C ($200)
3. Go to Step 4 summary
4. Verify:
   - Service names show: "Service A + Service B + Service C"
   - Total price calculated: $450
   - Duration includes all services
5. Proceed to confirmation
6. Email should list all 3 services

## Testing Date/Time Edge Cases

### Tomorrow Selection (Valid)
1. Today: October 30, 2025
2. Tomorrow: October 31, 2025
3. Select October 31 in calendar → should be enabled
4. Should work ✅

### Today Selection (Invalid)
1. Try to select October 30 in calendar → should be disabled/greyed
2. Click on October 30 → should not be selectable ❌

### Far Future (Valid)
1. Select date 30 days from now → should be enabled ✅

## Troubleshooting

### Issue: Email field not showing read-only when logged in
- **Fix**: Verify `bookingData.isLoggedIn` is set correctly in BookingPage
- **Check**: Browser console for any errors
- **Verify**: User authentication is working

### Issue: Email sent notification doesn't appear
- **Possible Causes**:
  1. Resend API key not configured
  2. Email address invalid
  3. Backend error (check server logs)
- **Workaround**: Booking still succeeds, email is non-blocking

### Issue: Booking creation fails
- **Check**:
  1. All required fields filled (name, email, phone, services, branch, date, time)
  2. Date is in future (not today or past)
  3. Backend is running and accessible
  4. API endpoint is correct

### Issue: Reference number not generated
- **Check**: Backend booking.service.ts `generateReferenceNumber()` method
- **Verify**: Date/time is correct on backend server
- **Check**: Prisma migrations applied (`npx prisma migrate dev`)

## Performance Testing

### Load Testing Notes
- Email sending is non-blocking (doesn't slow down booking response)
- Each booking creation should take < 2 seconds
- Email sending should take < 5 seconds (doesn't block user)
- Multiple concurrent bookings should work fine

## Monitoring / Logs

### Frontend Logs (Browser Console)
```
✓ Submitting booking with payload: {...}
✓ Booking created successfully: {...}
✓ Booking confirmation email sent
✓ Booking result: success
```

### Backend Logs (Server Console)
```
✓ POST /api/v1/bookings - Booking created
✓ POST /api/v1/bookings/:bookingId/send-confirmation - Email request received
✓ Booking confirmation email sent to user@example.com
```

### Email Logs (Resend Dashboard)
- Check at: https://resend.com/emails
- Should see email sent with proper details
- Check delivery status and open rates

---

**Created**: October 30, 2025
**Test Environment**: Development (localhost)
**Complexity**: Full end-to-end flow with email integration
