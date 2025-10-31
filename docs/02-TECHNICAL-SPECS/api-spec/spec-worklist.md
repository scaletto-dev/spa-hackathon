# API Specification Worklist

**Generated:** October 29, 2025  
**Source:** verify-gaps.md + verify-matrix.json + verify-actions.md  
**Total Items:** 42  
**Priority Distribution:** CRITICAL (8), HIGH (13), MEDIUM (19), LOW (2)

---

## Summary by Feature

| Feature | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---------|----------|------|--------|-----|-------|
| Authentication | 3 | 2 | 0 | 0 | 5 |
| Bookings | 2 | 1 | 1 | 0 | 4 |
| Staff | 1 | 1 | 2 | 1 | 5 |
| Uploads | 1 | 0 | 1 | 0 | 2 |
| Appointments | 0 | 2 | 1 | 0 | 3 |
| Customers | 0 | 2 | 1 | 0 | 3 |
| Dashboard | 0 | 2 | 1 | 0 | 3 |
| Payments | 0 | 2 | 1 | 0 | 3 |
| Blog | 0 | 0 | 3 | 1 | 4 |
| Reviews | 0 | 0 | 2 | 0 | 2 |
| Branches | 0 | 0 | 2 | 0 | 2 |
| Services | 0 | 0 | 1 | 0 | 1 |
| Contact | 0 | 0 | 1 | 0 | 1 |
| All Features | 1 | 1 | 2 | 0 | 4 |
| **TOTAL** | **8** | **13** | **19** | **2** | **42** |

---

## Summary by Action Type

| Action | Count | Breaking Changes |
|--------|-------|------------------|
| ADD | 20 | 0 |
| UPDATE | 20 | 3 |
| CLARIFY | 1 | 0 |
| DEPRECATE | 0 | 0 |
| REMOVE | 0 | 0 |
| **TOTAL** | **42** | **3** |

**Breaking Changes:**
1. #7: Google OAuth - server-side verification (CRITICAL)
2. #8: Admin domain whitelist enforcement (CRITICAL)
3. #19: User.id should be string UUID (HIGH)
4. #38: membershipTier enum lowercase (MEDIUM)

---

## CRITICAL Priority (8 items)

### Week 1 Implementation

| ID | Feature | Action | API | Path | Effort |
|----|---------|--------|-----|------|--------|
| 1 | Bookings | ADD | Check availability | `GET /api/v1/bookings/availability` | 3-5 days |
| 2 | Authentication | ADD | Get profile | `GET /api/v1/profile` | 1 day |
| 3 | Authentication | ADD | Update profile | `PATCH /api/v1/profile` | 1 day |
| 4 | Bookings | ADD | Client booking history | `GET /api/v1/profile/bookings` | 1 day |
| 5 | Staff | ADD | Get available staff | `GET /api/v1/staff/available` | 2-3 days |
| 6 | Uploads | UPDATE | Upload with folder routing | `POST /api/v1/admin/uploads/:folder` | 1 day |
| 7 | Authentication | UPDATE | Google OAuth server-side | `POST /api/v1/auth/google` | 2-3 days |
| 8 | Authentication | UPDATE | Admin whitelist enforcement | `POST /api/v1/admin/auth/google` | 0.5 day |

**Total Effort:** 12-18.5 days  
**Blocking:** All booking flow functionality, profile management, secure auth

---

## HIGH Priority (13 items)

### Week 2 Implementation

