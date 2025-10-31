# Backend Refactor Proposal - Clean Code & Coding Convention

## 📊 Current Structure Analysis

```
✅ Strengths:
  - Service → Controller → Routes layering is good
  - Types are separated in /types folder
  - Middleware and config are organized
  - Error handling pattern is consistent
  - JSDoc comments on major functions

❌ Issues Found:
  1. Missing @/ path alias in imports (using relative paths)
  2. TypeScript strict mode enabled but noImplicitAny = false
  3. Some routes exports inconsistent (default vs named exports)
  4. Lib folder has only utilities, no helper/error consolidation
  5. No env validation at startup
  6. Controllers instantiated ad-hoc without factory pattern
  7. Missing request/response validation at boundary
  8. Error responses don't follow consistent schema
  9. No repository pattern - services call Prisma directly
  10. Duplicate logic across similar services (booking, payment, member)
```

---

## 🎯 Proposed Refactoring (Phase by Phase)

### **Phase 1: Configuration & Tooling** (Priority: HIGH)
**Goal:** Enable strict TS, setup path aliases, standardize formatting

#### 1.1 TypeScript Strict Mode
**File:** `apps/backend/tsconfig.json`
- [ ] Change `"noImplicitAny": false` → `true`
- [ ] Add missing options:
  ```json
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
  ```
- **Impact:** Catch ~50+ type safety issues; requires ~2-3 hours fix

#### 1.2 Path Alias Setup
**File:** `apps/backend/tsconfig.json`
- [ ] Add `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }`
- **Files to Update:** All imports in `/src` (170+ files)
  - Before: `import x from '../../../utils/errors'`
  - After: `import x from '@/utils/errors'`
- **Tool:** Use codemod or manual batch find-replace

#### 1.3 ESLint + Prettier Consistency
**Files:** `.eslintrc.json`, `.prettierrc`, `apps/backend/package.json`
- [ ] Add ESLint plugins:
  ```json
  "@typescript-eslint/recommended",
  "eslint-plugin-import",
  "eslint-plugin-promise",
  "eslint-plugin-security"
  ```
- [ ] Configure import ordering rule: `@/` imports first
- [ ] Run `npm run lint -- --fix` to auto-correct

---

### **Phase 2: Layer Consolidation & Patterns** (Priority: HIGH)
**Goal:** Apply repository pattern, consolidate error handling, factory for controllers

#### 2.1 Create Repository Pattern
**New Folder:** `src/repositories/`
- [ ] Extract Prisma calls from services into `*.repository.ts`
  - Example: `booking.repository.ts`
  ```typescript
  class BookingRepository {
    async findById(id: string) { ... }
    async findByUserId(userId: string) { ... }
    async create(data) { ... }
    async update(id, data) { ... }
    async delete(id) { ... }
  }
  ```
- **Affected Modules:** booking, member, payment, user, service, review (6 files)
- **Benefit:** Testability, easier to mock, single data access layer

#### 2.2 Consolidate Error Handling
**File:** `src/lib/error.ts` (expand existing `src/utils/errors.ts`)
- [ ] Centralize all error classes:
  ```typescript
  export class AppError extends Error { ... }
  export class ValidationError extends AppError { ... }
  export class AuthError extends AppError { ... }
  export class NotFoundError extends AppError { ... }
  export class ConflictError extends AppError { ... }
  export class ForbiddenError extends AppError { ... }
  ```
- [ ] Add error mapper to HTTP status codes
- [ ] Update middleware/errorHandler.ts to use it

#### 2.3 Global Exception Filter
**File:** `src/middleware/errorHandler.ts` (refactor existing)
- [ ] Map all error types to consistent response:
  ```typescript
  {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "...",
      timestamp: "ISO-8601",
      requestId: "...",
      details?: [{ field, message }]  // for validation
    }
  }
  ```
- [ ] Log all errors with correlationId
- [ ] No stacktrace in production response

---

