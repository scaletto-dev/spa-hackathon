# Epic 2: Service Discovery & Information

**Expanded Goal:** Enable customers to explore the complete service catalog and clinic locations through intuitive browsing interfaces. Deliver service listing with filtering/categorization, detailed service pages with pricing and imagery, branch listing with location information, branch detail pages with Google Maps integration, and a contact page. This epic provides customers with all information needed to make informed booking decisions.

### Story 2.1: Build Services Listing Page with Category Filtering

As a potential customer,
I want to browse all available services with the ability to filter by category,
so that I can find services relevant to my beauty care needs.

#### Acceptance Criteria
1. Services listing page created at `/services` route
2. Page displays all services in responsive grid (3 columns desktop, 2 tablet, 1 mobile)
3. Service cards show: image, name, category badge, duration, price, brief description (truncated)
4. Category filter sidebar (desktop) or dropdown (mobile) displays all service categories
5. Clicking category filter updates service grid to show only services in that category
6. "All Services" option clears filter and shows complete catalog
7. Active category visually highlighted in filter UI
8. Empty state displayed when no services match filter (with "View All" button)
9. Services fetched from `GET /api/v1/services` with categoryId query param when filtered
10. Page includes page title, breadcrumb navigation (Home > Services), and meta description

### Story 2.2: Create Service Detail Page with Rich Information

As a potential customer,
I want to view detailed information about a specific service,
so that I understand what's included, the benefits, and can decide if I want to book.

#### Acceptance Criteria
1. Service detail page created at `/services/:id` route
2. Page layout includes: hero image, service name, category, price, duration prominently displayed
3. Full service description rendered with proper formatting (paragraphs, line breaks)
4. "What's Included" section lists service components (if data available)
5. "Benefits" section highlights key outcomes (if data available)
6. Before/After photo gallery using Swiper component (if images available)
7. FAQ accordion section for common questions about the service (if data available)
8. "Book This Service" CTA button prominently displayed (links to booking flow - placeholder for Epic 3)
9. Related/recommended services section showing 3-4 services in same category
10. Page fetches data from `GET /api/v1/services/:id` and handles 404 if service not found

### Story 2.3: Implement Branches Listing Page

As a potential customer,
I want to see all clinic locations,
so that I can find a branch convenient to my location.

#### Acceptance Criteria
1. Branches listing page created at `/branches` route
2. Page displays all branches in responsive grid (2 columns desktop, 1 mobile) or list view
3. Branch cards show: featured image, branch name, address, phone number, operating hours summary
4. Branch cards include "View Details" button linking to branch detail page
5. Optional: Toggle between grid view and list view (icon buttons)
6. Optional: Sort by distance (requires geolocation permission - can be deferred to polish)
7. All branches fetched from `GET /api/v1/branches` endpoint (needs to be created in backend)
8. Page includes page title, breadcrumb navigation (Home > Locations)
9. Responsive layout works well on all screen sizes
10. Loading and error states handled gracefully

### Story 2.4: Build Branch Detail Page with Google Maps Integration

As a potential customer,
I want to view detailed information about a specific branch location with an interactive map,
so that I can plan my visit and know exactly where to go.

#### Acceptance Criteria
1. Branch detail page created at `/branches/:id` route
2. Page layout includes: hero image of branch, branch name, full address, phone number
3. Operating hours displayed in clear format (table or list showing days and times)
4. Google Maps integration showing branch location with accurate pin
5. Map is interactive (zoom, pan, street view access)
6. "Get Directions" button opens Google Maps with branch address in new tab
7. Branch facility photo gallery using Swiper component (if multiple images)
8. List of services available at this branch (linked to service detail pages)
9. "Book at This Branch" CTA button (will pre-select branch in booking flow - placeholder for Epic 3)
10. Page fetches data from `GET /api/v1/branches/:id` and handles 404 if branch not found

### Story 2.5: Implement Branches API Endpoints

As a backend developer,
I want to create RESTful API endpoints for branches data,
so that the frontend can fetch and display clinic location information.

#### Acceptance Criteria
1. `GET /api/v1/branches` endpoint created returning all branches with location data
2. `GET /api/v1/branches/:id` endpoint created returning single branch details
3. Branch response includes: id, name, address, phone, operatingHours, latitude, longitude, images, services (array of service IDs or objects)
4. Optional: Endpoint supports query param `services=true` to include full service details
5. Proper error handling for invalid IDs (404) and database errors (500)
6. Branches ordered by name alphabetically by default
7. Response follows consistent API structure: { data: {...} } for single, { data: [...] } for list
8. Prisma query includes relationship to services if needed
9. API endpoints tested with manual requests returning expected data
10. API documentation updated with branch endpoints specifications

