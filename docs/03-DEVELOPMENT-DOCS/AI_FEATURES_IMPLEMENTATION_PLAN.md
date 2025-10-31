# ��� AI Features Implementation Plan

## Phân tích các tính năng AI hiện có và đề xuất triển khai

### ��� Tổng quan AI Service hiện tại

Backend đã có sẵn các AI methods:
- ✅ `chat()` - Chat với AI, function calling
- ✅ `analyzeSkin()` - Phân tích da
- ✅ `analyzeSentiment()` - Phân tích cảm xúc review
- ✅ `generateBlog()` - Tạo nội dung blog
- ✅ `generateSupportSuggestions()` - Gợi ý câu trả lời support

---

## ��� Các tính năng cần triển khai

### 1. ✨ AI Smart Time Slot Selection (Homepage + Booking Page)

**Vị trí:**
- Homepage: Checkbox "Để AI chọn giờ tốt nhất" ở Quick Booking
- Booking Page: Checkbox "Let AI choose the best available slot for me"

**Nghiệp vụ đề xuất:**
```
INPUT: Ngày đặt lịch, dịch vụ, chi nhánh
OUTPUT: Khung giờ tối ưu nhất

Thuật toán AI:
1. Phân tích lịch sử booking theo giờ
2. Kiểm tra tỷ lệ show-up rate theo time slot
3. Tính toán độ rảnh của therapist
4. Đánh giá trải nghiệm khách hàng (giờ không rush)
5. Xem xét yếu tố thời tiết/giao thông (nếu có API)

Ưu tiên:
- Giờ có tỷ lệ hủy lịch thấp
- Giờ không quá đông khách (trải nghiệm tốt hơn)
- Giờ có therapist giỏi available
```

**API mới cần tạo:**
```typescript
POST /api/v1/ai/suggest-timeslot
Body: {
  date: "2025-11-01",
  serviceIds: ["service-1"],
  branchId: "branch-1"
}
Response: {
  suggestedSlots: [
    { time: "14:00", score: 0.95, reason: "Low traffic, high therapist availability" },
    { time: "15:30", score: 0.88, reason: "Optimal customer satisfaction time" }
  ],
  bestSlot: "14:00"
}
```

---

### 2. ��� AI Demand Forecasting (Admin Appointments)

**Vị trí:** Admin → Appointments → Banner "Dự đoán AI"

**Nghiệp vụ đề xuất:**
```
INPUT: Dữ liệu lịch sử booking, ngày trong tuần, mùa, sự kiện
OUTPUT: Dự báo nhu cầu theo giờ

Thuật toán AI:
1. Phân tích pattern booking 30 ngày gần nhất
2. Nhận diện trend theo:
   - Ngày trong tuần (thứ 6-7 thường cao)
   - Giờ trong ngày (trưa, chiều, tối)
   - Mùa/tháng (trước Tết, Valentine, 8/3, 20/10)
3. Machine learning dự đoán với Gemini Pro
4. Gợi ý điều chỉnh nhân sự

Output mẫu:
"��� Dự kiến nhu cầu cao từ 15:00-17:00 hôm nay
��� Khuyến nghị: Bố trí thêm 2 therapist
��� Độ tin cậy: 87%"
```

**API mới cần tạo:**
```typescript
GET /api/v1/ai/demand-forecast?date=2025-11-01
Response: {
  forecast: {
    peakHours: ["15:00-17:00"],
    expectedBookings: 45,
    staffRecommendation: 8,
    confidence: 0.87
  },
  insights: [
    "Thứ 6 thường có nhu cầu cao hơn 35%",
    "Thời tiết đẹp dự kiến tăng lượt booking"
  ]
}
```

---

### 3. ✍️ AI Service Description Generator (Admin Services)

**Vị trí:** Admin → Services → "Dùng thử AI Writer"

**Nghiệp vụ đề xuất:**
```
INPUT: Tên dịch vụ, loại dịch vụ, giá, thời gian
OUTPUT: Mô tả hấp dẫn, SEO-friendly

Thuật toán AI:
1. Phân tích các dịch vụ tương tự
2. Sử dụng Gemini Pro generate description
3. Tối ưu SEO keywords
4. Thêm benefits, selling points
5. Multiple variations để chọn
```

