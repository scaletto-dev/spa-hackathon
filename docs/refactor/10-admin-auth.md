# Admin Authentication & Authorization

**Date**: 2025-10-29  
**Status**: In Progress  
**Phase**: Epic 6 - Admin Portal Management  
**Related**: `docs/refactor/09a-protected-map.md`, `src/auth/useAuth.ts`

---

## Overview

This document details the implementation of **Admin-specific authentication and authorization** using RBAC (Role-Based Access Control). Admin routes under `/admin/**` require authentication with `role='admin'`, separate from client-side auth.

**Key Requirements**:
- Admin login page (`/admin/login`) with email/password + Google Sign-In
- Route-level protection: All `/admin/**` routes require admin role
- Action-level protection: Sensitive CTAs (delete, approve, export) check admin status
- Domain whitelist for Google Admin sign-in (e.g., `@company.com`)
- Unified auth layer (`useAuth`) handles both client and admin authentication

---

## Admin Routes Protected Map

### Route-Level Protection

All routes under `/admin/**` are protected with:
```tsx
<ProtectedRoute>
  <RequireRole role="admin">
    {/* Admin content */}
  </RequireRole>
</ProtectedRoute>
```

| Path | Component | Description | Guard Status |
|------|-----------|-------------|--------------|
| `/admin` | Dashboard | Admin dashboard | ‚úÖ RequireRole('admin') |
| `/admin/appointments` | Appointments | Manage bookings | ‚úÖ RequireRole('admin') |
| `/admin/services` | Services | Manage services catalog | ‚úÖ RequireRole('admin') |
| `/admin/branches` | Branches | Manage spa locations | ‚úÖ RequireRole('admin') |
| `/admin/customers` | Customers | Customer management | ‚úÖ RequireRole('admin') |
| `/admin/staff` | Staff | Staff management | ‚úÖ RequireRole('admin') |
| `/admin/payments` | Payments | Payment records & reports | ‚úÖ RequireRole('admin') |
| `/admin/reviews` | Reviews | Review moderation | ‚úÖ RequireRole('admin') |
| `/admin/blog` | Blog | Content management | ‚úÖ RequireRole('admin') |
| `/admin/settings` | Settings | System configuration | ‚úÖ RequireRole('admin') |
| `/admin/login` | AdminLoginPage | Admin authentication | ‚ö™ Public (unauthenticated only) |

**Total**: 10 protected routes + 1 public auth route

---

### Action-Level Protection

Sensitive actions within admin pages that require admin role verification:

| Page | Action | Handler | Protection | Priority |
|------|--------|---------|------------|----------|
| **Staff** | Delete Staff | `handleDeleteStaff()` | ‚úÖ Role check | Ì¥¥ High |
| **Staff** | Edit Staff | `handleEditStaff()` | ‚úÖ Role check | Ìø° Medium |
| **Payments** | Export Report | `handleExportReport()` | ‚úÖ Role check | Ì¥¥ High |
| **Customers** | Delete Customer | `handleCustomerDeleted()` | ‚úÖ Role check | Ì¥¥ High |
| **Blog** | Delete Post | `handleDeletePost()` | ‚úÖ Role check | Ì¥¥ High |
| **Blog** | Edit Post | `handleEditPost()` | ‚úÖ Role check | Ìø° Medium |
| **Appointments** | Delete Appointment | `handleDeleteAppointment()` | ‚úÖ Role check | Ì¥¥ High |
| **Appointments** | Edit Appointment | (TODO) | ‚è≥ Coming soon | Ìø° Medium |

**Implementation Strategy**:
- **Route-level**: Already protected by `RequireRole` guard (implemented in Phase 6)
- **Action-level**: Add runtime checks in handlers for defense-in-depth
  - If `!isAuthenticated` ‚Üí redirect to `/admin/login?from=<current>`
  - If `user.role !== 'admin'` ‚Üí show 403 toast and prevent action

---

## Authentication Flow

### 1. Admin Login Page (`/admin/login`)

**Path**: `/admin/login` (public route)

**Features**:
- Email/password form with validation
- "Remember me" checkbox
- "Sign in with Google (Admin)" button
- Domain whitelist for Google (e.g., only `@company.com` allowed)
- Redirect to `state.from` or `/admin` after successful login

**UI Requirements**:
- Match admin theme (similar to AdminLayout colors/typography)
- Responsive design (mobile, tablet, desktop)
- Accessibility: ARIA labels, keyboard navigation, focus management
- Loading states, error messages via toast

