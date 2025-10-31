# ~~~~ Setup Guide - Beauty Clinic Care Website

**Project:** Beauty Clinic Care Website
**Type:** Monorepo Fullstack Application
**Date:** October 31, 2025

---

## Quick Navigation

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running](#running)
- [Troubleshooting](#troubleshooting)

---

## Overview

Beauty Clinic Care Website - Spa booking platform với React + Node.js

**Tech Stack:**

- Frontend: React 18 + Vite + TypeScript + Tailwind
- Backend: Node.js + Express + Prisma + PostgreSQL
- Database: Supabase (PostgreSQL)
- AI: Google Gemini
- Payment: VNPay

**Ports:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## ✅ Prerequisites

```bash
node -v   # v20.x required
npm -v    # v10.x required
git --version
```

---

## 📦 Installation

**Source code đã bao gồm:**

- ✅ Tất cả dependencies trong package.json
- ✅ Environment files đã cấu hình sẵn (.env, .env.local)
- ✅ Database migrations và seed data
- ✅ Prisma schemas

### Cài đặt

```bash
# Giải nén source code (nếu nhận file .zip)
unzip spa-hackathon.zip
cd spa-hackathon

# Hoặc clone từ GitHub
git clone https://github.com/scaletto-dev/spa-hackathon.git
cd spa-hackathon

# Install tất cả dependencies
npm install

npx prisma db pull --schema=apps/backend/src/prisma/schema.prisma

npx prisma generate --schema=apps/backend/src/prisma/schema.prisma
```

**Note!!!!:**

For corporate networks, if you see a “database connection failed” message, enable Cloudflare DNS (1.1.1.1).

---

## 👤 Demo Credentials

### Tài khoản có sẵn

```
Admin:
Email: doanhaiduydev@gmail.com
Password: haiduy10

Member:
Email: getsdtfree4@gmail.com
Password: baolol123
```

## 🔧 Environment Setup (Đã cấu hình sẵn)

**✅ Đã cấu hình sẵn** - Các file environment đã được cấu hình sẵn trong source code:

- `/.env` - Root configuration
- `/apps/backend/.env` - Backend configuration
- `/apps/frontend/.env.local` - Frontend configuration

**Không cần copy hay tạo file env mới** - Chỉ cần chạy `npm install` là có thể sử dụng ngay.

### Environment Files Included

#### Root .env (/.env)

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=your-email@example.com
CONTACT_NOTIFICATION_EMAIL=admin@example.com

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Backend Configuration
PORT=3000

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/booking/payment-result
VNPAY_IPN_URL=http://localhost:3000/api/v1/payments/vnpay/ipn

# Frontend URL
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

#### Backend .env (apps/backend/.env)

```env
# Environment
NODE_ENV=development

# Server
PORT=3000

# Gemini AI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.0-flash

# Database (Add your Supabase credentials here)
DATABASE_URL=your_database_url_here

# JWT (Add your secret here)
JWT_SECRET=your_jwt_secret_here

# Supabase (Add your credentials here)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code_here
VNPAY_SECRET_KEY=your_vnpay_secret_key_here
VNPAY_URL=https://sandbox.vnpayment.vn
VNPAY_RETURN_URL=http://localhost:5173/booking/payment-result
VNPAY_IPN_URL=http://localhost:5001/api/v1/payments/vnpay/ipn

# Frontend URL
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
```

#### Frontend .env (apps/frontend/.env.local)

```env
# Google Sign-In Configuration
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Admin Google Sign-In: Whitelist email domains (comma-separated)
VITE_GOOGLE_ALLOWED_DOMAINS=gmail.com,yourcompany.com
```

---

## ️ Database Setup

### Create Supabase Project

1. Go to https://app.supabase.com
2. Create new project
3. Get credentials from Settings

### Run Migrations

```bash
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed data
npx prisma db seed
```

**Expected:** 13 tables created with sample data

---

## ▶️ Running

### Option 1: Run Both (Recommended)

```bash
# From root
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend:**

```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd apps/frontend
npm run dev
```

### Verify

```bash
# Backend health
curl http://localhost:3000/api/health

# Frontend
open http://localhost:5173
```

---

## Troubleshooting

### Port in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env
PORT=3001
```

### Database error

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev
```

### Module not found

```bash
rm -rf node_modules
npm install
npx prisma generate
```

---

## ✅ Verification

- [ ] Backend: http://localhost:3000/api/health returns OK
- [ ] Frontend: http://localhost:5173 loads
- [ ] Services: http://localhost:5173/services shows list
- [ ] Booking: Can complete 6-step booking
- [ ] Admin: http://localhost:5173/admin accessible

---

### Thẻ Test VNPay (Sandbox)

```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### 🌟 Khuyến nghị: Đăng ký tài khoản mới

**Để trải nghiệm đầy đủ tính năng:**

- ✅ Nhận email xác nhận booking
- ✅ Nhận email thông báo thanh toán
- ✅ Test full booking flow với email thật

**Cách đăng ký:**

1. Truy cập http://localhost:5173/register
2. Đăng ký với email thật của bạn

---

**Ready for Evaluation ✅**
