# Beauty Clinic Care Website

Spa booking platform with React frontend and Node.js backend.

## Quick Start

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## Database Setup (Prisma)

This project uses Prisma ORM with PostgreSQL (via Supabase).

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret!)
- `DATABASE_URL` - PostgreSQL connection string from Supabase

Get these values from your Supabase dashboard:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. **API Keys**: Settings → API
3. **Database URL**: Settings → Database → Connection string (URI mode)

### Prisma Commands

```bash
# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Generate Prisma Client (run after schema changes)
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Database Models

The schema includes 9 models:
- **User** - Members and administrators
- **ServiceCategory** - Service categorization
- **Service** - Beauty treatments and procedures
- **Branch** - Clinic locations
- **Booking** - Appointment reservations (supports guest and member bookings)
- **BlogCategory** - Blog post categorization
- **BlogPost** - Content marketing articles
- **Review** - Customer ratings and feedback
- **ContactSubmission** - Contact form inquiries

See `prisma/schema.prisma` for complete model definitions.

## Supabase Setup

This project uses Supabase for:
- **PostgreSQL Database** - Managed database with automatic backups
- **Authentication** - Email OTP (passwordless) authentication
- **Storage** - Image hosting for services, branches, and blog posts

### Initial Setup

1. **Create Supabase Project**
   - Sign up at [https://app.supabase.com](https://app.supabase.com)
   - Create a new project (choose region closest to your location)
   - Wait for project provisioning (~2 minutes)

2. **Configure Environment Variables**
   - Copy credentials from Supabase dashboard to `.env`
   - See `.env.example` for required variables

3. **Run Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Configure Storage Bucket** (via Supabase Dashboard)
   - Go to Storage → Create bucket → Name: "images"
   - Set bucket to **Public**
   - Create folders: `services/`, `branches/`, `blog/`, `profile/`

5. **Enable Email OTP Authentication** (via Supabase Dashboard)
   - Go to Authentication → Providers
   - Enable Email provider
   - Enable "Email OTP" option
   - Set OTP expiry to 10 minutes

### Test Scripts

Verify your Supabase setup with test scripts:

```bash
# Test database connection and CRUD operations
npm run test:db --workspace=@spa-hackathon/backend

# Test authentication flow (requires updating TEST_EMAIL in script)
npm run test:auth --workspace=@spa-hackathon/backend

# Test storage upload/download (requires storage bucket setup)
npm run test:storage --workspace=@spa-hackathon/backend
```

### Supabase Dashboard Links

Quick access to common dashboard pages:
- **Database**: `https://app.supabase.com/project/[PROJECT_REF]/database/tables`
- **Auth**: `https://app.supabase.com/project/[PROJECT_REF]/auth/users`
- **Storage**: `https://app.supabase.com/project/[PROJECT_REF]/storage/buckets`
- **API Docs**: `https://app.supabase.com/project/[PROJECT_REF]/api`

### Authentication Flow

**Email OTP (Passwordless) Flow:**

1. User enters email → Backend calls `signInWithOTP(email)`
2. Supabase sends 6-digit OTP code to email
3. User enters code → Backend calls `verifyOTP(email, code)`
4. Backend receives JWT tokens (access + refresh)
5. Frontend stores tokens and makes authenticated requests

**Helper Functions** (in `apps/backend/src/lib/supabaseAuth.ts`):
- `signUpWithEmail(email, password, metadata)` - Create new user
- `signInWithOTP(email)` - Send OTP code via email
- `verifyOTP(email, token)` - Verify OTP and get tokens
- `getCurrentUser(accessToken)` - Get user from JWT
- `signOut(accessToken)` - Invalidate session
- `getUserByEmail(email)` - Admin: find user by email
- `updateUserMetadata(userId, metadata)` - Admin: update user
- `deleteUser(userId)` - Admin: delete user

### Storage Patterns

**Upload Image:**
```typescript
import { supabase } from './lib/supabase';

const { data, error } = await supabase.storage
  .from('images')
  .upload('services/image.jpg', fileBuffer, {
    contentType: 'image/jpeg'
  });

const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl('services/image.jpg');
```