**Validation Rules**:
- Email: valid format (`/\S+@\S+\.\S+/`)
- Password: minimum 8 characters
- Google Admin: email domain must match `VITE_GOOGLE_ALLOWED_DOMAINS` whitelist

---

### 2. Google Sign-In (Admin)

**Method**: Google Identity Services (GIS) - same as client implementation

**Domain Restriction**:
- Environment variable: `VITE_GOOGLE_ALLOWED_DOMAINS=company.com,another.com`
- Client-side validation: Check email domain after JWT parsing
- If domain not whitelisted ‚Üí reject with error: "Admin access requires authorized domain"
- TODO: Backend must verify domain restriction (client-side check is NOT secure)

**Implementation**:
```typescript
// useAuth.ts
const loginWithGoogleAdmin = async (): Promise<void> => {
    await loadGoogleScript();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const allowedDomains = import.meta.env.VITE_GOOGLE_ALLOWED_DOMAINS?.split(',') || [];
    
    // ... GIS initialization ...
    
    callback: (response) => {
        const payload = parseJwt(response.credential);
        const emailDomain = payload.email.split('@')[1];
        
        if (!allowedDomains.includes(emailDomain)) {
            throw new Error('Admin access requires authorized email domain');
        }
        
        // Create admin user with role='admin'
        const user = { id: payload.sub, name: payload.name, email: payload.email, role: 'admin' };
        // ... persist & redirect ...
    }
};
```

---

### 3. Auth Layer Extension (`useAuth`)

**New Methods**:
```typescript
interface AuthState {
    // ... existing fields ...
    loginAdmin: (credentials: { email: string; password: string }) => Promise<void>;
    loginWithGoogleAdmin: () => Promise<void>;
}
```

**Implementation Notes**:
- `loginAdmin()`: Similar to `login()`, but sets `user.role = 'admin'`
  - Mock: Check email contains "admin" keyword for demo
  - TODO: Real API call to `/api/admin/auth/login` with backend role verification
  
- `loginWithGoogleAdmin()`: Similar to `loginWithGoogle()`, but:
  - Validates email domain against whitelist
  - Sets `user.role = 'admin'`
  - TODO: Backend verifies JWT and checks admin permissions

**Persistence**:
- Same mechanism as client auth (localStorage for mock)
- Store: `localStorage.setItem('user', JSON.stringify({ ...user, role: 'admin' }))`
- On page reload, `useAuth` reads from localStorage and restores admin session

---

## Environment Configuration

### Required Variables

```env
# .env.local (NOT committed to git)

# Google Client ID (shared between client & admin)
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# Admin-specific: Whitelist email domains for Google Admin sign-in
# Comma-separated list of allowed domains
VITE_GOOGLE_ALLOWED_DOMAINS=company.com,yourcompany.com

# Example for local dev (allow all domains):
# VITE_GOOGLE_ALLOWED_DOMAINS=gmail.com,company.com
```

### Google Cloud Console Setup

1. **OAuth 2.0 Client ID**: Use existing client ID from client auth setup
2. **Authorized JavaScript origins**: Same as client (`http://localhost:5173`, production domain)
3. **Domain verification** (optional): Add your company domain to Google Search Console for branding

---

## Routing Configuration

### Updated `route-map.tsx`

```typescript
// Add admin login route (public)
{
    path: '/admin/login',
    element: (
        <RootErrorBoundary>
            <Suspense fallback={<Pending />}>
                <AdminLoginPage />
            </Suspense>
        </RootErrorBoundary>
    ),
}

// Existing admin routes (already protected)
{
    path: '/admin',
    element: (
        <RootErrorBoundary>
            <Suspense fallback={<Pending />}>
                <RequireRole role='admin'>
                    <ScrollToTop />
                    <AdminLayout />
                </RequireRole>
            </Suspense>
        </RootErrorBoundary>
    ),
    children: [/* ... existing admin routes ... */]
}
```

**Note**: Admin routes are already wrapped with `RequireRole('admin')` from Phase 6. No changes needed to existing route structure.

---

## UI Entry Points

### 1. Admin Layout Header

**Location**: `src/admin/layouts/AdminLayout.tsx` (or Header component)

**When NOT authenticated as admin**:
```tsx
<Link to="/admin/login" className="btn-primary">
  Admin Login
</Link>
```

