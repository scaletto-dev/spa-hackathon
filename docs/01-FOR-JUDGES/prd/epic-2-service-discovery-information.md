# Epic 2: Service Discovery & Information

**Expanded Goal:** Build comprehensive **backend API endpoints** to support service catalog and clinic location information. Deliver RESTful APIs for services listing with category filtering, service details, branch listing, branch details, and contact form submissions. This epic provides all backend capabilities needed for customers to discover services and locations through future frontend interfaces.

**Phase 1 Focus:** Backend API ONLY - API endpoints, business logic, database queries, validation.

### Story 2.1: Enhance Services API with Advanced Filtering and Search

As a backend developer,
I want to extend the services API with filtering, searching, and sorting capabilities,
so that future frontend clients can provide rich service discovery features.

#### Acceptance Criteria
1. `GET /api/v1/services` endpoint supports query parameter `categoryId` for category filtering
2. Endpoint supports query parameter `q` for text search (searches in name and description fields)
3. Endpoint supports query parameter `featured=true` to filter only featured services
4. Endpoint supports query parameter `sort` with values: name, price-asc, price-desc, duration
5. Endpoint supports pagination with `page` and `limit` query parameters (default limit=20, max limit=100)
6. Response includes metadata: `{ data: [...], meta: { total, page, limit, totalPages } }`
7. Search is case-insensitive and uses SQL LIKE or full-text search
8. Multiple filters can be combined (e.g., `?categoryId=1&featured=true&q=facial`)
9. Invalid query parameters return 400 error with clear error messages
10. API documentation updated with all query parameters and examples

### Story 2.2: Implement Service Categories API Endpoints

As a backend developer,
I want to create API endpoints for service categories management,
so that services can be organized and filtered by category.

#### Acceptance Criteria
1. `GET /api/v1/categories` endpoint created returning all service categories
2. `GET /api/v1/categories/:id` endpoint created returning single category with its services
3. Category response includes: id, name, description, slug, serviceCount (number of services in category)
4. `GET /api/v1/categories/:id/services` endpoint returns all services in a specific category
5. Categories endpoint supports optional query param `includeServices=true` to embed service data
6. Categories ordered alphabetically by name by default
7. Response follows consistent API structure in folder api.ts
8. Proper error handling for invalid category IDs (404)
9. API endpoints tested with Postman/Insomnia
10. API documentation updated with category endpoints

### Story 2.3: Implement Branches API with Location Data

As a backend developer,
I want to create comprehensive API endpoints for branch/location management,
so that clinic locations can be discovered and filtered.

#### Acceptance Criteria
1. `GET /api/v1/branches` endpoint created returning all branches with complete location data
2. `GET /api/v1/branches/:id` endpoint created returning single branch details
3. Branch response includes: id, name, address, phone, operatingHours (JSON), latitude, longitude, images (array), createdAt, updatedAt
4. `GET /api/v1/branches/:id/services` endpoint returns all services available at specific branch
5. Branches endpoint supports query param `includeServices=true` to embed service data
6. Optional: Endpoint supports geolocation filtering with `lat`, `lng`, and `radius` parameters (can defer to later)
7. Branches ordered by name alphabetically by default
8. Proper error handling for invalid branch IDs (404) and database errors (500)
9. Response follows consistent API structure
10. API documentation updated with branch endpoints and examples

### Story 2.4: Create Contact Form Submission API

As a backend developer,
I want to create an API endpoint for contact form submissions,
so that customer inquiries can be captured and processed.

#### Acceptance Criteria
1. ContactSubmission model added to Prisma schema with fields: id, name, email, phone, messageType, message, status, createdAt
2. `POST /api/v1/contact` endpoint created accepting: name, email, phone, messageType, message
3. Request validation ensures all required fields are present and properly formatted (email format, max lengths)
4. messageType must be one of: general_inquiry, service_question, booking_assistance, feedback, other
5. Contact submissions saved to database with status "pending"
6. Rate limiting applied: max 3 submissions per hour per IP address
7. Input sanitization to prevent XSS attacks (strip HTML tags, sanitize special characters)
8. Response returns success message: `{ success: true, message: "Thank you for contacting us. We'll respond within 24 hours." }`
9. Error handling for validation errors (400), rate limit exceeded (429), server errors (500)
10. API endpoint tested with various valid and invalid inputs

### Story 2.5: Implement Email Notification for Contact Forms

As a backend developer,
I want to send email notifications when contact forms are submitted,
so that staff can respond to customer inquiries promptly.

