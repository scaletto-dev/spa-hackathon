# AI Features Specification - Backend Implementation Guide

**Document Version**: 1.0.0  
**Last Updated**: October 30, 2025  
**Target**: Backend Development Team

---

## ��� Overview

This document outlines **8 AI-powered features** that have UI implementations in the frontend and require backend API development. Each feature includes detailed API specifications, request/response schemas, authentication requirements, and implementation priorities.

---

## ��� Quick Summary

| #   | Feature                           | Priority   | Complexity | Estimated Dev Time |
| --- | --------------------------------- | ---------- | ---------- | ------------------ |
| 1   | Global Chat Widget (AI Assistant) | ��� HIGH   | Medium     | 3-5 days           |
| 2   | Skin Analysis Quiz                | ��� HIGH   | Medium     | 2-3 days           |
| 3   | Admin Dashboard AI Insights       | ��� MEDIUM | Medium     | 3-4 days           |
| 4   | Admin Contextual AI Tips          | ��� LOW    | Low        | 1-2 days           |
| 5   | AI Blog Content Generator         | ��� MEDIUM | High       | 4-6 days           |
| 6   | Contact Form Smart Categorization | ��� LOW    | Low        | 1-2 days           |
| 7   | Review Sentiment Analysis         | ��� MEDIUM | Medium     | 2-3 days           |
| 8   | Live Chat with Staff (NEW)        | ��� HIGH   | High       | 5-7 days           |

**Total Estimated Time**: 21-32 days (3-4 sprint cycles)

---

## 1️⃣ GLOBAL CHAT WIDGET (AI ASSISTANT)

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/client/components/GlobalChatWidget.tsx`
-   **Status**: ✅ UI Complete, Mock responses only
-   **Current Handler**: `getBotResponse()` function with hardcoded rules

### ��� UI Features

-   Floating chat button (bottom-right corner)
-   Chat window with message history
-   Text input with send button
-   Promotional hint bubble
-   Auto-scroll, keyboard shortcuts (ESC to close)

### ��� API Endpoint

#### **POST** `/api/v1/ai/chat`

**Authentication**: Optional (enhanced experience for logged-in users)

**Request Body**:

```json
{
    "message": "string (required, max 500 chars)",
    "sessionId": "string (optional, UUID)",
    "context": {
        "currentPage": "string (optional, e.g., 'services', 'booking')",
        "userId": "string (optional, if authenticated)",
        "previousMessages": ["string (optional, last 5 messages for context)"]
    }
}
```

**Response**:

```json
{
  "reply": "string",
  "suggestions": [
    "string (quick reply suggestions, max 3)"
  ],
  "sessionId": "string (UUID, return same or create new)",
  "actions": [
    {
      "type": "navigate|book|call",
      "label": "string",
      "url": "string (optional)",
      "data": {} (optional)
    }
  ],
  "metadata": {
    "responseTime": "number (ms)",
    "confidence": "number (0-1)",
    "fallbackUsed": "boolean"
  }
}
```

**Error Responses**:

-   `400`: Invalid message format
-   `429`: Rate limit exceeded (max 20 messages/minute per session)
-   `500`: AI service unavailable

### ��� Intelligence Requirements

1. **Intent Recognition**:

    - Booking inquiries → Suggest `/booking` page
    - Pricing questions → Fetch from services database
    - Location/branch queries → Link to `/branches`
    - Skin analysis mentions → Redirect to `/quiz`
    - General questions → Use RAG (Retrieval Augmented Generation)

2. **Context Awareness**:

    - Track conversation history (Redis session store)
    - Remember user preferences if logged in
    - Detect page context for relevant responses

3. **Fallback Strategy**:
    - If confidence < 0.6 → "Let me connect you with a staff member"
    - Offer phone number: (555) 123-4567
    - Suggest popular help topics

### ��� Database Schema

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP NULL,
  message_count INTEGER DEFAULT 0,
  satisfaction_rating INTEGER NULL, -- 1-5 after session ends
  INDEX idx_user_sessions (user_id, started_at)
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  role ENUM('user', 'assistant', 'system'),
  content TEXT,
  metadata JSONB, -- stores intent, confidence, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_session_messages (session_id, created_at)
);
```

