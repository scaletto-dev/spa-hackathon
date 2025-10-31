# Branches API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**Version:** 1.0

**Last Updated:** October 29, 2025

---

## Overview

The Branches API provides endpoints for managing and retrieving clinic branch/location information. Branches represent physical clinic locations where services are offered.

---

## Endpoints

### 1. Get All Branches

Retrieve a list of all active clinic branches.

**Endpoint:** `GET /api/v1/branches`

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeServices` | boolean | No | `false` | If `true`, includes all available services at each branch |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Downtown Clinic",
      "slug": "downtown-clinic",
      "address": "123 Main Street, District 1, Ho Chi Minh City",
      "phone": "+84 28 1234 5678",
      "email": "downtown@beautyclinic.vn",
      "latitude": "10.7769",
      "longitude": "106.7009",
      "operatingHours": {
        "monday": { "open": "09:00", "close": "18:00" },
        "tuesday": { "open": "09:00", "close": "18:00" },
        "wednesday": { "open": "09:00", "close": "18:00" },
        "thursday": { "open": "09:00", "close": "18:00" },
        "friday": { "open": "09:00", "close": "20:00" },
        "saturday": { "open": "10:00", "close": "20:00" },
        "sunday": { "open": "10:00", "close": "17:00" }
      },
      "images": [
        "https://example.com/branch1-front.jpg",
        "https://example.com/branch1-interior.jpg"
      ],
      "active": true,
      "description": "Our flagship location in the heart of downtown",
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "North Branch",
      "slug": "north-branch",
      "address": "456 North Avenue, Thu Duc City, Ho Chi Minh City",
      "phone": "+84 28 8765 4321",
      "email": "north@beautyclinic.vn",
      "latitude": "10.8231",
      "longitude": "106.6297",
      "operatingHours": {
        "monday": { "open": "08:00", "close": "17:00" },
        "tuesday": { "open": "08:00", "close": "17:00" },
        "wednesday": { "open": "08:00", "close": "17:00" },
        "thursday": { "open": "08:00", "close": "17:00" },
        "friday": { "open": "08:00", "close": "19:00" },
        "saturday": { "open": "09:00", "close": "19:00" },
        "sunday": { "open": "closed", "close": "closed" }
      },
      "images": ["https://example.com/branch2.jpg"],
      "active": true,
      "description": "Convenient location in the northern area",
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Success Response with Services (200 OK):**

When `includeServices=true`:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Downtown Clinic",
      "slug": "downtown-clinic",
      "address": "123 Main Street, District 1, Ho Chi Minh City",
      "phone": "+84 28 1234 5678",
      "email": "downtown@beautyclinic.vn",
      "latitude": "10.7769",
      "longitude": "106.7009",
      "operatingHours": {
        "monday": { "open": "09:00", "close": "18:00" }
      },
      "images": ["https://example.com/branch1.jpg"],
      "active": true,
      "description": "Our flagship location",
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z",
      "services": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "name": "Hydrating Facial",
          "slug": "hydrating-facial",
          "description": "Deep hydration treatment",
          "excerpt": "Restore moisture and radiance",
          "duration": 60,
          "price": "1200000",
          "categoryId": "550e8400-e29b-41d4-a716-446655440000",
          "images": ["https://example.com/service1.jpg"],
          "featured": true,
          "active": true,
          "createdAt": "2025-10-29T10:30:00.000Z",
          "updatedAt": "2025-10-29T10:30:00.000Z"
        }
      ]
    }
  ],
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Example Request:**

```bash
# Get all branches
curl -X GET http://localhost:3000/api/v1/branches

# Get all branches with services
curl -X GET "http://localhost:3000/api/v1/branches?includeServices=true"
```

---

### 2. Get Branch by ID

Retrieve a single branch by its unique identifier.

**Endpoint:** `GET /api/v1/branches/:id`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Branch unique identifier |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeServices` | boolean | No | `false` | If `true`, includes all services available at this branch |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Downtown Clinic",
    "slug": "downtown-clinic",
    "address": "123 Main Street, District 1, Ho Chi Minh City",
    "phone": "+84 28 1234 5678",
    "email": "downtown@beautyclinic.vn",
    "latitude": "10.7769",
    "longitude": "106.7009",
    "operatingHours": {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" },
      "wednesday": { "open": "09:00", "close": "18:00" },
      "thursday": { "open": "09:00", "close": "18:00" },
      "friday": { "open": "09:00", "close": "20:00" },
      "saturday": { "open": "10:00", "close": "20:00" },
      "sunday": { "open": "10:00", "close": "17:00" }
    },
    "images": [
      "https://example.com/branch1-front.jpg",
      "https://example.com/branch1-interior.jpg"
    ],
    "active": true,
    "description": "Our flagship location in the heart of downtown",
    "createdAt": "2025-10-29T10:30:00.000Z",
    "updatedAt": "2025-10-29T10:30:00.000Z"
  },
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Branch with ID '550e8400-e29b-41d4-a716-446655440000' not found",
  "statusCode": 404,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Example Request:**

```bash
# Get branch by ID
curl -X GET http://localhost:3000/api/v1/branches/550e8400-e29b-41d4-a716-446655440000

# Get branch with services
curl -X GET "http://localhost:3000/api/v1/branches/550e8400-e29b-41d4-a716-446655440000?includeServices=true"
```

---

### 3. Get Services by Branch

Retrieve all services available at a specific branch with pagination support.

