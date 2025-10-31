# 💳 VNPay Payment Integration

## 📋 Tổng quan

Tích hợp VNPay vào hệ thống booking để hỗ trợ thanh toán trực tuyến qua cổng thanh toán VNPay.

**Thư viện sử dụng:** [vnpay](https://github.com/lehuygiang28/vnpay) v2.4.4

## 🔄 Luồng thanh toán

```
1. User tạo booking → Chọn phương thức thanh toán ATM (VNPay)
2. Backend tạo booking với payment PENDING
3. Backend tạo VNPay payment URL
4. Frontend redirect user đến VNPay
5. User thanh toán tại VNPay
6. VNPay redirect user về /booking/payment-result
7. Frontend gọi API verify return URL
8. Backend verify signature và cập nhật payment status
9. VNPay gửi IPN (Instant Payment Notification) đến backend
10. Backend xác nhận và cập nhật payment status (lần 2 để đảm bảo)
11. Hiển thị kết quả thanh toán cho user
```

## 🏗️ Cấu trúc Backend

### 1. VNPay Service (`apps/backend/src/services/vnpay.service.ts`)

**Chức năng:**

-   Khởi tạo VNPay với config từ environment variables
-   Tạo payment URL để redirect user đến VNPay
-   Verify return URL khi user quay lại từ VNPay
-   Xử lý IPN (Instant Payment Notification) từ VNPay server
-   Cập nhật payment status trong database

**Key Methods:**

-   `createPaymentUrl(params)` - Tạo URL thanh toán VNPay
-   `verifyReturnUrl(query)` - Xác thực return URL từ customer
-   `verifyIPN(query)` - Xác thực IPN từ VNPay server
-   `updatePaymentStatus()` - Cập nhật trạng thái thanh toán

### 2. VNPay Controller (`apps/backend/src/controllers/vnpay.controller.ts`)

**Endpoints:**

#### POST `/api/v1/payments/vnpay/create-payment-url`

Tạo VNPay payment URL cho booking

**Request Body:**

```json
{
    "bookingId": "booking-uuid",
    "bankCode": "NCB", // Optional
    "locale": "vn" // Optional: "vn" hoặc "en"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
    },
    "timestamp": "2025-10-31T10:00:00.000Z"
}
```

#### GET `/api/v1/payments/vnpay/return`

Xử lý return từ VNPay sau khi thanh toán

**Query Params:** Tất cả params từ VNPay (vnp_TmnCode, vnp_Amount, vnp_TransactionNo, v.v.)

**Response:**

```json
{
    "success": true,
    "data": {
        "isSuccess": true,
        "isVerified": true,
        "bookingId": "booking-uuid",
        "transactionNo": "14012345",
        "amount": 500000,
        "message": "Payment successful",
        "responseCode": "00"
    }
}
```

#### GET `/api/v1/payments/vnpay/ipn`

Xử lý IPN từ VNPay server (được gọi tự động bởi VNPay)

**Query Params:** Tất cả params từ VNPay

**Response:**

```json
{
    "RspCode": "00",
    "Message": "Success"
}
```

**Response Codes:**

-   `00` - Success
-   `01` - Booking not found
-   `02` - Payment already processed
-   `97` - Invalid signature
-   `99` - Unknown error

#### GET `/api/v1/payments/vnpay/status/:bookingId`

Lấy payment status của booking

**Response:**

```json
{
    "success": true,
    "data": {
        "bookingId": "booking-uuid",
        "referenceNumber": "SPAbooking-20251031-A1B2C3",
        "payments": [
            {
                "id": "payment-uuid",
                "amount": 500000,
                "status": "COMPLETED",
                "transactionId": "14012345"
            }
        ]
    }
}
```

### 3. VNPay Routes (`apps/backend/src/routes/vnpay.routes.ts`)

Định nghĩa tất cả VNPay routes và mount vào `/api/v1/payments/vnpay`

## 🎨 Cấu trúc Frontend

### 1. Booking API Service (`apps/frontend/src/services/bookingApi.ts`)

**Thêm các functions:**

```typescript
// Tạo VNPay payment URL
createVNPayPaymentUrl(request: VNPayPaymentUrlRequest): Promise<VNPayPaymentUrlResponse>

// Verify return URL từ VNPay
verifyVNPayReturn(query: Record<string, string>): Promise<VNPayReturnResult>

// Lấy payment status
getVNPayPaymentStatus(bookingId: string): Promise<any>
```

### 2. Booking Page (`apps/frontend/src/client/pages/BookingPage.tsx`)

**Cập nhật `handleSubmitBooking`:**

```typescript
// Sau khi tạo booking thành công
if (bookingData.paymentMethod === 'ATM') {
    // Tạo VNPay payment URL
    const vnpayResponse = await createVNPayPaymentUrl({
        bookingId: response.id,
        locale: 'vn',
    });

    // Redirect đến VNPay
    window.location.href = vnpayResponse.paymentUrl;
} else {
    // Các phương thức thanh toán khác
    toast.success('Đặt lịch thành công!');
}
```

### 3. Payment Result Page (`apps/frontend/src/client/pages/PaymentResult.tsx`)

Trang hiển thị kết quả thanh toán sau khi user quay lại từ VNPay.

**Route:** `/booking/payment-result`

**Features:**

-   Tự động verify payment với backend
-   Hiển thị trạng thái thanh toán (thành công/thất bại)
-   Hiển thị thông tin giao dịch
-   Nút quay về trang chủ hoặc xem chi tiết booking

## ⚙️ Cấu hình Environment Variables

### Backend (`.env`)

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code_here
VNPAY_SECRET_KEY=your_vnpay_secret_key_here
VNPAY_URL=https://sandbox.vnpayment.vn
VNPAY_RETURN_URL=http://localhost:5173/booking/payment-result
VNPAY_IPN_URL=http://localhost:5001/api/v1/payments/vnpay/ipn

# Frontend & Backend URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
```

**Lấy VNPay credentials:**

1. Đăng ký tài khoản tại [sandbox.vnpayment.vn](https://sandbox.vnpayment.vn)
2. Lấy `TMN_CODE` và `SECRET_KEY` từ dashboard
3. Cập nhật vào file `.env`

**Production URLs:**

-   `VNPAY_URL`: `https://vnpayment.vn` (production)
-   `VNPAY_RETURN_URL`: URL frontend production
-   `VNPAY_IPN_URL`: URL backend production

## 🧪 Testing

### Test với Sandbox VNPay

**Thẻ test:**

-   Ngân hàng: `NCB`
-   Số thẻ: `9704198526191432198`
-   Tên chủ thẻ: `NGUYEN VAN A`
-   Ngày phát hành: `07/15`
-   OTP: `123456`

### Test Flow:

1. Tạo booking với payment method = 'ATM'
2. Verify booking được tạo với payment status = 'PENDING'
3. Click thanh toán → redirect đến VNPay sandbox
4. Nhập thông tin thẻ test
5. Xác nhận thanh toán
6. Verify redirect về `/booking/payment-result` với query params
7. Verify payment status = 'COMPLETED' trong database
8. Verify IPN được gọi và xử lý đúng

## 📊 Database Schema

**Payment Model** đã có sẵn trong schema:

```prisma
model Payment {
  id            String        @id @default(uuid())
  bookingId     String
  amount        Decimal       @db.Decimal(10, 2)
  currency      String        @default("VND")
  paymentType   PaymentType   @default(ATM)
  status        PaymentStatus @default(PENDING)
  transactionId String?       @unique
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  booking       Booking       @relation(...)
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentType {
  ATM
  CLINIC
  WALLET
  CASH
  BANK_TRANSFER
}
```

## 🔐 Bảo mật

### Backend:

1. ✅ Verify signature từ VNPay (SHA512 HMAC)
2. ✅ Validate booking tồn tại trước khi tạo payment URL
3. ✅ Check payment đã được xử lý chưa (tránh duplicate)
4. ✅ Log tất cả transactions cho audit
5. ✅ Sử dụng HTTPS cho production
6. ✅ Secret key không expose ra frontend

### Frontend:

1. ✅ Không store sensitive data trong localStorage
2. ✅ Verify result với backend (không tin tưởng query params)
3. ✅ Redirect ngay sau khi tạo payment URL
4. ✅ Handle errors gracefully

## 🚀 Deployment Checklist

### Backend:

-   [ ] Cập nhật `VNPAY_TMN_CODE` production
-   [ ] Cập nhật `VNPAY_SECRET_KEY` production
-   [ ] Đổi `VNPAY_URL` sang `https://vnpayment.vn`
-   [ ] Cập nhật `VNPAY_RETURN_URL` với domain production
-   [ ] Cập nhật `VNPAY_IPN_URL` với domain production
-   [ ] Đảm bảo IPN URL accessible từ VNPay server
-   [ ] Enable HTTPS
-   [ ] Test thoroughly trên production

### Frontend:

-   [ ] Cập nhật API endpoints
-   [ ] Test payment flow
-   [ ] Test error handling
-   [ ] Test mobile responsiveness

## 📚 Tài liệu tham khảo

-   [VNPay Official Docs](https://sandbox.vnpayment.vn/apis/)
-   [vnpay npm package](https://www.npmjs.com/package/vnpay)
-   [vnpay.js.org](https://vnpay.js.org/)
-   [GitHub Repository](https://github.com/lehuygiang28/vnpay)

## 🐛 Troubleshooting

### Lỗi "Invalid signature"

-   Kiểm tra `VNPAY_SECRET_KEY` có đúng không
-   Kiểm tra order của query params
-   Kiểm tra hash algorithm (phải là SHA512)

### IPN không được gọi

-   Kiểm tra `VNPAY_IPN_URL` có accessible từ internet không
-   Kiểm tra firewall/security groups
-   Xem VNPay dashboard logs

### Payment không được cập nhật

-   Kiểm tra logs của IPN handler
-   Kiểm tra database connection
-   Kiểm tra bookingId có đúng không

### Redirect loop

-   Kiểm tra return URL có đúng không
-   Kiểm tra frontend routing
-   Clear browser cache

## 📞 Support

Nếu gặp vấn đề:

1. Check logs: Backend console + VNPay dashboard
2. Verify environment variables
3. Test với sandbox credentials
4. Check network requests (DevTools)
5. Đọc VNPay documentation

---

**Tích hợp hoàn tất! 🎉**

Giờ hệ thống booking đã hỗ trợ thanh toán online qua VNPay!