### ��� Tech Stack Recommendations

-   **AI Model**: OpenAI GPT-4-turbo or GPT-3.5-turbo
-   **Embeddings**: OpenAI text-embedding-3-small (for RAG)
-   **Vector Store**: Pinecone or PostgreSQL with pgvector
-   **Cache**: Redis (response caching for common queries)
-   **Rate Limiting**: Redis with sliding window

---

## 2️⃣ SKIN ANALYSIS QUIZ

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/client/pages/QuizPage.tsx`
-   **Status**: ✅ UI Complete, Mock recommendations
-   **Questions**: 5 questions with multiple-choice options

### ��� UI Features

-   Progress bar (Question X of 5)
-   Animated question transitions
-   Results page with recommended treatments
-   "Book Consultation" CTA
-   "Retake Quiz" option

### ��� API Endpoint

#### **POST** `/api/v1/ai/skin-analysis`

**Authentication**: Optional

**Request Body**:

```json
{
    "answers": [
        {
            "questionId": 1,
            "question": "What is your primary skin concern?",
            "answer": "Acne & Breakouts"
        },
        {
            "questionId": 2,
            "question": "What is your skin type?",
            "answer": "Oily"
        }
        // ... 3 more questions
    ],
    "userId": "string (optional, UUID)"
}
```

**Response**:

```json
{
    "analysisId": "string (UUID)",
    "analysis": {
        "skinType": "oily|dry|combination|normal|sensitive",
        "primaryConcern": "acne|aging|pigmentation|dryness|sensitivity",
        "secondaryConcerns": ["string"],
        "riskLevel": "low|medium|high",
        "ageGroup": "18-25|26-35|36-45|46-55|55+"
    },
    "recommendations": [
        {
            "serviceId": "string (UUID)",
            "serviceName": "Hydrafacial Treatment",
            "description": "string",
            "reason": "Excellent for oily skin with acne concerns",
            "priority": 1,
            "price": {
                "amount": 150,
                "currency": "USD"
            },
            "duration": "60 minutes",
            "imageUrl": "string (optional)"
        }
        // Top 4 recommendations
    ],
    "tips": [
        "Use gentle, non-comedogenic cleansers twice daily",
        "Apply sunscreen every morning (SPF 30+)",
        "Consider incorporating salicylic acid into your routine"
    ],
    "nextSteps": {
        "bookingUrl": "/booking?service=hydrafacial",
        "consultationRecommended": true
    }
}
```

### ��� Analysis Logic

1. **Question Scoring**:

    - Q1 (Concern) → Primary concern flag
    - Q2 (Skin Type) → Skin type classification
    - Q3 (Frequency) → Severity score (1-5)
    - Q4 (Age) → Age-appropriate treatments
    - Q5 (Goals) → Treatment priorities

2. **Recommendation Algorithm**:

    ```
    FOR each service IN services_database:
      score = 0
      IF service.targets_concern(primary_concern): score += 40
      IF service.suitable_for_skin_type(skin_type): score += 30
      IF service.age_appropriate(age_group): score += 20
      IF service.matches_goals(goals): score += 10

    RETURN top_4_services ORDER BY score DESC
    ```

3. **Personalization**:
    - If user logged in → Save analysis to profile
    - Track recommendations → Improve accuracy over time
    - A/B test different tip sets

### ��� Database Schema

```sql
CREATE TABLE skin_analyses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NULL,
  answers JSONB,
  analysis_result JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  booking_converted BOOLEAN DEFAULT FALSE,
  INDEX idx_user_analyses (user_id, created_at)
);
```

---

## 3️⃣ ADMIN DASHBOARD AI INSIGHTS

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/admin/components/dashboard/AIInsightsPanel.tsx`
-   **Status**: ✅ UI Complete, Hardcoded insights

### ��� UI Features

-   Gradient card with bot icon
-   3 insight cards with icons
-   Animated pulse indicator (live updates)
-   "View All Insights" button

### ��� API Endpoint

#### **GET** `/api/v1/admin/ai/insights`

**Authentication**: Required (Admin only)

**Query Parameters**:

