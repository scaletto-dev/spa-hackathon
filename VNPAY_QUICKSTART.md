# ⚡ VNPay Quick Start - 5 phút để chạy

## 1️⃣ Cập nhật .env Backend (2 phút)

Mở file `apps/backend/.env` và thêm (hoặc sử dụng credentials test có sẵn):

```env
# VNPay Sandbox Test Credentials
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_SECRET_KEY=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn
VNPAY_RETURN_URL=http://localhost:5173/booking/payment-result
VNPAY_IPN_URL=http://localhost:5001/api/v1/payments/vnpay/ipn

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
```

## 2️⃣ Start Services (1 phút)

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

Đợi đến khi thấy:

-   Backend: `[INFO] VNPay Service initialized`
-   Frontend: `VITE ... ready in ... ms`

## 3️⃣ Test Payment (2 phút)

### Bước 1: Tạo booking

1. Mở http://localhost:5173/booking
2. Chọn dịch vụ → Chi nhánh → Ngày giờ
3. Điền thông tin cá nhân
4. **QUAN TRỌNG: Chọn "ATM/Internet Banking"**
5. Click "Xác nhận đặt lịch"

### Bước 2: Thanh toán tại VNPay

Bạn sẽ được redirect đến VNPay sandbox.

**Nhập thông tin thẻ test:**

```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456
```

### Bước 3: Xem kết quả

-   Sau khi thanh toán, redirect về `/booking/payment-result`
-   Kiểm tra:
    -   ✅ Status: "Thanh toán thành công"
    -   ✅ Mã giao dịch hiển thị
    -   ✅ Số tiền đúng
    -   ✅ Nút "Xem chi tiết đặt lịch"

## 🎉 Done!

Vậy là xong! VNPay đã hoạt động!

---

## 📚 Tài liệu đầy đủ

-   **[VNPAY_SUMMARY.md](./VNPAY_SUMMARY.md)** - Tổng quan những gì đã làm
-   **[VNPAY_SETUP.md](./VNPAY_SETUP.md)** - Hướng dẫn setup chi tiết
-   **[VNPAY_INTEGRATION.md](./VNPAY_INTEGRATION.md)** - Tài liệu kỹ thuật

## 🐛 Lỗi thường gặp

### "VNPay configuration is missing"

→ Chưa set environment variables trong `.env`  
→ Restart backend sau khi thêm

### Không redirect về payment result

→ Check `VNPAY_RETURN_URL` trong `.env`  
→ Phải là `http://localhost:5173/booking/payment-result`

### "Invalid signature"

→ `VNPAY_SECRET_KEY` sai  
→ Copy lại từ VNPay dashboard

---

**Need help?** Check [VNPAY_SETUP.md](./VNPAY_SETUP.md) Troubleshooting section
