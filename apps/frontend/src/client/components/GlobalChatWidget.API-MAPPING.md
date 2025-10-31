# GlobalChatWidget - API Integration Guide

## Overview
This component is ready for backend integration with the following features:
- ‚úÖ **AI Chat** - Automated responses with FAQ patterns
- ‚úÖ **Live Chat** - Human agent escalation
- ‚úÖ **Quick Booking** - In-chat appointment booking
- ‚úÖ **UI Complete** - All states and interactions implemented

---

## Ì¥å API Endpoints to Integrate

### 1. Send Message (AI Mode)
**Current**: Mock `getBotResponse()` function with pattern matching  
**Target**: `POST /api/v1/ai/chat`

**Location in code**: Line ~85 (`handleSend` function)

```typescript
// TODO: Replace mock with API call
const response = await fetch('/api/v1/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userInputText,
    sessionId: localStorage.getItem('chatSessionId'),
    context: {
      currentPage: window.location.pathname,
      userId: currentUser?.id // if logged in
    }
  })
});

const data = await response.json();
// data = { reply, suggestions, sessionId, actions }
```

---

### 2. Request Live Agent
**Current**: Mock agent connection with setTimeout  
**Target**: `POST /api/v1/ai/chat/request-agent`

**Location in code**: Line ~254 (`requestLiveAgent` function)

```typescript
// TODO: Replace mock with API call
const response = await fetch('/api/v1/ai/chat/request-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: chatSessionId,
    reason: 'booking_help', // or 'complex_question', 'complaint'
    priority: 'normal'
  })
});

const data = await response.json();
// data = { queuePosition, estimatedWaitTime, status, agent }

if (data.status === 'connected') {
  setAgentInfo(data.agent);
  setChatMode('live');
}
```

---

### 3. WebSocket Connection (Live Chat)
**Current**: Not implemented, uses mock agent messages  
**Target**: WebSocket `/ws/live-chat/:sessionId`

**Location in code**: Add after agent connection (Line ~271)

```typescript
// TODO: Add WebSocket connection
const ws = new WebSocket(`wss://api.example.com/ws/live-chat/${sessionId}`);

ws.onopen = () => {
  console.log('Connected to live chat');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'agent_connected':
      setAgentInfo(data.agent);
      setChatMode('live');
      break;
      
    case 'message':
      setMessages(prev => [...prev, {
        type: 'agent',
        text: data.content,
        timestamp: new Date(data.timestamp)
      }]);
      break;
      
    case 'agent_typing':
      setIsAgentTyping(data.isTyping);
      break;
      
    case 'booking_suggestion':
      // Handle booking suggestion
      break;
  }
};

// Send message via WebSocket in live mode
ws.send(JSON.stringify({
  type: 'message',
  content: input
}));
```

---

### 4. Show Booking Slots
**Current**: Mock booking data hardcoded  
**Target**: `POST /api/v1/ai/chat/suggest-booking`

**Location in code**: Line ~291 (`showBookingSlots` function)

```typescript
// TODO: Replace mock with API call
const response = await fetch('/api/v1/ai/chat/suggest-booking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: chatSessionId,
    serviceId: serviceType, // optional
    preferredDate: null, // user can specify
    preferredTime: null  // 'morning', 'afternoon', 'evening'
  })
});

const data = await response.json();
// data = { suggestions: [{ serviceId, serviceName, availableSlots: [...] }] }

setMessages(prev => [...prev, {
  type: 'bot',
  text: t('chat.availableSlots'),
  timestamp: new Date(),
  bookingData: data.suggestions[0]
}]);
```

---

### 5. Quick Book Appointment
**Current**: Mock toast notification only  
**Target**: `POST /api/v1/ai/chat/quick-book`

**Location in code**: Line ~326 (`handleBookSlot` function)

```typescript
// TODO: Replace mock with API call
const response = await fetch('/api/v1/ai/chat/quick-book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: chatSessionId,
    serviceId: bookingData.serviceId,
    datetime: slot.datetime,
    branchId: slot.branchId,
    customerInfo: {
      name: currentUser?.name || 'Guest',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    },
    notes: `Booked via chat on ${new Date().toISOString()}`
  })
});

const data = await response.json();
// data = { bookingId, referenceNumber, status, confirmationUrl }

if (data.status === 'confirmed') {
  toast.success(t('chat.bookingConfirmed'));
  setMessages(prev => [...prev, {
    type: 'system',
    text: t('chat.bookingSuccess', {
      service: serviceName,
      time: new Date(slot.datetime).toLocaleString()
    }),
    timestamp: new Date()
  }]);
}
```

---

## Ì≥ä State Management

### Current State Variables
- `messages: Message[]` - Chat history
- `input: string` - Current input text
- `chatMode: 'ai' | 'live' | 'booking'` - Current chat mode
- `agentInfo: AgentInfo | null` - Connected agent details
- `isAgentTyping: boolean` - Agent typing indicator
- `queuePosition: number | null` - Position in agent queue

### Session Storage
Consider storing:
- `chatSessionId` - Unique session identifier
- `chatHistory` - Last 20 messages for context
- `agentId` - Connected agent ID (for reconnection)

---

## Ìæ® UI States

### Chat Modes
1. **AI Mode** (default)
   - Pink/purple gradient header
   - SparklesIcon avatar
   - Shows FAQ responses + action buttons

2. **Live Mode** (agent connected)
   - Blue/indigo gradient header
   - UserIcon avatar with online status dot
   - Shows agent name + typing indicator

3. **Queue Mode** (waiting for agent)
   - Shows queue position in header
   - System message: "Connecting to staff..."

### Message Types
- `user` - User messages (right, pink gradient)
- `bot` - AI responses (left, white bg)
- `agent` - Staff messages (left, blue bg)
- `system` - System notifications (center, gray italic)

### Interactive Elements
- **Action Buttons** - Quick actions (talk to agent, view pricing)
- **Booking Slots** - Clickable time slots with date/time/price
- **Typing Indicator** - 3 animated dots for agent typing

---

## Ì∑™ Testing Checklist

- [ ] Send message in AI mode
- [ ] Trigger FAQ responses (hours, pricing, location)
- [ ] Request live agent
- [ ] Test queue mode (if no agents available)
- [ ] Agent connects successfully
- [ ] Send message in live mode
- [ ] Request booking slots
- [ ] Click booking slot to book
- [ ] Verify booking confirmation
- [ ] Close/reopen chat maintains session
- [ ] ESC key closes chat
- [ ] Mobile responsive

---

## Ì¥ê Security Notes

1. **Session Management**
   - Generate secure session IDs on client
   - Validate on backend
   - Expire after 30 minutes of inactivity

2. **Rate Limiting**
   - Max 20 messages per minute in AI mode
   - Max 3 agent requests per hour

3. **Input Sanitization**
   - Sanitize all user input before sending to API
   - Prevent XSS in rendered messages

4. **Authentication**
   - Optional for AI chat
   - Required for booking
   - Enhanced experience for logged-in users

---

## Ì≥ù Future Enhancements

- [ ] Voice input/output
- [ ] Image sharing
- [ ] Chat transcript email
- [ ] Satisfaction rating after session
- [ ] Proactive chat suggestions
- [ ] Multi-language auto-detection
- [ ] Chat analytics dashboard

---

**Last Updated**: October 30, 2025  
**Component**: `apps/frontend/src/client/components/GlobalChatWidget.tsx`  
**API Spec**: See `docs/architecture/ai-features-specification.md`
