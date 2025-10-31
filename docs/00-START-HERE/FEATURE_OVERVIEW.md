#  Beauty Clinic Care Website - Feature Overview

**Dự án:** Beauty Clinic Care Website  
**Hackathon:** EES AI Hackathon 2025  
**Ngày:** October 31, 2025  

---

##  Giới thiệu tổng quan

**Beauty Clinic Care Website** là hệ thống đặt lịch chăm sóc da thông minh, tích hợp AI toàn diện trong tư vấn khách hàng, phân tích dữ liệu và tự động hóa vận hành spa. Website mang đến trải nghiệm đặt lịch trực quan 6 bước, chatbot AI tư vấn 24/7, và công cụ quản trị mạnh mẽ cho admin.

**Công nghệ chính:**
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **AI Engine:** Google Gemini (1.5 Flash & Pro)
- **Payment:** VNPay Integration
- **Real-time:** Socket.IO

**Deployment:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

##  Danh mục chức năng chính

### ‍ Client Portal (Khách hàng)

| Nhóm | Chức năng chính | Mô tả chi tiết | AI Integration |
|------|------------------|----------------|----------------|
| ** Homepage** | Banner + Services + CTA | Hero section với giới thiệu spa, danh sách dịch vụ nổi bật, call-to-action "Đặt lịch ngay" | ❌ |
| ** Services Menu** | Danh sách + Filter + Detail | Grid dịch vụ với filter theo danh mục (Facial, Body, Massage), trang chi tiết liệu trình, giá, thời lượng, lợi ích | ❌ |
| ** Booking System** | Wizard 6 bước | **Bước 1:** Chọn dịch vụ<br>**Bước 2:** Chọn chi nhánh<br>**Bước 3:** Chọn ngày & giờ<br>**Bước 4:** Nhập thông tin (guest/member)<br>**Bước 5:** Chọn thanh toán<br>**Bước 6:** Xác nhận & email | ✅ AI Smart Suggestions |
| ** Membership** | Đăng ký + Đăng nhập + Profile | Supabase Auth (Google OAuth + OTP), quản lý hồ sơ cá nhân, lịch sử booking, điểm tích lũy | ❌ |
| ** Branches** | Danh sách + Maps | Hiển thị 3+ chi nhánh với địa chỉ, giờ mở cửa, Google Maps tích hợp, hỗ trợ tìm đường | ❌ |
| ** Reviews & Feedback** | Viết review + Rating | Khách hàng đánh giá dịch vụ sau khi hoàn thành, rating 5 sao, kèm comment | ✅ AI Sentiment Analysis |
| ** Blog/News** | Tin tức làm đẹp | Bài viết về chăm sóc da, xu hướng làm đẹp, hướng dẫn sử dụng sản phẩm | ✅ AI Blog Generator |
| ** Contact** | Form + Map + Info | Form liên hệ, bản đồ chi nhánh chính, hotline, email, social media links | ❌ |
| ** Multilingual** | Đa ngôn ngữ | 2 ngôn ngữ: Tiếng Việt , English . Auto-detect browser language, persistent selection | ❌ |
| ** Live Chat** | Chatbot + Live Support | Chatbot AI trả lời FAQ, tư vấn dịch vụ, hỗ trợ đặt lịch. Có thể chuyển sang nhân viên thật nếu cần | ✅ Gemini Chatbot |

---

### ‍ Admin Portal (Quản trị viên)

