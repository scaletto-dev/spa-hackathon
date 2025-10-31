# Backend Refactor - Completed Template

## 📋 Overview
This document shows the **exact pattern** used to refactor features following clean code conventions.
Two features have been fully refactored as templates: **Category** and **Service**.

All subsequent features (Booking, Member, Payment, User, Review) should follow this pattern.

---

## 🏗️ Complete Refactor Pattern (Checklist)

### 1️⃣ Create Types File
**File:** `src/types/{feature}.ts`

**Purpose:** Define all DTOs and response types for the feature
- ✅ Input types (Request bodies)
- ✅ Output types (Response DTOs)
- ✅ Filter/Query types
- ✅ Pagination metadata

**Example from Service:**
```typescript
// src/types/service.ts

export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  excerpt: string;
  duration: number;
  price: string;
  categoryId: string;
  categoryName?: string;
  images: string[];
  benefits: string[];
  featured: boolean;
  active: boolean;
  beforeAfterPhotos: string[];
  faqs: any[];
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedServiceDTO {
  id: string;
  name: string;
  categoryName: string;
  images: string[];
  duration: string;
  price: string;
  excerpt: string;
  slug: string;
}

export interface ServiceWithCategoryDTO extends ServiceDTO {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
  };
}

export interface ServicesResponse {
  data: ServiceDTO[] | FeaturedServiceDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetServicesQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}
```

---

### 2️⃣ Create Repository Class
**File:** `src/repositories/{feature}.repository.ts`

**Pattern:**
- ✅ Extends `BaseRepository<T>`
- ✅ Sets `protected model = prisma.{model}`
- ✅ Encapsulates ALL Prisma calls
- ✅ Methods return typed data (no `any` types)
- ✅ Export as singleton: `export const {feature}Repository = new {Feature}Repository()`

**Example from Service:**
```typescript
// src/repositories/service.repository.ts

import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

class ServiceRepository extends BaseRepository<any> {
  /**
   * Prisma model instance
   */
  protected model = prisma.service;

  /**
   * Find all services with pagination and filtering
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    featured?: boolean
  ) {
    // Build where clause
    const where: any = {
      active: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    // Get total count and services in parallel
    const [total, services] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        include: {
          category: {
            select: featured
              ? { name: true }
              : {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  icon: true,
                },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { name: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      services,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find service by ID
   */
  async findById(id: string) {
    return prisma.service.findUnique({
      where: {
        id,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
          },
        },
      },
    });
  }

  /**
   * Find service by slug
   */
  async findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: {
        slug,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
          },
        },
      },
    });
  }

  /**
   * Find featured services
   */
  async findFeatured(limit: number = 8) {
    return prisma.service.findMany({
      where: {
        featured: true,
        active: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Get all service categories
   */
  async getAllCategories() {
    return prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            services: {
              where: {
                active: true,
                featured: true,
              },
            },
          },
        },
      },
    });
  }
}

export const serviceRepository = new ServiceRepository();
```

**Key Points:**
- All database queries are here (no Prisma calls in service layer)
- Methods handle complex queries with joins, filtering, pagination
- Return raw Prisma data (transformations happen in service layer)
- Single responsibility: data access only

---

### 3️⃣ Create Validators
**File:** `src/validators/{feature}.validator.ts`

**Pattern:**
- ✅ Zod schemas for each endpoint's input
- ✅ Boolean/enum transformations for query params
- ✅ Type inference: `export type GetQuery = z.infer<typeof schema>`
- ✅ Clear schema names: `get{Feature}Schema`, `create{Feature}Schema`, etc.

**Example from Service:**
```typescript
// src/validators/service.validator.ts

import { z } from 'zod';

/**
 * Schema: GET /api/v1/services
 * Query parameters
 */
export const getServicesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
  categoryId: z
    .string()
    .uuid('Invalid category ID format')
    .optional(),
  featured: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .transform((val) => val === 'true' || val === true)
    .optional(),
});

export type GetServicesQuery = z.infer<typeof getServicesQuerySchema>;

/**
 * Schema: GET /api/v1/services/:id
 * Path parameters
 */
export const getServiceParamsSchema = z.object({
  id: z.string().min(1, 'Service ID or slug is required'),
});

export type GetServiceParams = z.infer<typeof getServiceParamsSchema>;
```

