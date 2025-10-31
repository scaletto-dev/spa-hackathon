# Supabase Onboarding Guide

Welcome to the Beauty Clinic Care project! This guide will help you set up your local development environment with Supabase.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- A valid email address (for testing OTP authentication)
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone Repository and Install Dependencies

```bash
git clone https://github.com/scaletto-dev/spa-hackathon.git
cd spa-hackathon
npm install
```

### 2. Get Supabase Access

**Option A: Use Existing Team Project** (Recommended)
1. Contact team lead for Supabase project access
2. Accept invitation email from Supabase
3. Access shared project at https://app.supabase.com

**Option B: Create Personal Dev Project** (For isolated testing)
1. Sign up at https://app.supabase.com
2. Create new project: "beauty-clinic-dev-[YOUR_NAME]"
3. Choose same region as team (e.g., Southeast Asia - Singapore)
4. Set strong database password and save it

### 3. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Get credentials from Supabase Dashboard:
   - Go to Project Settings  API
   - Copy Project URL  Add to `.env` as `SUPABASE_URL`
   - Copy anon/public key  Add to `.env` as `SUPABASE_ANON_KEY`
   - Copy service_role key  Add to `.env` as `SUPABASE_SERVICE_ROLE_KEY`
   
3. Get database connection string:
   - Go to Project Settings  Database
   - Click "Connection string"  Choose "URI" tab
   - Copy the connection string  Add to `.env` as `DATABASE_URL`
   - **Important**: Replace `[YOUR-PASSWORD]` in the URL with your actual database password

4. Verify `.env` file looks like this:
   ```env
   DATABASE_URL="postgresql://postgres.abc123:YourPassword@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
   SUPABASE_URL="https://abc123.supabase.co"
   SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

### 4. Run Database Migration

Apply the database schema to your Supabase project:

```bash
npx prisma migrate dev --name init
```

Expected output:
```
Applying migration `20251029021032_init`
Your database is now in sync with your schema.
 Generated Prisma Client
```

### 5. Configure Supabase Storage

1. Go to Supabase Dashboard  Storage
2. Click "Create a new bucket"
3. Set name: `images`
4. Set to **Public bucket**
5. Click "Create bucket"
6. Inside the `images` bucket, create these folders:
   - `services/`
   - `branches/`
   - `blog/`
   - `profile/`

### 6. Enable Email OTP Authentication

1. Go to Supabase Dashboard  Authentication  Providers
2. Ensure Email provider is enabled (green toggle)
3. Click on Email provider to open settings
4. Enable "Email OTP" option
5. Set OTP expiry: 10 minutes
6. Click "Save"

### 7. Verify Setup

Run test scripts to confirm everything works:

```bash
# Test database connection
npm run test:db --workspace=@spa-hackathon/backend

# Expected output:
# All Database Tests Passed! 
```

If database test passes, your setup is complete! 

### 8. Optional: Test Authentication

1. Edit `apps/backend/src/scripts/testSupabaseAuth.ts`
2. Change `TEST_EMAIL` to your personal email
3. Run:
   ```bash
   npm run test:auth --workspace=@spa-hackathon/backend
   ```
4. Check your email for OTP code
5. Follow instructions in terminal to complete test

### 9. Optional: Test Storage

```bash
npm run test:storage --workspace=@spa-hackathon/backend
```

This verifies you can upload/download files from Supabase Storage.

## Verification Checklist

Use this checklist to confirm your environment is ready:

- [ ] Repository cloned and dependencies installed
- [ ] Supabase account created or team access granted
- [ ] `.env` file created with all 4 required variables
- [ ] Database migration applied successfully
- [ ] `images` storage bucket created and set to public
- [ ] Storage folders created: services/, branches/, blog/, profile/
- [ ] Email OTP authentication enabled
- [ ] Database test script passes
- [ ] Can access Prisma Studio (run `npx prisma studio`)

## Common Issues

### Issue: "Can't reach database server"

**Cause:** DATABASE_URL is incorrect or database password is wrong.

**Solution:**
1. Go to Supabase Dashboard  Settings  Database
2. Click "Reset Database Password"
3. Copy new password
4. Update DATABASE_URL in `.env` with new password
5. Try migration again

### Issue: "Invalid connection string"

**Cause:** DATABASE_URL format is wrong.

**Solution:** Verify format matches:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Issue: Migration fails with "already exists" error

**Cause:** Running migration on a database that already has tables.

**Solution:**
1. **Option A** (Clean slate): Reset database:
   ```bash
   npx prisma migrate reset
   ```
2. **Option B** (Keep data): Mark migration as applied:
   ```bash
   npx prisma migrate resolve --applied 20251029021032_init
   ```

### Issue: OTP emails not received

**Cause:** Email provider or spam filtering.

**Solutions:**
- Check spam/junk folder
- Wait 2-3 minutes for delivery
- Use Gmail instead of temporary email services
- Check Supabase Dashboard  Authentication  Logs for delivery errors

### Issue: Storage upload fails

**Cause:** Bucket not public or doesn't exist.

**Solutions:**
- Verify bucket name is exactly `images` (lowercase)
- Go to Storage  images  Click "Make public"
- Check that folders exist (click into bucket to see folders)

## Next Steps

After completing setup:

1. **Explore Prisma Studio**
   ```bash
   npx prisma studio
   ```
   Open http://localhost:5555 to see your database

2. **Review Code Structure**
   - `apps/backend/src/lib/supabase.ts` - Supabase client
   - `apps/backend/src/lib/supabaseAuth.ts` - Auth helpers
   - `prisma/schema.prisma` - Database schema

3. **Read Documentation**
   - Main README.md for project overview
   - `docs/architecture.md` for system design
   - `docs/prd.md` for requirements

4. **Join Team Communication**
   - Ask team lead for Slack/Discord invite
   - Introduce yourself and share setup status

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md troubleshooting section
2. Search existing GitHub Issues
3. Ask in team chat channel
4. Create new GitHub Issue with:
   - What you tried
   - Error messages (full stack trace)
   - Your environment (OS, Node version)

## Team Coordination

### Shared vs Personal Projects

**Shared Project** (Production/Staging):
- Used for: Integration testing, demos
- Access: All team members
- Changes: Require PR approval
- Database: Shared data (be careful with deletions!)

**Personal Project** (Development):
- Used for: Local development, experiments
- Access: Just you
- Changes: Anything goes
- Database: Your own data (delete freely)

### Best Practices

1. **Always use personal project** for local development
2. **Never commit `.env`** file (use `.env.example` template)
3. **Run migrations locally** before creating PR
4. **Test auth flow** with your own email before committing
5. **Ask before modifying** shared Supabase settings

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Project Architecture**: `docs/architecture.md`
- **API Specification**: `docs/architecture/api-specification.md`

Welcome to the team! 