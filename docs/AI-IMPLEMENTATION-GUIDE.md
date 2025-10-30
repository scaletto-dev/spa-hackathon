# AI Implementation Guide - Model Selection & Integration

**Last Updated**: October 30, 2025  
**Audience**: Backend Development Team  
**Status**: Ready for Implementation

---

## Ì¥ñ AI Model Options

### Option 1: Google Gemini (RECOMMENDED ‚úÖ)

**Why Gemini is Great for This Project:**
- ‚úÖ **Cost-Effective**: Free tier generous (60 requests/minute)
- ‚úÖ **Multimodal**: Can handle text + images (useful for skin analysis)
- ‚úÖ **Fast**: Low latency responses
- ‚úÖ **Vietnamese Support**: Excellent Vietnamese language understanding
- ‚úÖ **Function Calling**: Built-in for structured outputs
- ‚úÖ **Context Window**: 32K tokens (Gemini Pro)

**Models Available:**
- **gemini-1.5-pro**: Best quality, slower, 2M token context
- **gemini-1.5-flash**: Fast, good quality, 1M token context (RECOMMENDED)
- **gemini-pro**: Standard, 32K context

**Pricing (Gemini 1.5 Flash):**
- Free tier: 15 requests/minute, 1M tokens/day
- Paid: $0.35 per 1M input tokens, $1.05 per 1M output tokens

---

### Option 2: OpenAI GPT

**Models:**
- **gpt-4o-mini**: Fast, cheap ($0.15/$0.60 per 1M tokens)
- **gpt-4o**: Best quality ($5/$15 per 1M tokens)
- **gpt-3.5-turbo**: Balanced ($0.50/$1.50 per 1M tokens)

**Pros**: Industry standard, excellent documentation
**Cons**: More expensive, rate limits stricter

---

### Option 3: Hybrid Approach (BEST PRACTICE)

```
Chat Widget ‚Üí Gemini Flash (fast, cheap)
Skin Analysis ‚Üí Gemini Pro (better reasoning)
Sentiment Analysis ‚Üí Rule-based + Gemini Flash
Blog Generator ‚Üí GPT-4o or Gemini Pro (quality matters)
Smart Scheduling ‚Üí Rule-based algorithm (no LLM needed)
```

---

## ÌæØ Feature-by-Feature Recommendations

### 1. Chat Widget (AI Assistant)
**Recommended**: **Gemini 1.5 Flash**
- Fast responses needed
- Simple intent recognition
- Function calling for actions

**NPM Package**: `@google/generative-ai`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// System prompt
const systemPrompt = `You are a helpful assistant for BeautyAI Spa. 
Help users with:
- Booking appointments
- Service information
- Pricing inquiries
- Skin care advice

Always be friendly and concise. If asked to book, use the book_appointment function.`;

// Function declaration
const functions = [{
  name: 'book_appointment',
  description: 'Book a spa appointment',
  parameters: {
    type: 'object',
    properties: {
      service: { type: 'string' },
      preferredDate: { type: 'string' },
      preferredTime: { type: 'string' }
    },
    required: ['service']
  }
}];

