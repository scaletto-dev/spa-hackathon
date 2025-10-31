# API Specification

This section defines the complete REST API for the Beauty Clinic Care Website. The API follows RESTful principles with resource-based URLs, standard HTTP methods, and JSON request/response payloads. All endpoints are versioned under `/api/v1/` to support future API evolution.

### REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Beauty Clinic Care Website API
  version: 1.0.0
  description: |
    RESTful API for the Beauty Clinic Care Website platform.
    
    **Authentication:**
    - Public endpoints: No authentication required
    - Member endpoints: Require Bearer token from Supabase Auth
    - Admin endpoints: Require Bearer token + admin/super_admin role
    
    **Base URL:** http://localhost:4000/api/v1 (local development)
    
    **Rate Limiting:**
    - Auth endpoints: 5 requests/minute per IP
    - Public endpoints: 100 requests/minute per IP
    - Authenticated endpoints: 200 requests/minute per user
  contact:
    name: API Support
    email: dev@beautyclinic.com

servers:
  - url: http://localhost:4000/api/v1
    description: Local development server
  - url: https://api.beautyclinic.com/api/v1
    description: Production server (Phase 2)

tags:
  - name: Health
    description: Health check and status endpoints
  - name: Auth
    description: Authentication and user registration (Supabase Auth integration)
  - name: Services
    description: Service catalog and details (public)
  - name: Branches
    description: Branch locations and information (public)
  - name: Bookings
    description: Appointment booking and management
  - name: Contact
    description: Contact form submissions
  - name: Blog
    description: Blog posts and categories (public)
  - name: Reviews
    description: Service reviews and ratings
  - name: Profile
    description: Member profile management
  - name: Admin - Dashboard
    description: Admin analytics and metrics
  - name: Admin - Bookings
    description: Admin booking management
  - name: Admin - Services
    description: Admin service CRUD operations
  - name: Admin - Branches
    description: Admin branch CRUD operations
  - name: Admin - Users
    description: Admin user management
  - name: Admin - Blog
    description: Admin blog management
  - name: Admin - Reviews
    description: Admin review moderation
  - name: Admin - Contact
    description: Admin contact submissions

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase Auth JWT token

  schemas:
    Error:
      type: object
      required:
        - error
        - message
        - statusCode
      properties:
        error:
          type: string
          example: "ValidationError"
        message:
          type: string
          example: "Invalid email format"
        statusCode:
          type: integer
          example: 400
        details:
          type: object
          additionalProperties: true
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string
          format: uuid

    PaginationMeta:
      type: object
      properties:
        total:
          type: integer
          example: 100
        page:
          type: integer
          example: 1
        limit:
          type: integer
          example: 20
        totalPages:
          type: integer
          example: 5

    ServiceCategory:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        slug:
          type: string
        description:
          type: string
          nullable: true
        displayOrder:
          type: integer
        icon:
          type: string
          nullable: true

    ServiceListItem:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        slug:
          type: string
        excerpt:
          type: string
        duration:
          type: integer
          description: Duration in minutes
        price:
          type: number
          format: decimal
        images:
          type: array
          items:
            type: string
        category:
          type: object
          properties:
            id:
              type: string
              format: uuid
            name:
              type: string
            slug:
              type: string

    ServiceDetail:
      allOf:
        - $ref: '#/components/schemas/ServiceListItem'
        - type: object
          properties:
            description:
              type: string
            featured:
              type: boolean
            beforeAfterPhotos:
              type: array
              items:
                type: string
              nullable: true
            faqs:
              type: array
              items:
                type: object
                properties:
                  question:
                    type: string
                  answer:
                    type: string
              nullable: true
            averageRating:
              type: number
              format: float
            totalReviews:
              type: integer
            reviews:
              type: array
              items:
                $ref: '#/components/schemas/Review'

    BranchListItem:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        slug:
          type: string
        address:
          type: string
        phone:
          type: string
        images:
          type: array
          items:
            type: string

    BranchDetail:
      allOf:
        - $ref: '#/components/schemas/BranchListItem'
        - type: object
          properties:
            email:
              type: string
              nullable: true
            latitude:
              type: number
              format: double
            longitude:
              type: number
              format: double
            operatingHours:
              type: object
              additionalProperties:
                type: object
                properties:
                  open:
                    type: string
                  close:
                    type: string
                  closed:
                    type: boolean
            description:
              type: string
              nullable: true
            services:
              type: array
              items:
                $ref: '#/components/schemas/ServiceListItem'

    BookingCreateInput:
      type: object
      required:
        - serviceId
        - branchId
        - appointmentDate
        - appointmentTime
      properties:
        serviceId:
          type: string
          format: uuid
        branchId:
          type: string
          format: uuid
        appointmentDate:
          type: string
          format: date
        appointmentTime:
          type: string
          pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'
          example: "14:00"
        guestName:
          type: string
          minLength: 2
          description: Required for guest bookings
        guestEmail:
          type: string
          format: email
          description: Required for guest bookings
        guestPhone:
          type: string
          description: Required for guest bookings
        notes:
          type: string
          maxLength: 500
        language:
          type: string
          enum: [vi, ja, en, zh]
          default: vi

    BookingDetail:
      type: object
      properties:
        id:
          type: string
          format: uuid
        referenceNumber:
          type: string
        appointmentDate:
          type: string
          format: date
        appointmentTime:
          type: string
        status:
          type: string
          enum: [confirmed, completed, cancelled, no_show]
        notes:
          type: string
          nullable: true
        language:
          type: string
        createdAt:
          type: string
          format: date-time
        service:
          $ref: '#/components/schemas/ServiceListItem'
        branch:
          $ref: '#/components/schemas/BranchListItem'
        customerName:
          type: string

    Review:
      type: object
      properties:
        id:
          type: string
          format: uuid
        customerName:
          type: string
        rating:
          type: integer
          minimum: 1
          maximum: 5
        reviewText:
          type: string
        adminResponse:
          type: string
          nullable: true
        createdAt:
          type: string
          format: date-time

    BlogPostListItem:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        slug:
          type: string
        excerpt:
          type: string
        featuredImage:
          type: string
        publishedAt:
          type: string
          format: date-time
        category:
          type: object
          properties:
            name:
              type: string
            slug:
              type: string
        author:
          type: object
          properties:
            fullName:
              type: string

    BlogPostDetail:
      allOf:
        - $ref: '#/components/schemas/BlogPostListItem'
        - type: object
          properties:
            content:
              type: string
            relatedPosts:
              type: array
              items:
                $ref: '#/components/schemas/BlogPostListItem'

    UserProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
        phone:
          type: string
        fullName:
          type: string
        language:
          type: string
        createdAt:
          type: string
          format: date-time