**When authenticated as admin**:
```tsx
<div className="flex items-center gap-4">
  <span>{user.name}</span>
  <Avatar>{user.name.charAt(0)}</Avatar>
  <Dropdown>
    <DropdownItem onClick={() => navigate('/admin/settings')}>
      Account Settings
    </DropdownItem>
    <DropdownItem onClick={logout}>
      Logout
    </DropdownItem>
  </Dropdown>
</div>
```

### 2. Client Navbar (Admin Link)

**Location**: `src/client/components/layouts/Navbar.tsx`

Add admin link in footer or utility nav:
```tsx
{user?.role === 'admin' && (
    <Link to="/admin" className="text-sm">
      Admin Dashboard
    </Link>
)}
```

---

## Testing Checklist

### Manual Testing

- [ ] **Unauthenticated access**: Visit `/admin` ‚Üí redirected to `/admin/login?from=/admin`
- [ ] **Admin login (email/password)**: Valid credentials ‚Üí redirect to `/admin`
- [ ] **Admin login (Google)**: 
  - Valid domain ‚Üí success ‚Üí redirect to `/admin`
  - Invalid domain ‚Üí error message, no login
- [ ] **Client user**: Login as client ‚Üí try `/admin` ‚Üí blocked with 403 or redirect to `/`
- [ ] **Redirect preservation**: Try `/admin/services` while logged out ‚Üí login ‚Üí redirect back to `/admin/services`
- [ ] **Logout**: Click logout in admin header ‚Üí redirect to `/admin/login`
- [ ] **Action guards**: Try delete/export actions ‚Üí confirm admin role check works
- [ ] **Responsive**: Test login page on mobile, tablet, desktop
- [ ] **Accessibility**: Keyboard navigation, screen reader, focus indicators

### Build & TypeScript

- [ ] `npm run build` ‚Üí no errors
- [ ] `npm run dev` ‚Üí no console errors
- [ ] TypeScript: `tsc --noEmit` ‚Üí no type errors
- [ ] ESLint: `npm run lint` ‚Üí clean (or only warnings)

---

## TODO & Future Enhancements

### Security (High Priority)

- [ ] **Backend verification**: Replace client-side JWT parsing with API calls
  - `POST /api/admin/auth/login` ‚Üí return JWT with admin role claim
  - `POST /api/admin/auth/google` ‚Üí verify Google credential server-side, check domain, return JWT
- [ ] **Token refresh**: Implement refresh token flow for long sessions
- [ ] **Rate limiting**: Add login attempt throttling (frontend + backend)
- [ ] **HTTPS only**: Enforce secure cookies/tokens in production

### Features (Medium Priority)

- [ ] **2FA**: Two-factor authentication for admin accounts
- [ ] **Audit log**: Track admin actions (who deleted what, when)
- [ ] **Granular permissions**: Beyond admin/client, add sub-roles (e.g., `manager`, `editor`, `viewer`)
- [ ] **Session management**: Show active sessions, allow remote logout
- [ ] **Password reset**: Forgot password flow for admin users

### UX Improvements (Low Priority)

- [ ] **Remember device**: "Don't ask again on this device" for trusted devices
- [ ] **Login history**: Show recent login attempts in settings
- [ ] **Dark mode**: Ensure login page respects theme preference

---

## Implementation Status

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | Scan admin routes & CTAs | ‚úÖ Done | 10 routes, 8 sensitive actions identified |
| 2 | Create `/admin/login` page | ‚è≥ In Progress | Form + Google button |
| 3 | Update route-map | ‚è≥ Pending | Add `/admin/login` route |
| 4 | Extend `useAuth` | ‚è≥ Pending | `loginAdmin()`, `loginWithGoogleAdmin()` |
| 5 | Guard action-level | ‚è≥ Pending | Add role checks to handlers |
| 6 | Add UI entry points | ‚è≥ Pending | Header login/logout buttons |
| 7 | Manual testing | ‚è≥ Pending | All checklist items |
| 8 | Documentation | ‚úÖ In Progress | This file |

---

## References

- **Client Auth**: `docs/refactor/09a-protected-map.md`, `docs/refactor/09b-auth-google.md`
- **Guards**: `src/routes/guards/ProtectedRoute.tsx`, `src/routes/guards/RequireRole.tsx`
- **Auth Hook**: `src/auth/useAuth.ts`
- **Google GIS**: https://developers.google.com/identity/gsi/web/guides/overview
- **PRD**: Epic 6 - Admin Portal Management

---

**Last Updated**: 2025-10-29  
**Author**: Development Team  
**Reviewers**: TBD
