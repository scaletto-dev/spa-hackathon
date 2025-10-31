# 🚀 VNPay Integration - Quick Setup Guide

## 📦 Cài đặt Package

Package `vnpay` đã được cài đặt cho backend:

```bash
cd apps/backend
npm install vnpay
```

## ⚙️ Cấu hình Environment Variables

### 1. Backend Configuration

Mở file `apps/backend/.env` và thêm:

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

### 2. Lấy VNPay Credentials (Sandbox)

1. Truy cập [https://sandbox.vnpayment.vn](https://sandbox.vnpayment.vn)
2. Đăng ký tài khoản (miễn phí)
3. Đăng nhập và vào Dashboard
4. Copy `TMN Code` và `Hash Secret`
5. Paste vào file `.env`:
    - `VNPAY_TMN_CODE` = TMN Code
    - `VNPAY_SECRET_KEY` = Hash Secret

**Sandbox Test Credentials (nếu chưa có tài khoản):**

```env
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_SECRET_KEY=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
```

## 🧪 Test Thanh Toán

### Thông tin thẻ test:

```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Test Flow:

1. **Start Backend:**

    ```bash
    cd apps/backend
    npm run dev
    ```

2. **Start Frontend:**

    ```bash
    cd apps/frontend
    npm run dev
    ```

3. **Tạo booking:**

    - Truy cập http://localhost:5173/booking
    - Chọn dịch vụ, chi nhánh, ngày giờ
    - Điền thông tin
    - **Chọn phương thức thanh toán: ATM/Internet Banking**
    - Click "Xác nhận đặt lịch"

4. **Thanh toán:**

    - Sẽ redirect đến trang VNPay sandbox
    - Chọn ngân hàng NCB
    - Nhập thông tin thẻ test (xem bên trên)
    - Nhập OTP: `123456`
    - Click Thanh toán

5. **Xác nhận:**
    - Sẽ redirect về `/booking/payment-result`
    - Xem kết quả thanh toán
    - Check database: payment status = `COMPLETED`

## 📂 Files Đã Thêm/Sửa

### Backend:

```
apps/backend/src/
├── services/
│   └── vnpay.service.ts          # NEW - VNPay service
├── controllers/
│   └── vnpay.controller.ts       # NEW - VNPay controller
├── routes/
│   ├── vnpay.routes.ts           # NEW - VNPay routes
│   └── payments.ts               # MODIFIED - Added VNPay routes
└── .env                          # MODIFIED - Added VNPay config
```

### Frontend:

```
apps/frontend/src/
├── services/
│   └── bookingApi.ts             # MODIFIED - Added VNPay APIs
├── client/pages/
│   ├── BookingPage.tsx           # MODIFIED - Added VNPay payment
│   └── PaymentResult.tsx         # NEW - Payment result page
└── routes/
    └── route-map.tsx             # MODIFIED - Added payment result route
```

## 🔍 Verify Installation

### 1. Check Backend Server Logs

Khi start backend, bạn sẽ thấy:

```
[INFO] VNPay Service initialized {
  testMode: true,
  returnUrl: 'http://localhost:5173/booking/payment-result',
  ipnUrl: 'http://localhost:5001/api/v1/payments/vnpay/ipn'
}
```

### 2. Test API Endpoints

#### Health Check:

```bash
curl http://localhost:5001/api/v1/payments/vnpay/status/test-booking-id
```

Response:

```json
{
    "success": false,
    "error": {
        "message": "Booking not found: test-booking-id"
    }
}
```

Nếu thấy response này = API đang chạy! ✅

## 🐛 Troubleshooting

### Lỗi: "VNPay configuration is missing"

**Nguyên nhân:** Chưa set environment variables

**Giải pháp:**

1. Kiểm tra file `.env` có các biến VNPay
2. Restart backend server
3. Check logs xem có message "VNPay Service initialized" không

### Lỗi: "Invalid signature"

**Nguyên nhân:** `VNPAY_SECRET_KEY` sai

**Giải pháp:**

1. Double check `VNPAY_SECRET_KEY` trong `.env`
2. Copy lại từ VNPay dashboard
3. Restart backend

### Payment không redirect về frontend

**Nguyên nhân:** `VNPAY_RETURN_URL` sai

**Giải pháp:**

1. Check `VNPAY_RETURN_URL` trong `.env`
2. Phải match với frontend URL + route `/booking/payment-result`
3. Development: `http://localhost:5173/booking/payment-result`

### IPN không được gọi

**Chú ý:** Trong môi trường local development, VNPay không thể gọi IPN URL (vì localhost không accessible từ internet)

**Giải pháp cho development:**

-   IPN sẽ chỉ work khi deploy lên server có public URL
-   Trong dev mode, rely on return URL verification

**Giải pháp cho testing IPN:**

1. Deploy lên server test (có public URL)
2. Hoặc dùng ngrok để expose local server
3. Cập nhật `VNPAY_IPN_URL` với public URL

## 🎯 Next Steps

### Sau khi test thành công:

1. **Tích hợp với UI/UX:**

    - Customize payment result page
    - Thêm loading states
    - Thêm error handling

2. **Production Setup:**

    - Đăng ký VNPay production account
    - Cập nhật production credentials
    - Đổi `VNPAY_URL` sang production
    - Test thoroughly trên production

3. **Monitoring:**

    - Setup logging cho transactions
    - Monitor payment success rate
    - Track IPN callbacks

4. **Features bổ sung:**
    - Refund functionality
    - Payment history page
    - Email notifications sau payment

## 📚 Documentation

Chi tiết về implementation, xem:

-   [VNPAY_INTEGRATION.md](./VNPAY_INTEGRATION.md) - Tài liệu chi tiết
-   [VNPay Official Docs](https://sandbox.vnpayment.vn/apis/)
-   [vnpay npm package](https://www.npmjs.com/package/vnpay)

## ✅ Checklist

-   [ ] Install `vnpay` package
-   [ ] Add environment variables
-   [ ] Get VNPay sandbox credentials
-   [ ] Test create booking with ATM payment
-   [ ] Test payment flow
-   [ ] Verify payment status updated
-   [ ] Check return URL works
-   [ ] Review implementation

---

**Setup complete! Giờ bạn có thể test VNPay payment! 🎉**
