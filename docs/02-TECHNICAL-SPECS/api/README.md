# API Specification - Beauty Clinic Care Website

**Version:** 1.0.0  
**Date:** October 29, 2025  
**Status:** In Progress

## ��� File Structure

```
docs/api/
├── README.md                        # This file
├── 00-overview.md                   # API principles, auth, errors, pagination (TO BE CREATED)
├── 10-client-apis.md                # Client-facing endpoints (TO BE CREATED)
├── 20-admin-apis.md                 # Admin portal endpoints (TO BE CREATED)
├── 30-schemas.md                    # JSON schemas & TypeScript types (TO BE CREATED)
├── 40-openapi.yaml                  # OpenAPI 3.1 specification (TO BE CREATED)
├── 50-diff-from-existing-docs.md    # Changes vs existing docs (TO BE CREATED)
└── 99-checklist-fe-mapping.md       # FE-BE integration checklist (TO BE CREATED)
```

## ��� Purpose

Provide complete, accurate API specification that:
1. **Matches FE requirements exactly** - Every field FE uses is documented
2. **Ready for BE implementation** - Clear contracts, examples, error codes
3. **Easy to integrate** - Postman collections, curl examples
4. **Maintainable** - Versioned, changelog, deprecation policy

## ��� API Overview

### Base URL
```
Development: http://localhost:4000/api/v1
Production:  https://api.beautyclinic.com/api/v1
```

### Authentication
- **JWT Bearer Token** for user/admin sessions
- **Google OAuth 2.0** for social login
- **Domain Whitelist** for admin OAuth

### Endpoints Summary

| Category | Count | Scope | Status |
|----------|-------|-------|--------|
| **Auth** | 7 | Public/Client | ✅ Planned |
| **Services** | 3 | Public | ✅ Planned |
| **Branches** | 4 | Public | ✅ Planned |
| **Booking** | 8 | Public/Client | ✅ Planned |
| **Payments** | 6 | Client | ✅ Planned |
| **Blog** | 4 | Public | ✅ Planned |
| **Reviews** | 3 | Public/Client | ✅ Planned |
| **Contact** | 2 | Public | ✅ Planned |
| **Chat** | 3 | Public/Client | ✅ Planned |
| **Admin Dashboard** | 2 | Admin | ✅ Planned |
| **Admin Appointments** | 4 | Admin | ✅ Planned |
| **Admin Services** | 5 | Admin | ✅ Planned |
| **Admin Branches** | 5 | Admin | ✅ Planned |
| **Admin Customers** | 4 | Admin | ✅ Planned |
| **Admin Staff** | 5 | Admin | ✅ Planned |
| **Admin Payments** | 4 | Admin | ✅ Planned |
| **Admin Reviews** | 5 | Admin | ✅ Planned |
| **Admin Blog** | 6 | Admin | ✅ Planned |
| **Admin Settings** | 3 | Admin | ✅ Planned |
| **TOTAL** | **77** | Mixed | **In Progress** |

## �� FE Component Mapping

### Critical Paths
1. **Booking Flow** (6 steps)
   - `BookingServiceSelect` → `GET /services`
   - `BookingBranchSelect` → `GET /branches`
   - `BookingDateTimeSelect` → `GET /booking/slots`
   - `BookingUserInfo` → User form (no API)
   - `BookingPayment` → Payment selection (no API yet)
   - `BookingConfirmation` → `POST /bookings`

2. **Auth Flow**
   - `LoginPage` → `POST /auth/login`
   - `RegisterPage` → `POST /auth/register`
   - Google OAuth → `POST /auth/google`
   - `useAuth` hook → JWT management

3. **Admin CRUD**
   - `Dashboard` → `GET /admin/metrics`
   - `Appointments` → `GET /admin/appointments`, `PATCH /admin/appointments/{id}`
   - Services/Branches/Staff/Customers → Full CRUD
   - Reviews → Moderation endpoints

## ��� Next Steps

1. ✅ Create `docs/api/` folder structure
2. ⏳ Create `00-overview.md` (API principles)
3. ⏳ Create `10-client-apis.md` (all client endpoints)
4. ⏳ Create `20-admin-apis.md` (all admin endpoints)
5. ⏳ Create `30-schemas.md` (shared types)
6. ⏳ Create `40-openapi.yaml` (OpenAPI spec)
7. ⏳ Create `50-diff-from-existing-docs.md` (comparison)
8. ⏳ Create `99-checklist-fe-mapping.md` (integration guide)
9. ⏳ Create Postman collection
10. ⏳ Create `setup.md` (local dev guide)

## ���️ Tools Needed

- **OpenAPI Validator**: `npx @openapitools/openapi-generator-cli validate`
- **Postman**: Import `40-openapi.yaml`
- **curl/HTTPie**: Example requests in each endpoint doc
- **JSON Schema Validator**: Validate request/response schemas

## ��� Team Roles

- **FE Team**: Review endpoints match component needs
- **BE Team**: Implement endpoints following specs
- **QA Team**: Test using Postman collection + checklist
- **DevOps**: Setup rate limiting, CORS, security headers

---

**Status:** ��� **Work in Progress** - Documents being created  
**Last Updated:** October 29, 2025  
**Contact:** API Team
