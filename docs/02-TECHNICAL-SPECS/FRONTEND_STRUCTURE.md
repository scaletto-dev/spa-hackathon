# Frontend Structure - Beauty Clinic Care Website

**Date:** October 29, 2025  
**Framework:** React 18 + TypeScript + Vite  
**UI Library:** TailwindCSS + Custom Components  
**Router:** React Router v6  
**Animation:** Framer Motion  
**Charts:** Recharts  

---

## ��� Directory Tree

```
apps/frontend/
├── ��� Configuration Files
│   ├── .env.example              # Environment variables template
│   ├── .env.local                # Local environment variables (gitignored)
│   ├── .eslintrc.cjs             # ESLint configuration (legacy)
│   ├── eslint.config.js          # ESLint flat config
│   ├── .gitignore                # Git ignore rules
│   ├── index.html                # HTML entry point
│   ├── package.json              # NPM dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # TailwindCSS configuration
│   ├── tsconfig.json             # TypeScript root config
│   ├── tsconfig.app.json         # TypeScript app config
│   ├── tsconfig.node.json        # TypeScript Node.js config
│   ├── vite.config.ts            # Vite bundler config
│   ├── FORM_UI_COMPONENTS.md     # Form components documentation
│   └── README.md                 # Frontend documentation
│
├── ��� public/                    # Static assets (served directly)
│
└── ��� src/                       # Source code
    │
    ├── ��� Entry Points
    │   ├── index.tsx             # React app entry point
    │   ├── index.css             # Global styles (TailwindCSS)
    │   ├── App.tsx               # Root app component
    │   └── vite-env.d.ts         # Vite type declarations
    │
    ├── ��� auth/                  # Authentication Module
    │   └── useAuth.ts            # Auth hook (login, register, Google OAuth)
    │
    ├── �� client/                # CLIENT-FACING FEATURES
    │   │
    │   ├── ��� pages/             # Client Pages
    │   │   ├── Home.tsx                    # Homepage (/)
    │   │   ├── ServicesPage.tsx            # Services catalog (/services)
    │   │   ├── BookingPage.tsx             # Booking wizard (/booking)
    │   │   ├── BranchesPage.tsx            # Branch locator (/branches)
    │   │   ├── BlogPage.tsx                # Blog list (/blog)
    │   │   ├── BlogDetailPage.tsx          # Blog post detail (/blog/:slug)
    │   │   ├── ContactPage.tsx             # Contact form (/contact)
    │   │   ├── LoginPage.tsx               # Client login (/login)
    │   │   ├── RegisterPage.tsx            # Client registration (/register)
    │   │   ├── QuizPage.tsx                # Quiz feature (optional)
    │   │   └── FormShowcasePage.tsx        # Form components demo
    │   │
    │   ├── ��� layouts/           # Client Layouts
    │   │   └── ClientLayout.tsx            # Main client layout (Navbar + Footer)
    │   │
    │   └── ��� components/        # Client Components
    │       │
    │       ├── ��� Home/                    # Homepage Components
    │       │   ├── Hero.tsx
    │       │   ├── AIBanner.tsx
    │       │   ├── BookingWidget.tsx
    │       │   ├── Branches.tsx
    │       │   └── Testimonials.tsx
    │       │
    │       ├── ��� services/                # Services Components
    │       │   ├── ServicesBanner.tsx
    │       │   ├── CategoryFilter.tsx
    │       │   ├── ServiceCard.tsx
    │       │   ├── Services.tsx
    │       │   └── ServicesCTA.tsx
    │       │
    │       ├── ��� booking/                 # Booking Wizard Components
    │       │   ├── types.ts                        # Booking data types
    │       │   ├── BookingProgress.tsx             # Step indicator
    │       │   ├── BookingServiceSelect.tsx        # Step 1: Select service
    │       │   ├── BookingBranchSelect.tsx         # Step 2: Select branch
    │       │   ├── BookingDateTimeSelect.tsx       # Step 3: Date & time
    │       │   ├── BookingUserInfo.tsx             # Step 4: User info form
    │       │   ├── BookingPayment.tsx              # Step 5: Payment method
    │       │   ├── BookingConfirmation.tsx         # Step 6: Confirmation
    │       │   ├── QuickBooking.tsx                # Quick booking mode
    │       │   ├── QuickBookingConfirmationModal.tsx
    │       │   ├── TherapistSelector.tsx
    │       │   ├── AvailabilityIndicator.tsx
    │       │   └── InlinePaymentMethod.tsx
    │       │
    │       ├── ��� payment/                 # Payment Components
    │       │   ├── PaymentMethodSelector.tsx
    │       │   ├── CardPayment.tsx
    │       │   ├── EWalletPayment.tsx
    │       │   ├── BankTransferPayment.tsx
    │       │   ├── PayAtClinicPayment.tsx
    │       │   ├── PromoCodeInput.tsx
    │       │   ├── OrderSummary.tsx
    │       │   └── PaymentSuccess.tsx
    │       │
    │       ├── ��� branches/                # Branches Components
    │       │   └── BranchMap.tsx                   # Google Maps integration
    │       │
    │       ├── ��� blog/                    # Blog Components
    │       │   ├── Blog.tsx
    │       │   ├── BlogHero.tsx
    │       │   ├── BlogGrid.tsx
    │       │   └── BlogSidebar.tsx
    │       │
    │       ├── ��� contact/                 # Contact Components
    │       │   ├── ContactForm.tsx
    │       │   ├── ContactInfo.tsx
    │       │   └── AIChatWidget.tsx
    │       │
    │       ├── ��� layouts/                 # Shared Layout Components
    │       │   ├── Navbar.tsx
    │       │   └── Footer.tsx
    │       │
    │       ├── GlobalChatWidget.tsx        # Floating chat widget
    │       └── ScrollToTop.tsx             # Scroll to top on route change
    │
    ├── ���‍��� admin/                 # ADMIN PORTAL FEATURES
    │   │
    │   ├── ��� pages/             # Admin Pages
    │   │   ├── AdminLoginPage.tsx          # Admin login (/admin/login)
    │   │   ├── Dashboard.tsx               # Admin dashboard (/admin)
    │   │   ├── Appointments.tsx            # Appointments management (/admin/appointments)
    │   │   ├── Services.tsx                # Services CRUD (/admin/services)
    │   │   ├── Branches.tsx                # Branches CRUD (/admin/branches)
    │   │   ├── Customers.tsx               # Customer management (/admin/customers)
    │   │   ├── Staff.tsx                   # Staff management (/admin/staff)
    │   │   ├── Payments.tsx                # Payments & transactions (/admin/payments)
    │   │   ├── Reviews.tsx                 # Review moderation (/admin/reviews)
    │   │   ├── Blog.tsx                    # Blog CMS (/admin/blog)
    │   │   └── Settings.tsx                # Admin settings (/admin/settings)
    │   │
    │   ├── ��� layouts/           # Admin Layouts
    │   │   └── AdminLayout.tsx             # Admin layout (Sidebar + Header)
    │   │
    │   └── ��� components/        # Admin Components
    │       │
    │       ├── ��� dashboard/               # Dashboard Components
    │       │   ├── MetricCard.tsx
    │       │   └── AIInsightsPanel.tsx
    │       │
    │       ├── ��� layout/                  # Layout Components
    │       │   ├── Header.tsx
    │       │   └── Sidebar.tsx
    │       │
    │       ├── ��� modals/                  # Admin Modals
    │       │   ├── NewBookingModal.tsx
    │       │   ├── CustomerModal.tsx
    │       │   ├── CustomerDetailsModal.tsx
    │       │   ├── StaffModal.tsx
    │       │   ├── BlogPostModal.tsx
    │       │   ├── ReviewReplyModal.tsx
    │       │   ├── PaymentDetailsModal.tsx
    │       │   └── RefundModal.tsx
    │       │
    │       ├── AIAssistant.tsx             # AI assistant component
    │       └── Toast.tsx                   # Toast notification
    │
    ├── ��� components/            # SHARED UI COMPONENTS
    │   └── ��� ui/                          # Reusable UI Components
    │       ├── index.ts                    # UI components barrel export
    │       ├── FormField.tsx               # Form field wrapper
    │       ├── Input.tsx                   # Input component
    │       ├── Textarea.tsx                # Textarea component
    │       ├── Select.tsx                  # Select dropdown
    │       ├── MultiSelect.tsx             # Multi-select dropdown
    │       ├── RadioCheckbox.tsx           # Radio & checkbox
    │       ├── DatePicker.tsx              # Date picker
    │       ├── TimePicker.tsx              # Time picker
    │       └── Toggle.tsx                  # Toggle switch
    │
    ├── ���️ routes/                # ROUTING CONFIGURATION
    │   ├── route-map.tsx                   # Route definitions (React Router v6)
    │   ├── RootBoundary.tsx                # Error boundary
    │   │
    │   ├── ��� guards/                      # Route Guards
    │   │   ├── ProtectedRoute.tsx          # Auth required guard
    │   │   └── RequireRole.tsx             # Role-based access guard
    │   │
    │   └── ��� layouts/                     # Layout Wrappers
    │       ├── ClientLayoutWrapper.tsx     # Client layout wrapper
    │       └── AdminLayoutWrapper.tsx      # Admin layout wrapper
    │
    ├── ���️ store/                # STATE MANAGEMENT
    │   └── mockDataStore.ts                # Mock data store (in-memory)
    │
    ├── ��� hooks/                 # CUSTOM HOOKS
    │   └── useStore.ts                     # Store hooks (CRUD operations)
    │
    ├── ��� contexts/              # REACT CONTEXTS
    │   └── ChatWidgetContext.tsx           # Chat widget state context
    │
    ├── ��� utils/                 # UTILITY FUNCTIONS
    │   ├── toast.ts                        # Toast notification utility
    │   └── loadGoogleScript.ts             # Google APIs loader
    │
    └── ��� types/                 # TYPE DEFINITIONS
        └── google.d.ts                     # Google OAuth type definitions
```

