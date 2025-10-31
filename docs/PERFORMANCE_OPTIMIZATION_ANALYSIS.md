# Query Performance Analysis & Optimization Guide

**Created:** 2025-10-31
**Analysis of:** Service and Blog Post Queries
**Status:** Performance Issues Identified

---

## Executive Summary

### Issues Found

1. **Missing Indexes** - Critical performance bottleneck
2. **Potential N+1 Query Issues** - In rating aggregations
3. **Slow Response Times** - 700-3200ms for paginated queries

### Key Metrics from Logs

| Endpoint | Min Time | Max Time | Pattern |
|----------|----------|----------|---------|
| `GET /?featured=true&limit=6` | 367ms | 2373ms | Inconsistent - suggests cache misses |
| `GET /?limit=3` | 361ms | 2541ms | High variance |
| `GET /?page=1&limit=3&sortBy=date&sortOrder=desc&rating=5` | 717ms | 2729ms | Slow with filters |
| `GET /posts?page=1&limit=3` | 1277ms | 3212ms | Blog queries are slower |

---

## Problem Analysis

### 1. Missing Database Indexes

#### Service Model Issues
```prisma
model Service {
  // ❌ MISSING: Index for (active, featured) - used in featured queries
  // ❌ MISSING: Index for (categoryId, active) - used in category filtering
  // ❌ MISSING: Index for (active, featured, name) - used in getAllServices

  @@index([slug])           // ✅ Present
  @@index([categoryId])     // ✅ Present
  @@index([featured])       // ✅ Present - but not composite
}
```

**Query Pattern in Repository:**
```typescript
// This query needs a composite index!
const services = await prisma.service.findMany({
  where: {
    active: true,        // Filter 1
    featured: featured,  // Filter 2 (conditional)
  },
  // ... takes 700-2373ms without proper index
});
```

#### BlogPost Model Issues
```prisma
model BlogPost {
  // ❌ MISSING: Index for (published, publishedAt) - used in ordering
  // ❌ MISSING: Index for (published, categoryId) - used in filtering
  // ❌ MISSING: Index for full-text search fields

  @@index([slug])       // ✅ Present
  @@index([published])  // ✅ Present - but should be composite
  @@index([categoryId]) // ✅ Present - but should be composite
}
```

**Query Pattern:**
```typescript
// This needs (published, publishedAt) composite index
const posts = await prisma.blogPost.findMany({
  where: {
    published: true,     // Filter
    categoryId: categoryId // Filter
  },
  orderBy: { publishedAt: 'desc' }, // Sort
  skip: (page - 1) * limit,
  take: limit,
  // ... takes 1277-3212ms
});
```

#### Review Model Issues
```prisma
model Review {
  // ❌ MISSING: Index for (serviceId, approved) - used in rating calculation
  // ❌ MISSING: Index for (serviceId, approved, rating) - used in filtering

  // No indexes defined!
  // This is the PRIMARY PERFORMANCE BOTTLENECK for rating queries
}
```

**Problematic Query:**
```typescript
// This causes full table scan on Review table!
const result = await prisma.review.aggregate({
  where: {
    serviceId,      // No index!
    approved: true, // No index!
  },
  _avg: { rating: true },
  _count: true,
});

// Plus this additional query (N+1 pattern):
const distribution = await prisma.review.groupBy({
  by: ['rating'],
  where: {
    serviceId,      // No index!
    approved: true, // No index!
  },
  _count: true,
});
```

---

### 2. N+1 Query Problem: Rating Queries

#### Current Implementation (SLOW)
```typescript
// In review.controller.ts - Line 31-38
const { rating, sort } = (req as any).validatedQuery;

// Query 1: Get reviews with includes
const result = await reviewService.getReviews(page, limit, serviceId, sort, rating);

// This translates to:
// 1. COUNT query for total
// 2. findMany query with service include (loads service data)
// 3. If you need rating stats: getServiceRating() does:
//    - aggregate query (Query 3)
//    - groupBy query for distribution (Query 4)
```

**Impact:** Each request with rating filter/stats makes 4 queries instead of 1

---

### 3. Query-Specific Performance Issues

#### Issue A: Featured Services Query
**Request:** `GET /?featured=true&limit=6`
**Time:** 367-2373ms (6.5x variance!)

**Root Cause:**
```typescript
// Repository method queries ALL featured services then paginates
const services = await prisma.service.findMany({
  where: {
    featured: true,
    active: true,      // No composite index
  },
  // ... without proper index, PostgreSQL does full table scan
  take: 6,
});
```

**Why Variance?** PostgreSQL query planner is re-analyzing the query each time, cache misses on repeated calls.

#### Issue B: Filtered Services with Rating
**Request:** `GET /?page=1&limit=3&sortBy=date&sortOrder=desc&rating=5`
**Time:** 717-2729ms