-   `timeframe`: `today` | `week` | `month` (default: `today`)
-   `limit`: number (default: 3, max: 10)

**Response**:

```json
{
    "insights": [
        {
            "id": "string (UUID)",
            "type": "peak_hours|demand_prediction|trend|anomaly|recommendation",
            "icon": "TrendingUp|Clock|Users|AlertTriangle|Lightbulb",
            "color": "text-pink-500|text-purple-500|text-rose-500",
            "message": "Peak booking time: 10 AM – 12 PM (35% of daily bookings)",
            "confidence": 0.92,
            "actionable": true,
            "action": {
                "label": "Adjust staff schedule",
                "url": "/admin/staff/schedule",
                "type": "navigate"
            },
            "data": {
                "peakStart": "10:00",
                "peakEnd": "12:00",
                "bookingCount": 28
            },
            "createdAt": "2025-10-30T08:00:00Z"
        },
        {
            "type": "demand_prediction",
            "icon": "Clock",
            "color": "text-purple-500",
            "message": "High demand predicted for 3-5 PM today (15% above average)",
            "confidence": 0.85,
            "actionable": true,
            "action": {
                "label": "Add staff coverage",
                "url": "/admin/staff?highlight=afternoon"
            }
        },
        {
            "type": "trend",
            "icon": "Users",
            "color": "text-rose-500",
            "message": "15% increase in new member signups this week",
            "confidence": 1.0,
            "actionable": false
        }
    ],
    "generatedAt": "2025-10-30T08:30:00Z",
    "nextUpdate": "2025-10-30T09:00:00Z"
}
```

### ��� Insights Generation Logic

#### A. **Peak Hours Analysis**

```sql
-- Query last 30 days booking data
SELECT
  EXTRACT(HOUR FROM appointment_datetime) as hour,
  COUNT(*) as booking_count
FROM appointments
WHERE appointment_datetime >= NOW() - INTERVAL '30 days'
  AND status = 'confirmed'
GROUP BY hour
ORDER BY booking_count DESC
LIMIT 1;
```

#### B. **Demand Prediction**

-   Use Prophet or similar time-series forecasting
-   Factors: day of week, holidays, promotions, weather
-   Alert if predicted demand > 120% of average

#### C. **Trend Detection**

-   Compare current week vs. previous week
-   Significant change threshold: ±10%
-   Metrics: signups, bookings, revenue, reviews

#### D. **Anomaly Detection**

-   Flag unusual patterns (e.g., cancellation spike)
-   Booking drop > 30% compared to same day last week
-   Negative review clusters (3+ in 1 day)

### ��� Caching Strategy

-   Cache insights for 30 minutes
-   Invalidate on new booking/cancellation
-   Background job runs every 30 minutes

---

## 4️⃣ ADMIN CONTEXTUAL AI TIPS

### ��� Frontend Implementation

-   **Files**:
    -   `apps/frontend/src/admin/pages/Appointments.tsx` (AI Prediction)
    -   `apps/frontend/src/admin/pages/Staff.tsx` (AI Tip)
    -   `apps/frontend/src/admin/pages/Services.tsx` (AI Suggestion)
    -   `apps/frontend/src/admin/pages/Payments.tsx` (AI Alert)
    -   `apps/frontend/src/admin/pages/Customers.tsx` (AI Insight)

### ��� API Endpoint

#### **GET** `/api/v1/admin/ai/contextual-tips`

**Authentication**: Required (Admin only)

**Query Parameters**:

-   `page`: `appointments|staff|services|payments|customers` (required)

**Response**:

```json
{
    "tip": {
        "id": "string (UUID)",
        "type": "prediction|tip|suggestion|alert|insight",
        "message": "Thursday evenings have 40% no-show rate. Consider SMS reminders 24h before.",
        "severity": "info|warning|success|error",
        "icon": "Info|AlertTriangle|CheckCircle|XCircle",
        "cta": "Setup Reminder Automation",
        "action": {
            "type": "navigate|modal|external",
            "target": "/admin/settings/notifications"
        },
        "dismissable": true,
        "expiresAt": "2025-10-31T23:59:59Z"
    }
}
```

### ��� Context-Specific Tips

#### Appointments Page:

