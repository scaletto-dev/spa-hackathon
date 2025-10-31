# 💬 Support Dashboard - Implementation Guide

## 📋 Overview

The Support Dashboard is a **completely isolated** view from Client and Admin interfaces, designed specifically for customer support staff to handle live chat conversations with customers in real-time.

### ✨ Key Features

-   ✅ **Real-time messaging** via Socket.IO
-   ✅ **AI-powered suggestions** to help staff respond faster
-   ✅ **Conversation management** with filtering and search
-   ✅ **Typing indicators** for both customer and staff
-   ✅ **Optimistic UI updates** for instant feedback
-   ✅ **Conversation assignment** - staff can "take" pending chats
-   ✅ **Multi-sender support** - Customer, Staff, and AI messages
-   ✅ **Beautiful gradient UI** with glassmorphism effects

---

## 🗂️ File Structure

```
src/support/
├── types.ts                      # TypeScript type definitions
├── layouts/
│   └── SupportLayout.tsx         # Full-screen layout (no navbar/footer)
├── pages/
│   ├── ConversationList.tsx      # Main dashboard with all conversations
│   └── ChatRoom.tsx              # 1-on-1 chat interface
├── components/
│   └── AIHintPanel.tsx           # AI suggestion sidebar
└── README.md                     # This file
```

---

## 🚀 Routes

| Route                                     | Description       | Auth Required   |
| ----------------------------------------- | ----------------- | --------------- |
| `/support-dashboard`                      | Conversation list | `role: 'staff'` |
| `/support-dashboard/chat/:conversationId` | Chat room         | `role: 'staff'` |

---

## 🔐 Authentication & Role Guard

The Support Dashboard is protected by `RequireRole` guard with `role='staff'`:

```tsx
<RequireRole role='staff'>
    <SupportLayout />
</RequireRole>
```

### Testing Access

To test the support dashboard, set staff role in localStorage:

```javascript
// In browser console:
localStorage.setItem(
    'user_data',
    JSON.stringify({
        id: 'staff-1',
        fullName: 'Support Agent',
        email: 'support@beautyai.com',
        role: 'STAFF',
    }),
);
localStorage.setItem('accessToken', 'mock-token');
// Reload page
location.reload();
```

Then navigate to: `http://localhost:3000/support-dashboard`

---

## 🔌 Socket.IO Integration

### Connection Setup

The `SocketProvider` automatically connects to the backend WebSocket server:

```typescript
// Default URL: http://localhost:5000
// Can be configured via VITE_SOCKET_URL env variable
```

### Socket Events

#### **Client → Server**

| Event                 | Payload                               | Description                  |
| --------------------- | ------------------------------------- | ---------------------------- |
| `conversation:join`   | `{ conversationId }`                  | Join a conversation room     |
| `conversation:leave`  | `{ conversationId }`                  | Leave a conversation room    |
| `conversation:assign` | `{ conversationId, staffId }`         | Assign conversation to staff |
| `conversation:close`  | `{ conversationId }`                  | Close/end a conversation     |
| `message:send`        | `{ conversationId, content, sender }` | Send a message               |

#### **Server → Client**

| Event                   | Payload                        | Description              |
| ----------------------- | ------------------------------ | ------------------------ |
| `conversation:new`      | `Conversation`                 | New conversation created |
| `message:new`           | `Message`                      | New message received     |
| `user:typing`           | `{ conversationId, isTyping }` | Typing indicator         |
| `conversation:assigned` | `{ conversationId, staffId }`  | Conversation assigned    |

---

## 🧠 AI Suggestion Panel

### How It Works

1. **Automatic**: AI panel auto-opens when entering a chat
2. **Context-aware**: Suggestions based on conversation history
3. **Confidence scores**: Each suggestion shows confidence level
4. **One-click use**: Click suggestion to auto-fill input
5. **Refresh**: Generate new suggestions anytime

### API Integration

Currently using **mock data**. To connect real AI:

```typescript
// In AIHintPanel.tsx - replace mockFetchSuggestions with:

const response = await fetch(`/api/v1/ai/suggest?conversationId=${conversationId}`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
const suggestions = await response.json();
```

Expected API response:

```typescript
interface AISuggestion {
    id: string;
    content: string; // Suggested reply text
    confidence: number; // 0.0 - 1.0
    reasoning?: string; // Why this suggestion
}
```

---

## 💾 Data Models

### Conversation

```typescript
interface Conversation {
    id: string;
    customerName: string;
    customerAvatar?: string;
    lastMessage: string;
    status: 'active' | 'closed' | 'pending';
    unreadCount: number;
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    assignedTo?: string; // Staff ID or 'me'
}
```