**API đã có sẵn:** `generateBlog()` - Có thể tái sử dụng!

**API mới cần tạo (hoặc extend):**
```typescript
POST /api/v1/ai/generate-service-description
Body: {
  serviceName: "HydraFacial Premium",
  category: "Facial Treatment",
  price: 2500000,
  duration: 90
}
Response: {
  variations: [
    {
      description: "...",
      longDescription: "...",
      excerpt: "...",
      benefits: ["..."]
    }
  ]
}
```

---

### 4. ��� AI Customer Insights (Admin Customers)

**Vị trí:** Admin → Customers → "Thông tin AI"

**Nghiệp vụ đề xuất:**
```
INPUT: Dữ liệu khách hàng (lịch sử booking, chi tiêu, frequency)
OUTPUT: Insights và dự đoán behavior

Thuật toán AI:
1. Phân loại khách hàng (segments)
   - VIP: 10+ visits, >10M/năm
   - Regular: 5-10 visits
   - New: <5 visits
2. Dự đoán churn risk
3. Gợi ý upsell/cross-sell
4. Tính Customer Lifetime Value (CLV)

Output mẫu:
"��� Khách hàng VIP tiềm năng
��� CLV dự kiến: 15,000,000 VNĐ
��� Churn risk: Thấp (12%)
��� Gợi ý: Giới thiệu gói Premium Membership"
```

**API mới cần tạo:**
```typescript
GET /api/v1/ai/customer-insights?timeRange=30d
Response: {
  segments: {
    vip: { count: 45, avgSpending: 8500000 },
    regular: { count: 120, avgSpending: 3200000 }
  },
  insights: [
    "Khách >5 lượt thăm có xu hướng dùng dịch vụ cao cấp hơn",
    "Tỷ lệ giữ chân: 88%"
  ],
  recommendations: [...]
}
```

---

### 5. ��� AI Sentiment Analysis Dashboard (Admin Reviews)

**Vị trí:** Admin → Reviews → "AI Sentiment Analysis"

**Nghiệp vụ đã có:** ✅ `analyzeSentiment()` method đã có sẵn!

**Cần thêm:**
```typescript
GET /api/v1/ai/sentiment-summary?period=month
Response: {
  overall: {
    sentiment: "positive",
    score: 0.85,
    change: "+12%"
  },
  avgRating: 4.7,
  breakdown: {
    service: 0.92,
    staff: 0.88,
    cleanliness: 0.90
  },
  trends: [
    "Sentiment tăng mạnh trong 30 ngày qua",
    "Staff service được đánh giá cao nhất"
  ]
}
```

---

### 6. ��� AI Blog Content Generator (Admin Blog)

**Vị trí:** Admin → Blog → Modal "Tạo bằng AI"

**Nghiệp vụ đã có:** ✅ `generateBlog()` method đã có sẵn!

**Cải thiện UX:**
```typescript
// Modal workflow:
1. Nhập topic: "Cách chăm sóc da mùa hè"
2. Chọn keywords: "skincare, summer, UV protection"
3. Chọn tone: Professional / Friendly / Educational
4. AI generate 3 variations
5. Edit và publish
```

---

## �� Ưu tiên triển khai (Priority)

### Phase 1 - Quick Wins (Đã có API sẵn) ⚡
1. **AI Blog Generator** - Đã có `generateBlog()`, chỉ cần làm UI
2. **AI Sentiment Analysis** - Đã có `analyzeSentiment()`, tạo summary API

### Phase 2 - High Value Features ���
3. **AI Smart Time Slot** - Tăng conversion rate booking
4. **AI Service Description** - Reuse `generateBlog()` logic

### Phase 3 - Advanced Analytics ���
5. **AI Demand Forecasting** - Cần nhiều data training
6. **AI Customer Insights** - Cần phân tích data phức tạp

---

## ��� Implementation Checklist