| ID | Feature | Action | API | Path | Effort |
|----|---------|--------|-----|------|--------|
| 9 | Bookings | ADD | Validate promo code | `POST /api/v1/bookings/validate-promo` | 1-2 days |
| 10 | Appointments | ADD | Bulk delete | `POST /api/v1/admin/appointments/bulk-delete` | 0.5 day |
| 11 | Appointments | ADD | Bulk update status | `POST /api/v1/admin/appointments/bulk-update` | 0.5 day |
| 12 | Customers | ADD | Bulk delete | `POST /api/v1/admin/customers/bulk-delete` | 0.5 day |
| 13 | Staff | ADD | Get schedule | `GET /api/v1/admin/staff/:id/schedule` | 2-3 days |
| 14 | Customers | ADD | Get analytics | `GET /api/v1/admin/customers/:id/analytics` | 2 days |
| 15 | Dashboard | UPDATE | Add change percentages | `GET /api/v1/admin/dashboard/metrics` | 1 day |
| 16 | Dashboard | ADD | Revenue chart data | `GET /api/v1/admin/dashboard/revenue-chart` | 1-2 days |
| 17 | Payments | ADD | Revenue trend | `GET /api/v1/admin/payments/revenue-trend` | 1-2 days |
| 18 | Payments | ADD | Export report | `GET /api/v1/admin/payments/export` | 2 days |
| 19 | Authentication | UPDATE | User.id should be string | `ALL /api/v1/auth/*` | 1 day |
| 20 | All Features | UPDATE | Add auth scope to all | `ALL` | 1 hour |
| 21 | Staff | CLARIFY | Endpoint ambiguity | `GET /api/v1/staff` | 1 day |

**Total Effort:** 13.5-18 days  
**Impact:** Admin workflows complete, analytics functional

---

## MEDIUM Priority (19 items)

### Week 3-4 Implementation

| ID | Feature | Action | API | Path | Effort |
|----|---------|--------|-----|------|--------|
| 22 | Bookings | UPDATE | Date/time format clarify | `POST /api/v1/bookings` | 0.5 day |
| 23 | All Features | UPDATE | Add search param ?q= | `GET /api/v1/admin/{resource}` | 1 day |
| 24 | All Features | UPDATE | Add meta.totalPages | `ALL list endpoints` | 1 day |
| 25 | Blog | ADD | Get by slug | `GET /api/v1/blog/:slug` | 0.5 day |
| 26 | Contact | ADD | Submit form | `POST /api/v1/contact` | 1 day |
| 27 | Dashboard | ADD | Service distribution | `GET /api/v1/admin/dashboard/service-distribution` | 1 day |
| 28 | Reviews | ADD | Metrics | `GET /api/v1/admin/reviews/metrics` | 1 day |
| 29 | Branches | ADD | Find nearby | `GET /api/v1/branches/nearby` | 2-3 days |
| 30 | Branches | UPDATE | Location object structure | `GET /api/v1/branches` | 0.5 day |
| 31 | Staff | UPDATE | Specialties array | `GET /api/v1/admin/staff` | 0.5 day |
| 32 | Blog | UPDATE | Add tags field | `GET /api/v1/blog/posts` | 0.5 day |
| 33 | Payments | UPDATE | Method enum | `GET /api/v1/admin/payments` | 0.5 day |
| 34 | Reviews | UPDATE | Add reply fields | `GET /api/v1/admin/reviews` | 0.5 day |
| 35 | Uploads | UPDATE | Absolute URL | `POST /api/v1/admin/uploads/:folder` | 0.5 day |
| 36 | Services | UPDATE | Category filter clarify | `GET /api/v1/services` | 0.5 day |
| 37 | Blog | UPDATE | Search/filter params | `GET /api/v1/blog` | 1 day |
| 38 | Customers | UPDATE | membershipTier lowercase | `GET /api/v1/admin/customers` | 0.5 day |
| 39 | Appointments | UPDATE | Status lowercase | `GET /api/v1/admin/appointments` | 0.5 day |
| 40 | All Features | UPDATE | Generic export pattern | `GET /api/v1/admin/{resource}/export` | 0.5 day/resource |

**Total Effort:** 14-17 days  
**Impact:** Polish, consistency, minor features

---

## LOW Priority (2 items)

### Future / Nice-to-Have

| ID | Feature | Action | API | Path | Effort |
|----|---------|--------|-----|------|--------|
| 41 | Blog | ADD | AI content generator | `POST /api/v1/admin/blog/ai-generate` | 3-5 days |
| 42 | Staff | ADD | AI bio generator | `POST /api/v1/admin/staff/ai-generate-bio` | 2-3 days |

**Total Effort:** 5-8 days  
**Impact:** AI features, optional

---

## Breaking Changes Detail

### #7: Google OAuth - Server-Side Verification (CRITICAL)

**Current:** FE parses Google JWT client-side (INSECURE)  
**Required:** BE verifies credential with Google, returns session token  
**Impact:** Security critical, must implement immediately  
**Migration:** FE sends credential → BE validates → returns user + token  

