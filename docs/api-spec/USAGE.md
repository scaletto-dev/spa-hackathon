# API Specification - Usage Guide

**Generated:** October 29, 2025  
**Files:** 5 documents (4,804 lines total)

---

## í³¦ Files Overview

```
docs/api-spec/
â”œâ”€â”€ README.md                    # Executive summary & navigation (286 lines)
â”œâ”€â”€ by-feature.updated.md        # Complete API spec by feature (1,286 lines)
â”œâ”€â”€ changelog.md                 # Detailed changes & issues (667 lines)
â”œâ”€â”€ openapi.yml                  # OpenAPI 3.1 specification (1,923 lines)
â”œâ”€â”€ types.d.ts                   # TypeScript types (642 lines)
â””â”€â”€ USAGE.md                     # This file
```

---

## í¾¯ Quick Start by Role

### **Frontend Developers**

1. **Import TypeScript types:**
   ```typescript
   import type {
     Service,
     Branch,
     Appointment,
     Customer,
     Staff,
     Review,
     BlogPost,
     Payment,
     ApiResponse,
     ApiError,
   } from '@/docs/api-spec/types';
   ```

2. **Use types in API calls:**
   ```typescript
   async function getServices(): Promise<ApiResponse<Service[]>> {
     const response = await fetch('/api/v1/services');
     return response.json();
   }
   ```

3. **Field name constants:**
   ```typescript
   import { FIELD_NAMES } from '@/docs/api-spec/types';
   
   const nameField = FIELD_NAMES.USER.NAME; // 'name'
   const emailField = FIELD_NAMES.USER.EMAIL; // 'email'
   ```

4. **Check spec for endpoint details:**
   - Open `by-feature.updated.md`
   - Search for your feature (e.g., "Bookings")
   - Copy request/response examples

---

### **Backend Developers**

1. **Import OpenAPI spec into Swagger/Postman:**
   ```bash
   # Validate spec
   npx @openapitools/openapi-generator-cli validate -i docs/api-spec/openapi.yml
   
   # Generate server stubs (optional)
   npx @openapitools/openapi-generator-cli generate \
     -i docs/api-spec/openapi.yml \
     -g nodejs-express-server \
     -o apps/backend/generated
   ```

2. **Use types for validation:**
   ```typescript
   import { Service, CreateServiceRequest } from '@/docs/api-spec/types';
   
   app.post('/api/v1/admin/services', async (req, res) => {
     const body: CreateServiceRequest = req.body;
     // Validate with Zod or Joi
   });
   ```

3. **Check changelog for priorities:**
   - Open `changelog.md`
   - Section: "Priority Actions for Backend Team"
   - Implement Week 1 (Critical) first

---

### **QA/Testing Team**

1. **Import to Postman:**
   - Postman â†’ Import â†’ `docs/api-spec/openapi.yml`
   - Auto-generates collection with all endpoints

2. **Test checklist:**
   - Reference `by-feature.updated.md` for expected responses
   - Verify field names match `types.d.ts`
   - Check error responses match `ApiError` type

---

### **Product/PM Team**

1. **Review feature coverage:**
   - Open `README.md` for executive summary
   - Check "Key Findings" section
   - Review TODO endpoints

2. **Track implementation:**
   - Open `changelog.md`
   - Section: "Priority Actions"
   - Track backend progress by week

---

## í´ Common Use Cases

### Use Case 1: "I need to implement login"

1. Open `by-feature.updated.md`
2. Search for "Client Login" (section 1.2)
3. Copy:
   - Endpoint: `POST /api/v1/auth/login`
   - Request body fields
   - Response structure
4. Import types:
   ```typescript
   import { LoginRequest, AuthResponse } from '@/docs/api-spec/types';
   ```

---

### Use Case 2: "I need to add a new customer field"

1. Open `types.d.ts`
2. Find `Customer` interface
3. Add field:
   ```typescript
   export interface Customer {
     // ... existing fields
     newField: string; // Add this
   }
   ```
4. Update `openapi.yml` schema (search for `Customer`)
5. Document in `changelog.md` under "Updated Endpoints"

---

### Use Case 3: "What's the booking flow?"

1. Open `by-feature.updated.md`
2. Section 4: "Booking / Appointments"
3. Check:
   - 4.1 Create Booking (guest or member)
   - Request fields (name, email, phone, service, etc.)
   - Response (confirmation with appointment ID)

---

### Use Case 4: "Check security issues"

1. Open `changelog.md`
2. Section: "Security Issues Found"
3. Read all 3 critical issues:
   - Google OAuth client-side verification
   - Admin domain whitelist
   - Mock authentication

---

### Use Case 5: "Generate API client"

**For TypeScript/Axios:**
```bash
npx @openapitools/openapi-generator-cli generate \
  -i docs/api-spec/openapi.yml \
  -g typescript-axios \
  -o apps/frontend/src/api/generated
```

**For Fetch API:**
```bash
npx @openapitools/openapi-generator-cli generate \
  -i docs/api-spec/openapi.yml \
  -g typescript-fetch \
  -o apps/frontend/src/api/generated
```

---

## í³– File Reference

### `README.md`
**Purpose:** Overview + navigation  
**Read this when:**
- First time reviewing spec
- Need executive summary
- Want to understand priorities

**Key sections:**
- Executive Summary (metrics)
- Critical Issues (security)
- Missing Endpoints (TODO)
- Priority Actions (week-by-week)

---

### `by-feature.updated.md`
**Purpose:** Complete API specification  
**Read this when:**
- Implementing an endpoint
- Need exact request/response format
- Want field-level details