-   No-show predictions
-   Optimal slot recommendations
-   Booking pattern insights

#### Staff Page:

-   Utilization optimization
-   Skill gap recommendations
-   Performance insights

#### Services Page:

-   Low-performing service alerts
-   Pricing optimization
-   Description improvements

#### Payments Page:

-   Payment failure patterns
-   Revenue anomalies
-   Outstanding balance alerts

#### Customers Page:

-   Churn risk predictions
-   Upsell opportunities
-   Loyalty program suggestions

---

## 5️⃣ AI BLOG CONTENT GENERATOR

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/admin/pages/Blog.tsx`
-   **Status**: ✅ UI button ready, shows "Under development" toast

### ��� API Endpoint

#### **POST** `/api/v1/admin/ai/generate-blog`

**Authentication**: Required (Admin only)

**Request Body**:

```json
{
    "topic": "Hair Care Trends for 2025",
    "keywords": ["hair care", "trends", "styling", "treatments"],
    "tone": "professional|casual|friendly|expert",
    "length": "short|medium|long",
    "targetWordCount": 800,
    "includeImages": true,
    "language": "en|vi"
}
```

**Response**:

```json
{
    "post": {
        "title": "Top 10 Hair Care Trends to Watch in 2025",
        "slug": "top-10-hair-care-trends-2025",
        "excerpt": "Discover the cutting-edge hair care innovations and styling techniques that will dominate 2025...",
        "content": "<h2>Introduction</h2><p>...</p>",
        "metaDescription": "string",
        "wordCount": 823
    },
    "seo": {
        "keywords": ["hair care 2025", "hair trends", "styling techniques"],
        "readabilityScore": 75,
        "seoScore": 82
    },
    "suggestedCategories": ["Hair Care", "Trends"],
    "suggestedTags": ["2025 trends", "hair styling", "beauty innovation"],
    "imagePrompts": [
        "Modern hair salon with futuristic styling tools",
        "Close-up of healthy, shiny hair with advanced treatment"
    ],
    "generationTime": 3.2,
    "model": "gpt-4-turbo"
}
```

### ��� Generation Strategy

1. **Prompt Engineering**:

    ```
    You are a professional beauty industry content writer.
    Topic: {topic}
    Keywords: {keywords}
    Tone: {tone}
    Target audience: Beauty-conscious consumers aged 25-45

    Write a {length} blog post ({targetWordCount} words) that:
    - Hooks readers in the first paragraph
    - Uses subheadings (H2, H3)
    - Includes practical tips and examples
    - Ends with a clear CTA
    - Naturally incorporates keywords for SEO
    ```

2. **Post-Processing**:

    - HTML sanitization
    - SEO analysis (Yoast-style)
    - Readability check (Flesch-Kincaid)
    - Image placement suggestions

3. **Draft Status**:
    - All generated posts saved as DRAFT
    - Require admin review before publishing
    - Track generation metadata for quality improvement

---

## 6️⃣ CONTACT FORM SMART CATEGORIZATION

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/client/components/contact/ContactForm.tsx`
-   **Status**: ✅ UI Complete, Mock submission

### ��� API Endpoint

#### **POST** `/api/v1/contact`

**Authentication**: Optional

**Request Body**:

```json
{
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "0912345678",
    "serviceInterest": "facial",
    "message": "I'm interested in booking a HydraFacial for next week. Do you have availability on Thursday afternoon?"
}
```

**Response**:

```json
{
    "referenceNumber": "CNT-2025-001234",
    "submittedAt": "2025-10-30T10:15:00Z",
    "aiAnalysis": {
        "category": "booking",
        "subcategory": "appointment_inquiry",
        "priority": "high",
        "sentiment": "positive",
        "confidence": 0.94,
        "detectedIntent": "book_hydrafacial",
        "extractedInfo": {
            "serviceRequested": "HydraFacial",
            "preferredDate": "next Thursday",
            "preferredTime": "afternoon"
        },
        "suggestedService": {
            "id": "uuid",
            "name": "HydraFacial Treatment",
            "duration": "60 min",
            "price": 150
        },
        "autoReply": "Thank you for your interest in HydraFacial! We have availability on Thursday at 2 PM and 3:30 PM. Reply to this email or call us at (555) 123-4567 to confirm your preferred time.",
        "assignTo": "booking_team",
        "estimatedResponseTime": "Within 2 hours"
    },
    "nextSteps": [
        "Check your email for our response",
        "You can also call us at (555) 123-4567",
        "View available time slots: /booking"
    ]
}
```

