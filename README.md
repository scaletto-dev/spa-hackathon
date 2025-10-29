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