async function chatWithAI(userMessage: string, history: any[]) {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
```

**Estimated Cost**: ~$1-5/month (free tier sufficient initially)

---

### 2. AI Smart Scheduling
**Recommended**: **Rule-Based Algorithm** (No LLM needed!)

**Why Not Use LLM:**
- Deterministic results needed
- Fast computation required
- Cost-effective
- Easier to debug

**Algorithm Implementation:**

```typescript
interface SlotScore {
  slot: BookingSlot;
  score: number;
  breakdown: {
    preferenceMatch: number;  // 0-40 points
    staffExpertise: number;   // 0-25 points
    historicalSuccess: number; // 0-20 points
    convenience: number;      // 0-15 points
  };
  reasoning: string;
}

async function calculateSmartSchedule(
  serviceId: string,
  preferences: UserPreferences,
  context: UserContext
): Promise<SlotScore[]> {
  // 1. Get all available slots
  const availableSlots = await getAvailableSlots(serviceId, preferences.dateRange);
  
  // 2. Score each slot
  const scoredSlots = await Promise.all(
    availableSlots.map(slot => scoreSlot(slot, preferences, context))
  );
  
  // 3. Sort by score
  scoredSlots.sort((a, b) => b.score - a.score);
  
  return scoredSlots.slice(0, 5); // Top 5 recommendations
}

function scoreSlot(
  slot: BookingSlot,
  preferences: UserPreferences,
  context: UserContext
): SlotScore {
  let score = 0;
  const breakdown = {
    preferenceMatch: 0,
    staffExpertise: 0,
    historicalSuccess: 0,
    convenience: 0
  };
  
  // 1. Preference Matching (40 points max)
  if (matchesTimePreference(slot, preferences.timePreference)) {
    breakdown.preferenceMatch += 20;
  }
  if (matchesDateRange(slot, preferences.dateRange)) {
    breakdown.preferenceMatch += 10;
  }
  if (matchesBranchPreference(slot, preferences.branchPreference, context.userLocation)) {
    breakdown.preferenceMatch += 10;
  }
  
  // 2. Staff Expertise (25 points max)
  const staff = getStaffInfo(slot.staffId);
  if (staff.specializations.includes(context.skinConcerns)) {
    breakdown.staffExpertise += 15;
  }
  if (staff.rating >= 4.5) {
    breakdown.staffExpertise += 10;
  }
  
  // 3. Historical Success (20 points max)
  const historicalData = getHistoricalData(slot.timeSlot, slot.staffId, serviceId);
  breakdown.historicalSuccess = Math.min(20, historicalData.successRate * 20);
  
  // 4. Convenience (15 points max)
  const distance = calculateDistance(context.userLocation, slot.branch.location);
  breakdown.convenience = Math.max(0, 15 - distance * 2);
  
  score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  const reasoning = generateReasoning(breakdown, staff, slot);
  
  return { slot, score, breakdown, reasoning };
}

function generateReasoning(breakdown: any, staff: any, slot: any): string {
  const reasons = [];
  
  if (breakdown.preferenceMatch >= 30) {
    reasons.push('Matches your time and location preferences');
  }
  if (breakdown.staffExpertise >= 20) {
    reasons.push(`${staff.name} specializes in your treatment type with ${staff.rating}‚òÖ rating`);
  }
  if (breakdown.historicalSuccess >= 15) {
    reasons.push('This time slot has high booking success rate');
  }
  if (breakdown.convenience >= 12) {
    reasons.push('Convenient location near you');
  }
  
  return reasons.join('. ') + '.';
}
```

**Estimated Cost**: $0 (pure algorithm)

---

### 3. Skin Analysis Quiz
**Recommended**: **Gemini 1.5 Flash** or **Rule-Based + Gemini**

**Option A: Rule-Based (Faster, Cheaper)**
```typescript
function analyzeSkin(answers: QuizAnswer[]): SkinAnalysis {
  let score = {
    oily: 0,
    dry: 0,
    sensitive: 0,
    acne: 0
  };
  
  // Score based on answers
  answers.forEach(answer => {
    if (answer.questionId === 1 && answer.answer.includes('shiny')) {
      score.oily += 2;
    }
    // ... more rules
  });
  
  // Determine skin type
  const skinType = Object.keys(score).reduce((a, b) => 
    score[a] > score[b] ? a : b
  );
  
  // Get service recommendations from database
  const services = await getServiceRecommendations(skinType, score);
  
  return { skinType, concerns: score, services };
}
```

**Option B: Gemini-Enhanced (Better insights)**
```typescript
async function analyzeSkinWithAI(answers: QuizAnswer[]): Promise<SkinAnalysis> {
  const prompt = `Based on this skin quiz:
${answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Analyze and provide:
1. Skin type (oily/dry/combination/normal/sensitive)
2. Primary concerns (acne, pigmentation, aging, etc.)
3. Risk level (low/medium/high)
4. Top 3 service recommendations from this list: HydraFacial, Chemical Peel, Microneedling, LED Therapy

Format as JSON.`;

  const result = await model.generateContent(prompt);
  const analysis = JSON.parse(result.response.text());
  
  // Enrich with database services
  return enrichWithServices(analysis);
}
```

**Estimated Cost**: 
- Rule-based: $0
- Gemini: ~$0.50-2/month

---

### 4. Review Sentiment Analysis
**Recommended**: **Hybrid (Rule-based + Gemini for edge cases)**

```typescript
async function analyzeSentiment(reviewText: string): Promise<Sentiment> {
  // 1. Quick rule-based check
  const quickScore = quickSentimentCheck(reviewText);
  
  if (quickScore.confidence > 0.8) {
    // High confidence, no need for AI
    return quickScore;
  }
  
  // 2. Use Gemini for uncertain cases
  const prompt = `Analyze sentiment of this spa review (Vietnamese or English):
"${reviewText}"

Return JSON:
{
  "sentiment": "positive|neutral|negative",
  "score": 0-1,
  "aspects": {
    "service": "positive|neutral|negative",
    "staff": "positive|neutral|negative",
    "cleanliness": "positive|neutral|negative",
    "value": "positive|neutral|negative"
  },
  "keywords": ["word1", "word2"]
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

function quickSentimentCheck(text: string): Sentiment {
  const positive = ['tuy·ªát v·ªùi', 'excellent', 'amazing', 'love', 'great'];
  const negative = ['terrible', 'bad', 'awful', 't·ªá', 'k√©m'];
  
  let score = 0;
  positive.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 1;
  });
  negative.forEach(word => {
    if (text.toLowerCase().includes(word)) score -= 1;
  });
  
  const confidence = Math.abs(score) > 2 ? 0.9 : 0.5;
  
  return {
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
    score: Math.max(0, Math.min(1, (score + 5) / 10)),
    confidence
  };
}
```

**Estimated Cost**: ~$1-3/month (mostly rule-based)

---

### 5. Blog Content Generator
**Recommended**: **Gemini 1.5 Pro** (quality matters)

```typescript
async function generateBlogPost(topic: string, keywords: string[]): Promise<BlogPost> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `Write a professional blog post for a luxury spa website.

Topic: ${topic}
Keywords to include: ${keywords.join(', ')}
Target audience: 25-45 year old women interested in skincare
Tone: Professional but warm and approachable
Length: 800-1000 words
Language: Vietnamese

Structure:
1. Engaging headline
2. Introduction (hook the reader)
3. Main content (3-4 sections with subheadings)
4. Practical tips
5. Call-to-action
6. SEO meta description (max 160 chars)

Format as JSON with fields: title, content (HTML), metaDescription, excerpt`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2000,
    }
  });
  
  return JSON.parse(result.response.text());
}
```

**Estimated Cost**: ~$5-10/month (used less frequently)

---

### 6. Admin AI Insights
**Recommended**: **SQL Analytics + Gemini for natural language**

```typescript
async function generateInsights(timeframe: string): Promise<Insight[]> {
  // 1. Run SQL analytics
  const analytics = await runAnalytics(timeframe);
  
  // 2. Let Gemini generate natural language insights
  const prompt = `Based on this spa booking data:

Bookings today: ${analytics.bookingsToday}
Revenue: $${analytics.revenue}
Top service: ${analytics.topService.name} (${analytics.topService.count} bookings)
Peak hour: ${analytics.peakHour}
Cancellation rate: ${analytics.cancellationRate}%
Average rating: ${analytics.avgRating}

Generate 3-5 actionable insights for spa management. Format as JSON array with:
{
  "type": "peak_hours|demand_prediction|trend|anomaly",
  "message": "Human-readable insight",
  "confidence": 0-1,
  "actionable": boolean,
  "action": { "label": "...", "url": "..." }
}`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

**Estimated Cost**: ~$2-5/month

---

### 7. Live Chat with Staff
**Recommended**: **WebSocket + No AI initially**

**Why No AI:**
- Real-time human-to-human chat
- AI only used for initial routing
- Keep it simple

**Optional AI Features:**
- Sentiment detection on messages
- Auto-suggest responses for staff
- Smart message routing

---

## Ìª†Ô∏è Implementation Setup

### Install Gemini SDK

```bash
npm install @google/generative-ai
```

### Environment Variables

```env
# .env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro

# Optional: OpenAI fallback
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Get Gemini API Key

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key to .env file

---

## Ì≥ä Cost Estimation (Monthly)

### Scenario: 1000 active users/month

| Feature | Model | Requests/Month | Cost |
|---------|-------|----------------|------|
| Chat Widget | Gemini Flash | ~5,000 | $1.75 |
| Smart Scheduling | Rule-based | ~2,000 | $0 |
| Skin Analysis | Gemini Flash | ~500 | $0.35 |
| Sentiment Analysis | Hybrid | ~1,000 | $0.70 |
| Blog Generator | Gemini Pro | ~20 | $2.00 |
| Admin Insights | Gemini Flash | ~300 | $0.21 |
| **TOTAL** | | | **~$5/month** |

**With OpenAI (for comparison)**: ~$25-40/month

---

## Ì∫Ä Quick Start Code

### Create AI Service Module

```typescript
// backend/src/services/ai.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
    });
  }
  
  async chat(message: string, context?: any): Promise<string> {
    const prompt = this.buildChatPrompt(message, context);
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
  
  async analyzeSentiment(text: string): Promise<any> {
    // Implementation here
  }
  
  async generateBlogPost(topic: string): Promise<any> {
    // Implementation here
  }
  
  private buildChatPrompt(message: string, context?: any): string {
    return `You are BeautyAI spa assistant. Context: ${JSON.stringify(context)}
    
User message: ${message}

Respond helpfully and concisely.`;
  }
}

export const aiService = new AIService();
```

### Use in Controller

```typescript
// backend/src/controllers/ai.controller.ts
import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';

export class AIController {
  async chat(req: Request, res: Response) {
    try {
      const { message, sessionId, context } = req.body;
      
      const response = await aiService.chat(message, context);
      
      res.json({
        reply: response,
        sessionId: sessionId || generateSessionId(),
        suggestions: extractSuggestions(response)
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'AI service unavailable' });
    }
  }
}
```

---

## Ì¥í Best Practices

### 1. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: 'Too many AI requests, please try again later'
});