### ��� Categorization Logic

```
CATEGORIES:
- booking → High priority, auto-suggest available slots
- question → Normal priority, knowledge base lookup
- complaint → High priority, escalate to manager
- feedback → Normal priority, sentiment analysis
- consultation → High priority, suggest services
- other → Review manually

PRIORITY RULES:
- "urgent", "asap", "immediately" → Priority = high
- Negative sentiment + complaint → Priority = high
- Question about specific service → Priority = normal
- General inquiry → Priority = low
```

### ��� Email Template

-   Send auto-reply email immediately
-   Include reference number
-   Suggest relevant services/articles
-   Provide estimated response time

---

## 7️⃣ REVIEW SENTIMENT ANALYSIS

### ��� Frontend Implementation

-   **File**: `apps/frontend/src/admin/pages/Reviews.tsx`
-   **Status**: ✅ UI mentions "AI Sentiment Analysis" (line 90)

### ��� API Endpoints

#### **GET** `/api/v1/admin/reviews/:reviewId/sentiment`

**Authentication**: Required (Admin only)

**Response**:

```json
{
    "reviewId": "uuid",
    "sentiment": "positive|negative|neutral|mixed",
    "score": 0.87,
    "confidence": 0.92,
    "emotions": {
        "joy": 0.75,
        "satisfaction": 0.82,
        "disappointment": 0.05,
        "anger": 0.02
    },
    "keyPhrases": ["excellent service", "very professional", "relaxing atmosphere"],
    "aspects": {
        "service_quality": { "sentiment": "positive", "score": 0.9 },
        "staff_friendliness": { "sentiment": "positive", "score": 0.85 },
        "facility_cleanliness": { "sentiment": "positive", "score": 0.88 },
        "value_for_money": { "sentiment": "neutral", "score": 0.6 }
    },
    "suggestedResponse": "Thank you so much for your wonderful feedback! We're thrilled to hear you enjoyed your experience with our team. We look forward to serving you again soon!",
    "actionItems": []
}
```

#### **POST** `/api/v1/admin/ai/analyze-reviews-batch`

**Request Body**:

```json
{
    "filters": {
        "dateRange": {
            "from": "2025-10-01",
            "to": "2025-10-30"
        },
        "rating": [1, 2, 3],
        "serviceId": "uuid (optional)"
    },
    "analysisType": "sentiment|topics|trends|all"
}
```

**Response**:

```json
{
    "summary": {
        "totalReviews": 127,
        "sentimentDistribution": {
            "positive": 85,
            "neutral": 32,
            "negative": 10
        },
        "averageSentimentScore": 0.78,
        "overallSentiment": "positive"
    },
    "topIssues": [
        {
            "issue": "wait_time",
            "mentions": 8,
            "avgRating": 2.5,
            "sentiment": "negative",
            "examples": ["Had to wait 20 minutes past my appointment time"]
        }
    ],
    "topPraises": [
        {
            "praise": "staff_professionalism",
            "mentions": 45,
            "avgRating": 5.0,
            "sentiment": "positive"
        }
    ],
    "trends": {
        "improving": ["facility_cleanliness", "service_quality"],
        "declining": ["wait_time"],
        "stable": ["pricing"]
    },
    "recommendations": [
        "Consider adding more staff during peak hours (10 AM - 12 PM)",
        "Highlight staff training program in marketing materials",
        "Address wait time concerns with SMS notifications"
    ]
}
```

### ��� Analysis Components

1. **Sentiment Detection**: GPT-4 or specialized model
2. **Aspect Extraction**: Identify service, staff, facility, pricing aspects
3. **Trend Analysis**: Compare with historical data
4. **Action Item Generation**: Suggest improvements based on patterns

---

## 8️⃣ LIVE CHAT WITH STAFF (NEW FEATURE)

### ��� Description