### **Phase 3: Request/Response Validation** (Priority: MEDIUM)
**Goal:** Validate at API boundary using Zod with clean middleware

#### 3.1 Install Zod
```bash
npm install zod
# Optional: npm install zod-error for better error formatting
```

#### 3.2 Create Validation Middleware
**File:** `src/middleware/validate.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import logger from '@/config/logger';

/**
 * Generic validation middleware for request body, query, params
 * Usage:
 *   router.post('/', validate(schemaBody), controller.action)
 *   router.get('/', validate(schemaQuery, 'query'), controller.action)
 */
export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const validated = schema.parse(data);
      
      // Attach validated data back to request
      if (source === 'body') req.body = validated;
      if (source === 'query') req.query = validated as any;
      if (source === 'params') req.params = validated as any;
      
      next();
    } catch (error: any) {
      logger.warn(`Validation error [${source}]:`, error.errors);
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          timestamp: new Date().toISOString(),
          details: error.errors?.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })) || [],
        },
      });
    }
  };
}
```

#### 3.3 Create Validation Schemas
**New Folder:** `src/validators/`

**File:** `src/validators/booking.validator.ts`
```typescript
import { z } from 'zod';

// ✅ CREATE BOOKING - Body validation
export const createBookingSchema = z.object({
  serviceIds: z
    .array(z.string().uuid('Invalid service ID format'))
    .min(1, 'At least one service is required'),
  branchId: z.string().uuid('Invalid branch ID format'),
  appointmentDate: z.string().date('Invalid date format (YYYY-MM-DD)'),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm format'),
  notes: z.string().max(500).optional(),
  language: z.enum(['vi', 'en']).default('vi'),
  // Guest fields (conditional - checked at service level)
  guestName: z.string().min(2).optional(),
  guestEmail: z.string().email('Invalid email').optional(),
  guestPhone: z.string().regex(/^\+?[0-9]{8,}$/, 'Invalid phone').optional(),
});

// ✅ GET BOOKINGS - Query validation
export const listBookingsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['all', 'confirmed', 'completed', 'cancelled', 'no_show']).default('all'),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  sortBy: z.enum(['date', 'status', 'created']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type inference for use in controllers
export type CreateBookingRequest = z.infer<typeof createBookingSchema>;
export type ListBookingsQuery = z.infer<typeof listBookingsSchema>;
```

**File:** `src/validators/member.validator.ts`
```typescript
import { z } from 'zod';

// GET MEMBER BOOKINGS - Query validation
export const getMemberBookingsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['all', 'confirmed', 'completed', 'cancelled', 'no_show']).default('all'),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});

// UPDATE MEMBER PROFILE - Body validation
export const updateMemberProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[0-9]{8,}$/).optional(),
  avatar: z.string().url().optional(),
  preferences: z.object({
    language: z.enum(['vi', 'en']).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

export type GetMemberBookingsQuery = z.infer<typeof getMemberBookingsSchema>;
export type UpdateMemberProfileRequest = z.infer<typeof updateMemberProfileSchema>;
```

**File:** `src/validators/user.validator.ts`
```typescript
import { z } from 'zod';

// UPDATE USER - Body validation
export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[0-9]{8,}$/).optional(),
  dateOfBirth: z.string().date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
```

#### 3.4 Apply Validation to Routes

**File:** `src/routes/booking.routes.ts` (Before)
```typescript
router.post('/', optionalAuthenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.listBookings);
```

**File:** `src/routes/booking.routes.ts` (After)
```typescript
import { validate } from '@/middleware/validate';
import { createBookingSchema, listBookingsSchema } from '@/validators/booking.validator';

// POST - Create booking with body validation
router.post(
  '/',
  validate(createBookingSchema, 'body'),
  optionalAuthenticate,
  bookingController.createBooking
);

// GET - List bookings with query validation
router.get(
  '/',
  validate(listBookingsSchema, 'query'),
  authenticate,
  bookingController.listBookings
);
```

