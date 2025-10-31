# AI Smart Scheduling API - Integration Guide

**Feature**: "Let AI choose the best available slot for me"  
**Status**: ‚úÖ UI Complete, Awaiting Backend API  
**Priority**: ÔøΩÔøΩ HIGH  
**Last Updated**: October 30, 2025

---

## Ì≥ç Frontend Locations

### 1. Client Booking Page
**File**: `apps/frontend/src/client/components/booking/QuickBooking.tsx`  
**Line**: ~228  
**UI Element**: Checkbox "Let AI choose the best available slot for me"

**Current Behavior**:
- User checks the AI checkbox
- Mock function `handleAISelection()` simulates AI selection
- Displays fake reasoning: "Based on your preferences and therapist availability..."

### 2. Admin Booking Modal
**File**: `apps/frontend/src/admin/components/modals/NewBookingModal.tsx`  
**Line**: ~179  
**UI Element**: Button "AI: G·ª£i √Ω khung gi·ªù t·ªët nh·∫•t"

**Current Behavior**:
- Button click (not yet functional)
- Should call AI API to suggest optimal slots

---

## ÌæØ API Endpoint

### **POST** `/api/v1/ai/chat/smart-schedule`

**Purpose**: AI intelligently selects the best available slot based on multiple factors

**Authentication**: Optional (enhanced for logged-in users)

---

## Ì≥• Request Format

```typescript
interface SmartScheduleRequest {
  sessionId?: string;           // For chat context (optional)
  serviceId: string;            // Required: Service UUID
  preferences?: {
    dateRange?: {
      start: string;            // YYYY-MM-DD (default: today)
      end: string;              // YYYY-MM-DD (default: today + 7 days)
    };
    timePreference?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    branchPreference?: string | 'closest' | 'any';
    avoidWeekends?: boolean;
    priority?: 'soonest' | 'best_price' | 'best_staff' | 'flexible';
  };
  context?: {
    userId?: string;            // For personalized recommendations
    previousBookings?: Array<{  // Historical pattern analysis
      serviceId: string;
      datetime: string;
    }>;
    skinConcerns?: string[];    // From quiz results
  };
}
```

### Example Request (Client Booking)
```json
{
  "serviceId": "a1b2c3d4-...",
  "preferences": {
    "dateRange": {
      "start": "2025-10-31",
      "end": "2025-11-07"
    },
    "timePreference": "afternoon",
    "branchPreference": "closest",
    "priority": "best_staff"
  },
  "context": {
    "userId": "user-uuid-123",
    "skinConcerns": ["acne", "hyperpigmentation"]
  }
}
```

### Example Request (Admin Modal - Quick Suggest)
```json
{
  "serviceId": "a1b2c3d4-...",
  "preferences": {
    "dateRange": {
      "start": "2025-10-31",
      "end": "2025-11-02"
    },
    "timePreference": "flexible",
    "priority": "soonest"
  }
}
```

---

## Ì≥§ Response Format

```typescript
interface SmartScheduleResponse {
  recommendedSlot: {
    datetime: string;           // ISO8601
    serviceId: string;
    serviceName: string;
    branchId: string;
    branchName: string;
    staffId: string;
    staffName: string;
    staffTitle?: string;        // e.g., "Senior Esthetician"
    price: number;
    duration: string;           // e.g., "60 min"
    confidence: number;         // 0-1 (how sure AI is)
    reasoning: string;          // Human-readable explanation
  };
  alternativeSlots: Array<{
    datetime: string;
    branchName: string;
    staffName: string;
    price: number;
    confidence: number;
    reasoning: string;
  }>;
  aiInsights?: {
    bestTimeForSkinType?: string;
    peakEffectiveness?: string;
    staffExpertise?: string;
    tip?: string;
  };
}
```

### Example Response
```json
{
  "recommendedSlot": {
    "datetime": "2025-10-31T14:00:00Z",
    "serviceId": "a1b2c3d4-...",
    "serviceName": "HydraFacial Treatment",
    "branchId": "branch-001",
    "branchName": "Downtown Spa",
    "staffId": "staff-emma",
    "staffName": "Emma Wilson",
    "staffTitle": "Senior Esthetician",
    "price": 150,
    "duration": "60 min",
    "confidence": 0.92,
    "reasoning": "Best match: Emma specializes in hydration treatments for acne-prone skin, and afternoon slots show 15% better results for this service type."
  },
  "alternativeSlots": [
    {
      "datetime": "2025-11-01T10:00:00Z",
      "branchName": "Westside Spa",
      "staffName": "Sarah Chen",
      "price": 150,
      "confidence": 0.85,
      "reasoning": "Earlier availability, Sarah also has excellent reviews for HydraFacial"
    },
    {
      "datetime": "2025-10-31T16:30:00Z",
      "branchName": "Downtown Spa",
      "staffName": "Emma Wilson",
      "price": 150,
      "confidence": 0.80,
      "reasoning": "Same specialist, slightly later time"
    }
  ],
  "aiInsights": {
    "bestTimeForSkinType": "Afternoon sessions recommended for oily/acne-prone skin",
    "peakEffectiveness": "Tuesday-Thursday afternoons show optimal results",
    "staffExpertise": "Emma Wilson: 8 years experience, 4.9‚òÖ rating, specializes in sensitive skin",
    "tip": "Book 2-3 days in advance for better staff availability"
  }
}
```

---

## Ì¥ñ AI Selection Algorithm

### Scoring Weights (Total: 100%)
1. **User Preference Matching** (40%)
   - Time of day preference
   - Date range compliance
   - Branch location preference

2. **Staff Expertise** (25%)
   - Service specialization
   - Years of experience
   - Customer ratings (4.5+ stars)
   - Previous success with similar skin types

