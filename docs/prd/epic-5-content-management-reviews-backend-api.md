# Epic 5: Content Management & Reviews (Backend API)

**Expanded Goal:** Build comprehensive **backend API** for blog/news content management and customer review system. Deliver RESTful APIs for blog post CRUD operations, category management, review submissions with moderation workflow, and content retrieval with filtering/search. This epic provides the backend foundation for content marketing, SEO, and customer social proof features.

**Phase 1 Focus:** Backend API ONLY - Blog endpoints, review endpoints, admin moderation APIs, content management.

### Story 5.1: Design Blog Database Schema and API Structure

As a backend developer,
I want to design the blog post data model and API structure,
so that blog content can be stored, retrieved, and managed efficiently.

#### Acceptance Criteria
1. BlogPost model already defined in Prisma schema from Epic 1 (verify completeness)
2. BlogPost includes: id, title, slug, content, excerpt, featuredImage, categoryId, authorId, published, publishedAt, createdAt, updatedAt
3. BlogCategory model includes: id, name, slug, description
4. Relationship defined: BlogPost belongsTo BlogCategory, BlogPost belongsTo User (author)
5. Indexes added on: slug (unique), published, publishedAt, categoryId
6. Migration created if schema changes needed
7. Seed data created with 3 blog categories and 5 sample blog posts
8. API endpoint structure planned: GET /api/v1/blog/posts, GET /api/v1/blog/posts/:slug, GET /api/v1/blog/categories
9. Public endpoints (read-only) separate from admin endpoints (write operations)
10. Documentation updated with blog schema and API specifications

### Story 5.2: Implement Blog API Endpoints (Public)

As a backend developer,
I want to create public API endpoints for blog content,
so that the frontend can display blog posts to visitors.

#### Acceptance Criteria
1. `GET /api/v1/blog/posts` endpoint created returning published posts with pagination
2. Endpoint supports query params: category (filter by slug), search (text search), page, limit
3. Response includes: posts array, pagination meta (total, page, totalPages, limit)
4. Posts ordered by publishedAt desc (newest first)
5. Each post includes: id, title, slug, excerpt, featuredImage, category, author (name only), publishedAt
6. `GET /api/v1/blog/posts/:slug` endpoint created returning single post details
7. Post detail includes full content, category, author info, related posts (3 from same category)
8. Draft posts (published=false) not returned by public endpoints
9. `GET /api/v1/blog/categories` endpoint created returning all categories with post counts
10. All endpoints tested and returning properly formatted data

### Story 5.3: Build Blog Listing Page

As a visitor,
I want to browse all blog posts with filtering and search,
so that I can find relevant beauty and wellness content.

#### Acceptance Criteria
1. Blog listing page created at `/blog` route
2. Posts displayed in card grid layout (3 columns desktop, 2 tablet, 1 mobile)
3. Each card shows: featured image, category badge, title, excerpt (truncated to 150 chars), publish date, "Read More" link
4. Category filter sidebar (desktop) or dropdown (mobile) with all categories
5. Search bar at top of page with placeholder "Search articles..."
6. Filtering by category updates URL query param (?category=skincare-tips)
7. Search updates URL query param (?search=facial)
8. Pagination controls at bottom (Previous, Page numbers, Next)
9. Empty state shown if no posts found with "Try different filters" message
10. Page meta tags for SEO: title, description, og:image

### Story 5.4: Create Blog Post Detail Page

As a visitor,
I want to read full blog articles with rich formatting,
so that I can learn about beauty treatments and wellness tips.

#### Acceptance Criteria
1. Blog post detail page created at `/blog/:slug` route
2. Page layout: hero image, category badge, title, author name, publish date, reading time estimate
3. Article content rendered with proper HTML formatting (headings, paragraphs, lists, images, quotes)
4. Content uses typography styles for readability (larger font, optimal line height, max-width container)
5. Table of contents generated from article headings (H2, H3) with jump links (optional, nice-to-have)
6. Related posts section at bottom showing 3 posts from same category
7. Social sharing buttons: Facebook, Twitter, LinkedIn, Copy Link
8. "Back to Blog" breadcrumb navigation at top
9. 404 page shown if blog post slug not found
10. SEO meta tags populated from post data: title, description, og:image, publish date

### Story 5.5: Implement Review Database Schema and API

As a backend developer,
I want to design the review data model and create API endpoints,
so that customer reviews can be collected and managed.

