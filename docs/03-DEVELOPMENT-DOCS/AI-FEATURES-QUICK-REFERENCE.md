# ��� AI Features Quick Reference

**Last Updated**: October 30, 2025  
**Full Specification**: [docs/architecture/ai-features-specification.md](./architecture/ai-features-specification.md)

---

## �� Summary Table

| #   | Feature                        | Priority   | Frontend File          | API Endpoint                              | Auth     |
| --- | ------------------------------ | ---------- | ---------------------- | ----------------------------------------- | -------- |
| 1   | **Chat Widget (AI Assistant)** | ��� HIGH   | `GlobalChatWidget.tsx` | `POST /api/v1/ai/chat`                    | Optional |
| 1a  | **AI Smart Scheduling**        | ��� HIGH   | `GlobalChatWidget.tsx` | `POST /api/v1/ai/chat/smart-schedule`     | Optional |
| 1b  | **Quick Booking in Chat**      | ��� HIGH   | `GlobalChatWidget.tsx` | `POST /api/v1/ai/chat/quick-book`         | Optional |
| 2   | **Skin Analysis Quiz**         | ��� HIGH   | `QuizPage.tsx`         | `POST /api/v1/ai/skin-analysis`           | Optional |
| 3   | **Admin AI Insights Panel**    | ��� MEDIUM | `AIInsightsPanel.tsx`  | `GET /api/v1/admin/ai/insights`           | Admin    |
| 4   | **Admin Contextual Tips**      | ��� LOW    | Multiple admin pages   | `GET /api/v1/admin/ai/contextual-tips`    | Admin    |
| 5   | **Blog Content Generator**     | ��� MEDIUM | `Blog.tsx` (admin)     | `POST /api/v1/admin/ai/generate-blog`     | Admin    |
| 6   | **Contact Form Smart Reply**   | ��� LOW    | `ContactForm.tsx`      | `POST /api/v1/contact`                    | None     |
| 7   | **Review Sentiment Analysis**  | ��� MEDIUM | `Reviews.tsx` (admin)  | `GET /api/v1/admin/reviews/:id/sentiment` | Admin    |
| 8   | **Live Chat with Staff**       | ��� HIGH   | `GlobalChatWidget.tsx` | WebSocket `/ws/live-chat/:sessionId`      | Optional |

---

## ��� Quick Start for Backend Team

### 1. Chat Widget API

```typescript
// POST /api/v1/ai/chat
interface ChatRequest {
    message: string;
    sessionId?: string;
    context?: {
        currentPage?: string;
        userId?: string;
    };
}

interface ChatResponse {
    reply: string;
    suggestions: string[];
    sessionId: string;
    actions?: Array<{
        type: 'navigate' | 'book' | 'call';
        label: string;
        url?: string;
    }>;
}
```

**Implementation Hint**: Use OpenAI GPT-3.5-turbo with function calling for actions.

---

### 2. Skin Analysis Quiz

```typescript
// POST /api/v1/ai/skin-analysis
interface SkinAnalysisRequest {
    answers: Array<{
        questionId: number;
        question: string;
        answer: string;
    }>;
    userId?: string;
}

interface SkinAnalysisResponse {
    analysisId: string;
    analysis: {
        skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
        primaryConcern: string;
        riskLevel: 'low' | 'medium' | 'high';
    };
    recommendations: Array<{
        serviceId: string;
        serviceName: string;
        reason: string;
        priority: number;
        price: number;
    }>;
    tips: string[];
}
```

**Implementation Hint**: Rule-based scoring + service matching from database.

---

### 3. Admin AI Insights

```typescript
// GET /api/v1/admin/ai/insights?timeframe=today
interface InsightsResponse {
    insights: Array<{
        type: 'peak_hours' | 'demand_prediction' | 'trend' | 'anomaly';
        icon: string;
        message: string;
        confidence: number;
        actionable: boolean;
        action?: {
            label: string;
            url: string;
        };
    }>;
    generatedAt: string;
    nextUpdate: string;
}
```

**Implementation Hint**: SQL analytics + caching (30min TTL).

---

### 4. Live Chat with Staff (NEW)

```typescript
// POST /api/v1/ai/chat/request-agent
interface AgentRequest {
    sessionId: string;
    reason: 'booking_help' | 'complex_question' | 'complaint';
    priority: 'high' | 'normal' | 'low';
}

// WebSocket Events
type WSEvent =
    | { type: 'agent_connected'; agent: AgentInfo }
    | { type: 'message'; from: 'agent' | 'user'; content: string }
    | { type: 'agent_typing'; isTyping: boolean }
    | { type: 'booking_suggestion'; service: ServiceInfo }
    | { type: 'session_ended'; reason: string };
```

**Implementation Hint**: Socket.io + Redis queue + Agent availability management.

---

### 5. AI Smart Scheduling (NEW)

```typescript
// POST /api/v1/ai/chat/smart-schedule
interface SmartScheduleRequest {
    sessionId: string;
    serviceId: string;
    preferences?: {
        dateRange?: { start: string; end: string };
        timePreference?: 'morning' | 'afternoon' | 'evening' | 'flexible';
        branchPreference?: string | 'closest' | 'any';
        priority?: 'soonest' | 'best_price' | 'best_staff' | 'flexible';
    };
    context?: {
        userId?: string;
        skinConcerns?: string[];
    };
}

interface SmartScheduleResponse {
    recommendedSlot: {
        datetime: string;
        serviceName: string;
        branchName: string;
        staffName: string;
        price: number;
        confidence: number;
        reasoning: string;
    };
    alternativeSlots: Array<{
        datetime: string;
        branchName: string;
        confidence: number;
        reasoning: string;
    }>;
    aiInsights: {
        bestTimeForSkinType: string;
        peakEffectiveness: string;
        staffExpertise: string;
    };
}
```