Extends the Global Chat Widget with real-time human agent escalation capability. Seamlessly transitions from AI bot to live staff member when needed.

### ��� UI Features (Extension of GlobalChatWidget.tsx)

-   **AI Mode** (default):
    -   Automated responses
    -   "Connect with a staff member" button in messages
-   **Live Chat Mode**:
    -   Staff avatar + name + online status
    -   Typing indicators ("Sarah is typing...")
    -   File/image sharing
    -   Chat transfer capabilities
    -   Session rating after close

### ��� API Endpoints

#### **POST** `/api/v1/ai/chat/request-agent`

**Request Body**:

```json
{
    "sessionId": "uuid",
    "reason": "booking_help|complex_question|complaint|general",
    "priority": "high|normal|low",
    "context": {
        "chatHistory": ["last 10 messages"],
        "userInfo": {
            "userId": "uuid (if logged in)",
            "name": "string",
            "email": "string (optional)"
        }
    }
}
```

**Response**:

```json
{
    "queuePosition": 2,
    "estimatedWaitTime": "2-3 minutes",
    "status": "queued|connected",
    "agent": {
        "id": "uuid (if connected)",
        "name": "Sarah Johnson (if connected)",
        "avatar": "url",
        "specialization": "Booking Specialist"
    },
    "transferId": "uuid"
}
```

#### **WebSocket** `/ws/live-chat/:sessionId`

**Authentication**: Session token

**Events (Client → Server)**:

```typescript
// User sends message
{
  type: 'message',
  content: 'string',
  attachments: [{ type: 'image', url: 'string' }]
}

// User is typing
{
  type: 'typing',
  isTyping: boolean
}

// End session
{
  type: 'end_session',
  rating: 1-5 (optional),
  feedback: 'string (optional)'
}
```

**Events (Server → Client)**:

```typescript
// Agent connected
{
  type: 'agent_connected',
  agent: {
    id: 'uuid',
    name: 'Sarah Johnson',
    avatar: 'url',
    specialization: 'Booking Specialist'
  }
}

// Agent message
{
  type: 'message',
  from: 'agent',
  agentId: 'uuid',
  content: 'string',
  timestamp: 'ISO8601'
}

// Agent typing
{
  type: 'agent_typing',
  isTyping: boolean
}

// Session ended
{
  type: 'session_ended',
  reason: 'user_closed|agent_closed|timeout',
  summary: 'string (optional)'
}

// Quick booking suggestion (NEW)
{
  type: 'booking_suggestion',
  service: {
    id: 'uuid',
    name: 'HydraFacial',
    slots: ['2025-10-31T14:00', '2025-10-31T15:30']
  },
  action: 'book_now'
}
```

### ��� Booking Integration APIs

#### **POST** `/api/v1/ai/chat/suggest-booking`

**Request Body**:

```json
{
    "sessionId": "uuid",
    "serviceId": "uuid (optional)",
    "preferredDate": "YYYY-MM-DD (optional)",
    "preferredTime": "morning|afternoon|evening (optional)"
}
```

**Response**:

```json
{
    "suggestions": [
        {
            "serviceId": "uuid",
            "serviceName": "HydraFacial Treatment",
            "price": 150,
            "duration": "60 min",
            "availableSlots": [
                {
                    "datetime": "2025-10-31T14:00:00Z",
                    "branchId": "uuid",
                    "branchName": "Downtown Spa",
                    "staffId": "uuid",
                    "staffName": "Emma Wilson"
                }
            ]
        }
    ],
    "bookingLink": "/booking?service=hydrafacial&date=2025-10-31"
}
```

#### **POST** `/api/v1/ai/chat/smart-schedule`

**Purpose**: AI intelligently selects the best available slot based on user preferences, historical data, and optimization criteria.

**Request Body**:

```json
{
    "sessionId": "uuid",
    "serviceId": "uuid",
    "preferences": {
        "dateRange": {
            "start": "YYYY-MM-DD (optional, default: today)",
            "end": "YYYY-MM-DD (optional, default: +7 days)"
        },
        "timePreference": "morning|afternoon|evening|flexible (optional)",
        "branchPreference": "uuid|closest|any (optional)",
        "avoidWeekends": "boolean (optional, default: false)",
        "priority": "soonest|best_price|best_staff|flexible (default: flexible)"
    },
    "context": {
        "userId": "uuid (optional, for personalized recommendations)",
        "previousBookings": "array (optional, for pattern analysis)",
        "skinConcerns": "array (optional, from quiz results)"
    }
}
```

