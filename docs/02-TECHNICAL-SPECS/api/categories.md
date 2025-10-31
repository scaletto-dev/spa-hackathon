# Service Categories API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**Version:** 1.0

**Last Updated:** October 29, 2025

---

## Overview

The Categories API provides endpoints for managing and retrieving service categories. Categories are used to organize services into logical groups (e.g., "Facial Care", "Body Treatments", "Aesthetic Procedures").

---

## Endpoints

### 1. Get All Categories

Retrieve a list of all service categories.

**Endpoint:** `GET /api/v1/categories`

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeServices` | boolean | No | `false` | If `true`, includes all services in each category |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Facial Care",
      "slug": "facial-care",
      "description": "Professional facial treatments for all skin types",
      "serviceCount": 5,
      "displayOrder": 1,
      "icon": "spa",
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Body Treatments",
      "slug": "body-treatments",
      "description": "Relaxing and rejuvenating body care services",
      "serviceCount": 3,
      "displayOrder": 2,
      "icon": "wellness",
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
      "name": "Facial Care",
      "slug": "facial-care",
      "description": "Professional facial treatments for all skin types",
      "serviceCount": 2,
      "displayOrder": 1,
      "icon": "spa",
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z",
      "services": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "name": "Hydrating Facial",
          "slug": "hydrating-facial",
          "description": "Deep hydration treatment for dry and dehydrated skin",
          "excerpt": "Restore moisture and radiance",
          "duration": 60,
          "price": "1200000",
          "categoryId": "550e8400-e29b-41d4-a716-446655440000",
          "images": ["https://example.com/image1.jpg"],
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
# Get all categories
curl -X GET http://localhost:3000/api/v1/categories

# Get all categories with services
curl -X GET "http://localhost:3000/api/v1/categories?includeServices=true"
```

---

### 2. Get Category by ID

Retrieve a single category by its unique identifier.

**Endpoint:** `GET /api/v1/categories/:id`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Category unique identifier |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeServices` | boolean | No | `false` | If `true`, includes all services in the category |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Facial Care",
    "slug": "facial-care",
    "description": "Professional facial treatments for all skin types",
    "serviceCount": 5,
    "displayOrder": 1,
    "icon": "spa",
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
  "message": "Category with ID '550e8400-e29b-41d4-a716-446655440000' not found",
  "statusCode": 404,
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

**Example Request:**

```bash
# Get category by ID
curl -X GET http://localhost:3000/api/v1/categories/550e8400-e29b-41d4-a716-446655440000

# Get category with services
curl -X GET "http://localhost:3000/api/v1/categories/550e8400-e29b-41d4-a716-446655440000?includeServices=true"
```

---

### 3. Get Services by Category

Retrieve all services within a specific category with pagination support.

**Endpoint:** `GET /api/v1/categories/:id/services`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Category unique identifier |

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
      "images": ["https://example.com/image1.jpg"],
      "featured": true,
      "active": true,
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "name": "Anti-Aging Treatment",
      "slug": "anti-aging-treatment",
      "description": "Advanced anti-aging facial with collagen boost",
      "excerpt": "Reduce fine lines and wrinkles",
      "duration": 90,
      "price": "1800000",
      "categoryId": "550e8400-e29b-41d4-a716-446655440000",
      "images": ["https://example.com/image2.jpg"],
      "featured": false,
      "active": true,
      "createdAt": "2025-10-29T10:30:00.000Z",
      "updatedAt": "2025-10-29T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
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
  "message": "Category with ID '550e8400-e29b-41d4-a716-446655440000' not found",
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
curl -X GET http://localhost:3000/api/v1/categories/550e8400-e29b-41d4-a716-446655440000/services

# Get second page with 10 items per page
curl -X GET "http://localhost:3000/api/v1/categories/550e8400-e29b-41d4-a716-446655440000/services?page=2&limit=10"
```

---

## Data Models

### Category Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique category identifier |
| `name` | string | Category name |
| `slug` | string | URL-friendly category identifier |
| `description` | string \| null | Category description |
| `serviceCount` | number | Number of active services in this category |
| `displayOrder` | number | Order for displaying categories |
| `icon` | string \| null | Icon identifier for the category |
| `createdAt` | ISO 8601 | Timestamp when category was created |
| `updatedAt` | ISO 8601 | Timestamp when category was last updated |
| `services` | Service[] | Array of services (only when `includeServices=true`) |

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
| `categoryId` | UUID | Category identifier this service belongs to |
| `images` | string[] | Array of image URLs |
| `featured` | boolean | Whether service is featured on homepage |
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
| `404` | Not Found - Category not found |
| `500` | Internal Server Error - Server error |

---

## Error Handling

### Common Error Types

- **ValidationError** (400): Invalid query parameters or request data
- **NotFoundError** (404): Category not found
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
- Categories are ordered alphabetically by name
- Only active services are returned in responses
- Service prices are returned as strings to preserve precision
- The `serviceCount` field only counts active services
- Pagination is 1-indexed (first page is `page=1`)
- Maximum limit per page is 100 items

---

## Testing

### Postman Collection

Import the Postman collection from `docs/api/postman/categories-collection.json` to test these endpoints.

### Example cURL Commands

```bash
# List all categories
curl -X GET http://localhost:3000/api/v1/categories

# List categories with services
curl -X GET "http://localhost:3000/api/v1/categories?includeServices=true"

# Get specific category
curl -X GET http://localhost:3000/api/v1/categories/{categoryId}

# Get category services with pagination
curl -X GET "http://localhost:3000/api/v1/categories/{categoryId}/services?page=1&limit=10"
```

---

**API Version:** v1  
**Documentation Version:** 1.0  
**Last Updated:** October 29, 2025