**Structure:**
- 13 feature groups (Auth, Services, Branches, etc.)
- Each endpoint has:
  - Method + Path
  - Auth scope
  - Request body (JSON + types)
  - Response (JSON + examples)
  - FE file references

---

### `changelog.md`
**Purpose:** Track changes & issues  
**Read this when:**
- Checking what changed vs old docs
- Understanding why a field was added
- Prioritizing backend work

**Structure:**
- Summary statistics
- Added endpoints (12)
- Updated endpoints (18)
- TODO endpoints (5)
- Security issues (3)
- Field mismatches (9)
- Priority actions

---

### `openapi.yml`
**Purpose:** Machine-readable API spec  
**Read this when:**
- Generating code/clients
- Importing to Postman/Swagger
- Validating API structure

**Format:** OpenAPI 3.1 YAML  
**Tools:**
- Swagger Editor: https://editor.swagger.io
- Postman: Import â†’ OpenAPI 3.0
- Code generators: `@openapitools/openapi-generator-cli`

---

### `types.d.ts`
**Purpose:** TypeScript type definitions  
**Read this when:**
- Writing frontend code
- Need type safety
- Creating forms/validations

**Contents:**
- All entity interfaces (User, Service, Branch, etc.)
- Request/response types
- Query parameter types
- Enums (status, roles, etc.)
- Field name constants
- Type guards

---

## í» ï¸ Tools & Validation

### Validate OpenAPI spec
```bash
npx @openapitools/openapi-generator-cli validate -i docs/api-spec/openapi.yml
```

### Generate TypeScript client
```bash
npm install @openapitools/openapi-generator-cli -g

openapi-generator-cli generate \
  -i docs/api-spec/openapi.yml \
  -g typescript-axios \
  -o src/api/generated \
  --additional-properties=supportsES6=true,withInterfaces=true
```

### Generate Postman collection
```bash
# Install converter
npm install -g openapi-to-postmanv2

# Convert
openapi2postmanv2 \
  -s docs/api-spec/openapi.yml \
  -o docs/api-spec/postman-collection.json \
  -p -O folderStrategy=Tags
```

### View in Swagger UI
```bash
# Install serve
npm install -g serve

# Serve OpenAPI spec
serve docs/api-spec

# Open in browser with Swagger UI
# https://petstore.swagger.io/?url=http://localhost:3000/openapi.yml
```

---

## í´„ Keeping Types in Sync

### When FE adds a field:

1. Update `types.d.ts`:
   ```typescript
   export interface Service {
     // ... existing
     newField: string; // Add
   }
   ```

2. Update `openapi.yml` (search for schema):
   ```yaml
   Service:
     properties:
       newField:
         type: string
   ```

3. Document in `changelog.md`:
   ```markdown
   ### Service Schema
   **Changes:**
   - Added `newField` (string)
   
   **FE Reference:** `apps/frontend/src/...`
   ```

4. Update `by-feature.updated.md` (if needed):
   - Add field to request/response examples

---

### When BE changes endpoint:

1. Update `openapi.yml` path
2. Update `by-feature.updated.md` documentation
3. Update `types.d.ts` if types changed
4. Document change in `changelog.md`
5. Notify FE team

---

## í³ Example Workflows

### Workflow 1: Implement Login (BE)

```typescript
// 1. Check spec
// File: by-feature.updated.md â†’ Section 1.2

// 2. Import types
import { LoginRequest, AuthResponse, ApiResponse } from '@/docs/api-spec/types';

// 3. Implement endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  const body: LoginRequest = req.body;
  
  // Validate
  if (!body.email || !body.password) {
    return res.status(400).json({
      error: {
        message: 'Email and password required',
        code: 'VALIDATION_ERROR',
      }
    });
  }
  
  // Authenticate
  const user = await authenticateUser(body.email, body.password);
  const token = generateToken(user);
  
  // Return
  const response: ApiResponse<AuthResponse> = {
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    }
  };
  
  res.status(200).json(response);
});
```

---

### Workflow 2: Call API (FE)

```typescript
// 1. Import types
import type { LoginRequest, AuthResponse, ApiResponse } from '@/docs/api-spec/types';

// 2. Create API function
async function login(email: string, password: string): Promise<AuthResponse> {
  const request: LoginRequest = { email, password };
  
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  const result: ApiResponse<AuthResponse> = await response.json();
  return result.data;
}

// 3. Use in component
const handleLogin = async () => {
  try {
    const authData = await login(email, password);
    console.log('User:', authData.user);
    console.log('Token:', authData.token);
    // Store token, redirect, etc.
  } catch (err) {
    console.error('Login failed:', err);
  }
};
```

---

## íº¨ Important Notes

### Field Naming Convention
- **All fields use camelCase** (not snake_case)
- Match exactly with FE interfaces
- Examples: `customerName`, `createdAt`, `totalSpent`

### ID Types
- **All IDs are numbers** (not strings)
- Exception: User IDs are strings (from Supabase Auth)
- Example: `Service.id: number`, `User.id: string`

### Date Formats
- **All dates use ISO 8601 strings**
- Date only: `"2025-10-30"` (YYYY-MM-DD)
- Date-time: `"2025-10-29T12:00:00Z"` (ISO 8601)

### Response Envelopes
- **Success:** `{ data: T, meta?: PaginationMeta }`
- **Error:** `{ error: { message, code, details } }`

---

## í³š Additional Resources

- **OpenAPI Spec:** https://spec.openapis.org/oas/v3.1.0
- **Swagger Editor:** https://editor.swagger.io
- **TypeScript Handbook:** https://www.typescriptlang.org/docs
- **Code Generator:** https://openapi-generator.tech

---

**Questions?** Check `README.md` first, then `by-feature.updated.md` for details.
