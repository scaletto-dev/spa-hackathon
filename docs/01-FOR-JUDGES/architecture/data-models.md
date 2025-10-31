# Data Models

This section defines the core data entities that form the foundation of the Beauty Clinic Care Website. These models are shared conceptually between frontend TypeScript interfaces and backend Prisma schema. All models use UUIDs for primary keys to support distributed systems and prevent enumeration attacks.

### User

**Purpose:** Represents registered members and administrators. Guest users (non-registered) don't have User records - their info is stored directly in Booking table.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `email`: string (unique) - User's email address for login and communication
- `phone`: string - Contact phone number
- `fullName`: string - User's full name for personalization
- `role`: enum ('member', 'admin', 'super_admin') - Access level for authorization
- `emailVerified`: boolean - Whether email has been verified via OTP
- `supabaseAuthId`: string (nullable) - Reference to Supabase Auth user ID
- `language`: string ('vi', 'ja', 'en', 'zh') - Preferred language for UI and emails
- `createdAt`: DateTime - Account creation timestamp
- `updatedAt`: DateTime - Last profile update timestamp

**TypeScript Interface:**

```typescript
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: 'member' | 'admin' | 'super_admin';
  emailVerified: boolean;
  supabaseAuthId: string | null;
  language: 'vi' | 'ja' | 'en' | 'zh';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  phone: string;
  fullName: string;
  language?: 'vi' | 'ja' | 'en' | 'zh';
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  language: string;
  createdAt: Date;
}
```

**Relationships:**
- One-to-Many with Booking (user can have multiple bookings)
- One-to-Many with Review (user can write multiple reviews)
- One-to-Many with BlogPost (user as author, admin only)

---

### ServiceCategory

**Purpose:** Organizes services into logical groups (e.g., Facial Care, Body Treatments, Aesthetic Procedures) for better navigation and filtering.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `name`: string - Category name (stored in Vietnamese, translations handled by i18next)
- `slug`: string (unique) - URL-friendly identifier for routing
- `description`: string (nullable) - Brief category description
- `displayOrder`: integer - Sort order for UI display
- `icon`: string (nullable) - Icon identifier (e.g., 'spa', 'beauty') for UI
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategoryWithCount extends ServiceCategory {
  _count: {
    services: number;
  };
}
```

**Relationships:**
- One-to-Many with Service (category contains multiple services)

---

### Service

**Purpose:** Represents individual beauty treatments or procedures offered by the clinic (e.g., Anti-Aging Facial, Deep Tissue Massage, Laser Hair Removal).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `name`: string - Service name (multilingual via i18next)
- `slug`: string (unique) - URL-friendly identifier
- `description`: string - Detailed service description with benefits
- `excerpt`: string - Short description for listings (150 chars)
- `duration`: integer - Service duration in minutes
- `price`: decimal - Base price in Vietnamese Dong (VND)
- `categoryId`: string (UUID) - Foreign key to ServiceCategory
- `images`: string[] - Array of image URLs from Supabase Storage
- `featured`: boolean - Whether service appears on homepage
- `active`: boolean - Whether service is currently bookable
- `beforeAfterPhotos`: string[] (nullable) - Array of before/after image URLs
- `faqs`: JSON (nullable) - Array of {question, answer} objects
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  duration: number;
  price: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  active: boolean;
  beforeAfterPhotos: string[] | null;
  faqs: Array<{ question: string; answer: string }> | null;
  createdAt: Date;
  updatedAt: Date;
  category?: ServiceCategory;
}

export interface ServiceListItem {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  duration: number;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ServiceDetail extends Service {
  category: ServiceCategory;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
```

**Relationships:**
- Many-to-One with ServiceCategory
- One-to-Many with Booking
- One-to-Many with Review
- Many-to-Many with Branch (services available at specific branches)

---

### Branch

