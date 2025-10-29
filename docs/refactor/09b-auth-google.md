# Phase 9B: Google Sign-In Integration

**Branch:** `feat/auth-hardening-google`  
**Status:** ��� In Progress  
**Date:** 2025-10-29

## Overview

Integrate Google Sign-In using **Google Identity Services (GIS)** client-side library with mock credential persistence. Designed for easy migration to real backend verification when API is ready.

---

## Implementation Strategy

### Technology Choice: Google Identity Services (GIS)

**Why GIS over Firebase/NextAuth?**
- ✅ **Zero dependencies** - Lightweight script tag
- ✅ **Client-only** - No backend setup required for demo
- ✅ **Modern** - Replaces deprecated GoogleAuth library
- ✅ **Future-proof** - Easy to add BE verification later
- ✅ **No lock-in** - Returns standard JWT credential

**Alternative Paths (NOT USED):**
- Firebase Auth - Requires Firebase project setup (overkill for SPA)
- NextAuth.js - Server-side focused (we're React SPA)
- Supabase Auth - Not currently in use (but recommended for future)

---

## Environment Configuration

### .env.local Setup (Vite)

```env
# Google OAuth 2.0 Client ID
# Get from: https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com

# Allowed origins for development
# Production: Add your production domain in Google Console
```

**IMPORTANT:** Add `.env.local` to `.gitignore` (already done in most templates)

### Google Console Setup Steps

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Create Project** (if none exists)
   - Name: `Beauty Clinic SPA`
   - Enable Google+ API (required for profile access)
3. **Create OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `Beauty Clinic Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (Vite dev)
     - `http://localhost:4173` (Vite preview)
     - `https://your-production-domain.com` (production)
   - Authorized redirect URIs: **LEAVE EMPTY** (GIS handles this)
4. **Copy Client ID** → Paste into `.env.local`

---

## Code Implementation

### 1. Script Loader Utility (`src/utils/loadGoogleScript.ts`)

```typescript
/**
 * Load Google Identity Services script
 * Idempotent: Safe to call multiple times
 */

let scriptLoaded = false;
let scriptLoading = false;
const loadPromises: Array<Promise<void>> = [];

export function loadGoogleScript(): Promise<void> {
    if (scriptLoaded) {
        return Promise.resolve();
    }

    if (scriptLoading) {
        // Return existing promise if already loading
        return loadPromises[0] || Promise.resolve();
    }

    scriptLoading = true;

    const promise = new Promise<void>((resolve, reject) => {
        // Check if already exists
        if (window.google?.accounts?.id) {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
            return;
        }

        // Create script tag
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
        };

        script.onerror = () => {
            scriptLoading = false;
            reject(new Error('Failed to load Google Identity Services'));
        };

        document.head.appendChild(script);
    });

    loadPromises.push(promise);
    return promise;
}
```

### 2. useAuth Enhancement (`src/auth/useAuth.ts`)

**Add Google login method:**

```typescript
// Add to interface
interface AuthState {
    // ... existing
    loginWithGoogle: () => Promise<void>;
}

// Inside useAuth hook:
const loginWithGoogle = async (): Promise<void> => {
    try {
        // Load GIS script
        await loadGoogleScript();

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            throw new Error('VITE_GOOGLE_CLIENT_ID not configured');
        }

        // Initialize Google Sign-In
        await new Promise<void>((resolve, reject) => {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response: google.accounts.id.CredentialResponse) => {
                    try {
                        // Parse JWT credential (basic decode, NO verification yet)
                        const payload = parseJwt(response.credential);
                        
                        // Create user from Google profile
                        const user: User = {
                            id: payload.sub, // Google user ID
                            name: payload.name,
                            email: payload.email,
                            role: 'client', // All Google users are clients
                        };

                        // Persist credential for backend verification (TODO)
                        localStorage.setItem('auth/googleCredential', response.credential);
                        localStorage.setItem('auth/provider', 'google');
                        localStorage.setItem('user', JSON.stringify(user));

                        setAuthState({
                            isAuthenticated: true,
                            isLoading: false,
                            user,
                        });

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                auto_select: false, // Don't auto-select account
                cancel_on_tap_outside: true,
            });

            // Show One Tap prompt (or use renderButton for explicit button)
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // User closed prompt or it's suppressed
                    // Fall back to explicit button flow
                    reject(new Error('Google Sign-In cancelled'));
                }
            });
        });
    } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
    }
};

// Helper to parse JWT (basic, no signature verification)
function parseJwt(token: string): {
    sub: string;
    email: string;
    name: string;
    picture?: string;
} {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}
```

**SECURITY NOTE:**
- ⚠️ **JWT is NOT verified** client-side (by design)
- ✅ **TODO:** Send credential to backend for verification
- ✅ **Backend must verify** using Google's token verification endpoint
- See: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

### 3. Login Page Update (`src/client/pages/LoginPage.tsx`)

**Add Google button:**

```tsx
const { login, loginWithGoogle } = useAuth();
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
        await loginWithGoogle();
        toast.show('Welcome! Signed in with Google', 'success');
        navigate(from, { replace: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Google Sign-In failed';
        toast.show(message, 'error');
    } finally {
        setIsGoogleLoading(false);
    }
};

// In JSX (before email/password form):
<div className='space-y-4'>
    <motion.button
        type='button'
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        whileHover={{ scale: isGoogleLoading ? 1 : 1.02 }}
        whileTap={{ scale: isGoogleLoading ? 1 : 0.98 }}
        className='w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50'
    >
        {isGoogleLoading ? (
            <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
            </svg>
        ) : (
            <svg width='20' height='20' viewBox='0 0 20 20'>
                <g fill='none' fillRule='evenodd'>
                    <path d='M20 10.227c0-.709-.064-1.39-.182-2.045H10.2v3.868h5.513a4.71 4.71 0 0 1-2.045 3.095v2.51h3.31c1.936-1.782 3.053-4.408 3.053-7.428z' fill='#4285F4'/>
                    <path d='M10.2 20c2.764 0 5.08-.918 6.773-2.482l-3.31-2.57c-.918.614-2.091.982-3.463.982-2.664 0-4.918-1.8-5.722-4.218H1.05v2.655A9.996 9.996 0 0 0 10.2 20z' fill='#34A853'/>
                    <path d='M4.478 11.713a6.022 6.022 0 0 1 0-3.835V5.222H1.05A9.997 9.997 0 0 0 .2 10.204c0 1.614.39 3.14 1.05 4.509l3.428-2.655-.2-.345z' fill='#FBBC05'/>
                    <path d='M10.2 3.977c1.5 0 2.846.518 3.905 1.527l2.927-2.927C15.275.99 12.96 0 10.2 0 6.2 0 2.74 2.382 1.05 5.89l3.428 2.655C5.282 5.777 7.536 3.977 10.2 3.977z' fill='#EA4335'/>
                </g>
            </svg>
        )}
        <span className='text-gray-700'>Continue with Google</span>
    </motion.button>

    <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
        </div>
        <div className='relative flex justify-center text-sm'>
            <span className='px-4 bg-white text-gray-500'>Or continue with email</span>
        </div>
    </div>
</div>

{/* Then email/password form */}
```

### 4. Register Page Update (Optional)

Same pattern as LoginPage - add Google button before registration form.

---

## User Flow

### Google Sign-In Flow

```
1. User clicks "Continue with Google"
   ↓
2. Load GIS script (if not loaded)
   ↓
3. Call google.accounts.id.prompt()
   ↓
4. Google popup opens → User selects account
   ↓
5. Google returns JWT credential
   ↓
6. Parse JWT payload (client-side, unverified)
   ↓
7. Create User object from payload
   ↓
8. Persist to localStorage:
   - auth/googleCredential: JWT (for BE verification)
   - auth/provider: 'google'
   - user: User object
   ↓
9. Update useAuth state → isAuthenticated = true
   ↓
10. Redirect to state.from or home
   ↓
11. Toast: "Welcome! Signed in with Google"
```

### Logout Flow

```
1. User clicks "Sign Out"
   ↓
2. Clear localStorage:
   - user
   - auth/googleCredential
   - auth/provider
   ↓
3. Update useAuth state → isAuthenticated = false
   ↓
4. (Optional) Call google.accounts.id.disableAutoSelect()
   ↓
5. Redirect to homepage
```

---

## Backend Integration (TODO)

### Current State: Mock
- ✅ JWT stored in localStorage (key: `auth/googleCredential`)
- ✅ Provider tracked (key: `auth/provider` = `'google'`)
- ⚠️ **NO verification** - trust client-side decode

### Future: Real Backend

**When backend is ready, modify `loginWithGoogle()`:**

```typescript
const loginWithGoogle = async (): Promise<void> => {
    // ... GIS popup flow ...
    
    // After receiving credential:
    const response = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            credential: googleCredential, // JWT from Google
            provider: 'google'
        }),
    });

    if (!response.ok) {
        throw new Error('Backend verification failed');
    }

    const { user, sessionToken } = await response.json();
    
    // Store verified session token (not raw credential)
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({ isAuthenticated: true, user, isLoading: false });
};
```

**Backend endpoint (`POST /api/v1/auth/google`):**
1. Receive `credential` (JWT from client)
2. Verify JWT using Google's verification library
3. Check `aud` (audience) matches your CLIENT_ID
4. Check `iss` (issuer) is `accounts.google.com`
5. Check `exp` (expiry) is valid
6. Extract `sub` (Google user ID), `email`, `name`
7. Find or create user in database
8. Issue your own session token (JWT or opaque token)
9. Return `{ user, sessionToken }`

**Libraries for Backend Verification:**
- **Node.js:** `google-auth-library`
- **Python:** `google-auth`
- **Go:** `google.golang.org/api/idtoken`

**Docs:** https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

---

## Security Considerations

### ✅ What's Secure
- HTTPS in production (required by GIS)
- `cancel_on_tap_outside: true` - prevents phishing
- Client ID restricted to authorized origins
- Credential stored for backend verification

### ⚠️ Current Risks (Mock Mode)
- **No JWT signature verification** - malicious client can forge payload
- **No revocation check** - can't detect if Google revoked token
- **No CSRF protection** - backend must implement
- **LocalStorage XSS risk** - use httpOnly cookies in production

### ��� Production Hardening
1. **Move verification to backend** - NEVER trust client-decoded JWT
2. **Use httpOnly cookies** - store session tokens securely
3. **Implement CSRF tokens** - protect state-changing operations
4. **Add rate limiting** - prevent brute force on auth endpoints
5. **Monitor failed attempts** - detect suspicious activity
6. **Implement token refresh** - short-lived access tokens
7. **Add email verification** - confirm user owns email
8. **Check user consent** - respect Google's user data policy

---

## Testing

### Manual Tests

```bash
# Development
1. Set VITE_GOOGLE_CLIENT_ID in .env.local
2. npm run dev
3. Navigate to /login
4. Click "Continue with Google"
5. Select Google account
6. Verify redirect to homepage
7. Check navbar shows user avatar
8. Click avatar → "Sign Out"
9. Verify logout works

# Edge Cases
- Cancel Google popup → Should show error toast
- Invalid CLIENT_ID → Should show error toast
- Network error → Should show error toast
- Popup blocked → Should show error toast
```

### Automated Tests (TODO)

```typescript
// Mock google.accounts.id for testing
describe('Google Sign-In', () => {
    beforeEach(() => {
        // Mock GIS
        window.google = {
            accounts: {
                id: {
                    initialize: vi.fn(),
                    prompt: vi.fn((callback) => callback({ isDisplayed: () => true })),
                },
            },
        };
    });

    it('should sign in with Google successfully', async () => {
        // ... test implementation
    });
});
```

---

## Troubleshooting

### "Not a valid origin" Error
- **Cause:** Localhost origin not added in Google Console
- **Fix:** Add `http://localhost:5173` to Authorized JavaScript origins

### "Popup closed by user"
- **Cause:** User cancelled Google account picker
- **Fix:** Show friendly message, allow retry

### "google is not defined"
- **Cause:** GIS script failed to load
- **Fix:** Check network tab, verify CSP headers allow `accounts.google.com`

### "Client ID not configured"
- **Cause:** VITE_GOOGLE_CLIENT_ID missing from .env.local
- **Fix:** Copy `.env.example` → `.env.local`, add Client ID

### Auto-select keeps showing
- **Cause:** Google remembers previous One Tap dismissal
- **Fix:** Call `google.accounts.id.cancel()` or clear cookies

---

## Migration Path

### Current: GIS Client-Only (Phase 1)
```
User → Google → Client → LocalStorage
```

### Future: Backend Verification (Phase 2)
```
User → Google → Client → Backend → Database → Session Token → Client
```

### Optional: Supabase Auth (Phase 3)
```
User → Google → Supabase → Client
```
(Replace entire useAuth with Supabase client SDK)

---

## File Manifest

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/loadGoogleScript.ts` | GIS script loader | ✅ Created |
| `src/auth/useAuth.ts` | Add `loginWithGoogle()` | ✅ Updated |
| `src/client/pages/LoginPage.tsx` | Google button UI | ✅ Updated |
| `src/client/pages/RegisterPage.tsx` | Google button UI | ⏳ Optional |
| `.env.local` | Store CLIENT_ID | ⏳ User must create |
| `docs/refactor/09b-auth-google.md` | This doc | ✅ Created |

---

## Environment Variables

```bash
# Required
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com

# Optional (for future)
VITE_API_BASE_URL=https://api.example.com
VITE_GOOGLE_REDIRECT_URI=https://example.com/auth/callback
```

---

## References

- [Google Identity Services Docs](https://developers.google.com/identity/gsi/web)
- [Verify Google ID Token](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [OAuth 2.0 for Client-side](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Next Steps:**
1. ⏳ Implement `loadGoogleScript()` utility
2. ⏳ Update `useAuth` with `loginWithGoogle()`
3. ⏳ Add Google button to LoginPage
4. ⏳ Test flow end-to-end
5. ⏳ Update `.env.example` with CLIENT_ID placeholder
6. ⏳ Document backend verification plan

---

**Commit Message:**
```bash
feat(auth): add Google Sign-In with GIS client library

- Create loadGoogleScript() utility for idempotent script loading
- Add loginWithGoogle() method to useAuth hook
- Add "Continue with Google" button to LoginPage
- Parse JWT client-side (TODO: backend verification)
- Persist credential to localStorage for future BE integration
- Add documentation for setup and security considerations

SECURITY NOTE: JWT verification pending backend implementation.
Current mock mode stores unverified credential for demo purposes.
```