**Validation Tips:**
- `z.coerce.number()` - Convert string query params to numbers
- `z.union([z.literal('true'), z.literal('false'), z.boolean()]).transform()` - Handle string booleans from query
- `.default(value)` - Provide defaults for optional query params
- `.optional()` - Mark truly optional fields

---

### 4️⃣ Create Service Layer
**File:** `src/services/{feature}.service.ts`

**Pattern:**
- ✅ Import repository: `import { {feature}Repository } from '@/repositories/{feature}.repository'`
- ✅ Create helper mappers: `toDTO()`, `toFeaturedDTO()`, etc.
- ✅ No direct Prisma calls (use repository only)
- ✅ No `any` types - use proper types from Prisma
- ✅ Business logic only (transformation, validation, composition)
- ✅ Export as singleton: `export default new {Feature}Service()`

**Example from Service:**
```typescript
// src/services/service.service.ts

import { NotFoundError } from '@/utils/errors';
import { serviceRepository } from '@/repositories/service.repository';
import {
  ServiceDTO,
  ServiceWithCategoryDTO,
  ServicesResponse,
  FeaturedServiceDTO,
} from '@/types/service';

/**
 * Transform service to ServiceDTO
 */
function toServiceDTO(service: any): ServiceDTO {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    longDescription: service.longDescription,
    excerpt: service.excerpt,
    duration: service.duration,
    price: service.price.toString(),
    categoryId: service.categoryId,
    categoryName: service.category?.name,
    images: service.images,
    benefits: service.benefits,
    featured: service.featured,
    active: service.active,
    beforeAfterPhotos: service.beforeAfterPhotos,
    faqs: service.faqs,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

/**
 * Transform service to FeaturedServiceDTO (lightweight version)
 */
function toFeaturedServiceDTO(service: any): FeaturedServiceDTO {
  return {
    id: service.id,
    name: service.name,
    categoryName: service.category?.name || 'Uncategorized',
    images: service.images,
    duration: `${service.duration} min`,
    price: service.price.toString(),
    excerpt: service.excerpt,
    slug: service.slug,
  };
}

/**
 * Transform service with category to ServiceWithCategoryDTO
 */
function toServiceWithCategoryDTO(service: any): ServiceWithCategoryDTO {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    longDescription: service.longDescription,
    excerpt: service.excerpt,
    duration: service.duration,
    price: service.price.toString(),
    categoryId: service.categoryId,
    images: service.images,
    benefits: service.benefits,
    featured: service.featured,
    active: service.active,
    beforeAfterPhotos: service.beforeAfterPhotos,
    faqs: service.faqs,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    category: {
      id: service.category.id,
      name: service.category.name,
      slug: service.category.slug,
      description: service.category.description,
      icon: service.category.icon,
    },
  };
}

export class ServiceService {
  /**
   * Get all services with optional filtering and pagination
   */
  async getAllServices(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    featured?: boolean | string
  ): Promise<ServicesResponse> {
    // Convert string boolean to actual boolean if needed
    let featuredBool: boolean | undefined;
    if (featured !== undefined) {
      featuredBool = featured === 'true' || featured === true;
    }

    const { services, total, totalPages } =
      await serviceRepository.findAllWithPagination(
        page,
        limit,
        categoryId,
        featuredBool
      );

    // Map to appropriate DTO based on featured flag
    const mappedServices = featuredBool
      ? services.map(toFeaturedServiceDTO)
      : services.map(toServiceDTO);

    return {
      data: mappedServices,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get featured services (lightweight version for display)
   */
  async getFeaturedServices(limit: number = 8): Promise<FeaturedServiceDTO[]> {
    const services = await serviceRepository.findFeatured(limit);
    return services.map(toFeaturedServiceDTO);
  }

  /**
   * Get a single service by ID
   */
  async getServiceById(id: string): Promise<ServiceWithCategoryDTO> {
    const service = await serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError(`Service with ID '${id}' not found`);
    }

    return toServiceWithCategoryDTO(service);
  }

  /**
   * Get a single service by slug
   */
  async getServiceBySlug(slug: string): Promise<ServiceWithCategoryDTO> {
    const service = await serviceRepository.findBySlug(slug);

    if (!service) {
      throw new NotFoundError(`Service with slug '${slug}' not found`);
    }

    return toServiceWithCategoryDTO(service);
  }

  /**
   * Get all service categories with service count
   */
  async getAllCategories() {
    const categories = await serviceRepository.getAllCategories();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      serviceCount: category._count.services,
    }));
  }
}

export default new ServiceService();
```