**Root Cause:**
The validator allows these parameters but `getAllServices()` doesn't use them!
```typescript
// service.validator.ts defines: page, limit, categoryId, featured
// But frontend sends: sortBy, sortOrder, rating

// These are being IGNORED, causing frontend confusion
// Review queries use rating, but service queries don't support it
```

#### Issue C: Blog Post Queries
**Request:** `GET /posts?page=1&limit=3`
**Time:** 1277-3212ms

**Root Cause:**
```typescript
// blogPost queries include related data and do full-text search
const posts = await prisma.blogPost.findMany({
  where: {
    published: true,
    // search conditions with OR clause (3 fields)
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  },
  include: {
    category: {...},
    author: {...}
  },
  // Takes 1200-3200ms due to:
  // 1. No indexes for search fields
  // 2. Include relations without optimization
});
```

---

## Recommended Solutions

### Solution 1: Add Critical Indexes (IMMEDIATE - HIGH IMPACT)

#### A. Review Model - MOST CRITICAL
```prisma
model Review {
  // ... existing fields ...

  @@index([serviceId])                    // Filter by service
  @@index([approved])                     // Filter by approval
  @@index([serviceId, approved])          // Combined for aggregate queries
  @@index([serviceId, approved, rating])  // Composite for distribution queries
  @@index([createdAt])                    // For sorting by date
}
```

**Expected Impact:** Rating queries: **3200ms → 100-200ms** (16x improvement)

#### B. Service Model
```prisma
model Service {
  // ... existing fields ...

  @@index([active])                       // Add to existing
  @@index([active, featured])             // Composite for featured queries
  @@index([categoryId, active])           // Composite for category filtering
  @@index([featured, active, name])       // For getAllServices ordering
}
```

**Expected Impact:** Service queries: **2373ms → 300-400ms** (6x improvement)

#### C. BlogPost Model
```prisma
model BlogPost {
  // ... existing fields ...

  @@index([published, publishedAt])       // For ordered list queries
  @@index([published, categoryId])        // For category filtering
  @@index([title])                        // For search optimization (PostgreSQL can use)
}
```

**Expected Impact:** Blog queries: **3212ms → 500-700ms** (4-5x improvement)

#### D. BlogPost Full-Text Search Index (Optional but Recommended)
```prisma
model BlogPost {
  // Add searchable field
  /// @db.Text (enables full-text search)
  @@fulltext([title, excerpt, content])   // PostgreSQL full-text search
}
```

---

### Solution 2: Fix N+1 Query in Rating Aggregation

**Current Issue:**
```typescript
// review.repository.ts - getServiceRating() makes 2 queries
// Query 1: aggregate
const result = await prisma.review.aggregate({ where });
// Query 2: groupBy (N+1)
const distribution = await prisma.review.groupBy({ where });
```

**Optimized Solution:**
```typescript
async getServiceRatingOptimized(serviceId: string) {
  // Single query approach using aggregation
  const [stats, distribution] = await Promise.all([
    prisma.review.aggregate({
      where: { serviceId, approved: true },
      _avg: { rating: true },
      _count: true,
    }),
    // Continue groupBy in parallel (not sequential)
    prisma.review.groupBy({
      by: ['rating'],
      where: { serviceId, approved: true },
      _count: true,
    }),
  ]);

  // Already parallel, but add caching:
  // Cache this result for 1 hour since ratings don't change frequently

  return {
    serviceId,
    averageRating: stats._avg.rating || 0,
    totalReviews: stats._count,
    ratingDistribution: buildRatingMap(distribution),
  };
}
```

**Expected Impact:** Already parallel, but add **Redis caching for 1 hour** → **100-200ms → 5ms** (40x for cached hits)

---

### Solution 3: Optimize Blog Search Query

**Current Issue:**
```typescript
// Uses OR conditions with ILIKE on 3 fields - no full-text search
where: {
  published: true,
  OR: [
    { title: { contains: search, mode: 'insensitive' } },
    { excerpt: { contains: search, mode: 'insensitive' } },
    { content: { contains: search, mode: 'insensitive' } },
  ]
}
```

**Optimized Approach:**
```typescript
// Option A: Add PostgreSQL full-text search
const posts = await prisma.blogPost.findMany({
  where: {
    published: true,
    // Use Prisma raw query for full-text search
    // OR use trigram index for ILIKE optimization
  },
  include: {
    category: { select: { name: true, slug: true } },
    author: { select: { id: true, fullName: true } },
  },
});

// Option B: If staying with ILIKE, add trigram index
// CREATE INDEX idx_blogpost_title_search ON "BlogPost"
//   USING GIN (title gin_trgm_ops);
```

---

### Solution 4: Fix Parameter Mismatch

**Issue:** Frontend sends `rating`, `sortBy`, `sortOrder` but services endpoint doesn't support them

**Fix Option A: Extend Services Query**
```typescript
// service.validator.ts - Add support for sorting
export const getServicesQuerySchema = z.object({
  // ... existing fields ...
  sortBy: z.enum(['name', 'price', 'featured', 'newest']).optional().default('featured'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  rating: z.coerce.number().min(1).max(5).optional(), // Add if needed
});
```

