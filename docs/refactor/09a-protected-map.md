# Phase 9A: Protected Routes & Actions Map

**Branch:** `feat/auth-client-pages` → `feat/auth-hardening-google`  
**Status:** � In Progress (Scanning Phase Complete)  
**Date:** 2025-10-29

## Overview

This document maps all routes and user actions requiring authentication protection in the SPA. Based on PRD Epic 4 (Member Experience) and architectural analysis.

---

## Current State Analysis

### Existing Auth Infrastructure
- ✅ `/login` and `/register` pages implemented (Phase 7)
- ✅ `useAuth()` hook with login/register/logout methods
- ✅ `<ProtectedRoute>` guard component available
- ✅ `<RequireRole>` guard for admin routes (already applied)
- ✅ All admin routes (`/admin/**`) already protected
- ✅ Redirect with `state.from` working

### Pages Inventory (11 client pages)
1. `Home.tsx` - Homepage (public)
2. `ServicesPage.tsx` - Service catalog (public)
3. `BookingPage.tsx` - Booking flow (public, guest-friendly per FR8)
4. `BranchesPage.tsx` - Branch locations (public)
5. `BlogPage.tsx` - Blog posts (public)
6. `BlogDetailPage.tsx` - Blog post detail (public)
7. `QuizPage.tsx` - Interactive quiz (public)
8. `FormShowcasePage.tsx` - Demo page (public)
9. `ContactPage.tsx` - Contact form (public)
10. `LoginPage.tsx` - Auth page
11. `RegisterPage.tsx` - Auth page

---

## Protection Map

### A) Route-Level Protection

#### ✅ Already Protected (Admin)
| Path | Component | Guard | Status | Notes |
|------|-----------|-------|--------|-------|
| `/admin` | Dashboard | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/appointments` | Appointments | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/services` | AdminServices | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/branches` | AdminBranches | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/customers` | Customers | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/staff` | Staff | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/payments` | Payments | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/reviews` | AdminReviews | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/blog` | AdminBlog | RequireRole(admin) | ✅ DONE | Phase 6 |
| `/admin/settings` | Settings | RequireRole(admin) | ✅ DONE | Phase 6 |

#### � Member Routes (NOT YET IMPLEMENTED - Future Epic 4)
| Path | Component | Guard | Priority | Notes |
|------|-----------|-------|----------|-------|
| `/dashboard` | MemberDashboard | ProtectedRoute | � High | Epic 4 Story 4.5 - Overview with upcoming bookings |
| `/dashboard/bookings` | BookingHistory | ProtectedRoute | � High | Epic 4 Story 4.6 - Full booking history |
| `/dashboard/profile` | ProfilePage | ProtectedRoute | � High | Epic 4 Story 4.7 - Edit profile |
| `/profile` | ProfilePage | ProtectedRoute | � Medium | Alias for `/dashboard/profile` (decide on routing) |
| `/account` | AccountPage | ProtectedRoute | � Low | Generic account hub (if needed) |
| `/orders` | OrdersPage | ProtectedRoute | � Low | Future: Order history (if e-commerce) |
| `/wishlist` | WishlistPage | ProtectedRoute | � Low | Future: Saved favorites |
| `/notifications` | NotificationsPage | ProtectedRoute | � Low | Future: User notifications |
| `/settings` | ClientSettings | ProtectedRoute | � Medium | Future: Client preferences |

**TODO (Step 2):** When Epic 4 pages are implemented, wrap with `<ProtectedRoute>` in `route-map.tsx`.

#### ⚪ Public Routes (No Protection Needed)
| Path | Component | Rationale |
|------|-----------|-----------|
| `/` | Home | Public landing page |
| `/services` | ServicesPage | Public service catalog (SEO-friendly) |
| `/booking` | BookingPage | **Guest booking allowed per FR8** |
| `/branches` | BranchesPage | Public branch directory |
| `/blog` | BlogPage | Public content (SEO-friendly) |
| `/blog/:slug` | BlogDetailPage | Public content (SEO-friendly) |
| `/quiz` | QuizPage | Public interactive tool |
| `/contact` | ContactPage | Public contact form |
| `/form-showcase` | FormShowcasePage | Public demo page |
| `/login` | LoginPage | Auth page |
| `/register` | RegisterPage | Auth page |