#### Acceptance Criteria
1. Email service integrated (Supabase email or external provider like Resend/SendGrid)
2. Email template created for contact form notifications with all submission details
3. Email sent to configured admin email address (from environment variable) after successful submission
4. Email includes: submitter name, email, phone, message type, message content, submission timestamp
5. Email sending is asynchronous (doesn't block API response)
6. Failed email sends are logged but don't cause contact submission to fail
7. Retry logic implemented for failed email sends (3 attempts with exponential backoff)
8. Environment variable `CONTACT_NOTIFICATION_EMAIL` configured for recipient address
9. Email "from" address and "reply-to" configured properly
10. Test email sent successfully with all data populated correctly

### Story 2.6: Add Image Upload API for Services and Branches

As a backend developer,
I want to create API endpoints for uploading images to Supabase Storage,
so that service and branch images can be managed.

#### Acceptance Criteria
1. Supabase Storage bucket created for images with public read access (bucket name: "images" or "uploads")
2. `POST /api/v1/upload/image` endpoint created accepting multipart/form-data file upload
3. Endpoint validates file type (only JPEG, PNG, WebP allowed) and file size (max 5MB)
4. Images uploaded to Supabase Storage with unique filenames (e.g., UUID + original extension)
5. Endpoint returns uploaded image URL: `{ success: true, url: "https://..." }`
6. Optional: Image resizing/optimization before upload (can defer to later)
7. Error handling for invalid file types (400), file too large (413), upload failures (500)
8. Rate limiting applied: max 10 uploads per hour per IP
9. Uploaded image URLs can be used in service and branch data (stored in database)
10. API endpoint tested with various image files and edge cases

### Story 2.7: Implement Admin API for Managing Services (CRUD)

As a backend developer,
I want to create admin API endpoints for managing services (Create, Update, Delete),
so that service catalog can be maintained through the API.

#### Acceptance Criteria
1. `POST /api/v1/admin/services` endpoint created for creating new services
2. `PUT /api/v1/admin/services/:id` endpoint created for updating existing services
3. `DELETE /api/v1/admin/services/:id` endpoint created for deleting services (soft delete or hard delete)
4. All admin endpoints require authentication (check for valid Supabase Auth token in Authorization header)
5. Admin endpoints require admin role verification (user.role === 'admin')
6. Request validation for service data: required fields, data types, price > 0, duration > 0
7. Create/Update endpoints accept: name, description, categoryId, price, duration, images (array), featured (boolean)
8. Proper error responses: 401 Unauthorized, 403 Forbidden, 400 Bad Request, 404 Not Found, 500 Server Error
9. Database constraints enforced (foreign key for categoryId, unique constraints if any)
10. API endpoints tested with Postman including authentication scenarios

### Story 2.8: Implement Admin API for Managing Branches (CRUD)

As a backend developer,
I want to create admin API endpoints for managing branches (Create, Update, Delete),
so that branch information can be maintained through the API.

#### Acceptance Criteria
1. `POST /api/v1/admin/branches` endpoint created for creating new branches
2. `PUT /api/v1/admin/branches/:id` endpoint created for updating existing branches
3. `DELETE /api/v1/admin/branches/:id` endpoint created for deleting branches (soft delete recommended)
4. All admin endpoints require authentication and admin role verification
5. Create/Update endpoints accept: name, address, phone, operatingHours (JSON), latitude, longitude, images (array)
6. Operating hours validation: ensure proper JSON structure with days and time ranges
7. Geolocation validation: latitude between -90 and 90, longitude between -180 and 180
8. Proper error responses for all failure scenarios
9. Database constraints enforced
10. API endpoints tested with authentication and various input scenarios

### Story 2.9: Create Service Search with Redis Caching

As a backend developer,
I want to implement Redis caching for frequently accessed service and category data,
so that API performance improves and database load is reduced.

#### Acceptance Criteria
1. Redis client library installed and configured (ioredis or node-redis)
2. Redis connection established from backend application (local Redis instance or cloud service)
3. Cache middleware created for services endpoints: `GET /api/v1/services`, `GET /api/v1/categories`
4. Cache key strategy: `services:all`, `services:category:{id}`, `services:featured`, `categories:all`
5. Cache TTL (Time To Live) set appropriately: 5 minutes for services, 10 minutes for categories
6. Cache invalidation logic: when service/category is created, updated, or deleted, relevant cache keys are cleared
7. Cache miss scenario: if data not in cache, fetch from database and store in cache
8. Environment variable for Redis connection string: `REDIS_URL`
9. Graceful fallback: if Redis is unavailable, API still works (queries database directly)
10. Performance improvement measured: cached responses return in <50ms vs uncached ~100-200ms

### Story 2.10: Add API Versioning and Rate Limiting

As a backend developer,
I want to implement proper API versioning and rate limiting across all endpoints,
so that the API is stable, scalable, and protected from abuse.

#### Acceptance Criteria
1. All API routes use `/api/v1/` prefix for version 1
2. Rate limiting middleware implemented using `express-rate-limit` library
3. General rate limit: 100 requests per 15 minutes per IP for public endpoints
4. Auth rate limit: 5 requests per minute per IP for login/register endpoints
5. Contact form rate limit: 3 submissions per hour per IP
6. Rate limit responses include `X-RateLimit-*` headers: Limit, Remaining, Reset
7. Rate limit exceeded returns 429 status with clear error message
8. API versioning allows for future `/api/v2/` routes without breaking v1 clients
9. Documentation updated with rate limiting information
10. Rate limiting tested with multiple rapid requests to verify it works correctly

---