### Backend Tasks
```bash
# 1. Tạo AI endpoints mới
apps/backend/src/routes/ai.ts
apps/backend/src/controllers/ai.controller.ts

# 2. Extend AI Service
apps/backend/src/services/ai.service.ts
- suggestTimeSlot()
- forecastDemand()
- generateServiceDescription()
- getCustomerInsights()
- getSentimentSummary()

# 3. Tạo helper functions
apps/backend/src/utils/ai-helpers.ts
- analyzeBookingPatterns()
- calculateCustomerMetrics()
```

### Frontend Tasks
```bash
# 1. Smart Time Slot Component
apps/frontend/src/client/components/booking/AITimeSlotSelector.tsx

# 2. Admin Dashboard Widgets
apps/frontend/src/admin/components/ai/
- DemandForecastWidget.tsx
- SentimentDashboard.tsx
- CustomerInsightsWidget.tsx

# 3. AI Service Description Modal
apps/frontend/src/admin/components/services/AIDescriptionGenerator.tsx

# 4. AI Blog Generator Enhanced
apps/frontend/src/admin/components/blog/AIBlogGenerator.tsx
```

### API Integration
```typescript
// apps/frontend/src/services/aiApi.ts
export const aiApi = {
  suggestTimeSlot: (data) => axios.post('/api/v1/ai/suggest-timeslot', data),
  forecastDemand: (date) => axios.get(`/api/v1/ai/demand-forecast?date=${date}`),
  generateServiceDesc: (data) => axios.post('/api/v1/ai/generate-service-description', data),
  getCustomerInsights: (period) => axios.get(`/api/v1/ai/customer-insights?period=${period}`),
  getSentimentSummary: (period) => axios.get(`/api/v1/ai/sentiment-summary?period=${period}`),
  generateBlogContent: (data) => axios.post('/api/v1/ai/generate-blog', data),
};
```

---

## ��� UI/UX Guidelines

### Smart Time Slot Selector
```jsx
<div className="ai-timeslot-banner">
  <Sparkles icon />
  <Checkbox>Let AI choose the best time for you</Checkbox>
  {aiSelected && (
    <AIResult>
      ✨ AI suggests: 14:00 - 14:30
      ��� Reason: Best therapist availability, low traffic
      Confidence: 92%
    </AIResult>
  )}
</div>
```

### Admin Demand Forecast
```jsx
<DashboardCard>
  <BrainIcon />
  <h3>AI Demand Forecast</h3>
  <Chart data={forecast} />
  <Insights>
    ��� Peak hours: 15:00-17:00
    ��� Recommended staff: 8 therapists
    ��� Confidence: 87%
  </Insights>
</DashboardCard>
```

---

## ��� Giá trị kinh doanh (Business Value)

1. **AI Time Slot** → Tăng 15-20% conversion rate
2. **Demand Forecast** → Tối ưu chi phí nhân sự 10-15%
3. **Service Description** → Tiết kiệm 80% thời gian viết content
4. **Customer Insights** → Tăng 25% retention rate
5. **Sentiment Analysis** → Phản ứng nhanh với negative feedback
6. **Blog Generator** → Tăng 5x tốc độ ra content marketing

---

## ��� Security & Privacy

- ✅ Không lưu trữ PII data khi gọi Gemini API
- ✅ Encrypt sensitive customer insights
- ✅ Rate limiting cho AI endpoints
- ✅ Caching kết quả để giảm API calls
- ✅ Fallback khi AI service down

---

## ��� Monitoring & Analytics

Track metrics:
- AI suggestion acceptance rate
- Time saved using AI features
- Accuracy of predictions
- User satisfaction scores
- API response times
- Cost per AI request

---

## ��� Next Steps

1. **Review & Approve** kế hoạch này
2. **Start with Phase 1** (Blog + Sentiment - đã có API)
3. **Design mockups** cho các AI features
4. **Implement backend endpoints** cho Phase 2
5. **Build frontend components** progressively
6. **Test & iterate** based on user feedback

---

**Prepared by:** AI Development Team  
**Date:** October 31, 2025  
**Status:** Awaiting approval for implementation