### Message

```typescript
interface Message {
    id: string;
    conversationId: string;
    sender: 'customer' | 'staff' | 'ai';
    senderName?: string;
    senderAvatar?: string;
    content: string;
    createdAt: string; // ISO 8601
    isRead?: boolean;
}
```

---

## 🎨 Design System

### Color Palette

-   **Primary Gradient**: `from-pink-500 to-purple-500`
-   **AI Messages**: `from-purple-50 to-pink-50` with lavender border
-   **Customer Messages**: White with gray border
-   **Staff Messages**: Pink-purple gradient with white text
-   **Background**: `from-pink-50 via-white to-lavender-50`

### Components Style

-   **Glassmorphism**: `bg-white/80 backdrop-blur-md`
-   **Rounded corners**: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
-   **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-2xl`
-   **Transitions**: `transition-all duration-200`

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `apps/frontend/`:

```bash
# Socket.IO Backend URL
VITE_SOCKET_URL=http://localhost:5000

# API Base URL (for AI suggestions, conversation API, etc.)
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📡 API Endpoints to Implement

### Backend TODO List

#### 1. Conversations API

```typescript
// GET /api/v1/conversations
// Query params: ?status=active&assignedTo=me
Response: Conversation[]

// POST /api/v1/conversations/:id/assign
Body: { staffId: string }
Response: { success: boolean }

// POST /api/v1/conversations/:id/close
Response: { success: boolean }
```

#### 2. Messages API

```typescript
// GET /api/v1/conversations/:id/messages
Response: Message[]

// POST /api/v1/messages
Body: { conversationId, content, sender }
Response: Message
```

#### 3. AI Suggestions API

```typescript
// GET /api/v1/ai/suggest?conversationId=xxx
Response: AISuggestion[]

// POST /api/v1/ai/suggest/refresh
Body: { conversationId }
Response: AISuggestion[]
```

---

## 🚦 Feature Checklist

### ✅ Completed

-   [x] Support Dashboard layout and routing
-   [x] Conversation list with filters
-   [x] Real-time chat room
-   [x] AI suggestion panel
-   [x] Socket.IO integration
-   [x] Typing indicators
-   [x] Optimistic UI updates
-   [x] Role-based access control
-   [x] Responsive design
-   [x] Beautiful gradient UI

### 🔄 In Progress / TODO

-   [ ] Connect to real backend API endpoints
-   [ ] Implement conversation persistence
-   [ ] Add file attachment support
-   [ ] Add emoji picker
-   [ ] Add conversation summary (AI-generated)
-   [ ] Add notification sounds
-   [ ] Add staff status (online/away/offline)
-   [ ] Add conversation transfer between staff
-   [ ] Add canned responses library
-   [ ] Add conversation history/archive
-   [ ] Add analytics dashboard

---

## 🧪 Testing

### Manual Testing Steps

1. **Access Support Dashboard**

    ```bash
    # Set staff role in localStorage (see Auth section)
    # Navigate to /support-dashboard
    ```

2. **Test Conversation List**

    - Verify all conversations load
    - Test search functionality
    - Test filter tabs (All/Active/Mine/Closed)
    - Click "Take" button on pending conversations

3. **Test Chat Room**

    - Click a conversation to enter chat
    - Send messages (should appear immediately)
    - Test Enter key to send
    - Test multiline with Shift+Enter
    - Toggle AI suggestions panel
    - Click AI suggestions (should fill input)
    - Close conversation

4. **Test Real-time Features**
    - Open chat in two browser tabs
    - Send message from one → should appear in other
    - Test typing indicator
    - Test new conversation notification

---

## 🐛 Troubleshooting

### Socket Connection Issues

```typescript
// Check socket connection status
const { socket, isConnected } = useSocket();
console.log('Socket:', socket?.id, 'Connected:', isConnected);
```

### Common Issues

1. **"Socket is null"** → SocketProvider not wrapping component
2. **"Role guard redirect"** → User role not set to 'staff'
3. **"Messages not sending"** → Check socket connection + backend
4. **"AI suggestions not loading"** → Replace mock with real API

---

## 📚 Additional Resources

-   [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
-   [React Router v6 Docs](https://reactrouter.com/)
-   [Framer Motion Docs](https://www.framer.com/motion/)
-   [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 🎯 Next Steps

1. **Backend Integration**: Implement conversation and message APIs
2. **Socket.IO Backend**: Set up Socket.IO server with rooms
3. **AI Integration**: Connect Gemini API for real suggestions
4. **Testing**: Write unit + integration tests
5. **Production**: Add error boundaries + logging

---

**Built with ❤️ for BeautyAI Spa Hackathon**
