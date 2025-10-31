# Epic 3: Guest Booking Flow (Backend API)

**Expanded Goal:** Implement the complete **backend API** for guest booking functionality, including availability checking, booking creation, confirmation, and email notifications. Enable the booking system through robust API endpoints that support real-time availability queries, booking management, and automated communications. This epic delivers the core backend business logic - the foundation for customers to book beauty services online 24/7.

**Phase 1 Focus:** Backend API ONLY - Booking endpoints, availability logic, email notifications, validation.

### Story 3.1: Design Booking Database Schema and Relationships

As a backend developer,
I want to extend the database schema to support comprehensive booking management,
so that all booking data is properly structured and relational.

#### Acceptance Criteria
1. Booking model in Prisma schema includes all required fields: id, serviceId, branchId, userId (nullable), appointmentDate, appointmentTime, status, guestName, guestEmail, guestPhone, specialRequests, referenceNumber, createdAt, updatedAt
2. Booking status enum defined: pending, confirmed, completed, cancelled, no_show
3. Foreign key relationships defined: Booking belongsTo Service, Booking belongsTo Branch, Booking belongsTo User (optional)
4. Indexes created on: appointmentDate, branchId, referenceNumber, userId for optimized queries
5. Unique constraint on referenceNumber field
6. appointmentTime stored as string (HH:MM format) or Time type
7. Migration created and applied successfully
8. Test queries verify relationships work correctly (join booking with service and branch data)
9. Documentation updated with booking data model description
10. Seed script updated to include sample bookings (optional, for testing)

### Story 3.2: Implement Availability Check API

As a backend developer,
I want to create an API endpoint that returns available time slots for a given service, branch, and date,
so that customers can see real-time availability when booking.

#### Acceptance Criteria
1. `GET /api/v1/availability` endpoint created accepting query params: serviceId, branchId, date (YYYY-MM-DD format)
2. Endpoint validates all required parameters are present and properly formatted
3. Business logic generates time slots based on branch operating hours for the specified date
4. Time slots generated in appropriate increments (30 or 60 minutes based on service duration)
5. Endpoint queries existing bookings for that branch/date and marks conflicting slots as unavailable
6. Availability calculation accounts for service duration (e.g., 90-minute service blocks overlapping slots)
7. Past time slots excluded (if date is today, only future times returned)
8. Optional: Configurable buffer time between appointments (e.g., 15 minutes for cleanup)
9. Response format: `{ date: "2025-10-30", slots: [{ time: "09:00", available: true }, { time: "09:30", available: false }, ...] }`
10. Error handling: 400 for invalid params, 404 if service/branch not found, 500 for server errors

### Story 3.3: Implement Create Booking API Endpoint

As a backend developer,
I want to create an API endpoint for creating new bookings,
so that customers can schedule appointments through the API.

#### Acceptance Criteria
1. `POST /api/v1/bookings` endpoint created accepting request body: { serviceId, branchId, appointmentDate, appointmentTime, guestName, guestEmail, guestPhone, specialRequests }
2. Request validation ensures all required fields present and properly formatted (email format, phone format, date in future)
3. Business logic validates appointment time is available (not already booked)
4. Business logic validates appointment time is within branch operating hours
5. Unique booking reference number generated (format: BC-YYYYMMDD-XXXX where XXXX is random alphanumeric)
6. Booking saved to database with status "confirmed" and all provided information
7. Response returns created booking object: `{ success: true, booking: { id, referenceNumber, ...all booking data } }`
8. Concurrent booking prevention: use database transaction to check availability and create booking atomically
9. Error handling: 400 for validation errors, 409 for time slot conflict, 500 for server errors
10. Rate limiting applied: max 10 bookings per hour per IP address

### Story 3.4: Implement Get Booking by Reference Number API

As a backend developer,
I want to create an API endpoint to retrieve booking details by reference number,
so that customers can look up their appointments.