### #8: Admin Domain Whitelist (CRITICAL)

**Current:** FE checks email domain client-side (bypassable)  
**Required:** BE enforces domain whitelist server-side  
**Impact:** Security critical for admin access  
**Migration:** Move whitelist check to backend  

### #19: User IDs UUID String (HIGH)

**Current:** Spec shows `user.id: number`  
**Required:** `user.id: string` (Supabase UUID)  
**Impact:** Auth responses only, entity IDs remain number  
**Migration:** Update all auth endpoint responses  

### #38: membershipTier Lowercase (MEDIUM)

**Current:** `"New"|"Silver"|"Gold"|"VIP"`  
**Required:** `"new"|"silver"|"gold"|"vip"`  
**Impact:** Display mapping needed on FE  
**Migration:** FE maps lowercase to capitalized for display  

---

## Implementation Checklist

### Backend Team

**Week 1: CRITICAL (8 items)**
- [ ] #1: Availability check (scheduling logic)
- [ ] #2-3: Profile GET/PATCH
- [ ] #4: Client booking history
- [ ] #5: Staff filtering (public endpoint)
- [ ] #6: Upload folder routing
- [ ] #7-8: Security fixes (Google OAuth, admin whitelist)

**Week 2: HIGH (13 items)**
- [ ] #9: Promo code validation
- [ ] #10-12: Bulk operations (delete, update)
- [ ] #13-14: Staff schedule + customer analytics
- [ ] #15-18: Dashboard/payment charts
- [ ] #19: Fix user.id type
- [ ] #20-21: Auth scope + staff endpoint clarification

**Week 3-4: MEDIUM (19 items)**
- [ ] #22-24: Query params, pagination, date formats
- [ ] #25-29: Missing endpoints (blog slug, contact, nearby)
- [ ] #30-39: Field updates (arrays, enums, types)
- [ ] #40: Generic export pattern

**Future: LOW (2 items)**
- [ ] #41-42: AI features

### Frontend Team

**Week 1**
- [ ] Update auth flow for server-side OAuth
- [ ] Prepare for user.id string type

**Week 2**
- [ ] Add pagination UI components
- [ ] Implement bulk action checkboxes

**Week 3**
- [ ] Add export buttons
- [ ] Replace mock data with real API calls

**Week 4**
- [ ] Integration testing
- [ ] Field mapping for lowercase enums

---

## Query & Response Patterns

### Pagination (Standard)
```
GET /api/v1/admin/{resource}?page=1&limit=20
Response: {
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 156, "totalPages": 8 }
}
```

### Search (Standard)
```
GET /api/v1/admin/{resource}?q=sarah
```

### Filtering (Standard)
```
GET /api/v1/admin/{resource}?status=active&category=Facial
```

### Sorting (Standard)
```
GET /api/v1/admin/{resource}?sort=createdAt&order=desc
```

### Date Formats
- **Date only:** `"2025-10-29"` (YYYY-MM-DD)
- **Time only:** `"14:30"` (HH:mm, 24-hour)
- **Timestamp:** `"2025-10-29T14:30:00Z"` (ISO 8601)

### Auth Scopes
- **public:** No authentication required
- **client:** Authenticated client user
- **admin:** Authenticated admin user

---

## Notes

1. **Do not exceed 200 items:** Consolidated small changes to same endpoint
2. **No invented logic:** Ambiguous items have TODO notes
3. **Field naming:** Follows FE types (1-1 mapping with camelCase)
4. **Evidence-based:** Every item has file:line FE evidence
5. **Effort estimates:** Based on complexity (simple CRUD vs complex logic)
6. **Breaking changes:** Explicitly marked with migration notes

---

## Next Steps

1. **Backend:** Review worklist, estimate capacity
2. **Frontend:** Prepare for breaking changes (#7, #8, #19, #38)
3. **Both:** Align on Week 1 CRITICAL items implementation
4. **PM:** Use this for sprint planning

**JSON Version:** `spec-worklist.json` (machine-readable)  
**Priority Matrix:** `verify-actions.md` (week-by-week plan)  
**Gap Analysis:** `verify-gaps.md` (detailed evidence)  
**Status Matrix:** `verify-matrix.json` (coverage metrics)