#### Acceptance Criteria
1. Review model already defined in Prisma schema from Epic 1 (verify completeness)
2. Review includes: id, serviceId, userId (nullable), customerName, email, rating (1-5), reviewText, approved, adminResponse, createdAt, updatedAt
3. Relationship: Review belongsTo Service, Review belongsTo User (optional)
4. Indexes added on: serviceId, approved, rating, createdAt
5. `POST /api/v1/reviews` endpoint created for submitting reviews
6. Endpoint accepts: serviceId, customerName, email, rating, reviewText
7. Review saved with approved=false (pending moderation)
8. `GET /api/v1/reviews?serviceId=X` endpoint returns approved reviews for service
9. Reviews ordered by createdAt desc (newest first)
10. Rate limiting: max 3 review submissions per day per email

### Story 5.6: Build Review Submission Form

As a customer,
I want to submit a review for a service I've used,
so that I can share my experience and help others make decisions.

#### Acceptance Criteria
1. Review form component created (can be embedded on service detail pages)
2. Form includes: Customer Name (required), Email (required), Rating (1-5 stars, required), Review Text (required, textarea)
3. Star rating input allows clicking 1-5 stars with visual highlight
4. Review text has character limit (500 chars) with counter
5. Form validation with inline error messages
6. "Submit Review" button submits to `POST /api/v1/reviews`
7. Success message shown: "Thank you! Your review will appear after moderation."
8. Form resets after successful submission
9. Error handling for submission failures with retry option
10. Logged-in members' name and email pre-filled (optional)

### Story 5.7: Display Reviews on Service Detail Pages

As a potential customer,
I want to read reviews from other customers on service pages,
so that I can make informed booking decisions based on others' experiences.

#### Acceptance Criteria
1. Reviews section added to service detail page (from Epic 2 Story 2.2)
2. Section displays approved reviews for the service
3. Each review shows: customer name, star rating, review text, date posted, admin response (if exists)
4. Reviews displayed in card layout with proper spacing
5. Average rating calculated and displayed prominently (e.g., "4.8 out of 5 stars from 24 reviews")
6. Star distribution chart shown (5 stars: 15, 4 stars: 7, 3 stars: 2, etc.)
7. "Write a Review" button opens review form (modal or inline)
8. Pagination or "Load More" button if more than 10 reviews
9. Empty state if no reviews: "Be the first to review this service"
10. Reviews fetched from `GET /api/v1/reviews?serviceId=X`

### Story 5.8: Create Admin Blog Management Interface

As an admin,
I want to create and manage blog posts through an admin interface,
so that I can publish content without requiring developer assistance.

#### Acceptance Criteria
1. Admin blog management page created at `/admin/blog` (protected, admin role required)
2. Page lists all blog posts (published and drafts) in table view
3. Table columns: Title, Category, Author, Status (Published/Draft), Publish Date, Actions
4. "Create New Post" button opens post editor
5. Post editor includes fields: Title, Slug (auto-generated from title, editable), Category (dropdown), Featured Image (upload), Excerpt, Content (rich text editor)
6. Rich text editor supports: headings, bold, italic, lists, links, images, quotes
7. "Save as Draft" and "Publish" buttons
8. Edit functionality opens existing post in editor
9. Delete functionality with confirmation dialog
10. All operations call admin API endpoints (to be created in next story)

### Story 5.9: Implement Admin Blog API Endpoints

As a backend developer,
I want to create protected admin API endpoints for blog management,
so that authorized admins can create, update, and delete blog posts.

#### Acceptance Criteria
1. `POST /api/v1/admin/blog/posts` endpoint created for creating posts
2. `PUT /api/v1/admin/blog/posts/:id` endpoint created for updating posts
3. `DELETE /api/v1/admin/blog/posts/:id` endpoint created for deleting posts
4. All admin blog endpoints require authentication and admin role verification
5. Post creation generates slug from title (URL-friendly, unique)
6. Published posts require: title, content, excerpt, category, featuredImage
7. Draft posts can be saved with incomplete data
8. Image upload endpoint created: `POST /api/v1/admin/upload` (uploads to Supabase Storage)
9. Validation ensures slug uniqueness (returns error if duplicate)
10. Endpoints tested with admin and non-admin users

### Story 5.10: Create Admin Review Moderation Interface

As an admin,
I want to review and moderate customer reviews,
so that I can approve quality reviews and respond to feedback.

#### Acceptance Criteria
1. Admin review moderation page created at `/admin/reviews` (protected, admin role required)
2. Page displays all reviews (approved and pending) with filtering tabs
3. Tabs: "Pending", "Approved", "All"
4. Each review shows: customer name, service name, rating, review text, date submitted
5. Actions for each review: Approve, Reject, Respond
6. "Approve" button calls `PUT /api/v1/admin/reviews/:id/approve`
7. "Reject" button calls `DELETE /api/v1/admin/reviews/:id` with confirmation
8. "Respond" opens modal with textarea for admin response, calls `PUT /api/v1/admin/reviews/:id/response`
9. Approved reviews immediately visible on service pages
10. Admin response appears below review on service pages

---