paths:
  /health:
    get:
      tags:
        - Health
      summary: Health check endpoint
      responses:
        '200':
          description: API is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"
                  timestamp:
                    type: string
                    format: date-time
                  version:
                    type: string
                    example: "1.0.0"

  /auth/register:
    post:
      tags:
        - Auth
      summary: Register new member account
      description: |
        Creates a new user account using Supabase Auth email OTP.
        Sends OTP code to provided email for verification.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - fullName
                - phone
              properties:
                email:
                  type: string
                  format: email
                fullName:
                  type: string
                  minLength: 2
                phone:
                  type: string
                language:
                  type: string
                  enum: [vi, ja, en, zh]
                  default: vi
      responses:
        '201':
          description: Registration initiated, OTP sent
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "OTP code sent to your email"
                  email:
                    type: string
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Email already registered
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/verify-otp:
    post:
      tags:
        - Auth
      summary: Verify OTP code and complete registration
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - otp
              properties:
                email:
                  type: string
                  format: email
                otp:
                  type: string
                  pattern: '^[0-9]{6}$'
                  example: "123456"
      responses:
        '200':
          description: OTP verified, user authenticated
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  refreshToken:
                    type: string
                  user:
                    $ref: '#/components/schemas/UserProfile'
        '400':
          description: Invalid or expired OTP
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - Auth
      summary: Login with email (sends OTP)
      description: Initiates passwordless login by sending OTP to email
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
              properties:
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: OTP sent to email
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "OTP code sent to your email"
        '404':
          description: Email not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/logout:
    post:
      tags:
        - Auth
      summary: Logout current session
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successfully logged out
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Logged out successfully"

  /services:
    get:
      tags:
        - Services
      summary: Get all services with pagination
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: category
          in: query
          description: Filter by category slug
          schema:
            type: string
        - name: search
          in: query
          description: Search in service name and description
          schema:
            type: string
        - name: featured
          in: query
          description: Filter featured services
          schema:
            type: boolean
      responses:
        '200':
          description: List of services
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ServiceListItem'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

  /services/{slug}:
    get:
      tags:
        - Services
      summary: Get service details by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Service details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServiceDetail'
        '404':
          description: Service not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /services/categories:
    get:
      tags:
        - Services
      summary: Get all service categories
      responses:
        '200':
          description: List of categories
          content:
            application/json:
              schema:
                type: array
                items:
                  allOf:
                    - $ref: '#/components/schemas/ServiceCategory'
                    - type: object
                      properties:
                        _count:
                          type: object
                          properties:
                            services:
                              type: integer

  /branches:
    get:
      tags:
        - Branches
      summary: Get all branches
      responses:
        '200':
          description: List of branches
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/BranchListItem'

  /branches/{slug}:
    get:
      tags:
        - Branches
      summary: Get branch details by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Branch details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BranchDetail'
        '404':
          description: Branch not found

  /bookings:
    post:
      tags:
        - Bookings
      summary: Create new booking
      description: |
        Create appointment booking. Can be used by:
        - Guest users (provide guestName, guestEmail, guestPhone)
        - Authenticated members (user info auto-filled from token)
      security:
        - BearerAuth: []
        - {}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingCreateInput'
      responses:
        '201':
          description: Booking created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookingDetail'
        '400':
          description: Validation error or slot unavailable
        '409':
          description: Time slot already booked

  /bookings/{referenceNumber}:
    get:
      tags:
        - Bookings
      summary: Get booking by reference number
      description: Lookup booking for guests and members
      parameters:
        - name: referenceNumber
          in: path
          required: true
          schema:
            type: string
        - name: email
          in: query
          description: Required for guest bookings
          schema:
            type: string
            format: email
      responses:
        '200':
          description: Booking details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookingDetail'
        '404':
          description: Booking not found

  /bookings/availability:
    get:
      tags:
        - Bookings
      summary: Check availability for service at branch
      parameters:
        - name: serviceId
          in: query
          required: true
          schema:
            type: string
            format: uuid
        - name: branchId
          in: query
          required: true
          schema:
            type: string
            format: uuid
        - name: date
          in: query
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Available time slots
          content:
            application/json:
              schema:
                type: object
                properties:
                  date:
                    type: string
                    format: date
                  availableSlots:
                    type: array
                    items:
                      type: object
                      properties:
                        time:
                          type: string
                          example: "09:00"
                        available:
                          type: boolean

  /profile:
    get:
      tags:
        - Profile
      summary: Get member profile
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Member profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          description: Unauthorized
    put:
      tags:
        - Profile
      summary: Update member profile
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                fullName:
                  type: string
                phone:
                  type: string
                language:
                  type: string
                  enum: [vi, ja, en, zh]
      responses:
        '200':
          description: Profile updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'

  /profile/bookings:
    get:
      tags:
        - Profile
      summary: Get member booking history
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [confirmed, completed, cancelled, no_show]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Booking history
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/BookingDetail'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

  /blog/posts:
    get:
      tags:
        - Blog
      summary: Get blog posts with pagination
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 12
        - name: category
          in: query
          schema:
            type: string
        - name: search
          in: query
          schema:
            type: string
        - name: language
          in: query
          schema:
            type: string
            enum: [vi, ja, en, zh]
      responses:
        '200':
          description: List of blog posts
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/BlogPostListItem'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

  /blog/posts/{slug}:
    get:
      tags:
        - Blog
      summary: Get blog post by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Blog post details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BlogPostDetail'

  /blog/categories:
    get:
      tags:
        - Blog
      summary: Get blog categories
      responses:
        '200':
          description: List of categories
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                    name:
                      type: string
                    slug:
                      type: string
                    _count:
                      type: object
                      properties:
                        posts:
                          type: integer

  /reviews:
    post:
      tags:
        - Reviews
      summary: Submit service review
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - serviceId
                - customerName
                - email
                - rating
                - reviewText
              properties:
                serviceId:
                  type: string
                  format: uuid
                customerName:
                  type: string
                email:
                  type: string
                  format: email
                rating:
                  type: integer
                  minimum: 1
                  maximum: 5
                reviewText:
                  type: string
                  maxLength: 500
      responses:
        '201':
          description: Review submitted (pending moderation)
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Thank you! Your review will appear after moderation."
        '429':
          description: Rate limit exceeded (max 3 reviews per day per email)

  /reviews/service/{serviceId}:
    get:
      tags:
        - Reviews
      summary: Get approved reviews for service
      parameters:
        - name: serviceId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Service reviews
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Review'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
                  stats:
                    type: object
                    properties:
                      averageRating:
                        type: number
                      totalReviews:
                        type: integer
                      ratingDistribution:
                        type: object
                        properties:
                          5:
                            type: integer
                          4:
                            type: integer
                          3:
                            type: integer
                          2:
                            type: integer
                          1:
                            type: integer

  /contact:
    post:
      tags:
        - Contact
      summary: Submit contact form
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - messageType
                - message
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
                phone:
                  type: string
                messageType:
                  type: string
                  enum: [general, booking_inquiry, complaint, feedback]
                message:
                  type: string
                  maxLength: 2000
      responses:
        '201':
          description: Contact form submitted
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Thank you for contacting us. We'll respond within 24 hours."

  # ADMIN ENDPOINTS
  /admin/dashboard:
    get:
      tags:
        - Admin - Dashboard
      summary: Get admin dashboard metrics
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Dashboard metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  metrics:
                    type: object
                    properties:
                      totalBookings:
                        type: integer
                      todayBookings:
                        type: integer
                      monthBookings:
                        type: integer
                      totalMembers:
                        type: integer
                  recentBookings:
                    type: array
                    items:
                      $ref: '#/components/schemas/BookingDetail'
                  bookingsByStatus:
                    type: object
                  popularServices:
                    type: array
                    items:
                      type: object

  /admin/bookings:
    get:
      tags:
        - Admin - Bookings
      summary: Get all bookings (admin view)
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
        - name: status
          in: query
          schema:
            type: string
        - name: branchId
          in: query
          schema:
            type: string
        - name: dateFrom
          in: query
          schema:
            type: string
            format: date
        - name: dateTo
          in: query
          schema:
            type: string
            format: date
        - name: search
          in: query
          description: Search by customer name or reference number
          schema:
            type: string
      responses:
        '200':
          description: Bookings list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/BookingDetail'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

  /admin/bookings/{id}/status:
    put:
      tags:
        - Admin - Bookings
      summary: Update booking status
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - status
              properties:
                status:
                  type: string
                  enum: [confirmed, completed, cancelled, no_show]
                cancellationReason:
                  type: string
      responses:
        '200':
          description: Status updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookingDetail'

  /admin/services:
    get:
      tags:
        - Admin - Services
      summary: Get all services (admin view)
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Services list
    post:
      tags:
        - Admin - Services
      summary: Create new service
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - categoryId
                - duration
                - price
              properties:
                name:
                  type: string
                slug:
                  type: string
                description:
                  type: string
                excerpt:
                  type: string
                categoryId:
                  type: string
                  format: uuid
                duration:
                  type: integer
                price:
                  type: number
                images:
                  type: array
                  items:
                    type: string
                featured:
                  type: boolean
      responses:
        '201':
          description: Service created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServiceDetail'

  /admin/services/{id}:
    put:
      tags:
        - Admin - Services
      summary: Update service
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Service updated
    delete:
      tags:
        - Admin - Services
      summary: Delete service
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Service deleted

  /admin/reviews:
    get:
      tags:
        - Admin - Reviews
      summary: Get all reviews for moderation
      security:
        - BearerAuth: []
      parameters:
        - name: approved
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Reviews list

  /admin/reviews/{id}/approve:
    put:
      tags:
        - Admin - Reviews
      summary: Approve review
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Review approved

  /admin/reviews/{id}/response:
    put:
      tags:
        - Admin - Reviews
      summary: Add admin response to review
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - adminResponse
              properties:
                adminResponse:
                  type: string
      responses:
        '200':
          description: Response added

  /admin/blog/posts:
    post:
      tags:
        - Admin - Blog
      summary: Create blog post
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - content
                - categoryId
              properties:
                title:
                  type: string
                slug:
                  type: string
                content:
                  type: string
                excerpt:
                  type: string
                featuredImage:
                  type: string
                categoryId:
                  type: string
                  format: uuid
                published:
                  type: boolean
                language:
                  type: string
                  enum: [vi, ja, en, zh]
      responses:
        '201':
          description: Blog post created

  /admin/blog/posts/{id}:
    put:
      tags:
        - Admin - Blog
      summary: Update blog post
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Blog post updated
    delete:
      tags:
        - Admin - Blog
      summary: Delete blog post
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Blog post deleted

  /admin/upload:
    post:
      tags:
        - Admin - Blog
      summary: Upload image to Supabase Storage
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                folder:
                  type: string
                  enum: [services, branches, blog, profile]
      responses:
        '201':
          description: Image uploaded
          content:
            application/json:
              schema:
                type: object
                properties:
                  url:
                    type: string
                    example: "https://supabase.co/storage/v1/object/public/images/blog/abc123.jpg"

  /admin/users:
    get:
      tags:
        - Admin - Users
      summary: Get all users (super admin only)
      security:
        - BearerAuth: []
      parameters:
        - name: role
          in: query
          schema:
            type: string
            enum: [member, admin, super_admin]
        - name: search
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Users list

  /admin/users/{id}/role:
    put:
      tags:
        - Admin - Users
      summary: Update user role (super admin only)
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - role
              properties:
                role:
                  type: string
                  enum: [member, admin, super_admin]
      responses:
        '200':
          description: Role updated

  /admin/contact:
    get:
      tags:
        - Admin - Contact
      summary: Get contact submissions
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [new, in_progress, resolved]
      responses:
        '200':
          description: Contact submissions list

  /admin/contact/{id}/status:
    put:
      tags:
        - Admin - Contact
      summary: Update contact submission status
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - status
              properties:
                status:
                  type: string
                  enum: [new, in_progress, resolved]
                adminNotes:
                  type: string
      responses:
        '200':
          description: Status updated