**Response**:

```json
{
    "recommendedSlot": {
        "datetime": "2025-10-31T14:00:00Z",
        "serviceId": "uuid",
        "serviceName": "HydraFacial Treatment",
        "branchId": "uuid",
        "branchName": "Downtown Spa",
        "staffId": "uuid",
        "staffName": "Emma Wilson (Senior Esthetician)",
        "price": 150,
        "duration": "60 min",
        "confidence": 0.92,
        "reasoning": "Best match based on your afternoon preference and Emma's expertise in hydration treatments"
    },
    "alternativeSlots": [
        {
            "datetime": "2025-11-01T10:00:00Z",
            "branchName": "Westside Spa",
            "staffName": "Sarah Chen",
            "price": 150,
            "confidence": 0.85,
            "reasoning": "Earlier availability at nearby location"
        }
    ],
    "aiInsights": {
        "bestTimeForSkinType": "afternoon",
        "peakEffectiveness": "Tuesday-Thursday afternoons show 15% better results",
        "staffExpertise": "Emma Wilson specializes in sensitive skin treatments"
    }
}
```

**AI Selection Criteria**:

1. **User Preference Matching** (40% weight): Time/date/branch preferences
2. **Staff Expertise** (25% weight): Match service requirements with staff skills
3. **Historical Success** (20% weight): Similar customers' satisfaction rates
4. **Convenience** (15% weight): Travel distance, parking availability

#### **POST** `/api/v1/ai/chat/quick-book`

**Request Body**:

```json
{
    "sessionId": "uuid",
    "serviceId": "uuid",
    "datetime": "ISO8601",
    "branchId": "uuid",
    "customerInfo": {
        "name": "string",
        "email": "string",
        "phone": "string"
    },
    "notes": "string (from chat context)"
}
```

**Response**:

```json
{
    "bookingId": "uuid",
    "referenceNumber": "BK-2025-001234",
    "status": "confirmed",
    "confirmationUrl": "/booking/confirmation/uuid",
    "calendarInvite": "ics_url"
}
```

### ��� Database Schema

```sql
CREATE TABLE live_chat_sessions (
  id UUID PRIMARY KEY,
  ai_session_id UUID REFERENCES chat_sessions(id),
  user_id UUID REFERENCES users(id) NULL,
  agent_id UUID REFERENCES users(id) NULL, -- staff user
  status ENUM('queued', 'active', 'ended'),
  queue_position INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  agent_connected_at TIMESTAMP NULL,
  ended_at TIMESTAMP NULL,
  rating INTEGER NULL, -- 1-5
  feedback TEXT NULL,
  resolution_type ENUM('resolved', 'escalated', 'abandoned'),
  booking_created UUID REFERENCES bookings(id) NULL,
  INDEX idx_active_sessions (status, started_at),
  INDEX idx_agent_sessions (agent_id, status)
);

CREATE TABLE live_chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES live_chat_sessions(id),
  sender_type ENUM('user', 'agent', 'system'),
  sender_id UUID NULL,
  content TEXT,
  attachments JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP NULL,
  INDEX idx_session_messages (session_id, sent_at)
);

CREATE TABLE agent_availability (
  agent_id UUID PRIMARY KEY REFERENCES users(id),
  is_online BOOLEAN DEFAULT FALSE,
  current_sessions INTEGER DEFAULT 0,
  max_sessions INTEGER DEFAULT 3,
  specializations TEXT[], -- ['booking', 'technical', 'complaints']
  last_activity TIMESTAMP DEFAULT NOW(),
  INDEX idx_available_agents (is_online, current_sessions)
);
```

### ��� Agent Routing Logic