3. **Historical Performance** (20%)
   - Booking success rate for time slot
   - Customer satisfaction for service+staff combination
   - No-show rate for time slot

4. **Convenience Factors** (15%)
   - Travel distance to branch
   - Parking availability
   - Adjacent slot availability (for add-ons)

### Fallback Strategy
If AI model unavailable:
- Use rule-based scoring
- Prioritize highest-rated available staff
- Return 3 best options with `confidence: 0.70`

---

## Ì≤ª Frontend Integration Code

### QuickBooking.tsx Integration

**Location**: Line ~228 in `handleAISelection` function

```typescript
const handleAISelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const useAI = e.target.checked;
    
    setFormData(prev => ({ ...prev, useAI }));
    
    if (!useAI) {
        // User unchecked AI, clear AI selections
        setFormData(prev => ({
            ...prev,
            date: '',
            time: '',
            aiReasoning: ''
        }));
        return;
    }
    
    // TODO: Replace mock with actual API call
    try {
        const response = await fetch('/api/v1/ai/chat/smart-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceId: formData.service,
                preferences: {
                    dateRange: {
                        start: new Date().toISOString().split('T')[0],
                        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    },
                    timePreference: 'flexible',
                    branchPreference: 'closest',
                    priority: 'best_staff'
                },
                context: {
                    userId: currentUser?.id,
                    skinConcerns: skinQuizResults?.concerns // from quiz
                }
            })
        });
        
        const data: SmartScheduleResponse = await response.json();
        
        // Update form with AI recommendation
        setFormData(prev => ({
            ...prev,
            date: data.recommendedSlot.datetime.split('T')[0],
            time: data.recommendedSlot.datetime.split('T')[1].substring(0, 5),
            branch: data.recommendedSlot.branchId,
            therapist: data.recommendedSlot.staffId,
            aiReasoning: data.recommendedSlot.reasoning
        }));
        
        // Show AI insights
        toast.success(`AI found the perfect slot: ${data.recommendedSlot.staffName} at ${data.recommendedSlot.branchName}`);
        
    } catch (error) {
        console.error('AI scheduling failed:', error);
        toast.error('AI scheduling unavailable, please select manually');
        setFormData(prev => ({ ...prev, useAI: false }));
    }
};
```

### NewBookingModal.tsx Integration

**Location**: Line ~179 button click handler

```typescript
const handleAISuggestSlot = async () => {
    if (!formData.service) {
        toast.error('Vui l√≤ng ch·ªçn d·ªãch v·ª• tr∆∞·ªõc');
        return;
    }
    
    setLoading(true);
    
    try {
        const response = await fetch('/api/v1/ai/chat/smart-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceId: formData.service,
                preferences: {
                    dateRange: {
                        start: new Date().toISOString().split('T')[0],
                        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next 3 days
                    },
                    timePreference: 'flexible',
                    priority: 'soonest'
                }
            })
        });
        
        const data: SmartScheduleResponse = await response.json();
        
        // Auto-fill form
        setFormData(prev => ({
            ...prev,
            date: data.recommendedSlot.datetime.split('T')[0],
            time: data.recommendedSlot.datetime.split('T')[1].substring(0, 5),
            therapist: data.recommendedSlot.staffId
        }));
        
        toast.success(`ƒê√£ ch·ªçn: ${data.recommendedSlot.staffName} - ${data.recommendedSlot.datetime}`);
        
    } catch (error) {
        console.error('AI suggestion failed:', error);
        toast.error('Kh√¥ng th·ªÉ g·ª£i √Ω khung gi·ªù, vui l√≤ng ch·ªçn th·ªß c√¥ng');
    } finally {
        setLoading(false);
    }
};

// Add onClick to button
<button 
    onClick={handleAISuggestSlot}
    className='text-sm text-purple-600 hover:text-purple-700 font-medium'
>
    AI: G·ª£i √Ω khung gi·ªù t·ªët nh·∫•t
</button>
```

---

## Ì∑™ Testing Checklist

### Unit Tests
- [ ] Request validation (missing serviceId, invalid dates)
- [ ] AI scoring algorithm accuracy
- [ ] Fallback to rule-based when AI unavailable
- [ ] Response format compliance

### Integration Tests
- [ ] Full booking flow with AI selection
- [ ] Alternative slots displayed correctly
- [ ] Error handling (no slots available)
- [ ] Performance (response < 2 seconds)

### User Acceptance Tests
- [ ] QuickBooking.tsx checkbox workflow
- [ ] NewBookingModal.tsx button workflow
- [ ] AI reasoning displayed clearly
- [ ] Alternative slots selectable
- [ ] Works for logged-in and guest users

---

## Ì≥ä Success Metrics

**Target KPIs**:
- **Adoption Rate**: 40%+ of bookings use AI scheduling
- **Satisfaction**: 85%+ users accept AI recommendation
- **Accuracy**: 90%+ AI slots result in confirmed bookings
- **Speed**: < 2 seconds response time (p95)

**Analytics to Track**:
- `ai_schedule_request_count`
- `ai_schedule_acceptance_rate`
- `ai_schedule_alternative_selection_rate`
- `ai_schedule_response_time_ms`

---

## Ì¥í Rate Limiting

- **Guest Users**: 5 requests/minute
- **Authenticated Users**: 15 requests/minute
- **Admin Users**: No limit

---

## Ì≥û Support & Documentation

- **Full AI Features Spec**: [docs/architecture/ai-features-specification.md](../architecture/ai-features-specification.md)
- **Quick Reference**: [docs/AI-FEATURES-QUICK-REFERENCE.md](../AI-FEATURES-QUICK-REFERENCE.md)
- **Backend Contact**: Check with backend team lead

---

**Ready to Integrate?** Contact backend team when API is deployed to staging!