| Module | Mô tả chức năng | Features chính | AI Integration |
|---------|-----------------|----------------|----------------|
| ** Dashboard** | Tổng quan hệ thống | - Thống kê doanh thu (ngày/tuần/tháng)<br>- Biểu đồ booking trends (Recharts)<br>- Top services, branches, customers<br>- KPI cards (tổng đặt lịch, doanh thu, review trung bình) | ✅ AI Insights & Predictions |
| ** Appointments** | Quản lý lịch hẹn | - CRUD appointments (Create, Read, Update, Delete)<br>- Filter theo status (Pending, Confirmed, Completed, Cancelled)<br>- Calendar view<br>- Cập nhật trạng thái booking<br>- Tìm kiếm theo khách hàng, dịch vụ, chi nhánh | ❌ |
| ** Services** | Quản lý dịch vụ | - CRUD services & categories<br>- Upload ảnh dịch vụ (Supabase Storage)<br>- Quản lý giá, thời lượng, mô tả<br>- Toggle featured/active<br>- Sắp xếp display order | ❌ |
| ** Branches** | Quản lý chi nhánh | - CRUD branches<br>- Thiết lập giờ hoạt động<br>- Google Maps integration<br>- Latitude/longitude cho navigation<br>- Quản lý hình ảnh chi nhánh | ❌ |
| ** Customers** | Quản lý khách hàng | - Danh sách customers với filter<br>- Xem lịch sử booking<br>- Tạo customer mới (manual)<br>- Verify email<br>- Export customer list | ❌ |
| **‍ Staff** | Quản lý nhân viên | - CRUD staff members<br>- Phân công ca làm việc<br>- Filter theo chi nhánh<br>- Quản lý vai trò (Therapist, Receptionist, Manager)<br>- Tracking performance | ❌ |
| ** Payments** | Quản lý thanh toán | - Danh sách transactions<br>- Filter theo trạng thái (Completed, Pending, Failed)<br>- VNPay transaction tracking<br>- Export payment report (CSV)<br>- Refund handling | ❌ |
| ** Blog CMS** | Quản lý nội dung | - CRUD blog posts<br>- Rich text editor<br>- Upload featured image<br>- Publish/unpublish<br>- Category management<br>- SEO metadata | ✅ AI Blog Generator |
| **⭐ Reviews** | Quản lý đánh giá | - Duyệt review (Approve/Reject)<br>- Trả lời review của khách<br>- Xem sentiment score<br>- Filter theo rating, service<br>- Hide inappropriate reviews | ✅ AI Sentiment Analysis |
| ** Contacts** | Quản lý liên hệ | - Xem contact form submissions<br>- Cập nhật status (New, In Progress, Resolved)<br>- Thêm notes nội bộ<br>- Email templates trả lời | ❌ |
| **⚙️ Settings** | Cấu hình hệ thống | - Profile admin<br>- API keys management (Gemini, VNPay)<br>- Theme settings<br>- Email templates<br>- Security settings | ❌ |

---

##  AI-POWERED FEATURES

### 1.  AI Chatbot (Gemini)
**Mô tả:** Trợ lý ảo tư vấn 24/7, trả lời câu hỏi về dịch vụ, giá cả, chi nhánh, hỗ trợ đặt lịch.

**Công nghệ:** Google Gemini 1.5 Flash

**Tính năng:**
- ️ Trả lời FAQ tự động
-  Tư vấn dịch vụ phù hợp theo nhu cầu
-  Hỗ trợ đặt lịch (chuyển hướng đến booking wizard)
-  Context-aware conversation (nhớ lịch sử chat)
-  Multilingual support (Vietnamese & English)

**Use Cases:**
```
Khách: "Tôi muốn trị mụn, có dịch vụ nào?"
Bot: "Chúng tôi có Anti-Acne Facial (450,000đ) - Điều trị mụn sâu"

Khách: "Chi phí bao nhiêu?"
Bot: "Dịch vụ Anti-Acne Facial có giá 450,000 VNĐ"

Khách: "Đặt lịch thế nào?"
Bot: "Hãy click vào đây để chọn chi nhánh: [Link Booking]"
```

---

### 2.  Skin Analysis (AI Phân tích da)
**Mô tả:** Quiz 5-7 câu hỏi về loại da, tình trạng da, mối quan tâm. AI phân tích và trả về JSON khuyến nghị dịch vụ phù hợp.

**Công nghệ:** Gemini 1.5 Flash (Structured Output)

**Input Quiz:**
```javascript
{
  "skinType": "Oily",
  "concerns": ["Acne", "Dark Spots"],
  "age": 25,
  "skincare_routine": "Basic",
  "budget": "Medium"
}
```

