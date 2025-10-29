# Bookings API Documentation

Complete API reference for booking management endpoints in the Beauty Clinic SPA application.

## Table of Contents

-  [Overview](#overview)
-  [Guest Booking APIs](#guest-booking-apis)
   -  [Create Booking](#create-booking)
   -  [Get Booking by Reference](#get-booking-by-reference)
   -  [Cancel Booking](#cancel-booking)
-  [Admin Booking APIs](#admin-booking-apis)
   -  [List All Bookings](#list-all-bookings)
   -  [Update Booking Status](#update-booking-status)
-  [Data Models](#data-models)
-  [Error Responses](#error-responses)
-  [Rate Limiting](#rate-limiting)
-  [Authentication](#authentication)

---

## Overview

The Bookings API provides endpoints for managing beauty service appointments. It includes both guest-facing endpoints for creating and managing bookings, and admin endpoints for booking administration.

**Base URL**: `/api/v1`

**Content-Type**: `application/json`

---

## Guest Booking APIs

### Create Booking

Create a new service booking appointment.

**Endpoint**: `POST /bookings`

**Rate Limit**: 10 requests per hour per IP

**Request Body**:

```json
{
   "serviceId": "uuid",
   "branchId": "uuid",
   "appointmentDate": "2024-12-15",
   "appointmentTime": "14:30",
   "guestName": "Nguyễn Văn A",
   "guestEmail": "nguyen.van.a@example.com",
   "guestPhone": "+84901234567",
   "notes": "Tôi muốn dịch vụ massage thư giãn",
   "language": "vi"
}
```

**Field Validations**:

| Field           | Type   | Required | Validation                                |
| --------------- | ------ | -------- | ----------------------------------------- |
| serviceId       | string | Yes      | Valid UUID, must be an active service     |
| branchId        | string | Yes      | Valid UUID, must be an active branch      |
| appointmentDate | string | Yes      | YYYY-MM-DD format, must be future date    |
| appointmentTime | string | Yes      | HH:MM format (00:00-23:59)                |
| guestName       | string | Yes      | Min 1 character                           |
| guestEmail      | string | Yes      | Valid email format                        |
| guestPhone      | string | Yes      | 10+ digits, supports international format |
| notes           | string | No       | Max 500 characters                        |
| language        | string | No       | One of: `vi`, `en`, `ja` (default: `vi`)  |

**Success Response** (201 Created):

```json
{
   "success": true,
   "data": {
      "id": "uuid",
      "referenceNumber": "BC-20241215-1234",
      "serviceId": "uuid",
      "branchId": "uuid",
      "appointmentDate": "2024-12-15T00:00:00.000Z",
      "appointmentTime": "14:30",
      "status": "CONFIRMED",
      "guestName": "Nguyễn Văn A",
      "guestEmail": "nguyen.van.a@example.com",
      "guestPhone": "+84901234567",
      "notes": "Tôi muốn dịch vụ massage thư giãn",
      "language": "vi",
      "createdAt": "2024-12-10T10:30:00.000Z",
      "updatedAt": "2024-12-10T10:30:00.000Z",
      "service": {
         "id": "uuid",
         "name": "Massage Thư Giãn",
         "duration": 60,
         "price": "500000"
      },
      "branch": {
         "id": "uuid",
         "name": "Chi nhánh Quận 1",
         "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
         "phone": "+842812345678"
      }
   },
   "message": "Booking created successfully. Check your email for confirmation."
}
```

**Error Responses**:

-  `400 Bad Request`: Validation errors
-  `404 Not Found`: Service or branch not found
-  `409 Conflict`: Time slot no longer available
-  `429 Too Many Requests`: Rate limit exceeded
-  `500 Internal Server Error`: Server error

**Business Rules**:

1. Appointment must be in the future
2. Time slot availability is checked atomically using database transactions
3. Duplicate bookings at the same time for the same branch are prevented
4. Reference number format: `BC-YYYYMMDD-XXXX` (unique)
5. Confirmation email is sent upon successful booking

**Example cURL**:

```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "uuid-here",
    "branchId": "uuid-here",
    "appointmentDate": "2024-12-15",
    "appointmentTime": "14:30",
    "guestName": "Nguyễn Văn A",
    "guestEmail": "nguyen.van.a@example.com",
    "guestPhone": "+84901234567",
    "notes": "Tôi muốn dịch vụ massage thư giãn"
  }'
```

---

### Get Booking by Reference

Retrieve booking details using reference number.

**Endpoint**: `GET /bookings/:referenceNumber`

**URL Parameters**:

-  `referenceNumber` (string, required): Booking reference number (format: BC-YYYYMMDD-XXXX)

**Query Parameters**:

-  `email` (string, optional): Guest email for verification

**Success Response** (200 OK):

```json
{
   "success": true,
   "data": {
      "id": "uuid",
      "referenceNumber": "BC-20241215-1234",
      "serviceId": "uuid",
      "branchId": "uuid",
      "appointmentDate": "2024-12-15T00:00:00.000Z",
      "appointmentTime": "14:30",
      "status": "CONFIRMED",
      "guestName": "Nguyễn Văn A",
      "guestEmail": "nguyen.van.a@example.com",
      "guestPhone": "+84901234567",
      "notes": "Tôi muốn dịch vụ massage thư giãn",
      "language": "vi",
      "createdAt": "2024-12-10T10:30:00.000Z",
      "updatedAt": "2024-12-10T10:30:00.000Z",
      "service": {
         "id": "uuid",
         "name": "Massage Thư Giãn",
         "duration": 60,
         "price": "500000"
      },
      "branch": {
         "id": "uuid",
         "name": "Chi nhánh Quận 1",
         "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
         "phone": "+842812345678"
      }
   }
}
```

**Error Responses**:

-  `400 Bad Request`: Invalid reference number format
-  `404 Not Found`: Booking not found
-  `400 Bad Request`: Email does not match booking records (when email query param is provided)

**Example cURL**:

```bash
# Without email verification
curl http://localhost:5000/api/v1/bookings/BC-20241215-1234

# With email verification
curl "http://localhost:5000/api/v1/bookings/BC-20241215-1234?email=nguyen.van.a@example.com"
```

---

### Cancel Booking

Cancel an existing booking (requires email verification).

**Endpoint**: `POST /bookings/:referenceNumber/cancel`

**Rate Limit**: 10 requests per hour per IP

**URL Parameters**:

-  `referenceNumber` (string, required): Booking reference number

**Request Body**:

```json
{
   "email": "nguyen.van.a@example.com",
   "reason": "Tôi có việc đột xuất"
}
```

**Field Validations**:

| Field  | Type   | Required | Validation               |
| ------ | ------ | -------- | ------------------------ |
| email  | string | Yes      | Must match booking email |
| reason | string | No       | Max 500 characters       |

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "BC-20241215-1234",
    "status": "CANCELLED",
    ... (full booking details)
  },
  "message": "Booking cancelled successfully. You will receive a confirmation email shortly."
}
```

**Error Responses**:

-  `400 Bad Request`: Validation errors, invalid reference number, email mismatch, cancellation within 24 hours
-  `404 Not Found`: Booking not found
-  `409 Conflict`: Booking already cancelled or completed

**Business Rules**:

1. Email verification is required
2. Cannot cancel within 24 hours of appointment
3. Cannot cancel already cancelled bookings
4. Cannot cancel completed bookings
5. Cancellation confirmation email is sent

**Example cURL**:

```bash
curl -X POST http://localhost:5000/api/v1/bookings/BC-20241215-1234/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nguyen.van.a@example.com",
    "reason": "Tôi có việc đột xuất"
  }'
```

---

## Admin Booking APIs

All admin endpoints require authentication via `X-Admin-Key` header.

### List All Bookings

Retrieve all bookings with filtering and pagination.

**Endpoint**: `GET /admin/bookings`

**Authentication**: Required (X-Admin-Key header)

**Query Parameters**:

| Parameter | Type   | Default         | Description                                                 |
| --------- | ------ | --------------- | ----------------------------------------------------------- |
| page      | number | 1               | Page number (≥ 1)                                           |
| limit     | number | 50              | Items per page (1-100)                                      |
| branchId  | string | -               | Filter by branch UUID                                       |
| serviceId | string | -               | Filter by service UUID                                      |
| status    | string | -               | Filter by status (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW) |
| date      | string | -               | Filter by specific date (YYYY-MM-DD)                        |
| dateFrom  | string | -               | Filter by date range start (YYYY-MM-DD)                     |
| dateTo    | string | -               | Filter by date range end (YYYY-MM-DD)                       |
| sortBy    | string | appointmentDate | Sort field (appointmentDate, createdAt, updatedAt, status)  |
| sortOrder | string | desc            | Sort order (asc, desc)                                      |

**Success Response** (200 OK):

```json
{
   "success": true,
   "data": [
      {
         "id": "uuid",
         "referenceNumber": "BC-20241215-1234",
         "serviceId": "uuid",
         "branchId": "uuid",
         "appointmentDate": "2024-12-15T00:00:00.000Z",
         "appointmentTime": "14:30",
         "status": "CONFIRMED",
         "guestName": "Nguyễn Văn A",
         "guestEmail": "nguyen.van.a@example.com",
         "guestPhone": "+84901234567",
         "notes": "Tôi muốn dịch vụ massage thư giãn",
         "language": "vi",
         "createdAt": "2024-12-10T10:30:00.000Z",
         "updatedAt": "2024-12-10T10:30:00.000Z",
         "service": {
            "id": "uuid",
            "name": "Massage Thư Giãn",
            "duration": 60,
            "price": "500000"
         },
         "branch": {
            "id": "uuid",
            "name": "Chi nhánh Quận 1",
            "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
            "phone": "+842812345678"
         }
      }
   ],
   "meta": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "totalPages": 3
   }
}
```

**Error Responses**:

-  `400 Bad Request`: Invalid query parameters
-  `401 Unauthorized`: Missing or invalid admin authentication
-  `500 Internal Server Error`: Server error

**Example cURL**:

```bash
# List all bookings (first page)
curl http://localhost:5000/api/v1/admin/bookings \
  -H "X-Admin-Key: your-admin-key"

# Filter by branch and status
curl "http://localhost:5000/api/v1/admin/bookings?branchId=uuid&status=CONFIRMED" \
  -H "X-Admin-Key: your-admin-key"

# Filter by date range
curl "http://localhost:5000/api/v1/admin/bookings?dateFrom=2024-12-01&dateTo=2024-12-31&sortOrder=asc" \
  -H "X-Admin-Key: your-admin-key"

# Pagination
curl "http://localhost:5000/api/v1/admin/bookings?page=2&limit=20" \
  -H "X-Admin-Key: your-admin-key"
```

---

### Update Booking Status

Update the status of an existing booking.

**Endpoint**: `PATCH /admin/bookings/:id/status`

**Authentication**: Required (X-Admin-Key header)

**Rate Limit**: 30 requests per minute

**URL Parameters**:

-  `id` (string, required): Booking UUID

**Request Body**:

```json
{
   "status": "COMPLETED"
}
```

**Valid Status Values**:

-  `CONFIRMED` - Booking is confirmed
-  `CANCELLED` - Booking is cancelled
-  `COMPLETED` - Service has been completed
-  `NO_SHOW` - Guest did not show up

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "BC-20241215-1234",
    "status": "COMPLETED",
    ... (full booking details)
  },
  "message": "Booking status updated to COMPLETED"
}
```

**Error Responses**:

-  `400 Bad Request`: Invalid UUID format, invalid status, invalid state transition
-  `401 Unauthorized`: Missing or invalid admin authentication
-  `404 Not Found`: Booking not found
-  `429 Too Many Requests`: Rate limit exceeded

**Business Rules**:

1. Cannot change status of completed bookings
2. Cannot reactivate cancelled bookings
3. Status must be one of the valid enum values

**Example cURL**:

```bash
curl -X PATCH http://localhost:5000/api/v1/admin/bookings/uuid-here/status \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d '{"status": "COMPLETED"}'
```

---

## Data Models

### Booking Status Enum

```typescript
enum BookingStatus {
   CONFIRMED = "CONFIRMED",
   CANCELLED = "CANCELLED",
   COMPLETED = "COMPLETED",
   NO_SHOW = "NO_SHOW",
}
```

### Booking DTO

```typescript
interface BookingWithDetailsDTO {
   id: string;
   referenceNumber: string;
   serviceId: string;
   branchId: string;
   appointmentDate: string; // ISO 8601
   appointmentTime: string; // HH:MM
   status: BookingStatus;
   guestName: string;
   guestEmail: string;
   guestPhone: string;
   notes: string | null;
   language: string; // 'vi' | 'en' | 'ja'
   createdAt: string; // ISO 8601
   updatedAt: string; // ISO 8601
   service: {
      id: string;
      name: string;
      duration: number; // minutes
      price: string; // decimal as string
   };
   branch: {
      id: string;
      name: string;
      address: string;
      phone: string;
   };
}
```

---

## Error Responses

All error responses follow this format:

```json
{
   "error": "ErrorType",
   "message": "Human-readable error message",
   "statusCode": 400,
   "timestamp": "2024-12-10T10:30:00.000Z"
}
```

### Common Error Types

| Status Code | Error Type           | Description                               |
| ----------- | -------------------- | ----------------------------------------- |
| 400         | ValidationError      | Invalid request data                      |
| 401         | UnauthorizedError    | Missing or invalid authentication         |
| 404         | NotFoundError        | Resource not found                        |
| 409         | ConflictError        | Resource conflict (e.g., time slot taken) |
| 429         | TooManyRequestsError | Rate limit exceeded                       |
| 500         | InternalServerError  | Server error                              |

---

## Rate Limiting

Rate limits are applied per IP address:

| Endpoint Pattern                 | Limit                   |
| -------------------------------- | ----------------------- |
| POST /bookings                   | 10 requests per hour    |
| POST /bookings/:ref/cancel       | 10 requests per hour    |
| PATCH /admin/bookings/:id/status | 30 requests per minute  |
| Other endpoints                  | 100 requests per minute |

Rate limit headers are included in responses:

```
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 1702200000
```

---

## Authentication

### Guest Endpoints

No authentication required. Sensitive operations (like cancellation) require email verification in the request body.

### Admin Endpoints

Require `X-Admin-Key` header:

```
X-Admin-Key: your-admin-secret-key
```

**Note**: Current implementation uses simple API key authentication. In production, this will be replaced with Supabase JWT verification.

**Environment Variable**:

```
ADMIN_API_KEY=your-admin-secret-key
```

---

## Testing

### Postman Collection

Import the provided Postman collection for easy API testing:

**Collection File**: `docs/api/postman/bookings-api.postman_collection.json`

The collection includes:

-  Pre-configured requests for all endpoints
-  Environment variables for base URL and API keys
-  Example requests with valid data
-  Test scripts for response validation

### Example Test Flow

1. **Create Booking**

   -  POST /bookings with valid data
   -  Save `referenceNumber` from response

2. **Get Booking**

   -  GET /bookings/:referenceNumber
   -  Verify booking details

3. **List Bookings (Admin)**

   -  GET /admin/bookings with X-Admin-Key
   -  Verify booking appears in list

4. **Update Status (Admin)**

   -  PATCH /admin/bookings/:id/status
   -  Change status to COMPLETED

5. **Cancel Booking**
   -  POST /bookings/:referenceNumber/cancel
   -  Verify cancellation (should fail if already completed)

---

## Best Practices

1. **Always validate input** on the client side before sending requests
2. **Store reference numbers** for booking lookup
3. **Handle rate limits** gracefully with retry logic
4. **Use appropriate status codes** for error handling
5. **Log all booking operations** for audit trail
6. **Send confirmation emails** for all booking state changes
7. **Implement idempotency** for critical operations
8. **Use database transactions** for atomic operations

---

## Support

For API support or questions, contact:

-  Email: dev@beautyclinic.com
-  Documentation: https://docs.beautyclinic.com/api

---

**Version**: 1.0.0  
**Last Updated**: 2024-12-10  
**Maintainer**: Backend Team