**File:** `src/routes/member.routes.ts`
```typescript
import { validate } from '@/middleware/validate';
import {
  getMemberBookingsSchema,
  updateMemberProfileSchema,
} from '@/validators/member.validator';

// GET bookings with validated query params
router.get(
  '/bookings',
  authenticate,
  validate(getMemberBookingsSchema, 'query'),
  memberController.getBookings
);

// PATCH profile with validated body
router.patch(
  '/profile',
  authenticate,
  validate(updateMemberProfileSchema, 'body'),
  memberController.updateProfile
);
```

#### 3.5 Update Controllers to Use Typed Data
**Before:**
```typescript
async createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { serviceIds, branchId, appointmentDate, appointmentTime } = req.body;
    // No type safety, manual validation
    if (!serviceIds || serviceIds.length === 0) throw new Error('...');
```

**After:**
```typescript
async createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    // Request is already validated + typed via middleware
    const booking = await this.bookingService.createBooking({
      ...req.body,
      userId: req.user?.id,
    });
    
    res.json({
      success: true,
      data: booking,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
```

#### 3.6 Validation Benefits
```
✅ Single source of truth (schema = validation + types)
✅ Type inference: req.body has correct types automatically
✅ Clear error messages in one format
✅ Reusable across routes
✅ Easy to test: pass objects to schema.parse()
✅ Composable: combine schemas with .merge(), .extend()
```

#### 3.7 Example: Compose Schemas
```typescript
// Create base schema, extend for different contexts
const baseBookingSchema = z.object({
  serviceIds: z.array(z.string().uuid()),
  branchId: z.string().uuid(),
  appointmentDate: z.string().date(),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const createGuestBookingSchema = baseBookingSchema.extend({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().regex(/^\+?[0-9]{8,}$/),
});

export const createMemberBookingSchema = baseBookingSchema;
```

---

### **Phase 3.5: Repository Pattern** (Priority: MEDIUM-HIGH)
**Goal:** Create data access layer, separate Prisma calls from business logic

#### 3.5.1 Create Base Repository
**File:** `src/repositories/base.repository.ts`
```typescript
/**
 * Base Repository
 * Provides common CRUD operations for all repositories
 */
export abstract class BaseRepository<T> {
  protected abstract model: any;

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(where?: any): Promise<T[]> {
    return this.model.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }
}
```

#### 3.5.2 Create Category Repository
**File:** `src/repositories/category.repository.ts`
```typescript
import prisma from '@/config/database';
import { BaseRepository } from './base.repository';

export class CategoryRepository extends BaseRepository<any> {
  protected model = prisma.serviceCategory;

  /**
   * Find category by slug
   */
  async findBySlug(slug: string) {
    return this.model.findUnique({ where: { slug } });
  }

  /**
   * Find category with services
   */
  async findByIdWithServices(id: string, onlyActive = true) {
    return this.model.findUnique({
      where: { id },
      include: {
        services: onlyActive ? { where: { active: true } } : true,
      },
    });
  }

  /**
   * Get all categories with service count
   */
  async findAllWithCount() {
    return this.model.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            services: { where: { active: true } },
          },
        },
      },
    });
  }

  /**
   * Get services in category with pagination
   */
  async getServicesInCategory(categoryId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: { categoryId, active: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.service.count({
        where: { categoryId, active: true },
      }),
    ]);

    return {
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository();
```

#### 3.5.3 Refactor Category Service to Use Repository
**File:** `src/services/category.service.ts` (before)
```typescript
async getAllCategories(includeServices: boolean) {
  const categories = await prisma.serviceCategory.findMany({...});
  return categories.map(cat => ({...}));
}
```

**File:** `src/services/category.service.ts` (after)
```typescript
import { categoryRepository } from '@/repositories/category.repository';

class CategoryService {
  async getAllCategories(includeServices: boolean) {
    const categories = await categoryRepository.findAllWithCount();
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      serviceCount: cat._count.services,
      // ...
    }));
  }
}
```