---

## ��� Key Features by Area

### **Client Features**
- ✅ Homepage with Hero & AI Banner
- ✅ Service Catalog with Filtering
- ✅ Multi-step Booking Wizard (6 steps)
- ✅ Quick Booking Mode
- ✅ Branch Locator with Google Maps
- ✅ Blog with Categories
- ✅ Contact Form
- ✅ Auth (Login/Register + Google OAuth)
- ✅ Payment Method Selection
- ✅ Chat Widget

### **Admin Features**
- ✅ Admin Dashboard with Metrics & Charts
- ✅ Appointments Management (CRUD, Status Updates)
- ✅ Services Management (CRUD)
- ✅ Branches Management (CRUD)
- ✅ Customers Management (CRUD, Search, Filters)
- ✅ Staff Management (CRUD)
- ✅ Payments & Refunds
- ✅ Review Moderation (Approve, Reply)
- ✅ Blog CMS (CRUD, Publish/Draft)
- ✅ Settings
- ✅ AI Insights & Suggestions

### **Shared Components**
- ✅ Reusable UI Components (Form fields, Inputs, Selects, Date/Time pickers)
- ✅ Route Guards (Auth & Role-based)
- ✅ Error Boundaries
- ✅ Toast Notifications
- ✅ Modal System

---