**Endpoint:** `GET /api/v1/branches/:id/services`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Branch unique identifier |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number (1-indexed) |
| `limit` | number | No | `20` | Number of items per page (max: 100) |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Hydrating Facial",
      "slug": "hydrating-facial",
      "description": "Deep hydration treatment for dry and dehydrated skin",
      "excerpt": "Restore moisture and radiance",
      "duration": 60,
      "price": "1200000",
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "images": ["https://example.com/service1.jpg"],
      "featured": true,
      "active": true,
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "name": "Body Massage",
      "slug": "body-massage",
      "description": "Relaxing full body massage therapy",
      "excerpt": "Relieve stress and tension",
      "duration": 90,
      "price": "1500000",
      "categoryId": "660e8400-e29b-41d4-a716-446655440001",
      "images": ["https://example.com/service2.jpg"],
      "featured": false,
      "active": true,
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Branch with ID '550e8400-e29b-41d4-a716-446655440000' not found",
  "statusCode": 404,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Page must be greater than 0",
  "statusCode": 400,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Example Request:**

```bash
# Get first page of services
curl -X GET http://localhost:3000/api/v1/branches/550e8400-e29b-41d4-a716-446655440000/services

# Get second page with 10 items per page
curl -X GET "http://localhost:3000/api/v1/branches/550e8400-e29b-41d4-a716-446655440000/services?page=2&limit=10"
```

---

## Data Models

### Branch Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique branch identifier |
| `name` | string | Branch name |
| `slug` | string | URL-friendly branch identifier |
| `address` | string | Full street address |
| `phone` | string | Contact phone number |
| `email` | string \| null | Contact email address |
| `latitude` | string | GPS latitude coordinate (Decimal as string) |
| `longitude` | string | GPS longitude coordinate (Decimal as string) |
| `operatingHours` | object | Operating hours by day of week (JSON) |
| `images` | string[] | Array of branch facility image URLs |
| `active` | boolean | Whether branch is currently active |
| `description` | string \| null | Branch description |
| `createdAt` | ISO 8601 | Timestamp when branch was created |
| `updatedAt` | ISO 8601 | Timestamp when branch was last updated |
| `services` | Service[] | Array of services (only when `includeServices=true`) |

### Operating Hours Object

```json
{
  "monday": { "open": "09:00", "close": "18:00" },
  "tuesday": { "open": "09:00", "close": "18:00" },
  "wednesday": { "open": "09:00", "close": "18:00" },
  "thursday": { "open": "09:00", "close": "18:00" },
  "friday": { "open": "09:00", "close": "20:00" },
  "saturday": { "open": "10:00", "close": "20:00" },
  "sunday": { "open": "10:00", "close": "17:00" }
}
```

**Note:** For closed days, use `"closed"` for both open and close values.

### Service Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique service identifier |
| `name` | string | Service name |
| `slug` | string | URL-friendly service identifier |
| `description` | string | Full service description |
| `excerpt` | string | Short description for listings |
| `duration` | number | Service duration in minutes |
| `price` | string | Service price in Vietnamese Dong (VND) |
| `categoryId` | UUID | Category identifier |
| `images` | string[] | Array of image URLs |
| `featured` | boolean | Whether service is featured |
| `active` | boolean | Whether service is currently active |
| `createdAt` | ISO 8601 | Timestamp when service was created |
| `updatedAt` | ISO 8601 | Timestamp when service was last updated |

---

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "data": {}, // or []
  "meta": {}, // Optional, for paginated responses
  "timestamp": "ISO 8601 timestamp"
}
```

### Error Response

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "ISO 8601 timestamp",
  "details": {} // Optional, only in development
}
```

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Request successful |
| `400` | Bad Request - Invalid parameters |
| `404` | Not Found - Branch not found |
| `500` | Internal Server Error - Server error |

---

## Error Handling

### Common Error Types

- **ValidationError** (400): Invalid query parameters or request data
- **NotFoundError** (404): Branch not found or inactive
- **InternalServerError** (500): Unexpected server error

### Example Error Responses

**Invalid Page Number:**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Page must be greater than 0",
  "statusCode": 400,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Invalid Limit:**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Limit must be between 1 and 100",
  "statusCode": 400,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Branches are ordered alphabetically by name
- Only active branches are returned in responses
- Service prices are returned as strings to preserve precision
- Latitude and longitude are returned as strings (Decimal precision)
- Operating hours are stored as JSON objects
- Pagination is 1-indexed (first page is `page=1`)
- Maximum limit per page is 100 items
- The `includeServices` parameter returns all active services (in MVP, all services are available at all branches)

---

## Future Enhancements

The following features are planned for future releases:

1. **Geolocation Filtering** - Filter branches by distance from coordinates
   - Query parameters: `lat`, `lng`, `radius`
   - Example: `GET /api/v1/branches?lat=10.7769&lng=106.7009&radius=5`

2. **Branch-Specific Services** - Many-to-many relationship between branches and services
   - Currently, all services are available at all branches
   - Future: Each branch will have specific services

---

## Testing

### Postman Collection

Import the Postman collection from `docs/api/postman/branches-collection.json` to test these endpoints.

### Example cURL Commands

```bash
# List all branches
curl -X GET http://localhost:3000/api/v1/branches

# List branches with services
curl -X GET "http://localhost:3000/api/v1/branches?includeServices=true"

# Get specific branch
curl -X GET http://localhost:3000/api/v1/branches/{branchId}

# Get branch services with pagination
curl -X GET "http://localhost:3000/api/v1/branches/{branchId}/services?page=1&limit=10"
```

---

**API Version:** v1  
**Documentation Version:** 1.0  
**Last Updated:** October 29, 2025
