# Ì∑™ AI Integration Test Guide

## Quick Test Steps

### 1. Start Backend
```bash
cd apps/backend
npm start
```

**Expected Output**:
```
‚úÖ AI Service initialized with Gemini models
‚úÖ Backend server running on http://localhost:3000
‚úÖ Database connected successfully
```

### 2. Start Frontend
```bash
cd apps/frontend
npm run dev
```

**Expected Output**:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 3. Test Chat Widget

**Open**: http://localhost:5173

**Test Scenarios**:

**Scenario 1: English Query**
```
You: What services do you offer?
AI: Should list real services from database (HydraFacial, etc.)
```

**Scenario 2: Vietnamese Query**
```
You: C√°c d·ªãch v·ª• c√≥ gi√° bao nhi√™u?
AI: Should respond in Vietnamese with pricing
```

**Scenario 3: Booking Intent**
```
You: I want to book HydraFacial
AI: Should show booking-related actions/suggestions
```

**Scenario 4: Location Query**
```
You: Where are you located?
AI: Should show real branch addresses from database
```

### 4. Verify Features

‚úÖ **AI Typing Indicator**: Should show animated dots while waiting
‚úÖ **Session Persistence**: Follow-up questions should maintain context  
‚úÖ **Action Buttons**: Clicking buttons should navigate correctly
‚úÖ **Suggestions**: AI should provide 3 relevant suggestions
‚úÖ **Error Handling**: Disconnect backend ‚Üí should show fallback response

---

## Ì¥ç Debug Checklist

### Backend Issues:
- [ ] Check `GEMINI_API_KEY` in `.env`
- [ ] Verify port 3000 is not in use
- [ ] Check database connection
- [ ] Review backend console for errors

### Frontend Issues:
- [ ] Verify `VITE_API_URL=http://localhost:3000` in frontend `.env`
- [ ] Check browser console for errors
- [ ] Clear browser cache
- [ ] Check network tab for API calls

### API Issues:
- [ ] Test endpoint directly: `curl http://localhost:3000/api/v1/ai/health`
- [ ] Check rate limits (20 req/min)
- [ ] Review Gemini API quota
- [ ] Verify JSON payload format

---

## ‚úÖ Success Criteria

**Chat Widget Working** if:
- AI responds with real database data
- Typing indicator animates properly
- Messages persist in conversation
- Action buttons work
- Fallback triggers on API failure
- Both English & Vietnamese work

**All 4 APIs Working** if:
- `GET /api/v1/ai/health` returns 200
- `POST /api/v1/ai/chat` responds < 3s
- `POST /api/v1/ai/skin-analysis` accepts quiz answers
- `POST /api/v1/ai/sentiment` analyzes review text
- `POST /api/v1/ai/blog-generate` creates blog content

---

## Ì≥ä Expected Response Times

| API Endpoint | Expected Time | Rate Limit |
|-------------|---------------|------------|
| `/ai/chat` | 1-2 seconds | 20/minute |
| `/ai/skin-analysis` | 2-3 seconds | 10/5min |
| `/ai/sentiment` | 1-2 seconds | 10/5min |
| `/ai/blog-generate` | 5-10 seconds | 3/15min |

---

## Ìæâ When Everything Works

You should see:
1. Chat widget in bottom-right corner
2. Click opens chat window
3. Type message ‚Üí typing indicator ‚Üí AI response
4. AI uses real data (services, branches, prices)
5. Suggestions appear below AI response
6. Action buttons navigate to correct pages
7. Session ID persists across messages
8. Both languages work seamlessly

**You're ready for production!** Ì∫Ä