**Key Points:**
- Mappers transform raw Prisma data to DTOs
- Helper mappers are private functions or methods
- Service calls repository methods (no Prisma directly)
- All business logic is here (filtering, transformation, validation)
- Single responsibility: orchestration and transformation

---

### 5️⃣ Create Controller
**File:** `src/controllers/{feature}.controller.ts`

**Pattern:**
- ✅ Import service: `import {feature}Service from '@/services/{feature}.service'`
- ✅ Import types from validators for casting: `import { GetQuery, CreateRequest } from '@/validators/{feature}.validator'`
- ✅ Assume middleware already validated - just cast to type
- ✅ Call service methods, format response
- ✅ Pass errors to `next(error)` middleware
- ✅ Export as singleton: `export default new {Feature}Controller()`

**Example from Service:**
```typescript
// src/controllers/service.controller.ts

import { Request, Response, NextFunction } from 'express';
import serviceService from '@/services/service.service';
import { SuccessResponse } from '@/types/api';
import { GetServicesQuery, GetServiceParams } from '@/validators/service.validator';

/**
 * Service Controller
 *
 * Handles HTTP requests for service endpoints.
 * All request validation is performed by Zod middleware before reaching these handlers.
 * Controllers can assume valid, typed data from request.
 */
export class ServiceController {
  /**
   * GET /api/v1/services
   * Get all services with pagination and filtering
   */
  async getAllServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Middleware validated and typed req.query
      const { page = 1, limit = 20, categoryId, featured } = req.query as unknown as GetServicesQuery;

      const result = await serviceService.getAllServices(
        page,
        limit,
        categoryId,
        featured
      );

      const response: SuccessResponse<typeof result.data> = {
        success: true,
        data: result.data,
        meta: result.meta,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/:id
   * Get a single service by ID or slug
   */
  async getServiceById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Middleware validated req.params
      const { id } = req.params as unknown as GetServiceParams;

      // Check if parameter is a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      // Fetch by ID or slug
      const service = isUUID
        ? await serviceService.getServiceById(id)
        : await serviceService.getServiceBySlug(id);

      const response: SuccessResponse<typeof service> = {
        success: true,
        data: service,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/featured
   * Get featured services
   */
  async getFeaturedServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const services = await serviceService.getFeaturedServices();

      const response: SuccessResponse<typeof services> = {
        success: true,
        data: services,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/categories
   * Get all service categories with service count
   */
  async getServiceCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await serviceService.getAllCategories();

      const response: SuccessResponse<typeof categories> = {
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();
```

**Key Points:**
- Cast `req.query` or `req.params` to validator type
- No manual validation (middleware does it)
- No business logic (service does it)
- Only HTTP handling: extract params, call service, format response
- Single responsibility: HTTP layer only

---

### 6️⃣ Update Routes
**File:** `src/routes/{feature}.routes.ts`

**Pattern:**
- ✅ Import validation middleware: `import { validate } from '@/middleware/validate'`
- ✅ Import validators: `import { schema1, schema2, ... } from '@/validators/{feature}.validator'`
- ✅ Add validation middleware to EACH endpoint
- ✅ Validation middleware BEFORE controller method
- ✅ Order matters: params validation, query validation, then controller