**Implementation Hint**:

-   Weight scoring algorithm: Preferences (40%) + Staff expertise (25%) + Historical data (20%) + Convenience (15%)
-   Use ML model trained on booking patterns if available
-   Fallback to rule-based if ML unavailable

**AI Selection Criteria**:

-   User preference matching
-   Staff expertise & ratings
-   Historical booking success rates
-   Travel distance & convenience
-   Time slot optimization (avoid conflicts)

---

### 6. Booking Integration in Chat

```typescript
// POST /api/v1/ai/chat/quick-book
interface QuickBookRequest {
    sessionId: string;
    serviceId: string;
    datetime: string;
    branchId: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
    };
    notes?: string;
}

interface QuickBookResponse {
    bookingId: string;
    referenceNumber: string;
    status: 'confirmed';
    confirmationUrl: string;
}
```

**Implementation Hint**: Integrate with existing booking system, send confirmation email.

---

## ���️ Key Database Tables

### Chat Sessions

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  satisfaction_rating INTEGER NULL
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  role ENUM('user', 'assistant', 'system'),
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Live Chat

```sql
CREATE TABLE live_chat_sessions (
  id UUID PRIMARY KEY,
  ai_session_id UUID REFERENCES chat_sessions(id),
  agent_id UUID REFERENCES users(id) NULL,
  status ENUM('queued', 'active', 'ended'),
  rating INTEGER NULL,
  booking_created UUID REFERENCES bookings(id) NULL
);

CREATE TABLE agent_availability (
  agent_id UUID PRIMARY KEY REFERENCES users(id),
  is_online BOOLEAN DEFAULT FALSE,
  current_sessions INTEGER DEFAULT 0,
  max_sessions INTEGER DEFAULT 3,
  specializations TEXT[]
);
```

### FAQ Responses

```sql
CREATE TABLE faq_responses (
  id UUID PRIMARY KEY,
  question_pattern TEXT,
  answer TEXT,
  category VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  effectiveness_rating DECIMAL(3,2)
);
```

---

## ��� Security & Rate Limits

| Feature           | Rate Limit             | Auth Required |
| ----------------- | ---------------------- | ------------- |
| Chat API          | 20 msg/min per session | No            |
| Skin Analysis     | 5 per hour per IP      | No            |
| Live Chat Request | 3 per hour per user    | No            |
| Blog Generator    | 5 per hour             | Admin         |
| Admin Insights    | 60 per hour            | Admin         |

---

## ���️ Required Services

1. **OpenAI API** (Primary AI)

    - GPT-4-turbo for complex tasks
    - GPT-3.5-turbo for chat
    - text-embedding-3-small for RAG

2. **Redis** (Required)

    - Session storage
    - Rate limiting
    - Response caching
    - Live chat queue

3. **WebSocket Server** (For Live Chat)

    - Socket.io recommended
    - Alternative: Native WS

4. **Email Service** (Existing)
    - Booking confirmations
    - Chat transcripts

---

## ��� Implementation Priority

### Sprint 1 (Week 1-2): Foundation

-   [ ] Chat Widget API (POST /api/v1/ai/chat)
-   [ ] AI Smart Scheduling API (POST /api/v1/ai/chat/smart-schedule) **NEW**
-   [ ] Quick Booking API (POST /api/v1/ai/chat/quick-book)
-   [ ] Session management (DB + Redis)
-   [ ] FAQ system
-   [ ] Rate limiting

### Sprint 2 (Week 3-4): Intelligence

-   [ ] Skin Analysis API
-   [ ] AI slot recommendation algorithm (for smart-schedule)
-   [ ] Admin Insights (peak hours, trends)
-   [ ] Contact form categorization
-   [ ] Review sentiment

### Sprint 3 (Week 5-6): Live Chat

-   [ ] WebSocket infrastructure
-   [ ] Agent availability system
-   [ ] Queue management
-   [ ] Chat-to-booking integration (suggest-booking API)

### Sprint 4 (Week 7-8): Polish

-   [ ] Blog generator
-   [ ] Contextual tips
-   [ ] Analytics dashboard
-   [ ] Performance optimization

---

## ��� Contacts & Resources

-   **Full Specification**: [ai-features-specification.md](./architecture/ai-features-specification.md)
-   **API Docs**: [docs/api-spec/](./api-spec/)
-   **Backend Structure**: Run `find apps/backend/src -type f -name "*.ts"`
-   **Frontend Components**: `apps/frontend/src/client/components/`

---

## ��� Success Metrics

| Metric                    | Target | How to Measure                       |
| ------------------------- | ------ | ------------------------------------ |
| Chat Resolution Rate      | >80%   | Sessions without agent escalation    |
| Quiz → Booking Conversion | >25%   | Tracked via `analysisId` in bookings |
| Live Chat Response Time   | <2 min | Agent connection time tracking       |
| Agent Utilization         | 60-80% | Active sessions / total agents       |
| Customer Satisfaction     | >4.5/5 | Post-chat ratings                    |

---

**Ready to implement? Start with Sprint 1 and refer to the full specification for detailed schemas!**