**Output JSON:**
```json
{
  "skin_analysis": {
    "type": "Oily, Acne-prone",
    "concerns": ["Active acne", "Post-inflammatory hyperpigmentation"],
    "severity": "Moderate"
  },
  "recommendations": [
    {
      "service_id": "anti-acne-facial",
      "service_name": "Anti-Acne Treatment",
      "reason": "Targets active breakouts and oil control",
      "priority": "High",
      "frequency": "2 times/month"
    }
  ],
  "skincare_tips": [
    "Use oil-free cleanser twice daily",
    "Apply sunscreen SPF 50+",
    "Avoid touching face frequently"
  ]
}
```

---

### 3. ✍️ Blog Auto-Generator
**Mô tả:** Admin nhập topic + keywords, AI tự động sinh bài viết blog hoàn chỉnh (tiêu đề, excerpt, nội dung SEO-ready).

**Công nghệ:** Gemini 1.5 Pro

**Input:**
```javascript
{
  "topic": "Cách chăm sóc da mùa hè",
  "keywords": ["chống nắng", "dưỡng ẩm", "làm sạch da"],
  "tone": "Friendly, Professional",
  "length": "800-1000 words"
}
```

**Output:**
- Bài viết 1000 từ với heading, subheading
- SEO-optimized content
- Call-to-action cuối bài
- Thời gian tạo: ~10 giây

---

### 4.  Sentiment Analysis
**Mô tả:** Phân tích cảm xúc trong đánh giá khách hàng (Positive, Neutral, Negative) kèm điểm số 0-100.

**Công nghệ:** Gemini 1.5 Flash

**Input:**
```
"Dịch vụ tuyệt vời! Nhân viên thân thiện, da sáng hẳn lên!"
```

**Output:**
```json
{
  "sentiment": "Positive",
  "score": 95,
  "key_phrases": ["tuyệt vời", "thân thiện", "sáng hẳn lên"],
  "emotions": ["Happy", "Satisfied"],
  "recommendation": "Feature this review"
}
```

---

### 5.  AI Insights (Admin Dashboard)
**Mô tả:** Tự động phân tích dữ liệu booking, doanh thu, review để đưa ra insights và gợi ý.

**Input Data:**
```javascript
{
  "period": "Last 30 days",
  "total_bookings": 450,
  "revenue": 125000000, // VND
  "top_services": ["Deep Cleansing Facial", "Swedish Massage"],
  "peak_hours": ["10AM-12PM", "2PM-4PM"],
  "avg_rating": 4.7
}
```

**Output Insights:**
```json
{
  "insights": [
    {
      "type": "Revenue Trend",
      "message": "Doanh thu tăng 15% so với tháng trước",
      "action": "Tăng cường marketing cho dịch vụ Facial"
    },
    {
      "type": "Peak Hours",
      "message": "Khung 10AM-12PM luôn full. Khung 4PM-6PM còn trống",
      "action": "Chạy khuyến mãi giờ vắng"
    }
  ],
  "predictions": [
    "Dự báo doanh thu tháng tới: 135M VND (+8%)"
  ]
}
```

---

### 6.  Smart Booking Suggestions
**Mô tả:** Gợi ý khung giờ trống tối ưu dựa trên lịch nhân viên, phòng, và lịch sử booking.

**Status:**  Work in Progress

---

### 7. ️ Multilingual AI Translation
**Mô tả:** Tự động dịch nội dung động (review, blog) giữa 2 ngôn ngữ.

**Công nghệ:** i18next + Gemini Translate API

**Example:**
```
Input (vi): "Làn da sáng hẳn lên sau Deep Cleansing"
Output (en): "My skin became noticeably brighter after Deep Cleansing"
```

---

##  Authentication & Authorization

### Authentication Methods
- **Email + Password:** Standard login với bcrypt hashing
- **Google OAuth:** Supabase Auth (1-click sign-in)
- **OTP Email:** Passwordless login (6 digits)
- **JWT Tokens:** Access + refresh tokens