#### 3.5.4 Benefits of Repository Pattern
```
✅ Single Responsibility: Data access logic in one place
✅ Testability: Easy to mock repository for unit tests
✅ Maintainability: Changes to Prisma queries in one location
✅ Reusability: Repository methods used across services
✅ Type Safety: Repository methods have typed returns
✅ DRY: Base repository eliminates duplicate CRUD code
```

#### 3.5.5 Testing Repository
```typescript
// Example unit test
describe('CategoryRepository', () => {
  it('should find category by ID with services', async () => {
    const result = await categoryRepository.findByIdWithServices('123');
    expect(result).toHaveProperty('id');
    expect(result.services).toBeInstanceOf(Array);
  });
});
```

---

### **Phase 4: Service Layer Refactor** (Priority: MEDIUM)
**Goal:** Remove Prisma calls, use repositories; reduce duplication

#### 4.1 Update Service Classes
**Files to Refactor:** `booking.service.ts`, `member.service.ts`, `payment.service.ts`, `user.service.ts`

**Pattern:** Inject repository into service
```typescript
class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private emailService: EmailService,
    private logger: Logger,
  ) {}

  async createBooking(dto: CreateBookingRequest) {
    // Validate, transform, call repository
    const booking = await this.bookingRepo.create(data);
    await this.emailService.send(...);
    return booking;
  }
}
```

#### 4.2 Extract Common Logic
**New File:** `src/services/base.service.ts`
- [ ] Create abstract `BaseService` with common methods:
  - Pagination helper
  - Error logging
  - Response transformation
- [ ] All services extend `BaseService`

#### 4.3 Consolidate Booking-related Logic
**Issue:** `booking.service.ts` (579 lines), `member.service.ts` (332 lines), `payment.service.ts` duplicating logic
- [ ] Extract payment calculation → `payment.service.ts` only
- [ ] Extract booking validation → shared `booking.validator.ts`
- [ ] Extract appointment datetime helper → `src/lib/date-utils.ts`

---

### **Phase 5: Routes & Controllers** (Priority: LOW)
**Goal:** Standardize route exports, controller instantiation

#### 5.1 Consistent Route Exports
**Current Issue:** Mix of `export default router` and `export { router }`
- [ ] Standardize all routes: `export default router;`
- [ ] Update `src/routes/index.ts` to use `import X from './x'`

#### 5.2 Controller Factory
**New File:** `src/factories/controller.factory.ts`
```typescript
class ControllerFactory {
  static createBookingController() {
    const repo = new BookingRepository();
    const service = new BookingService(repo, ...);
    return new BookingController(service);
  }
}
```
- Use in routes: `const bookingController = ControllerFactory.createBookingController();`
- **Benefit:** Easy to inject dependencies, mock in tests

---

### **Phase 6: Environment & Startup** (Priority: MEDIUM)
**Goal:** Validate env vars at startup, centralize config

#### 6.1 Env Validation
**New File:** `src/config/env.ts`
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  JWT_SECRET: z.string(),
  // ... all required vars
});

export const config = envSchema.parse(process.env);
```
- [ ] Call `config` initialization in `src/server.ts` before app startup
- **Benefit:** Fail fast if env missing; type-safe config access

#### 6.2 Centralize Startup Config
**File:** `src/config/app.ts`
```typescript
export const appConfig = {
  cors: corsOptions,
  rateLimit: rateLimitConfig,
  upload: uploadConfig,
};
```

---

### **Phase 7: Testing & Documentation** (Priority: MEDIUM)
**Goal:** Add test scaffold, generate API docs

#### 7.1 Test Scaffold
**New Folder:** `src/__tests__/`
```
unit/
  services/
    booking.service.test.ts
    member.service.test.ts
  utils/
    referenceNumberGenerator.test.ts
integration/
  routes/
    booking.routes.test.ts