**Purpose:** Represents physical clinic locations where services are provided.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `name`: string - Branch name (e.g., "Downtown Clinic", "Westside Spa")
- `slug`: string (unique) - URL-friendly identifier
- `address`: string - Full street address
- `phone`: string - Branch contact number
- `email`: string (nullable) - Branch-specific email
- `latitude`: decimal - GPS coordinate for maps
- `longitude`: decimal - GPS coordinate for maps
- `operatingHours`: JSON - Operating hours by day: {monday: {open: "09:00", close: "18:00"}, ...}
- `images`: string[] - Array of facility image URLs
- `active`: boolean - Whether branch is currently accepting bookings
- `description`: string (nullable) - Branch-specific description
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: number;
  longitude: number;
  operatingHours: OperatingHours;
  images: string[];
  active: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchListItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  images: string[];
}

export interface BranchDetail extends Branch {
  services: Service[];
  _count: {
    bookings: number;
  };
}
```

**Relationships:**
- One-to-Many with Booking
- Many-to-Many with Service (via join table)

---

### Booking

**Purpose:** Represents appointment reservations made by guests or members. Supports both guest bookings (no userId) and member bookings (with userId).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `referenceNumber`: string (unique) - Human-readable booking reference (e.g., "BCW-2024-001234")
- `userId`: string (UUID, nullable) - Foreign key to User (null for guest bookings)
- `serviceId`: string (UUID) - Foreign key to Service
- `branchId`: string (UUID) - Foreign key to Branch
- `appointmentDate`: Date - Date of appointment
- `appointmentTime`: string - Time slot (e.g., "14:00")
- `status`: enum ('confirmed', 'completed', 'cancelled', 'no_show') - Booking status
- `guestName`: string (nullable) - Guest's full name if userId is null
- `guestEmail`: string (nullable) - Guest's email if userId is null
- `guestPhone`: string (nullable) - Guest's phone if userId is null
- `notes`: string (nullable) - Optional customer notes or special requests
- `language`: string - Language preference for confirmations
- `cancellationReason`: string (nullable) - Reason if cancelled
- `createdAt`: DateTime - Booking creation timestamp
- `updatedAt`: DateTime - Last status update timestamp

**TypeScript Interface:**

```typescript
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  referenceNumber: string;
  userId: string | null;
  serviceId: string;
  branchId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: BookingStatus;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  notes: string | null;
  language: 'vi' | 'ja' | 'en' | 'zh';
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCreateInput {
  serviceId: string;
  branchId: string;
  appointmentDate: Date;
  appointmentTime: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  language?: string;
}

export interface BookingDetail extends Booking {
  service: ServiceListItem;
  branch: BranchListItem;
  user?: UserProfile;
}

export interface BookingListItem {
  id: string;
  referenceNumber: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: BookingStatus;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  branch: {
    name: string;
    address: string;
  };
  customerName: string; // guestName or user.fullName
}
```

**Relationships:**
- Many-to-One with User (optional - null for guest bookings)
- Many-to-One with Service
- Many-to-One with Branch

---

### Review

**Purpose:** Customer reviews and ratings for services. Supports both member reviews (with userId) and guest reviews (anonymous or name-only).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `serviceId`: string (UUID) - Foreign key to Service being reviewed
- `userId`: string (UUID, nullable) - Foreign key to User (null for guest reviews)
- `customerName`: string - Reviewer's name (from user profile or manually entered)
- `email`: string - Contact email for admin communication
- `rating`: integer (1-5) - Star rating
- `reviewText`: string - Review content (max 500 chars)
- `approved`: boolean - Whether review passed moderation
- `adminResponse`: string (nullable) - Optional response from admin
- `createdAt`: DateTime - Review submission timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface Review {
  id: string;
  serviceId: string;
  userId: string | null;
  customerName: string;
  email: string;
  rating: number; // 1-5
  reviewText: string;
  approved: boolean;
  adminResponse: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreateInput {
  serviceId: string;
  customerName: string;
  email: string;
  rating: number;
  reviewText: string;
  userId?: string;
}

export interface ReviewWithService extends Review {
  service: {
    id: string;
    name: string;
    slug: string;
  };
}
```