**File Organization:**
- Services: `images/services/{uuid}_main.jpg`
- Branches: `images/branches/{uuid}_facility_1.jpg`
- Blog: `images/blog/{uuid}_featured.jpg`
- Profile: `images/profile/{userId}_avatar.jpg`

### Troubleshooting

**"Can't reach database server" error:**
- Verify DATABASE_URL format includes connection pooler
- Check password has no special characters needing encoding
- Ensure project is not paused (Supabase free tier pauses after 1 week inactivity)

**"Email not received" for OTP:**
- Check spam/junk folder
- Wait 2-3 minutes (email delivery can be delayed)
- Use Gmail (better deliverability than temporary email services)

**"Storage upload failed" error:**
- Verify "images" bucket exists and is set to Public
- Check file size (<5MB for free tier)
- Ensure file MIME type is allowed (image/jpeg, image/png, image/webp)

## API Server

The backend API is built with Express.js and provides a RESTful interface for the frontend application.

### Starting the Server

```bash
# Development mode (with auto-reload)
npm run dev --workspace=@spa-hackathon/backend

# Production build
npm run build --workspace=@spa-hackathon/backend
npm run start --workspace=@spa-hackathon/backend
```

Server will start on `http://localhost:3000` (configurable via `PORT` environment variable).

### API Endpoints

**Health Check:**
```bash
GET /api/health
Response: {
  "status": "ok",
  "timestamp": "2025-10-29T10:00:00.000Z",
  "uptime": 12345
}
```

**Available Endpoints (v1):**
- `GET /api/v1/services` - Get all services (coming in Story 1.6)
- `GET /api/v1/services/:id` - Get service by ID
- `GET /api/v1/branches` - Get all branches (coming in Story 2.5)
- `GET /api/v1/branches/:id` - Get branch by ID
- `POST /api/v1/auth/signup` - Register new user (coming in Epic 4)
- `POST /api/v1/auth/signin` - Send OTP for login
- `POST /api/v1/auth/verify-otp` - Verify OTP code
- `POST /api/v1/bookings` - Create booking (coming in Epic 3)
- `GET /api/v1/bookings/:referenceNumber` - Get booking details

Note: Endpoints marked "coming in Story X.X" currently return `501 Not Implemented`.

### Middleware Stack

The API server includes comprehensive middleware:

1. **Security (Helmet)** - HTTP security headers
2. **CORS** - Cross-origin requests from frontend (localhost:5173)
3. **Body Parsing** - JSON and URL-encoded
4. **Request Logging (Winston)** - Logs all HTTP requests with timestamps
5. **Rate Limiting** - Protects against abuse
   - Auth endpoints: 5 requests/minute per IP
   - General endpoints: 100 requests/minute per IP
6. **Error Handling** - Consistent error responses with proper HTTP status codes

### Error Response Format

All API errors follow a consistent format:

```json
{
  "error": "ValidationError",
  "message": "Invalid email format",
  "statusCode": 400,
  "timestamp": "2025-10-29T10:00:00.000Z",
  "details": {
    "field": "email",
    "value": "invalid-email"
  }
}
```

### Testing API Endpoints

Using PowerShell:
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET

# Test CORS (from frontend origin)
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/services" -Method GET `
  -Headers @{"Origin"="http://localhost:5173"}

# Test rate limiting (send 6 requests quickly)
1..6 | ForEach-Object {
  Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/signin" -Method POST
}
```

Using curl (if available):
```bash
# Health check
curl http://localhost:3000/api/health

# Test endpoint with JSON body
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "123", "branchId": "456"}'
```

### Environment Variables

Required for API server:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Database and Supabase (from previous section)
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Logging

Winston logger outputs:
- **Development**: Colorized console logs with timestamps
- **Production**: JSON logs to `logs/` directory

Log levels: error, warn, info, http, debug

Example log output:
```
2025-10-29 10:00:00 [info]: 🚀 Backend server running on http://localhost:3000
2025-10-29 10:00:05 [http]: GET /api/health 200 - 5ms
2025-10-29 10:00:10 [warn]: GET /api/invalid 404 - 2ms
2025-10-29 10:00:15 [error]: POST /api/v1/bookings 500 - 15ms
```