## ��� Data Flow

### **Current State (Mock Mode)**
```
Components → useStore hooks → mockDataStore (in-memory)
```

### **Target State (API Mode)**
```
Components → useStore/React Query → API Client → Backend REST API
```

---

## ��� Tech Stack Details

### **Core**
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing

### **Styling**
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### **Data Visualization**
- **Recharts** - Charts for admin dashboard

### **Authentication**
- **Google Identity Services** - Google OAuth
- **localStorage** - Current session storage (mock)

### **Maps**
- **Google Maps JavaScript API** - Branch locator

---

## ��� Component Breakdown

### **Pages: 21 total**
- Client Pages: 11
- Admin Pages: 10

### **Components: 80+ total**
- Client Components: 40+
- Admin Components: 25+
- Shared UI Components: 10+
- Route Components: 5+

### **Hooks: 2**
- `useAuth` - Authentication
- `useStore` - Data management

### **Contexts: 1**
- `ChatWidgetContext` - Chat widget state

---

## ��� Design System

### **Colors**
- Primary: Pink (#f472b6, #ec4899)
- Secondary: Purple (#c084fc, #a855f7)
- Accent: Rose (#fb7185)
- Success: Green (#10b981)
- Warning: Orange/Yellow
- Error: Red (#ef4444)

### **Layout**
- Client: Full-width with Navbar + Footer
- Admin: Sidebar (fixed) + Main content area
- Responsive: Mobile-first design

### **Typography**
- Font Family: System fonts (sans-serif)
- Font Sizes: 12px - 60px (Tailwind scale)

---

## ��� Authentication Flow

### **Client Auth**
1. Login/Register pages
2. Email/Password or Google OAuth
3. Mock: Store user in localStorage
4. Protected routes check auth state

### **Admin Auth**
1. Separate admin login page
2. Email/Password or Google OAuth (domain whitelist)
3. Role-based access control
4. Admin routes require `role: 'admin'`

---

## ��� Notes

- **Mock Data**: All data currently stored in `mockDataStore.ts`
- **No Backend**: Frontend-only implementation
- **Ready for API Integration**: Hooks structure prepared for API calls
- **Type Safety**: Full TypeScript coverage
- **Responsive**: Mobile, tablet, desktop support
- **Performance**: Lazy loading with React.lazy + Suspense

---

**End of Frontend Structure Document**