---

### B) Action-Level Protection

These are **UI actions** (buttons/CTAs) that require login but are embedded in **public pages**.

#### � High Priority - Implement Now

##### 1. Booking Flow - Member Auto-fill
**Location:** `BookingPage.tsx` → `BookingUserInfo.tsx`  
**Current Behavior:** Always shows manual form  
**Desired Behavior:**
- If `isAuthenticated`: Pre-fill name/email/phone from `user` profile
- If NOT authenticated: Show manual form + optional CTA "Login to auto-fill"
**Protection Type:** Action-level (optional prompt)
**Epic Reference:** FR13-FR16 (Member booking flow)

```tsx
// Pseudo-code
function BookingUserInfo() {
    const { isAuthenticated, user } = useAuth();
    
    useEffect(() => {
        if (isAuthenticated && user) {
            // Auto-fill form
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            });
        }
    }, [isAuthenticated, user]);
    
    // Show "Login to auto-fill" banner if not authenticated
}
```

**Status:** ⏳ TODO (Step 3)

##### 2. Write Review Action
**Location:** `BlogDetailPage.tsx` or `ServicesPage.tsx` (if review form exists)  
**Current Behavior:** Unknown (need to check components)  
**Desired Behavior:**
- If `!isAuthenticated` when clicking "Write Review" → Prompt modal → Navigate to `/login`
**Protection Type:** Action-level (gate before form)

**Status:** ⏳ TODO (Step 3 - need to verify if review form exists)

##### 3. Contact Form - Member Pre-fill
**Location:** `ContactPage.tsx`  
**Current Behavior:** Always shows empty form  
**Desired Behavior:**
- If `isAuthenticated`: Pre-fill name/email from user profile
**Protection Type:** UX enhancement (optional)

**Status:** ⏳ TODO (Step 3)

#### � Medium Priority - Future Features

##### 4. Add to Wishlist
**Location:** Not implemented yet  
**Future Epic:** E-commerce / Saved Services  
**Protection:** If `!isAuthenticated` → Prompt login

##### 5. Follow/Subscribe
**Location:** Not implemented yet  
**Future Epic:** Social features  
**Protection:** If `!isAuthenticated` → Prompt login

##### 6. Download Invoice
**Location:** Not implemented yet (admin `Payments` page exists but client-side unknown)  
**Future Epic:** Payment history  
**Protection:** Requires authentication

##### 7. Rate Service (Star Rating)
**Location:** Not implemented yet  
**Future Epic:** Reviews & Ratings  
**Protection:** If `!isAuthenticated` → Prompt login

##### 8. Book Again (Quick Rebooking)
**Location:** Not implemented yet (requires booking history)  
**Future Epic:** Member dashboard  
**Protection:** Requires authentication (only shows for logged-in users)

#### ⚪ No Protection Needed

- **View services** - Public
- **View branches** - Public
- **Read blog posts** - Public
- **View contact info** - Public
- **Browse quiz questions** - Public (results can be personalized if logged in, but not required)

---

## Implementation Plan

### Step 2: Route-Level Protection (When Epic 4 Pages Exist)
```tsx
// route-map.tsx additions (FUTURE)
import { ProtectedRoute } from './guards/ProtectedRoute';

// Inside ClientLayout children:
{
    path: 'dashboard',
    element: (
        <ProtectedRoute>
            <Suspense fallback={<Pending />}>
                <MemberDashboard />
            </Suspense>
        </ProtectedRoute>
    ),
},
{
    path: 'dashboard/bookings',
    element: (
        <ProtectedRoute>
            <Suspense fallback={<Pending />}>
                <BookingHistory />
            </Suspense>
        </ProtectedRoute>
    ),
},
{
    path: 'dashboard/profile',
    element: (
        <ProtectedRoute>
            <Suspense fallback={<Pending />}>
                <ProfilePage />
            </Suspense>
        </ProtectedRoute>
    ),
}
```