**Relationships:**
- Many-to-One with Service
- Many-to-One with User (optional)

---

### BlogCategory

**Purpose:** Organizes blog posts into topics (e.g., Skincare Tips, Beauty Trends, Clinic News).

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `name`: string - Category name
- `slug`: string (unique) - URL-friendly identifier
- `description`: string (nullable) - Category description
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategoryWithCount extends BlogCategory {
  _count: {
    posts: number;
  };
}
```

**Relationships:**
- One-to-Many with BlogPost

---

### BlogPost

**Purpose:** Blog articles for content marketing and SEO.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `title`: string - Post title
- `slug`: string (unique) - URL-friendly identifier
- `content`: string (text) - Full post content (rich text/markdown)
- `excerpt`: string - Short preview for listings
- `featuredImage`: string - Hero image URL
- `categoryId`: string (UUID) - Foreign key to BlogCategory
- `authorId`: string (UUID) - Foreign key to User (admin)
- `published`: boolean - Whether post is live
- `publishedAt`: DateTime (nullable) - Publication timestamp
- `language`: string - Post language ('vi', 'ja', 'en', 'zh')
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

**TypeScript Interface:**

```typescript
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  authorId: string;
  published: boolean;
  publishedAt: Date | null;
  language: 'vi' | 'ja' | 'en' | 'zh';
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: Date;
  category: {
    name: string;
    slug: string;
  };
  author: {
    fullName: string;
  };
}

export interface BlogPostDetail extends BlogPost {
  category: BlogCategory;
  author: {
    id: string;
    fullName: string;
  };
  relatedPosts: BlogPostListItem[];
}
```

**Relationships:**
- Many-to-One with BlogCategory
- Many-to-One with User (as author)

---

### ContactSubmission

**Purpose:** Stores contact form submissions for admin review and response.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `name`: string - Submitter's name
- `email`: string - Contact email
- `phone`: string (nullable) - Optional phone number
- `messageType`: enum ('general', 'booking_inquiry', 'complaint', 'feedback') - Categorization
- `message`: string (text) - Message content
- `status`: enum ('new', 'in_progress', 'resolved') - Admin workflow status
- `adminNotes`: string (nullable) - Internal admin notes
- `createdAt`: DateTime - Submission timestamp
- `updatedAt`: DateTime - Last status update timestamp

**TypeScript Interface:**

```typescript
export type MessageType = 'general' | 'booking_inquiry' | 'complaint' | 'feedback';
export type ContactStatus = 'new' | 'in_progress' | 'resolved';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  messageType: MessageType;
  message: string;
  status: ContactStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmissionCreateInput {
  name: string;
  email: string;
  phone?: string;
  messageType: MessageType;
  message: string;
}
```

**Relationships:**
- None (standalone entity)

---

### Entity Relationship Summary

**Core Relationships:**

```
User (1) ──→ (N) Booking
User (1) ──→ (N) Review
User (1) ──→ (N) BlogPost [as author]

ServiceCategory (1) ──→ (N) Service
Service (1) ──→ (N) Booking
Service (1) ──→ (N) Review
Service (N) ←→ (N) Branch [via BranchService join table]

Branch (1) ──→ (N) Booking

BlogCategory (1) ──→ (N) BlogPost

ContactSubmission [standalone]
```

**Key Design Decisions:**

1. **UUID Primary Keys:** Better for distributed systems, prevent enumeration, no sequential ID leaks
2. **Nullable userId in Booking/Review:** Supports guest users without accounts
3. **JSON Fields:** `operatingHours`, `faqs` use JSON for flexibility without additional tables
4. **Slug Fields:** All public-facing entities have slugs for SEO-friendly URLs
5. **Soft Deletes (implicit):** `active` boolean fields allow hiding entities without deletion
6. **Language Field:** Stored at booking/post level for proper email language and content filtering
7. **Timestamps:** All entities have `createdAt`/`updatedAt` for auditing

---
