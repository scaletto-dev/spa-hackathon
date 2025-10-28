# Epic 3: Guest Booking Flow

**Expanded Goal:** Implement the complete end-to-end booking functionality for guest users (non-members) from service selection through confirmation with email notifications. Enable customers to book appointments without creating an account, reducing friction and maximizing conversion. Deliver a multi-step booking wizard with real-time availability checking, form validation, booking confirmation, and automated email notifications. This epic delivers the core value proposition - enabling customers to book beauty services online 24/7.

### Story 3.1: Create Booking Wizard UI Component with Step Navigation

As a frontend developer,
I want to build a multi-step booking wizard with clear progress indicators,
so that customers can navigate through the booking process with confidence.

#### Acceptance Criteria
1. Booking wizard component created with 4 steps: Service Selection, Branch Selection, Date & Time, Guest Information
2. Progress indicator shows current step, completed steps, and upcoming steps (1 of 4, 2 of 4, etc.)
3. "Next" button navigates to next step, "Back" button returns to previous step
4. "Next" button disabled until current step's required fields are completed
5. Wizard maintains state across steps (selections persist when navigating back/forward)
6. Booking data stored in React context or state management (Redux/Zustand optional)
7. Wizard is mobile-responsive with appropriate layout for small screens
8. Each step has clear heading and instructions
9. Wizard route created at `/booking` with optional query params for pre-selection (`?serviceId=1&branchId=2`)
10. Visual design matches rest of application with appropriate spacing and typography

### Story 3.2: Build Service Selection Step

As a potential customer,
I want to select the service I want to book,
so that I can proceed with scheduling my appointment.

#### Acceptance Criteria
1. Step 1 of booking wizard displays all services in grid or list layout
2. Each service card shows: image, name, duration, price, brief description
3. Services organized by category with expandable/collapsible sections or tabs
4. Clicking service card selects it (visual highlight, checkmark, or border change)
5. Only one service can be selected at a time (single selection, not multi-select for MVP)
6. Search bar allows filtering services by name
7. Selected service information displayed in summary sidebar (desktop) or sticky footer (mobile)
8. "Next" button becomes enabled once service is selected
9. If arriving with `?serviceId` query param, that service is pre-selected
10. Service data fetched from existing `GET /api/v1/services` endpoint

### Story 3.3: Build Branch Selection Step

As a potential customer,
I want to select which clinic location I want to visit,
so that I can book an appointment at a convenient branch.

#### Acceptance Criteria
1. Step 2 of booking wizard displays all available branches
2. Each branch card shows: image, name, address, phone, distance (if geolocation enabled - optional)
3. Branches displayed in grid (2 columns desktop, 1 mobile) or list view
4. Clicking branch card selects it (visual highlight indicator)
5. Only one branch can be selected at a time
6. Optional: "Use My Location" button to suggest nearest branch (can defer to polish)
7. Mini map preview shown for selected branch (using Google Maps component from Epic 2)
8. Selected branch information displayed in summary sidebar/footer
9. "Next" button enabled once branch is selected
10. If arriving with `?branchId` query param, that branch is pre-selected

### Story 3.4: Implement Date and Time Picker with Availability

As a potential customer,
I want to select my preferred appointment date and time from available slots,
so that I can book a time that fits my schedule.

#### Acceptance Criteria
1. Step 3 displays calendar for date selection (using date picker library like react-day-picker or custom)
2. Calendar shows current month by default with navigation to previous/next months
3. Past dates are disabled (not selectable)
4. Calendar highlights today's date
5. Clicking date fetches available time slots for that date from API
6. Available time slots displayed as buttons (e.g., "9:00 AM", "10:30 AM", "2:00 PM")
7. Time slots shown in 30-minute or 60-minute increments based on service duration
8. Unavailable time slots are disabled/grayed out with tooltip explaining why
9. Selected date and time displayed clearly in summary sidebar/footer
10. "Next" button enabled once both date and time are selected

### Story 3.5: Build Guest Information Form

As a guest customer,
I want to provide my contact information to complete my booking,
so that the clinic can confirm my appointment and contact me if needed.

#### Acceptance Criteria
1. Step 4 displays form with fields: Full Name (required), Email (required), Phone (required), Special Requests (optional textarea)
2. All form fields have labels, placeholders, and appropriate input types
3. Real-time validation on each field (email format, phone format, required fields)
4. Inline error messages displayed below invalid fields
5. Phone number field formatted automatically (e.g., (555) 123-4567)
6. Special requests field has character limit (500 characters) with counter
7. Summary of booking displayed: service, branch, date, time, total price
8. "Confirm Booking" button at bottom of form
9. "Confirm Booking" button disabled until all required fields are valid
10. Terms and conditions checkbox (required) with link to terms page (placeholder)