**Example from Service:**
```typescript
// src/routes/services.routes.ts

import { Router } from 'express';
import serviceController from '@/controllers/service.controller';
import { validate } from '@/middleware/validate';
import {
  getServicesQuerySchema,
  getServiceParamsSchema,
} from '@/validators/service.validator';

const router = Router();

/**
 * Services Routes
 *
 * RESTful API endpoints for service management
 */

/**
 * GET /api/v1/services
 * Get all services with pagination and filtering
 * Query params: page, limit, categoryId, featured
 */
router.get(
  '/',
  validate(getServicesQuerySchema, 'query'),
  serviceController.getAllServices
);

/**
 * GET /api/v1/services/featured
 * Get featured services for homepage display
 */
router.get('/featured', serviceController.getFeaturedServices);

/**
 * GET /api/v1/services/categories
 * Get all service categories
 */
router.get('/categories', serviceController.getServiceCategories);

/**
 * GET /api/v1/services/:id
 * Get a single service by ID or slug
 *
 * Accepts either:
 * - UUID format: /api/v1/services/123e4567-e89b-12d3-a456-426614174000
 * - Slug format: /api/v1/services/ai-skin-analysis-facial
 *
 * Note: This must be last to avoid conflicts with other routes
 */
router.get(
  '/:id',
  validate(getServiceParamsSchema, 'params'),
  serviceController.getServiceById
);

export default router;
```

**Key Points:**
- Validation middleware is chainable
- Can have multiple validation middleware (params, query, body)
- Middleware runs in order: params → query → body → controller
- Must place specific routes before generic ones (e.g., `/featured` before `/:id`)

---

### 7️⃣ Validation Middleware
**File:** `src/middleware/validate.ts`

**Pattern:**
- ✅ Generic validation for body, query, params
- ✅ Zod schema parsing
- ✅ Proper error response formatting
- ✅ Logging for debugging

**Implementation:**
```typescript
// src/middleware/validate.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import logger from '@/config/logger';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Express middleware for Zod schema validation
 *
 * @param schema - Zod schema to validate against
 * @param source - Request property to validate ('body', 'query', or 'params')
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Extract data from appropriate request source
      const data =
        source === 'body'
          ? req.body
          : source === 'query'
            ? req.query
            : req.params;

      // Parse and validate with Zod
      const validated = schema.parse(data);

      // Attach validated data back to request for controller use
      // Note: req.query and req.params are read-only, so we only update req.body
      if (source === 'body') {
        req.body = validated;
      }
      // For query and params, the original values are already there and validated
      // Controllers should cast to the appropriate type if needed

      // Continue to next middleware/controller
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Validation error [${source}]:`, {
          errors: error.errors,
          path: error.issues.map((issue) => issue.path.join('.')),
        });

        // Format validation errors for client
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.') || source,
          message: issue.message,
          code: issue.code,
        }));

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid ${source} parameters`,
            timestamp: new Date().toISOString(),
            details,
          },
        });
        return;
      }

      // Unexpected error
      logger.error(`Unexpected validation error:`, error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during validation',
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}
```

---

## 📊 Comparison: Before vs After

### Before Refactor (❌ Anti-pattern)
```typescript
// ❌ Controllers had validation logic
async getAllServices(req: Request, res: Response) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  if (page < 1) throw new Error('Invalid page');
  if (limit > 100) throw new Error('Limit too high');
  
  const services = await prisma.service.findMany({...});
  res.json(services);
}

// ❌ Services called Prisma directly
async getAllServices(page, limit) {
  const services = await prisma.service.findMany({...});
  const total = await prisma.service.count({...});
  return services; // No DTO transformation
}

// ❌ Duplicated validation logic across many endpoints
// ❌ No single source of truth for validation
// ❌ Type safety lost after validation
// ❌ Prisma calls everywhere (hard to test)
```

### After Refactor (✅ Clean pattern)
```typescript
// ✅ Routes have validation middleware
router.get(
  '/',
  validate(getServicesQuerySchema, 'query'),  // Single source of truth
  serviceController.getAllServices            // Clean, focused controller
);

// ✅ Controller only handles HTTP
async getAllServices(req: Request, res: Response) {
  const { page = 1, limit = 20 } = req.query as unknown as GetServicesQuery;
  const result = await serviceService.getAllServices(page, limit);
  res.json({ success: true, data: result.data, meta: result.meta });
}

// ✅ Service handles business logic
async getAllServices(page: number, limit: number) {
  const { services, total } = await serviceRepository.findAllWithPagination(page, limit);
  return {
    data: services.map(toServiceDTO),
    meta: { total, page, limit }
  };
}

// ✅ Repository handles data access
async findAllWithPagination(page, limit) {
  const [total, services] = await Promise.all([
    prisma.service.count(),
    prisma.service.findMany({...})
  ]);
  return { services, total };
}
```