### Step 3: Action-Level Protection (High Priority)

#### Pattern: Login Prompt Utility
```tsx
// src/utils/authPrompt.ts
import { toast } from './toast';

export function requireAuth(
    isAuthenticated: boolean,
    navigate: NavigateFunction,
    from: string,
    action: string = 'continue'
): boolean {
    if (!isAuthenticated) {
        toast.show(
            `Please login to ${action}`,
            'info'
        );
        navigate('/login', { 
            replace: false, 
            state: { from } 
        });
        return false;
    }
    return true;
}
```

#### Usage Example
```tsx
// BookingUserInfo.tsx
const handleSubmit = () => {
    // Optional: Save booking to history if authenticated
    if (isAuthenticated) {
        // Future: POST to /api/v1/members/bookings
    } else {
        // Guest booking (current behavior)
    }
    proceedToPayment();
};
```

#### Write Review Example (if form exists)
```tsx
// ReviewForm component (FUTURE)
const handleWriteReview = () => {
    if (!requireAuth(isAuthenticated, navigate, location.pathname, 'write a review')) {
        return;
    }
    openReviewModal();
};
```

---

## Key Decisions & Constraints

### ✅ Confirmed Decisions
1. **BookingPage stays public** - Per FR8, guest booking is intentional
2. **All admin routes already protected** - No changes needed (Phase 6)
3. **Member routes not yet implemented** - Placeholder for Epic 4
4. **Action-level uses prompts** - Toast + redirect, not blocking page view

### ⚠️ Open Questions
1. **Profile vs Dashboard routing** - Use `/dashboard/profile` or separate `/profile`?
   - **Recommendation:** Use `/dashboard/*` for consistency (single member hub)
2. **Wishlist/Orders pages** - Are these in scope for current MVP?
   - **Answer:** No, future enhancement
3. **Review submission** - Is there a review form in current codebase?
   - **TODO:** Grep for review forms in components

### � Out of Scope (No Auth Required)
- Service browsing (SEO-critical)
- Blog reading (SEO-critical)
- Branch directory (SEO-critical)
- Contact form submission (guest-friendly)
- Quiz participation (optional login for personalization)

---

## Testing Strategy

### Route-Level Tests
```bash
# Test protected member routes (when implemented)
1. NOT logged in → Navigate to /dashboard → Redirect to /login ✓
2. Logged in as client → Navigate to /dashboard → Render page ✓
3. Logged in as client → Navigate to /admin → Redirect to / (role check) ✓
```

### Action-Level Tests
```bash
# Test booking auto-fill
1. NOT logged in → Fill form manually → Submit ✓
2. Logged in → Form pre-filled from profile → Submit ✓

# Test review gate (when implemented)
1. NOT logged in → Click "Write Review" → Show toast + redirect to /login ✓
2. Logged in → Click "Write Review" → Open review form ✓
```

---

## Summary Table

| Category | Count | Status |
|----------|-------|--------|
| Admin routes protected | 10 | ✅ DONE (Phase 6) |
| Member routes (future) | 8 | � Placeholder (Epic 4) |
| Public client routes | 11 | ⚪ No protection needed |
| High-priority actions | 3 | ⏳ TODO (Step 3) |
| Future actions | 5 | � Low priority |

**Next Steps:**
1. ✅ **DONE:** Scan complete, map documented
2. ⏳ **TODO:** Implement action-level guards (booking auto-fill, etc.)
3. ⏳ **TODO:** Add Login button to Header/Homepage (Step 4)
4. ⏳ **TODO:** Implement Google Sign-In (Step 5)

---

**References:**
- [PRD Epic 4](../prd/epic-4-member-experience-authentication-backend-api.md)
- [API Spec](../architecture/api-specification.md)
- [Phase 7: Auth Pages](./07-auth-client-pages.md)
- [Phase 6: Router Guards](./06-routes-modernization.md)
