# Booking Authentication Logic - Current Status

## Overview
Backend đã xử lý cả 2 trường hợp: **Authenticated Member** (có token) và **Guest** (chưa xác thực).

---

## 1. **Authenticated Member Booking** ✅ (Có Token)

### Flow:
```typescript
// Controller (booking.controller.ts)
const userId = req.user?.id;  // Lấy từ JWT token (middleware)

// Service (booking.service.ts)
async createBooking(createBookingDto, userId)
```

### Data Saved:
- `userId` → Lưu vào Booking.userId (có giá trị)
- `guestName`, `guestEmail`, `guestPhone` → NULL (không cần)
- Booking liên kết với User trong DB

### Validation:
- ✅ Kiểm tra serviceIds, branchId, appointmentDate, appointmentTime (bắt buộc)
- ✅ Kiểm tra appointmentDate + time (>= 1 giờ từ giờ hiện tại)
- ✅ Kiểm tra business hours (8:00-18:00)
- ✅ Kiểm tra services và branch tồn tại

### Example Request:
```json
{
  "serviceIds": ["svc-001", "svc-002"],
  "branchId": "branch-001",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "14:30",
  "notes": "Có dị ứng với hương liệu",
  "language": "vi",
  "paymentType": "ATM",
  "paymentAmount": 500000
}
```

**Headers cần có:**
```
Authorization: Bearer <jwt_token>
```

### Database Result:
```prisma
Booking {
  id: "uuid-xxx"
  referenceNumber: "SPAbooking-20251031-ABC123"
  userId: "user-id-from-token"  // ✅ SAVED
  guestName: null
  guestEmail: null
  guestPhone: null
  serviceIds: ["svc-001", "svc-002"]
  branchId: "branch-001"
  status: "CONFIRMED"
  language: "vi"
  ...
}
```

---

## 2. **Guest Booking** ✅ (Chưa Xác Thực)

### Flow:
```typescript
// Controller
const userId = req.user?.id;  // undefined (không có token)

// Service - Kiểm tra guest info
if (!userId) {
  if (!guestName || !guestEmail || !guestPhone) {
    throw new ValidationError('...')
  }
}
```

### Data Saved:
- `userId` → NULL (không có user)
- `guestName` → Lưu (bắt buộc)
- `guestEmail` → Lưu (bắt buộc)
- `guestPhone` → Lưu (bắt buộc)

### Validation:
- ✅ Bắt buộc guestName, guestEmail, guestPhone
- ✅ Email format validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- ✅ Phone format validation: `/^[0-9+\-\s()]+$/`
- ✅ Cùng validation appointment datetime như member

### Example Request:
```json
{
  "serviceIds": ["svc-001"],
  "branchId": "branch-001",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "10:30",
  "guestName": "Nguyễn Thị A",
  "guestEmail": "nguyen@example.com",
  "guestPhone": "+84912345678",
  "notes": "Làm nail gấp",
  "language": "vi",
  "paymentType": "ATM"
}
```

**Headers:**
```
Không cần Authorization header
```

### Database Result:
```prisma
Booking {
  id: "uuid-yyy"
  referenceNumber: "SPAbooking-20251031-XYZ789"
  userId: null  // ✅ NULL (guest)
  guestName: "Nguyễn Thị A"  // ✅ SAVED
  guestEmail: "nguyen@example.com"  // ✅ SAVED
  guestPhone: "+84912345678"  // ✅ SAVED
  serviceIds: ["svc-001"]
  branchId: "branch-001"
  status: "CONFIRMED"
  language: "vi"
  ...
}
```

---

## 3. **Booking Retrieval by Reference**

```typescript
// GET /api/v1/bookings/:referenceNumber
async getBookingByReference(referenceNumber: string, userId?: string)
```

### Logic:
- ✅ Guest có thể lấy booking bằng referenceNumber (không cần userId)
- ✅ Member có thể lấy booking của mình (với userId check)
- ✅ Trả về booking details (services, branch, payment)

---

## 4. **Member Bookings List**

```typescript
// GET /api/v1/bookings
async listUserBookings(userId, page, limit, status)
```

### Logic:
- ✅ **Bắt buộc authentication** - không có userId thì reject
- ✅ Phân trang (page, limit)
- ✅ Filter by status (optional)
- ✅ Chỉ trả về bookings của user đó

---

## 5. **Cancel Booking**

```typescript
// PATCH /api/v1/bookings/:id/cancel
async cancelBooking(id: string, cancellationReason: string, userId?: string)
```

### Logic:
- ✅ Cả member (với userId) và guest (không userId) có thể cancel
- ✅ Bắt buộc cancellationReason
- ✅ Cập nhật status → CANCELLED

---

## 6. **Payment Logic**

- ✅ Automatic calculation: Nếu `paymentAmount` không provide → tính từ service prices
- ✅ Create Payment record khi booking được tạo
- ✅ Payment default status: `PENDING`
- ✅ Payment currency: `VND`

---

## 7. **Email Confirmation**

- ✅ Gửi confirmation email nếu có `guestEmail` hoặc member email
- ✅ Không block booking nếu email fail
- ✅ Email content:
  - Reference number
  - Appointment date/time
  - Branch info
  - Service names
  - Total amount
  - Notes (nếu có)

---

## Database Schema - Booking Model

```prisma
model Booking {
  id                 String        @id @default(uuid())
  referenceNumber    String        @unique
  userId             String?       // NULL nếu guest, có giá trị nếu member
  branchId           String
  appointmentDate    DateTime
  appointmentTime    String
  status             BookingStatus @default(CONFIRMED)
  guestName          String?       // Chỉ cần nếu guest
  guestEmail         String?       // Chỉ cần nếu guest
  guestPhone         String?       // Chỉ cần nếu guest
  notes              String?
  language           String        @default("vi")
  cancellationReason String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  serviceIds         String[]
  branch             Branch        @relation(...)
  user               User?         @relation(...)  // NULL nếu guest
  payments           Payment[]
}
```

---

## Summary

| Trường | Member | Guest |
|--------|--------|-------|
| userId | ✅ Có giá trị | ✅ NULL |
| guestName | ❌ NULL | ✅ Bắt buộc |
| guestEmail | ❌ NULL | ✅ Bắt buộc |
| guestPhone | ❌ NULL | ✅ Bắt buộc |
| Cần JWT Token | ✅ Có | ❌ Không |
| Có Payment | ✅ Có | ✅ Có |

**Kết luận:** Backend đã **HOÀN TOÀN xử lý** cả 2 trường hợp authentication. Không cần thêm logic nào cả! 🎉