### Story 2.6: Integrate Google Maps JavaScript API

As a developer,
I want to integrate Google Maps JavaScript API into the application,
so that branch locations can be displayed on interactive maps.

#### Acceptance Criteria
1. Google Maps API key obtained and configured in frontend environment variables
2. Google Maps JavaScript API script loaded in React app (via script tag or package)
3. Reusable Map component created accepting props: latitude, longitude, zoom, markerTitle
4. Map component renders correctly and displays marker at specified coordinates
5. Map has default styling matching website aesthetic (optional: custom map style)
6. Map controls enabled: zoom, pan, street view
7. Click on marker shows info window with branch name and address
8. Map is responsive and works on mobile devices (touch gestures)
9. Error handling if API fails to load (displays fallback with static map image or address only)
10. Map component documented with usage examples

### Story 2.7: Create Contact Page with Form and Information

As a potential customer,
I want to contact the clinic with questions or inquiries,
so that I can get information before booking or for non-booking matters.

#### Acceptance Criteria
1. Contact page created at `/contact` route
2. Page layout: contact form on left, contact information and map on right (stacked on mobile)
3. Contact form includes fields: name (required), email (required), phone (optional), message type (dropdown), message (required, textarea)
4. Message type options: General Inquiry, Service Question, Booking Assistance, Feedback, Other
5. Form validation: required fields marked with *, inline error messages for invalid inputs
6. Submit button disabled while form is submitting
7. Success message displayed after successful submission with form reset
8. Contact information section displays: clinic phone number, email address, main office address
9. Google Map embedded showing main/flagship clinic location
10. Form submission calls `POST /api/v1/contact` endpoint (needs to be created in backend)

### Story 2.8: Implement Contact Form API Endpoint

As a backend developer,
I want to create an API endpoint for contact form submissions,
so that customer inquiries are captured and notifications sent to staff.

#### Acceptance Criteria
1. `POST /api/v1/contact` endpoint created accepting: name, email, phone, messageType, message
2. Request validation ensures all required fields are present and properly formatted
3. Contact submissions saved to database (new ContactSubmission model in Prisma schema)
4. Email notification sent to clinic admin email address with submission details
5. Rate limiting applied to prevent spam (max 3 submissions per hour per IP)
6. CAPTCHA verification integrated (optional for MVP, can add later if spam becomes issue)
7. Response returns success message: { success: true, message: "Thank you for contacting us..." }
8. Error handling for validation errors (400), server errors (500)
9. Submitted data sanitized to prevent XSS attacks
10. Endpoint tested with manual POST requests and various input scenarios

### Story 2.9: Add Search Functionality to Services

As a potential customer,
I want to search for services by name or keyword,
so that I can quickly find specific treatments I'm interested in.

#### Acceptance Criteria
1. Search bar component created and added to services listing page header
2. Search input has placeholder text "Search services..." with search icon
3. Search input debounced (300ms delay) to avoid excessive API calls while typing
4. Typing in search filters services in real-time (client-side filtering if all services loaded)
5. Search matches against service name and description (case-insensitive)
6. Search results displayed in same grid layout as regular services listing
7. Clear search button (X icon) appears when search has text, clears search on click
8. Empty state shown when search returns no results with "Try different keywords" message
9. Search state persists in URL query parameter (?q=facial) for shareable links
10. Search works in combination with category filters (intersection of both filters)

### Story 2.10: Optimize Images and Implement Lazy Loading

As a developer,
I want to optimize image loading across the application,
so that pages load quickly and meet performance requirements (<2s mobile).

#### Acceptance Criteria
1. All images use lazy loading attribute (`loading="lazy"`) or React lazy load library
2. Images include responsive sizes with srcset for different screen sizes
3. Placeholder blur or skeleton shown while images load
4. Service and branch images compressed to optimal size (WebP format where supported, JPEG fallback)
5. Images served from Supabase Storage with proper CDN headers
6. Hero section images use priority loading (load immediately, no lazy load)
7. Image optimization script or service integrated (Sharp library or similar)
8. Alt text provided for all images for accessibility and SEO
9. Page load time measured: homepage <2s on 4G, services listing <2s
10. Lighthouse performance score >90 on mobile after image optimizations

---