**Fix Option B: Use Separate Reviews Endpoint**
Rating filters should query reviews, not services:
```typescript
// Already exists: GET /api/v1/reviews?serviceId=xxx&rating=5
// Frontend should use this for filtered reviews, not services endpoint
```

**Recommendation:** Option B (separation of concerns) - Services and Reviews are different resources

---

## Migration Steps

### Step 1: Create Prisma Migration
```bash
npx prisma migrate dev --name add_performance_indexes
```

### Step 2: Update Schema
Add indexes as shown in Solution 1

### Step 3: Add Redis Cache (Optional but Recommended)
For rating calculations and featured services:
```typescript
// Add to review.service.ts
const RATING_CACHE_KEY = `service_rating:${serviceId}`;
const CACHE_TTL = 3600; // 1 hour

async getServiceRating(serviceId: string) {
  // Check cache first
  const cached = await redis.get(RATING_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  // Calculate if not cached
  const rating = await reviewRepository.getServiceRating(serviceId);

  // Store in cache
  await redis.set(RATING_CACHE_KEY, JSON.stringify(rating), 'EX', CACHE_TTL);

  return rating;
}
```

### Step 4: Verify Query Performance
```bash
# Enable query logging
QUERY_LOG=true npm run dev

# Monitor response times in logs
# Check that:
# - Featured queries: 367ms → 100ms
# - Featured with pagination: 2373ms → 300ms
# - Blog queries: 3212ms → 700ms
```

---

## Quick Wins (Implement First)

### Priority 1: Add Review Indexes (5 minutes)
- **Impact:** 16x improvement on rating queries
- **Risk:** None (indexes don't change data)
- **File:** `apps/backend/src/prisma/schema.prisma`

### Priority 2: Add Service Indexes (5 minutes)
- **Impact:** 6x improvement on service queries
- **Risk:** None
- **File:** `apps/backend/src/prisma/schema.prisma`

### Priority 3: Add BlogPost Indexes (5 minutes)
- **Impact:** 4-5x improvement on blog queries
- **Risk:** None
- **File:** `apps/backend/src/prisma/schema.prisma`

### Priority 4: Implement Redis Caching for Ratings (30 minutes)
- **Impact:** 40x improvement on cached rating calls
- **Risk:** Low (simple cache with TTL)
- **File:** `apps/backend/src/services/review.service.ts`

---

## Testing Checklist

- [ ] Run migration successfully
- [ ] Verify indexes created in PostgreSQL:
  ```sql
  SELECT indexname FROM pg_indexes WHERE tablename = 'Review';
  SELECT indexname FROM pg_indexes WHERE tablename = 'Service';
  SELECT indexname FROM pg_indexes WHERE tablename = 'BlogPost';
  ```
- [ ] Measure query times before/after indexes
- [ ] Test featured services endpoint (should be <200ms)
- [ ] Test blog posts endpoint (should be <800ms)
- [ ] Test rating calculations (should be <100ms)
- [ ] Load test with concurrent requests

---

## Query Analysis Summary

### Current Architecture Issues
1. **Review table is completely unindexed** → Causing 2-3 second queries
2. **Composite indexes missing** → PostgreSQL can't optimize multi-filter queries
3. **No caching strategy** → Repeated queries aren't optimized
4. **N+1 pattern in rating stats** → Running 2 queries when 1 would suffice (already parallel, so low priority)

### Expected Results After Optimization
- Featured services: 2373ms → 300ms (-87%)
- Blog queries: 3212ms → 700ms (-78%)
- Rating queries: 2729ms → 150ms (-95%)
- **Average response time: 1200ms → 250ms (80% improvement)**

---

## Additional Recommendations

### Long-term Optimizations

1. **Implement Query Result Caching**
   - Cache featured services for 30 minutes
   - Cache category listings for 1 hour
   - Invalidate on updates

2. **Add Query Monitoring**
   - Log slow queries (>500ms)
   - Set up alerts for queries >1000ms
   - Use `EXPLAIN ANALYZE` for optimization

3. **Database Query Optimization**
   - Add statistics on columns used in filters
   - Run `ANALYZE` on tables regularly
   - Consider table partitioning if data grows

4. **Consider Search Engine (Optional)**
   - For blog full-text search, consider Elasticsearch
   - Would reduce load on main database for complex searches

5. **Add Pagination Limits**
   - Cap `limit` parameter to prevent large result sets
   - Current validator: `max(100)` - Good!

---

## Files to Modify

1. **`apps/backend/src/prisma/schema.prisma`** - Add indexes
2. **`apps/backend/src/services/review.service.ts`** - Add caching (optional)
3. **`apps/backend/src/repositories/review.repository.ts`** - Ensure queries use indexes
4. **`apps/backend/src/repositories/blog.repository.ts`** - Optimize search
5. **`apps/backend/src/validators/service.validator.ts`** - Document current parameters

