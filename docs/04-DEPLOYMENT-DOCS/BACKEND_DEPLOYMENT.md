# Ì∫Ä Backend Deployment Guide

Complete guide for deploying the Beauty Clinic Care backend API.

---

## Ì≥ã Table of Contents

- [Overview](#overview)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)

---

## ÌæØ Overview

**Backend Stack:**
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Runtime:** Node.js 20
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **AI:** Google Gemini API
- **Email:** Resend API
- **Payment:** VNPay Gateway

**Deployment Options:**
1. **Docker** - Self-hosted (full control)
2. **Vercel** - Serverless (zero config)

---

## Ì∞≥ Docker Deployment

### Quick Start

```bash
# 1. Build backend image
cd deploy/docker
make build-be

# 2. Configure environment
cp backend.env.example backend.env
# Edit backend.env with your values

# 3. Run backend
make run-be

# Or run full stack (FE + BE + DB)
make up
```

### Dockerfile Structure

**File:** `deploy/docker/Dockerfile.backend`

**Features:**
- ‚úÖ Multi-stage build (builder + runtime)
- ‚úÖ Node.js 20 Alpine (~80MB final image)
- ‚úÖ Non-root user (nodejs UID 1001)
- ‚úÖ Prisma Client generation
- ‚úÖ Health checks
- ‚úÖ Proper signal handling (dumb-init)

**Build Process:**

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
# Install dependencies + build TypeScript + generate Prisma

# Stage 2: Runtime
FROM node:20-alpine AS runtime
# Copy built files + production deps only
```

### Full Stack with Docker Compose

**File:** `deploy/docker/docker-compose.full.yml`

**Services:**
- `backend` - Express API (port 3000)
- `frontend` - React SPA (port 8080)
- `postgres` - PostgreSQL 16 (port 5432)

```bash
# Start all services
make up

# View logs
make logs

# Check status
make status

# Stop all
make down
```

### Makefile Commands

```bash
# Backend only
make build-be           # Build backend image
make run-be             # Run backend container
make logs-be            # View backend logs

# Full stack
make build              # Build FE + BE
make up                 # Start all services
make down               # Stop all services
make restart            # Restart services

# Database
make db-migrate         # Run migrations
make db-seed            # Seed database
make db-reset           # Reset database

# Testing
make test               # Test health endpoints
```

### Environment Variables

**File:** `deploy/docker/backend.env`

```bash
# Required
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
RESEND_API_KEY=...
FROM_EMAIL=noreply@yourdomain.com

# VNPay
VNPAY_TMN_CODE=...
VNPAY_HASH_SECRET=...
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://yourdomain.com/payment/callback

# CORS
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

### Health Check

```bash
# Check backend health
curl http://localhost:3000/api/health

# Response
{
  "status": "ok",
  "timestamp": "2025-10-31T15:30:00.000Z",
  "uptime": 123.45
}
```

---

## ‚ö° Vercel Deployment

### Quick Start

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy backend
cd deploy/vercel
./scripts/deploy-fullstack.sh backend production
```

### Configuration

**File:** `deploy/vercel/vercel.backend.json`

**Features:**
- ‚úÖ Serverless Functions (Node.js 20)
- ‚úÖ Singapore region (sin1)
- ‚úÖ 1024MB memory per function
- ‚úÖ 10s max duration
- ‚úÖ Automatic CORS headers
- ‚úÖ API routing (`/api/*`)

### Environment Setup

**Vercel Dashboard:**
1. Go to Project Settings ‚Üí Environment Variables
2. Add each variable from `deploy/vercel/backend.env.example`
3. Select environments: Production, Preview, Development

**Vercel CLI:**

```bash
# Add single variable
vercel env add DATABASE_URL production

# Pull environment locally
vercel env pull

# List all variables
vercel env ls
```

### Deploy Commands

```bash
# Deploy backend only (preview)
./scripts/deploy-fullstack.sh backend preview

# Deploy backend (production)
./scripts/deploy-fullstack.sh backend production

# Deploy full stack (FE + BE)
./scripts/deploy-fullstack.sh fullstack production
```

### API Routes

Vercel automatically routes `/api/*` to your Express app:

```
https://yourdomain.vercel.app/api/health
https://yourdomain.vercel.app/api/services
https://yourdomain.vercel.app/api/bookings
```

### Limitations

‚ö†Ô∏è **Vercel Serverless Constraints:**

1. **Execution Time:** Max 10s per request (Hobby), 60s (Pro)
2. **Cold Start:** ~1-2s first request
3. **No WebSockets:** Socket.IO won't work (use Pusher/Ably)
4. **No File System:** Use object storage (S3/Supabase Storage)
5. **Memory:** 1024MB default (configurable)

**Recommended:**
- Use Docker for long-running processes
- Use Vercel for API routes and serverless functions

---

## Ì¥ê Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase public key | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key | `eyJh...` |
| `GEMINI_API_KEY` | Google AI API key | `AIza...` |
| `RESEND_API_KEY` | Email service key | `re_...` |
| `VNPAY_TMN_CODE` | VNPay merchant code | `MERCHANT123` |
| `VNPAY_HASH_SECRET` | VNPay secret | `SECRET123` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGIN` | Allowed origins | `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Winston log level | `info` |

### Security Best Practices

1. **Never commit `.env` files**
2. **Use secret management:**
   - Docker: Environment variables or Docker secrets
   - Vercel: Dashboard ‚Üí Environment Variables
3. **Rotate keys regularly**
4. **Use different keys for dev/staging/prod**
5. **Limit CORS origins in production**

---

## Ì∑ÑÔ∏è Database Setup

### Supabase (Recommended)

```bash
# 1. Create Supabase project
https://supabase.com/dashboard

# 2. Get connection string
Settings ‚Üí Database ‚Üí Connection String

# 3. Set DATABASE_URL
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

### Run Migrations

**Docker:**

```bash
# Run migrations
make db-migrate

# Or manually
docker compose exec backend npx prisma migrate deploy
```

**Vercel:**

```bash
# Pull environment
vercel env pull

# Run migrations locally (uses Vercel env)
cd apps/backend
npx prisma migrate deploy
```

### Seed Database

```bash
# Docker
make db-seed

# Local
cd apps/backend
npm run prisma db seed
```

---

## ÔøΩÔøΩ Troubleshooting

### Common Issues

#### 1. Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd apps/backend
npx prisma generate
npm run build
```

#### 2. Database Connection Failed

**Error:**
```
Can't reach database server
```

**Solution:**
- Check `DATABASE_URL` is correct
- Verify network connectivity
- Check Supabase project is active
- Whitelist Docker/Vercel IPs in Supabase

#### 3. CORS Errors

**Error:**
```
Access-Control-Allow-Origin missing
```

**Solution:**
- Set `CORS_ORIGIN` to include frontend domain
- For development: `http://localhost:5173`
- For production: `https://yourdomain.com`

#### 4. Vercel Function Timeout

**Error:**
```
Function execution timed out
```

**Solution:**
- Optimize database queries
- Add indexes to Prisma schema
- Use connection pooling
- Consider upgrading to Vercel Pro (60s timeout)

#### 5. Health Check Failing

**Error:**
```
Health check failed
```

**Solution:**
```bash
# Check backend logs
make logs-be

# Verify backend is running
curl http://localhost:3000/api/health

# Check environment variables
docker compose exec backend env | grep DATABASE_URL
```

### Debug Mode

**Enable debug logs:**

```bash
# Set LOG_LEVEL=debug in env
LOG_LEVEL=debug

# View detailed logs
make logs-be -f
```

---

## Ì≥ä Performance Optimization

### Database

```typescript
// Use connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=5`
    }
  }
})
```

### Caching

```typescript
// Use Redis for session/cache (optional)
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)
```

### Rate Limiting

```typescript
// Already configured in middleware
// Adjust in backend.env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window
```

---

## Ì∫¶ CI/CD Integration

### GitHub Actions (Docker)

```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'apps/backend/**'
      - 'deploy/docker/Dockerfile.backend'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build backend image
        run: |
          cd deploy/docker
          docker build -f Dockerfile.backend -t spa-backend:latest ../..
      
      - name: Deploy to server
        run: |
          # SSH and deploy
```

### GitHub Integration (Vercel)

```bash
# Connect repository in Vercel Dashboard
# Auto-deploys on push to main
# Preview deploys for PRs
```

---

## Ì≥û Support

**Issues:** https://github.com/scaletto-dev/spa-hackathon/issues  
**Email:** doanhaiduydev@gmail.com

---

**‚úÖ Backend deployment complete!**

Choose based on your needs:
- **Docker** for full control, long-running processes, WebSockets
- **Vercel** for zero config, automatic scaling, serverless
