# Epic 4: Member Experience & Authentication (Backend API)

**Expanded Goal:** Build comprehensive **backend API** for member registration, authentication, and profile management using Supabase Auth. Implement email OTP verification, JWT-based authentication, member booking history API, profile management endpoints, and enhanced member booking flow. Enable the foundation for personalized member experiences through robust authentication and data management APIs.

**Phase 1 Focus:** Backend API ONLY - Authentication endpoints, user management, member booking APIs, profile APIs.

### Story 4.1: Integrate Supabase Auth with Email OTP Registration

As a backend developer,
I want to integrate Supabase Auth for member registration with email OTP verification,
so that users can create secure accounts with email verification.

#### Acceptance Criteria
1. Supabase Auth SDK (@supabase/supabase-js) configured in backend with environment variables
2. `POST /api/v1/auth/register` endpoint created accepting: email, fullName, phone
3. Registration endpoint calls Supabase Auth signUp with email (passwordless with OTP)
4. User record created in application database (User table) with role="member" after email verification
5. OTP sent via email to user's provided email address (managed by Supabase)
6. Registration endpoint returns: { success: true, message: "Please check your email for verification code" }
7. User data validated: email format, phone format, fullName required
8. Duplicate email check returns appropriate error: "Email already registered"
9. Rate limiting applied: max 3 registration attempts per hour per IP
10. Error handling for Supabase Auth failures with user-friendly messages

### Story 4.2: Implement Email OTP Verification Endpoint

As a backend developer,
I want to create an endpoint for verifying email OTP codes,
so that users can complete their registration after receiving the verification code.

#### Acceptance Criteria
1. `POST /api/v1/auth/verify-otp` endpoint created accepting: email, otp
2. Endpoint calls Supabase Auth verifyOtp to validate the code
3. If OTP valid, user's emailVerified flag set to true in database
4. Supabase Auth session created and returned (access token, refresh token)
5. User profile data synced to application database if not already exists
6. Response includes: { success: true, user: {...}, session: {...} }
7. OTP codes expire after 10 minutes (managed by Supabase)
8. Invalid OTP returns error: "Invalid or expired verification code"
9. OTP is single-use only (cannot be reused)
10. Session tokens include user id and role for authorization

### Story 4.3: Build Member Registration Page with Email OTP Flow

As a potential member,
I want to register for an account with email verification,
so that I can access member benefits and track my bookings.

#### Acceptance Criteria
1. Registration page created at `/register` route
2. Form includes fields: Full Name (required), Email (required), Phone (required)
3. "Create Account" button submits registration to `POST /api/v1/auth/register`
4. After successful registration, OTP verification screen shown
5. OTP input field displayed with 6-digit code entry (numerical input with auto-tab)
6. "Verify Code" button submits OTP to `POST /api/v1/auth/verify-otp`
7. "Resend Code" button available with cooldown timer (60 seconds)
8. Success message after verification: "Account created successfully!"
9. User redirected to dashboard or booking flow after successful verification
10. Form validation with inline error messages for all fields

### Story 4.4: Implement Login and Session Management

As a registered member,
I want to log in to my account using my email,
so that I can access member features and my booking history.

#### Acceptance Criteria
1. Login page created at `/login` route
2. Login form with Email field (required)
3. "Send Login Code" button triggers `POST /api/v1/auth/login` endpoint
4. Backend endpoint calls Supabase Auth signInWithOtp for passwordless login
5. OTP sent to user's email address
6. OTP verification screen shown with 6-digit input
7. "Verify Login Code" submits to existing `POST /api/v1/auth/verify-otp` endpoint
8. Successful login creates session and stores auth tokens (localStorage or cookies)
9. User redirected to intended page or dashboard after login
10. "Forgot Password" link not needed (passwordless), but "Having trouble?" help link provided

### Story 4.5: Build Member Dashboard with Overview

As a member,
I want to see a dashboard with my upcoming appointments and quick actions,
so that I can easily manage my bookings and profile.

#### Acceptance Criteria
1. Member dashboard created at `/dashboard` route (protected, requires authentication)
2. Dashboard displays welcome message with member's name: "Welcome back, [Name]!"
3. "Upcoming Appointments" section shows next 3 upcoming bookings with details
4. Each appointment card shows: service name, branch name, date & time, reference number
5. "View All" button links to full booking history page
6. "Book New Appointment" prominent CTA button
7. Quick stats displayed: Total Bookings, Upcoming Appointments count
8. Special offers/promotions section (placeholder cards for future use)
9. Recent activity feed showing last 5 actions (bookings made, profile updates)
10. Dashboard data fetched from `GET /api/v1/members/dashboard` endpoint (needs creation)