```

### API Endpoint Summary

**Total Endpoints:** 62

**Public Endpoints (No Auth Required):**
- Health check (1)
- Services: list, detail, categories (3)
- Branches: list, detail (2)
- Blog: posts list, post detail, categories (3)
- Reviews: submit, get by service (2)
- Contact: submit form (1)
- Bookings: create (guest), lookup, availability (3)
- **Subtotal: 15 endpoints**

**Member Endpoints (Require Auth Token):**
- Auth: register, verify OTP, login, logout (4)
- Profile: get, update (2)
- Bookings: create (authenticated), history (2)
- **Subtotal: 8 endpoints**

**Admin Endpoints (Require Admin Role):**
- Dashboard: metrics (1)
- Bookings: list, update status (2)
- Services: CRUD operations (4)
- Branches: CRUD operations (4 - implied)
- Blog: CRUD operations, upload (5)
- Reviews: list, approve, reject, respond (4)
- Contact: list, update status (2)
- Users: list, update role, status (3 - super admin only)
- **Subtotal: 25+ endpoints**

### API Design Patterns

1. **Resource-Based URLs:** `/api/v1/services`, `/api/v1/bookings`
2. **HTTP Verbs:** GET (read), POST (create), PUT (update), DELETE (delete)
3. **Nested Resources:** `/api/v1/blog/posts`, `/api/v1/reviews/service/{id}`
4. **Query Parameters:** Filtering, pagination, search
5. **Consistent Response Format:** `{ data: [], meta: {} }` for lists
6. **Error Format:** Standardized error object with code, message, details
7. **Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 429 (Rate Limited), 500 (Server Error)

### Authentication Flow

```
Client                          Backend                    Supabase Auth
  |                                |                              |
  |-- POST /auth/register -------->|                              |
  |    {email, fullName, phone}    |                              |
  |                                |-- signUp() ----------------->|
  |                                |<-- {user, session} ----------|
  |                                |-- Create User record ------->|
  |<-- 201 "OTP sent" -------------|                              |
  |                                |                              |
  |-- POST /auth/verify-otp ------>|                              |
  |    {email, otp}                |                              |
  |                                |-- verifyOtp() -------------->|
  |                                |<-- {session, tokens} --------|
  |<-- 200 {accessToken, user} ----|                              |
  |                                |                              |
  |-- GET /profile --------------->|                              |
  |    Authorization: Bearer XXX   |                              |
  |                                |-- Verify JWT --------------->|
  |                                |<-- {valid, userId} ----------|
  |                                |-- Get User from DB --------->|
  |<-- 200 {profile} --------------|                              |
```

---