```
FUNCTION assignAgent(request):
  # 1. Find available agents
  agents = query("SELECT * FROM agent_availability
                  WHERE is_online = TRUE
                  AND current_sessions < max_sessions
                  ORDER BY current_sessions ASC, last_activity ASC")

  # 2. Prioritize by specialization
  IF request.reason IN agents.specializations:
    agent = agents.filter(specialization=request.reason).first()
  ELSE:
    agent = agents.first()

  # 3. If no agents available
  IF NOT agent:
    RETURN {status: 'queued', position: getQueuePosition()}

  # 4. Assign and notify
  incrementAgentSessions(agent.id)
  notifyAgent(agent.id, request)
  RETURN {status: 'connected', agent: agent}
```

### ��� Auto-Response FAQ Integration

```sql
CREATE TABLE faq_responses (
  id UUID PRIMARY KEY,
  question_pattern TEXT, -- Regex or keyword match
  answer TEXT,
  category VARCHAR(50),
  priority INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  effectiveness_rating DECIMAL(3,2), -- 0-5 based on user satisfaction
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example FAQs
INSERT INTO faq_responses (question_pattern, answer, category) VALUES
('hours|opening|close|schedule', 'Our spa is open Monday-Saturday 9 AM - 8 PM, Sunday 10 AM - 6 PM.', 'general'),
('price|cost|how much', 'Our services range from $80 to $400. You can view detailed pricing at /services', 'pricing'),
('location|address|where', 'We have 3 locations: Downtown (123 Main St), Westside (456 Oak Ave), Eastside (789 Elm Rd).', 'location');
```

---

## ���️ Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

-   [ ] Setup OpenAI API integration
-   [ ] Implement chat session management
-   [ ] Build FAQ knowledge base
-   [ ] Deploy Global Chat Widget backend

### Phase 2: Intelligence (Week 3-4)

-   [ ] Skin Analysis algorithm + recommendations
-   [ ] Admin AI Insights (peak hours, trends)
-   [ ] Contact form categorization
-   [ ] Review sentiment analysis

### Phase 3: Content & Live Chat (Week 5-6)

-   [ ] Blog content generator
-   [ ] WebSocket infrastructure for live chat
-   [ ] Agent dashboard for staff
-   [ ] Queue management system

### Phase 4: Integration & Optimization (Week 7-8)

-   [ ] Booking integration in chat
-   [ ] Quick booking flow
-   [ ] Performance optimization
-   [ ] A/B testing setup
-   [ ] Analytics dashboard

---

## ��� Security Considerations

1. **Rate Limiting**:

    - Chat: 20 messages/minute per session
    - Blog generation: 5 requests/hour per admin
    - Sentiment analysis: 100 requests/hour

2. **Data Privacy**:

    - Anonymize chat logs after 90 days
    - GDPR-compliant data deletion
    - User consent for AI analysis

3. **Content Moderation**:

    - Filter inappropriate messages
    - Block spam/abuse
    - Human review for escalations

4. **API Key Management**:
    - Rotate OpenAI keys monthly
    - Use environment variables
    - Monitor usage/costs

---

## ��� Success Metrics

| Feature        | KPI                   | Target    |
| -------------- | --------------------- | --------- |
| Chat Widget    | Resolution Rate       | >80%      |
| Skin Quiz      | Conversion to Booking | >25%      |
| AI Insights    | Admin Action Rate     | >60%      |
| Blog Generator | Posts Published       | 10+/month |
| Live Chat      | Avg Response Time     | <2 min    |
| Live Chat      | Customer Satisfaction | >4.5/5    |

---

## ���️ Tech Stack Summary

-   **AI**: OpenAI GPT-4-turbo, GPT-3.5-turbo
-   **Embeddings**: OpenAI text-embedding-3-small
-   **Vector DB**: Pinecone or pgvector (PostgreSQL)
-   **Real-time**: Socket.io or native WebSockets
-   **Cache**: Redis (sessions, responses, queue)
-   **Queue**: BullMQ (for background jobs)
-   **Monitoring**: Sentry, OpenAI usage tracking

---

## ��� Support & Questions

**Backend Team Lead**: [Your Name]  
**AI Integration Owner**: [AI Specialist Name]  
**Slack Channel**: #ai-features-dev  
**Documentation**: `/docs/architecture/`

---

**End of Specification Document**