app.use('/api/v1/ai', aiLimiter);
```

### 2. Caching
```typescript
import Redis from 'ioredis';

const redis = new Redis();

async function getCachedOrGenerate(key: string, generator: () => Promise<any>) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const result = await generator();
  await redis.setex(key, 3600, JSON.stringify(result)); // Cache 1 hour
  
  return result;
}
```

### 3. Error Handling
```typescript
async function callAIWithFallback(prompt: string): Promise<string> {
  try {
    return await aiService.chat(prompt);
  } catch (error) {
    console.error('Gemini failed, using fallback:', error);
    
    // Fallback to OpenAI or rule-based
    return await fallbackResponse(prompt);
  }
}
```

### 4. Monitoring
```typescript
import { Counter, Histogram } from 'prom-client';

const aiRequestCounter = new Counter({
  name: 'ai_requests_total',
  help: 'Total AI requests',
  labelNames: ['feature', 'status']
});

const aiResponseTime = new Histogram({
  name: 'ai_response_time_seconds',
  help: 'AI response time'
});

// Use in service
const end = aiResponseTime.startTimer();
try {
  const result = await model.generateContent(prompt);
  aiRequestCounter.inc({ feature: 'chat', status: 'success' });
  return result;
} catch (error) {
  aiRequestCounter.inc({ feature: 'chat', status: 'error' });
  throw error;
} finally {
  end();
}
```

---

## Ì≥ù Summary

### ‚úÖ Use Gemini for:
- ‚úÖ Chat Widget (gemini-1.5-flash)
- ‚úÖ Skin Analysis (gemini-1.5-flash or rule-based)
- ‚úÖ Sentiment Analysis (hybrid)
- ‚úÖ Blog Generator (gemini-1.5-pro)
- ‚úÖ Admin Insights (gemini-1.5-flash)

### ‚úÖ Use Rule-Based for:
- ‚úÖ Smart Scheduling (pure algorithm)
- ‚úÖ Contact Form Categorization (keywords)

### Ì≤∞ Total Cost: ~$5-10/month
### Ì∫Ä Free Tier: Sufficient for MVP and early growth

---

**Next Steps:**
1. Get Gemini API key
2. Set up AI service module
3. Implement chat widget first (highest priority)
4. Add caching and rate limiting
5. Monitor usage and costs

**Questions?** Check [Gemini API Docs](https://ai.google.dev/docs)