### Authorization Levels
| Role | Access | Permissions |
|------|--------|-------------|
| **Guest** | Public pages | View services, branches, blog |
| **Member** | Client portal | Book appointments, manage profile |
| **Admin** | Admin portal | Full CRUD, analytics, settings |
| **Staff** | Limited admin | Manage appointments, customers |

---

##  Payment Integration

### VNPay Gateway
**Supported Methods:**
1.  Credit/Debit Card (Visa, Mastercard, JCB)
2.  E-Wallet (Momo, ZaloPay, ViettelPay)
3.  Bank Transfer (24 ngân hàng)
4.  Pay at Clinic (Thanh toán trực tiếp)

### Payment Flow
```
1. Chọn dịch vụ → Booking wizard
2. Bước 5: Chọn phương thức thanh toán
3. Redirect to VNPay → Xác thực
4. Thanh toán → Callback về website
5. Cập nhật status → Gửi email xác nhận
```

---

##  Infrastructure & Development

### Monorepo Structure
```
spa-hackathon/
├── apps/
│   ├── frontend/    # React 18 + Vite
│   └── backend/     # Node.js + Express
├── docs/            # Documentation
└── package.json     # Workspace config
```

### Tech Stack
**Frontend:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion  
**Backend:** Node.js, Express, Prisma, PostgreSQL, Redis  
**AI:** Google Gemini (1.5 Flash & Pro)  
**Payment:** VNPay  
**Real-time:** Socket.IO  

---

##  Key Highlights

### 1.  AI Integration (7 Features)
✅ Chatbot, Skin Analysis, Blog Generator, Sentiment, Insights, Smart Booking, Translation

### 2.  Modern UX/UI
Framer Motion animations, Glass morphism, Responsive design

### 3.  Performance
Code splitting, Lazy loading, Redis cache, Bundle < 500KB

### 4.  Security
JWT auth, RBAC, SQL injection prevention, XSS protection

### 5.  Admin Power
Real-time analytics, Charts, Export reports, AI insights

---

##  Demo Scenarios

### Scenario 1: Khách mới đặt lịch
```
1. Homepage → "Đặt lịch ngay"
2. Chọn "Deep Cleansing Facial"
3. Chọn chi nhánh Hà Nội
4. Chọn 15/11/2025, 10:30 AM
5. Nhập thông tin
6. Thanh toán VNPay
7. Nhận email xác nhận
```

### Scenario 2: Chatbot tư vấn
```
: "Tôi muốn trị mụn"
: "Chúng tôi có Anti-Acne Treatment (450,000đ)"
: "Đặt lịch"
: "Click đây: [Link Booking]"
```

### Scenario 3: Admin phân tích
```
1. Admin login → Dashboard
2. Xem biểu đồ: +15% doanh thu
3. AI Insights: "Facial đang hot, tăng slots"
4. Export CSV report
```

---

##  Tổng kết

> **Beauty Clinic Care Website** là hệ thống spa thông minh với **7 tính năng AI** tự động hóa từ tư vấn (chatbot), phân tích da, tạo nội dung, đến insights kinh doanh.

**Mục tiêu:**
- ✅ Trải nghiệm đặt lịch nhanh (6-step wizard)
- ✅ Tự động hóa chăm sóc khách (chatbot 24/7)
- ✅ Cá nhân hóa dịch vụ (AI skin analysis)
- ✅ Quyết định dựa trên dữ liệu (AI insights)
- ✅ Đa ngôn ngữ (Vietnamese & English)

**Competitive Advantages:**
1.  AI-First: 7 features with Google Gemini integration
2.  Modern UX: Framer Motion, Glass morphism
3. ️ Production-Ready: TypeScript, Docker, Redis
4.  Excellent Docs: Comprehensive documentation
5.  Performance: < 500KB bundle size

---

**Status:** ✅ READY FOR HACKATHON  
**Team:** scaletto-dev  

*Tài liệu cho EES AI Hackathon 2025*