```
- [ ] Add `jest.config.js` configuration for TS support
- [ ] Write example test for `BookingService.createBooking()`

#### 7.2 API Documentation
**File:** `docs/api/ENDPOINTS.md` (auto or manual)
- [ ] Document all routes with:
  - Method, path
  - Auth required (yes/no/role)
  - Request/response examples
  - Error codes

---

## 📋 Implementation Order

| Phase | Task | Duration | Files | Priority |
|-------|------|----------|-------|----------|
| 1 | Fix tsconfig strict + path alias | 3h | 1 + 170 | 🔴 HIGH |
| 1 | ESLint + Prettier setup | 1h | 2 | 🔴 HIGH |
| 2 | Repository pattern | 3h | 6 new + 6 refactor | 🔴 HIGH |
| 2 | Error handling consolidation | 2h | 1 new + 1 refactor | 🔴 HIGH |
| 3 | Validation schemas | 2h | 5 new | 🟡 MEDIUM |
| 4 | Service refactor + injection | 4h | 6 refactor | 🟡 MEDIUM |
| 6 | Env validation | 1h | 1 new + 1 refactor | 🟡 MEDIUM |
| 5 | Routes standardization | 1h | 15 refactor | 🟠 LOW |
| 7 | Test scaffold | 2h | 5 new | 🟠 LOW |
| 7 | API docs | 1h | 1 new | 🟠 LOW |

**Total Effort:** ~20 hours

---

## 🚨 Breaking Changes & Mitigations

| Change | Impact | Mitigation |
|--------|--------|-----------|
| Path alias `/src/*` → `@/*` | Imports change everywhere | Use codemod; test with `npm run dev` |
| `noImplicitAny: true` | More TS errors | Fix incrementally; add `: any` where needed |
| Error response schema change | Client 4xx parsing differs | Version API response (v1 → v2) or add adapter layer |
| Repository layer injection | Tests need mocking | Create mock repository factories |

---

## 🛠️ Suggested Tooling

```bash
# Auto-fix ESLint issues
npm run lint -- --fix

# Check for dead code
npx knip --ignore tsconfig,engines,workspace

# Generate test coverage report
npm run test:coverage

# Type check (before lint)
npm run typecheck  # Add to package.json: "tsc --noEmit"
```

---

## 📌 Key Files to Monitor

After refactoring, validate these:
- `src/server.ts` - Startup logic
- `src/routes/index.ts` - Route registration
- `src/middleware/errorHandler.ts` - Error handling
- `src/types/api.ts` - Response schema
- `tsconfig.json` - Compiler settings
- `.eslintrc.json` - Lint rules

---

## ✅ Success Criteria (Definition of Done)

- [x] `tsc --noEmit` returns zero errors
- [x] `npm run lint` passes with no warnings
- [x] `npm run dev` starts without errors
- [x] All API tests pass (if baseline tests exist)
- [x] No `any` types without `// @ts-ignore` comments
- [x] All imports use `@/` alias
- [x] Error responses follow consistent schema
- [x] Env vars validated at startup
- [x] Repository pattern in place for ≥1 domain
- [x] Test examples exist for ≥1 module

---

## 📝 Notes & Recommendations

1. **Do incrementally:** Don't refactor all at once. Do 1–2 domains per week.
2. **Prioritize Phase 1 & 2:** TS strict + repository pattern unlock other improvements.
3. **Backup before large changes:** Commit frequently; create feature branch.
4. **Use AI code assistant:** For import path replacements, test scaffold generation.
5. **Document as you go:** Update README in `docs/architecture/` with new patterns.

---

## ✅ Completed Examples

See the actual implementation patterns in:
- **[REFACTOR_COMPLETED_TEMPLATE.md](./REFACTOR_COMPLETED_TEMPLATE.md)** - Shows exact pattern used for Category & Service features, with full code examples and checklist for refactoring new features

---

## 🔗 Related Docs

- [Coding Convention (BE)](./coding-convention-be.md)
- [Architecture Overview](./high-level-architecture.md)
- [API Specification](../api-spec/openapi.yml)
