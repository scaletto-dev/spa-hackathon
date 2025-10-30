# 🎨 Support Dashboard - Visual Guide

## 🖼️ Screen Layouts

### 1. Support Login Page (`/support`)

```
┌────────────────────────────────────────────────┐
│                                                │
│              💬 Support Dashboard              │
│              Customer service portal            │
│                                                │
│     ┌────────────────────────────────────┐    │
│     │  👤 Quick Login as Staff           │    │
│     └────────────────────────────────────┘    │
│                                                │
│     ℹ️  Demo Mode                             │
│     This is a mock login for development       │
│                                                │
│     ✨ Features:                               │
│     • Real-time chat with customers            │
│     • AI-powered reply suggestions             │
│     • Conversation management                  │
│     • Typing indicators                        │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 2. Conversation List (`/support-dashboard`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Support Dashboard                        🟢 Connected           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🔍 Search conversations...                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  [ All ]  [ Active ]  [ Mine ]  [ Closed ]                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐ 2️⃣     │
│  │  👤 Sarah Johnson              ⚡ active             │        │
│  │  I need help booking a facial treatment              │        │
│  │  ⏰ 1m ago                                           │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐ 1️⃣     │
│  │  👤 Michael Chen               ⏳ pending    [Take]  │        │
│  │  What are the prices for laser hair removal?        │        │
│  │  ⏰ 10m ago                                          │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  👤 Emma Wilson                ✓ closed              │        │
│  │  Thank you for the help!                             │        │
│  │  ⏰ 45m ago                                          │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**

-   **Unread badges** (pink circle with count)
-   **Status indicators** (colored dots: green/yellow/gray)
-   **Take button** for pending conversations
-   **Real-time updates** when new messages arrive
-   **Search + filters** for quick navigation

---

### 3. Chat Room (`/support-dashboard/chat/:id`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← 👤 Sarah Johnson  •  Active now          [✨ AI Hints] [✓ Close Chat]   │
├─────────────────────────────────────────────┬───────────────────────────────┤
│                                              │  ✨ AI Suggestions            │
│  Message Area                                │  ┌─────────────────────────┐ │
│  ─────────────────────────────────           │  │ I can help you book a   │ │
│                                              │  │ facial treatment. What  │ │
│  👤  Hi, I need help booking                 │  │ date works best for you?│ │
│      a facial treatment                      │  │ 92% confidence          │ │
│      10:15 AM                                │  └─────────────────────────┘ │
│                                              │                               │
│  ✨  I can help you with that!               │  ┌─────────────────────────┐ │
│      We have several facial                  │  │ Our facial treatments   │ │
│      treatments available.                   │  │ range from $150-$250.   │ │
│      10:16 AM                                │  │ 88% confidence          │ │
│                                              │  └─────────────────────────┘ │
│  👤  What are the prices?                    │                               │
│      10:17 AM                                │  ┌─────────────────────────┐ │
│                                              │  │ We have availability    │ │
│              You: Our prices range from 💬   │  │ this week. Let me check │ │
│              $150-$250 depending on...       │  │ 85% confidence          │ │
│              10:18 AM                        │  └─────────────────────────┘ │
│                                              │                               │
│  👤  ...                                     │  [🔄 Generate New]           │
│      Typing...                               │                               │
│                                              │                               │
├─────────────────────────────────────────────┴───────────────────────────────┤
│  😊  📎  ┌────────────────────────────────────────────────────┐  [Send]     │
│          │  Type your message...                               │             │
│          └────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**

**Left Panel (Chat):**

-   Message bubbles (customer: white, staff: gradient, AI: lavender)
-   Avatars for each sender
-   Timestamps
-   Typing indicator ("...")
-   Auto-scroll to bottom
-   Multiline input support

**Right Panel (AI Hints):**

-   2-3 AI-generated suggestions
-   Confidence scores with color coding
-   Click to auto-fill input
-   Refresh button for new suggestions
-   Collapsible panel

**Input Area:**

-   Emoji picker (ready)
-   Attachment button (ready)
-   Multiline textarea
-   Enter to send, Shift+Enter for newline

---

## 🎨 Color Scheme

### Primary Colors

```
┌─────────────────────────────────────────────┐
│  Pink to Purple Gradient                    │
│  from-pink-500 to-purple-500                │
│  #ec4899 → #a855f7                          │
└─────────────────────────────────────────────┘
```

### Message Bubbles

```
Customer:  ┌──────────────┐  White bg, gray border
           │ Hello!        │  #ffffff, border-gray-200
           └──────────────┘

Staff:     ┌──────────────┐  Pink-purple gradient
           │ Hi there!     │  from-pink-500 to-purple-500
           └──────────────┘  Text: white

AI:        ┌──────────────┐  Lavender bg, purple border
           │ ✨ Suggestion │  from-purple-50 to-pink-50
           └──────────────┘  border-purple-200
```

### Status Indicators

```
🟢 Green (Active)    - bg-green-100, text-green-700
🟡 Yellow (Pending)  - bg-yellow-100, text-yellow-700
⚪ Gray (Closed)     - bg-gray-100, text-gray-700
```

---

## ⚡ Animations

### Framer Motion Effects

1. **Page Transitions**

    ```
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    ```

2. **Message Appear**

    ```
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    ```

3. **Hover Effects**

    ```
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    ```

4. **AI Panel Slide**

    ```
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    ```

5. **Typing Indicator**
    ```
    3 dots with staggered bounce animation
    animationDelay: 0ms, 200ms, 400ms
    ```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)

-   Stack layout vertically
-   Hide AI panel by default
-   Full-width conversation cards
-   Collapsible filters

### Tablet (768px - 1024px)

-   2-column chat layout
-   AI panel toggleable
-   Conversation list with sidebar

### Desktop (> 1024px)

-   Full 3-column layout (optional left sidebar)
-   AI panel always visible
-   Wide conversation cards

---

## 🎯 Interactive States

### Conversation Card

```
Default:    border-gray-200, shadow-sm
Hover:      scale: 1.02, shadow-md
Active:     border-pink-300
Unread:     Bold text, pink badge
```

### Message Input

```
Empty:      border-gray-300
Focus:      ring-2 ring-pink-500
Sending:    Disabled, opacity-50
```

### AI Suggestion

```
Default:    border-gray-200
Hover:      border-pink-300, shadow-md, scale: 1.02
Selected:   bg-pink-50
```

---

## 🔔 Notifications

### Toast Messages

```
Success:  ✅ "Conversation assigned to you"
Info:     💬 "New chat from Guest #123"
Error:    ❌ "Failed to send message"
```

### Connection Status

```
🟢 Connected     - Green pulsing dot
🔴 Disconnected  - Red dot
```

---

## ✨ Special Effects

### Glassmorphism

```css
background: bg-white/80
backdrop-filter: backdrop-blur-md
border: border-gray-200
```

### Gradient Backgrounds

```css
bg-gradient-to-br from-pink-50 via-white to-lavender-50
```

### Shadows

```css
shadow-sm    - Subtle
shadow-md    - Medium (hover)
shadow-lg    - Large (buttons)
shadow-2xl   - Extra large (modals)
```

---

## 🎪 Demo Flow

1. **Visit `/support`** → See login page
2. **Click "Quick Login"** → Auto-login as staff
3. **Redirected to `/support-dashboard`** → See conversation list
4. **Click conversation** → Enter chat room
5. **Send message** → Optimistic update
6. **Toggle AI panel** → View suggestions
7. **Click suggestion** → Auto-fill input
8. **Close chat** → Return to list

---

**Designed with ❤️ for BeautyAI Spa**