### Story 4.6: Create Booking History Page

As a member,
I want to view my complete booking history,
so that I can track all my past and upcoming appointments.

#### Acceptance Criteria
1. Booking history page created at `/dashboard/bookings` route (protected)
2. Page displays all user's bookings in table or card layout
3. Bookings organized by status tabs: "Upcoming", "Past", "Cancelled" (for future)
4. Each booking shows: reference number, service name, branch, date & time, status
5. Bookings sorted by date (upcoming: soonest first, past: most recent first)
6. "View Details" button for each booking links to booking detail page
7. Pagination implemented for large booking lists (10 bookings per page)
8. Empty state shown if no bookings: "No bookings yet" with "Book Now" CTA
9. Data fetched from `GET /api/v1/members/bookings` endpoint (needs creation)
10. Loading state with skeleton cards while fetching data

### Story 4.7: Build Profile Management Page

As a member,
I want to update my profile information,
so that I can keep my contact details current and accurate.

#### Acceptance Criteria
1. Profile page created at `/dashboard/profile` route (protected)
2. Form displays current user information: Full Name, Email (read-only), Phone
3. "Save Changes" button submits updates to `PUT /api/v1/members/profile` endpoint
4. Email field is read-only with note: "Contact support to change email"
5. Form validation on all editable fields with inline error messages
6. Success message displayed after profile update: "Profile updated successfully"
7. Phone number format validation (same as registration)
8. "Change Password" section with button (future feature placeholder - not needed for OTP auth)
9. Profile data pre-filled from `GET /api/v1/members/profile` endpoint
10. Changes reflected immediately after save across all pages using profile data

### Story 4.8: Implement Member API Endpoints

As a backend developer,
I want to create API endpoints for member-specific data and operations,
so that members can access their personalized information.

#### Acceptance Criteria
1. `GET /api/v1/members/profile` endpoint created returning authenticated user's profile
2. `PUT /api/v1/members/profile` endpoint created for updating profile (fullName, phone)
3. `GET /api/v1/members/dashboard` endpoint created returning dashboard data (upcoming bookings, stats)
4. `GET /api/v1/members/bookings` endpoint created returning user's booking history with pagination
5. All member endpoints require authentication (validate JWT/Supabase Auth token)
6. Unauthorized requests return 401 error with appropriate message
7. Endpoints only return data belonging to authenticated user (no data leakage)
8. Profile update validates data and returns validation errors if invalid
9. Dashboard endpoint includes: upcomingBookings (array), totalBookings (count), memberSince (date)
10. All endpoints tested with authenticated and unauthenticated requests

### Story 4.9: Enhance Booking Flow for Members (Auto-fill)

As a member,
I want my information automatically filled during booking,
so that I can complete appointments faster without re-entering details.

#### Acceptance Criteria
1. Booking wizard detects if user is logged in (checks auth token)
2. If logged in, "Continue as Guest" and "Continue as Member" options shown at start
3. If "Continue as Member" selected, skip directly to Service Selection (Step 1)
4. Guest Information step (Step 4) auto-filled with member's profile data
5. Member can still edit pre-filled information if needed
6. Booking associated with member's user ID in database (userId field populated)
7. Member bookings appear automatically in booking history after creation
8. "Login to auto-fill your information" prompt shown to guests on Step 4
9. Successful member booking shows personalized confirmation: "Added to your bookings"
10. Member bookings include userId in `POST /api/v1/bookings` request

### Story 4.10: Add Protected Route Guards and Auth Context

As a frontend developer,
I want to implement authentication context and route protection,
so that member-only pages are properly secured and auth state is managed globally.

#### Acceptance Criteria
1. AuthContext created providing: user, session, login, logout, register functions
2. AuthProvider wraps entire app and makes auth state available to all components
3. useAuth hook created for easy access to auth context in components
4. Protected route wrapper component created checking authentication before rendering
5. Unauthenticated users redirected to login page with return URL parameter
6. Login page redirects to intended destination after successful authentication
7. Logout function clears session and redirects to homepage
8. Auth tokens persisted in localStorage or secure cookies
9. Token refresh handled automatically when access token expires
10. User profile data loaded on app initialization if valid session exists

---