#### Acceptance Criteria
1. `GET /api/v1/bookings/:referenceNumber` endpoint created
2. Endpoint retrieves booking from database by referenceNumber (case-insensitive search recommended)
3. Response includes full booking details plus related service and branch information
4. Response format: `{ success: true, booking: { id, referenceNumber, appointmentDate, appointmentTime, service: {...}, branch: {...}, guestName, guestEmail, status, ... } }`
5. Sensitive information handled appropriately (don't expose userId or internal IDs unnecessarily)
6. Error handling: 404 if booking not found, 500 for server errors
7. Optional: Require email verification to view booking (query param `?email=xxx` must match booking email)
8. No authentication required for this endpoint (allow guest lookups)
9. Rate limiting applied to prevent brute force reference number guessing
10. API endpoint tested with valid and invalid reference numbers

### Story 3.5: Implement Booking Confirmation Email Service

As a backend developer,
I want to send automated email confirmations when bookings are created,
so that customers receive proof of their appointment and important details.

#### Acceptance Criteria
1. Email service module created with function `sendBookingConfirmation(booking)` 
2. HTML email template created for booking confirmation with professional design
3. Email template includes: booking reference number, service name, branch name & address, date & time, customer name, special requests (if any)
4. Email includes call-to-action: "Add to Calendar" link or .ics file attachment (optional for MVP)
5. Email sent immediately after successful booking creation (called from create booking endpoint)
6. Email sending is asynchronous using background job or promise (doesn't block API response)
7. Failed email sends logged to error log but don't cause booking creation to fail
8. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
9. Environment variables configured: `EMAIL_FROM`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (or Supabase email config)
10. Test email sent successfully with all booking data populated correctly

### Story 3.6: Implement Booking Cancellation API

As a backend developer,
I want to create an API endpoint for cancelling bookings,
so that customers can cancel appointments if needed.

#### Acceptance Criteria
1. `POST /api/v1/bookings/:referenceNumber/cancel` endpoint created
2. Endpoint accepts optional request body: { email, reason } for verification and feedback
3. Email verification: booking can only be cancelled if provided email matches booking email (prevents unauthorized cancellations)
4. Business logic validates booking can be cancelled (not already cancelled or completed)
5. Optional: Cancellation policy check (e.g., can't cancel within 24 hours of appointment - configurable)
6. Booking status updated to "cancelled" in database
7. Cancellation confirmation email sent to customer
8. Response returns success message: `{ success: true, message: "Your booking has been cancelled." }`
9. Error handling: 400 for invalid email/verification failure, 404 if booking not found, 409 if already cancelled, 500 for server errors
10. API endpoint tested with various scenarios (valid cancellation, already cancelled, wrong email)

### Story 3.7: Implement Booking List API for Admin/Management

As a backend developer,
I want to create API endpoints for listing and filtering bookings,
so that admins can view and manage all appointments.

#### Acceptance Criteria
1. `GET /api/v1/admin/bookings` endpoint created (requires authentication)
2. Endpoint requires admin role verification (Authorization header with Supabase Auth token)
3. Supports filtering by query params: branchId, serviceId, status, date (appointmentDate), dateFrom, dateTo
4. Supports pagination with `page` and `limit` parameters (default limit=50)
5. Supports sorting by: appointmentDate (asc/desc), createdAt (asc/desc)
6. Response includes booking data with embedded service and branch details
7. Response includes metadata: `{ data: [...], meta: { total, page, limit, totalPages } }`
8. Proper error handling: 401 Unauthorized, 403 Forbidden (non-admin), 400 Bad Request, 500 Server Error
9. Query performance optimized with database indexes
10. API endpoint tested with various filter combinations and pagination

### Story 3.8: Implement Booking Update API for Status Management

As a backend developer,
I want to create an API endpoint for updating booking status,
so that admins can mark bookings as completed, no-show, etc.

#### Acceptance Criteria
1. `PATCH /api/v1/admin/bookings/:id/status` endpoint created (requires authentication)
2. Endpoint requires admin role verification
3. Request body accepts: { status } where status is one of: pending, confirmed, completed, cancelled, no_show
4. Business logic validates status transitions (e.g., can't mark cancelled booking as completed)
5. Booking status updated in database
6. Optional: Send status update email to customer for certain status changes
7. Response returns updated booking object
8. Audit log created for status changes (who changed, when, old status, new status) - optional for MVP
9. Error handling: 401/403 for auth issues, 400 for invalid status, 404 if booking not found, 500 for server errors
10. API endpoint tested with various status transitions

### Story 3.9: Implement Booking Validation and Business Rules

As a backend developer,
I want to implement comprehensive validation and business rules for bookings,
so that the system prevents invalid bookings and maintains data integrity.

#### Acceptance Criteria
1. Validation middleware created to enforce business rules across booking endpoints
2. Rule: Appointment date must be in the future (at least tomorrow, or configurable)
3. Rule: Appointment time must be within branch operating hours for the specified day of week
4. Rule: Service must be available at the selected branch
5. Rule: Time slot must not conflict with existing bookings (accounting for service duration)
6. Rule: Email format validation (valid email syntax)
7. Rule: Phone format validation (accept various formats, normalize for storage)
8. Rule: Special requests character limit (max 500 characters)
9. All validation errors return 400 with clear error messages explaining what's wrong
10. Validation logic is unit tested with various valid and invalid inputs

### Story 3.10: Create Booking API Documentation and Testing Collection

As a backend developer,
I want to create comprehensive documentation and testing collection for all booking endpoints,
so that the booking API is well-documented and easily testable.

#### Acceptance Criteria
1. API documentation created in `docs/api/bookings.md` with all booking endpoints
2. Documentation includes: endpoint URL, HTTP method, request parameters, request body schema, response schema, error codes, examples
3. Postman/Insomnia collection updated with all booking endpoints: availability check, create booking, get booking, cancel booking, admin list/update
4. Collection includes example requests with realistic data
5. Collection includes tests/assertions for successful responses
6. Environment variables configured in collection for base URL and auth tokens
7. All booking endpoints manually tested via Postman and verified to work correctly
8. Integration test written for complete booking flow: check availability → create booking → verify booking exists → cancel booking
9. README.md updated with booking API overview and links to detailed documentation
10. Postman collection exported and committed to repository
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