### Story 3.6: Create Booking Confirmation Page

As a guest customer,
I want to see a confirmation of my booking with all details,
so that I know my appointment was successfully scheduled.

#### Acceptance Criteria
1. Confirmation page displays after successful booking submission
2. Success message with icon: "Booking Confirmed! Your appointment has been scheduled."
3. Booking reference number displayed prominently (e.g., "Reference: BC-20251028-1234")
4. Complete booking details shown: service name, branch name & address, date & time, customer name, phone, email
5. "Add to Calendar" buttons for Google Calendar, Apple Calendar, Outlook (generates .ics file)
6. Instructions: "You will receive a confirmation email at [email address]"
7. "Book Another Appointment" button returns to booking wizard
8. "Back to Home" button navigates to homepage
9. Confirmation page is shareable via URL (`/booking/confirmation/:referenceNumber`)
10. If user navigates to confirmation page without valid booking, shows appropriate message

### Story 3.7: Implement Booking API Endpoints

As a backend developer,
I want to create API endpoints for booking management,
so that the frontend can create and retrieve bookings.

#### Acceptance Criteria
1. `POST /api/v1/bookings` endpoint created accepting: serviceId, branchId, appointmentDate, appointmentTime, guestName, guestEmail, guestPhone, specialRequests
2. Request validation ensures all required fields present and properly formatted
3. Business logic validates appointment time is in future and during branch operating hours
4. Booking reference number generated (format: BC-YYYYMMDD-XXXX where XXXX is random)
5. Booking saved to database with status "confirmed" and all provided information
6. Response returns created booking object including generated referenceNumber and id
7. `GET /api/v1/bookings/:referenceNumber` endpoint created to retrieve booking by reference number
8. Error handling: validation errors (400), conflicts if time slot unavailable (409), server errors (500)
9. Rate limiting applied to prevent abuse (max 10 bookings per hour per IP)
10. API endpoints tested with various scenarios (valid bookings, invalid data, conflicts)

### Story 3.8: Implement Availability Check System

As a backend developer,
I want to implement availability checking logic,
so that customers can only book available time slots and double-bookings are prevented.

#### Acceptance Criteria
1. `GET /api/v1/availability?serviceId=X&branchId=Y&date=YYYY-MM-DD` endpoint created
2. Endpoint returns array of available time slots for specified service, branch, and date
3. Availability logic considers: branch operating hours, existing bookings, service duration
4. Time slots generated in appropriate increments (30 or 60 minutes based on service)
5. Slots marked unavailable if conflicting booking exists (accounting for service duration overlap)
6. Endpoint excludes past time slots (if date is today, only future times shown)
7. Optional: Configurable buffer time between appointments (e.g., 15 minutes for cleanup)
8. Response format: `{ date: "2025-10-28", slots: [{ time: "09:00", available: true }, ...] }`
9. Database query optimized with indexes on appointmentDate and branchId
10. Endpoint tested with various scenarios (no bookings, fully booked, partial availability)

### Story 3.9: Implement Email Notification Service

As a backend developer,
I want to send email confirmations for bookings,
so that customers receive proof of their appointment and important details.

#### Acceptance Criteria
1. Email service module created with functions for sending transactional emails
2. Supabase email service or external email provider (SendGrid, Resend) integrated
3. Booking confirmation email template created with HTML and plain text versions
4. Email includes: booking reference, service name, branch name & address, date & time, customer name
5. Email sent immediately after successful booking creation
6. Email sending is asynchronous (doesn't block booking API response)
7. Failed email sends logged but don't cause booking to fail (booking still created)
8. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
9. Email "from" address configured (e.g., bookings@beautyclinic.com)
10. Test email sent successfully with all template variables populated correctly

### Story 3.10: Add Booking Management Features (View and Basic Validation)

As a customer,
I want to view my booking confirmation using the reference number,
so that I can retrieve my appointment details anytime.

#### Acceptance Criteria
1. "View Booking" link added to navigation footer or header
2. Booking lookup page created at `/booking/lookup` route
3. Page contains form with input field for booking reference number
4. "Find Booking" button submits reference number to API
5. If booking found, displays full booking details with same layout as confirmation page
6. If booking not found, shows friendly error message: "No booking found with that reference number"
7. Booking lookup calls `GET /api/v1/bookings/:referenceNumber` endpoint
8. Booking details page shows booking status (Confirmed, Completed, Cancelled - for future use)
9. Loading state shown while fetching booking data
10. Error handling for API failures with retry option

---