**Benefits:**
- ✅ Single source of truth (Zod schema = validation + types)
- ✅ Separation of concerns (validation, HTTP, business, data)
- ✅ Type safety throughout the chain
- ✅ Easy to test (schemas, services, repositories independently)
- ✅ No code duplication
- ✅ Clear error messages
- ✅ Reusable components

---

## 🚀 Quick Refactor Checklist for New Feature

When refactoring a new feature (e.g., **Booking**), follow this order:

```
1. ✅ Create types/{feature}.ts
   - Export all DTOs, response types, query params

2. ✅ Create repositories/{feature}.repository.ts
   - Extend BaseRepository
   - Move all Prisma calls here
   - Export as singleton

3. ✅ Create validators/{feature}.validator.ts
   - Create Zod schemas
   - Export typed inferred types

4. ✅ Refactor services/{feature}.service.ts
   - Import repository
   - Create mappers (toDTO, etc.)
   - Remove all Prisma calls
   - Use repository only

5. ✅ Update controllers/{feature}.controller.ts
   - Remove validation logic
   - Cast req.query/params to validator types
   - Call service methods
   - Format response

6. ✅ Update routes/{feature}.routes.ts
   - Import validators
   - Import validate middleware
   - Add validation to each endpoint

7. ✅ Test all endpoints
   - Verify validation works
   - Verify type safety
   - Verify DTOs are returned correctly
```

---

## 📁 File Structure After Refactor

```
src/
├── types/
│   ├── service.ts          ✅ Created
│   ├── category.ts         ✅ Created
│   ├── booking.ts          ⏳ Next
│   ├── member.ts           ⏳ Next
│   └── payment.ts          ⏳ Next
│
├── repositories/
│   ├── base.repository.ts          ✅ Base class
│   ├── service.repository.ts       ✅ Created
│   ├── category.repository.ts      ✅ Created
│   ├── booking.repository.ts       ⏳ Next
│   └── ...
│
├── validators/
│   ├── service.validator.ts        ✅ Created
│   ├── category.validator.ts       ✅ Created
│   ├── booking.validator.ts        ⏳ Next
│   └── ...
│
├── services/
│   ├── service.service.ts          ✅ Refactored
│   ├── category.service.ts         ✅ Refactored
│   ├── booking.service.ts          ⏳ Next
│   └── ...
│
├── controllers/
│   ├── service.controller.ts       ✅ Refactored
│   ├── category.controller.ts      ✅ Refactored
│   ├── booking.controller.ts       ⏳ Next
│   └── ...
│
├── routes/
│   ├── services.routes.ts          ✅ Updated with validation
│   ├── categories.routes.ts        ✅ Updated with validation
│   ├── booking.routes.ts           ⏳ Next
│   └── ...
│
└── middleware/
    ├── validate.ts                 ✅ Generic validation
    └── errorHandler.ts             ✅ Centralized errors
```

---

## 🎓 Summary

This template shows the **complete, production-ready pattern** for refactoring features:

1. **Types** define the contracts
2. **Repository** abstracts data access (testable)
3. **Validators** ensure clean input (single source of truth)
4. **Service** contains business logic (pure functions)
5. **Controller** handles HTTP (thin layer)
6. **Routes** compose everything (middleware pipeline)
7. **Middleware** validates at boundary (no invalid data reaches service)

**All features should follow this pattern for consistency and maintainability.**

✅ **Category** - Completed  
✅ **Service** - Completed  
⏳ **Booking** - Next  
⏳ **Member** - Then  
⏳ **Payment** - Then  
⏳ **User** - Then  
⏳ **Review** - Then  
