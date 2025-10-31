# ��� Full Stack Deployment Guide

Complete deployment guide for **Frontend + Backend + Database**.

---

## ��� Quick Deploy

### Option 1: Docker (Recommended for Production)

```bash
# Complete full stack in 3 commands
cd deploy/docker
cp .env.example .env && cp backend.env.example backend.env
# Edit both .env files
make up

# Access:
# Frontend: http://localhost:8080
# Backend:  http://localhost:3000
# Database: localhost:5432
```

### Option 2: Vercel (Fastest for Cloud)

```bash
# Deploy both FE + BE to Vercel
cd deploy/vercel
npm install -g vercel
vercel login
./scripts/deploy-fullstack.sh production

# Auto-configured:
# Frontend: https://yourdomain.vercel.app
# Backend:  https://yourdomain.vercel.app/api
# Database: Use Supabase (managed PostgreSQL)
```

---

## ��� What Gets Deployed

| Component | Docker | Vercel |
|-----------|--------|--------|
| **Frontend** | Nginx static files (port 8080) | Edge CDN (global) |
| **Backend** | Express API (port 3000) | Serverless Functions |
| **Database** | PostgreSQL 16 (port 5432) | Supabase (managed) |
| **Files** | Local volumes | Supabase Storage |
| **WebSocket** | ✅ Supported | ❌ Use alternatives |
| **Cost** | Server cost only | Free tier available |
| **Control** | Full control | Platform managed |

---

## ��� Docker Full Stack Deployment

### Architecture

```
┌─────────────────────────────────────────┐
│          Docker Network (bridge)        │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │Frontend │  │ Backend │  │PostgreSQL│ │
│  │ Nginx   │  │ Express │  │  DB      │ │
│  │:8080    │─▶│:3000    │─▶│:5432     │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

### Files

```
deploy/docker/
├── Dockerfile.frontend         # React + Vite + Nginx
├── Dockerfile.backend          # Express + Prisma + Node
├── docker-compose.full.yml     # Full stack orchestration
├── .env.example                # Frontend env template
├── backend.env.example         # Backend env template
├── Makefile                    # Helper commands
└── scripts/
    ├── inject-env.sh           # Frontend runtime ENV
    └── blue-green-deploy.sh    # Zero-downtime deployment
```

### Step-by-Step

**1. Configure Environment**

```bash
cd deploy/docker

# Frontend environment
cp .env.example .env
vim .env  # Edit with your values
```

```bash
# Backend environment
cp backend.env.example backend.env
vim backend.env  # Edit with your values
```

**2. Build Images**

```bash
# Build both images
make build

# Or separately
make build-fe
make build-be
```

**3. Start Services**

```bash
# Start all (FE + BE + DB)
make up

# Check status
make status

# View logs
make logs
```

**4. Initialize Database**

```bash
# Run migrations
make db-migrate

# Seed data
make db-seed
```

**5. Test Deployment**

```bash
# Test health endpoints
make test

# Or manually
curl http://localhost:8080/healthz  # Frontend
curl http://localhost:3000/api/health  # Backend
```

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
VITE_GOOGLE_CLIENT_ID=xxx
```

**Backend (backend.env):**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://spa_user:spa_password@postgres:5432/spa_hackathon
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=xxx
RESEND_API_KEY=xxx
VNPAY_TMN_CODE=xxx
VNPAY_HASH_SECRET=xxx
CORS_ORIGIN=http://localhost:8080,https://yourdomain.com
```

---

## ⚡ Vercel Full Stack Deployment

### Architecture

```
┌─────────────────────────────────────────┐
│         Vercel Edge Network             │
│                                         │
│  ┌─────────┐         ┌──────────┐      │
│  │Frontend │         │ Backend  │      │
│  │  CDN    │         │Serverless│      │
│  │ Global  │         │Functions │      │
│  └────┬────┘         └────┬─────┘      │
│       │                   │             │
└───────┼───────────────────┼─────────────┘
        │                   │
        └───────────────────┴─────▶ Supabase
                                    (Database)
```

### Files

```
deploy/vercel/
├── vercel.json                # Frontend config (Build Output API v3)
├── vercel.backend.json        # Backend config (Serverless)
├── .env.example               # Frontend env template
├── backend.env.example        # Backend env template
└── scripts/
    ├── build-output.js        # Frontend builder
    ├── deploy.sh              # Frontend deployment
    └── deploy-fullstack.sh    # Full stack deployment
```

### Step-by-Step

**1. Install Vercel CLI**

```bash
npm install -g vercel
vercel login
```

**2. Configure Environment (Vercel Dashboard)**

1. Go to https://vercel.com/dashboard
2. Create new project → Import Git Repository
3. Settings → Environment Variables
4. Add variables from `.env.example` and `backend.env.example`

**3. Deploy**

```bash
cd deploy/vercel

# Deploy full stack to production
./scripts/deploy-fullstack.sh production

# Or deploy separately
./scripts/deploy-fullstack.sh frontend production
./scripts/deploy-fullstack.sh backend production
```

**4. Run Database Migrations**

```bash
# Pull Vercel environment locally
vercel env pull

# Run migrations
cd apps/backend
npx prisma migrate deploy
```

**5. Test Deployment**

```bash
# Frontend
curl https://yourdomain.vercel.app

# Backend API
curl https://yourdomain.vercel.app/api/health
```

### Vercel Environment Setup

**Frontend Variables:**
```bash
vercel env add VITE_API_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
# ... add all VITE_* variables
```

**Backend Variables:**
```bash
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production
vercel env add RESEND_API_KEY production
vercel env add VNPAY_TMN_CODE production
vercel env add VNPAY_HASH_SECRET production
vercel env add CORS_ORIGIN production
```

---

## ���️ Database Options

### Option 1: Docker PostgreSQL (Development)

```bash
# Included in docker-compose.full.yml
# Automatic setup when running `make up`

# Connection string:
DATABASE_URL=postgresql://spa_user:spa_password@postgres:5432/spa_hackathon
```

**Pros:**
- ✅ Fast local development
- ✅ No external dependencies
- ✅ Full control

**Cons:**
- ❌ Data lost when container removed
- ❌ Manual backups required
- ❌ Not suitable for production

### Option 2: Supabase (Recommended for Production)

```bash
# 1. Create project at https://supabase.com
# 2. Get connection string from Settings → Database
# 3. Use in both Docker and Vercel

DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

**Pros:**
- ✅ Managed PostgreSQL
- ✅ Automatic backups
- ✅ Built-in Auth & Storage
- ✅ Free tier (500MB database)
- ✅ Works with both Docker & Vercel

**Cons:**
- ❌ External dependency
- ❌ Network latency (if far from region)

---

## ��� Deployment Workflow

### Development → Staging → Production

**1. Local Development**

```bash
# Run locally with hot reload
npm run dev
```

**2. Test Docker Build**

```bash
cd deploy/docker
make build
make up
make test
```

**3. Deploy to Staging (Vercel Preview)**

```bash
cd deploy/vercel
./scripts/deploy-fullstack.sh preview
```

**4. Deploy to Production**

**Docker:**
```bash
# Blue-green deployment (zero downtime)
cd deploy/docker
./scripts/blue-green-deploy.sh deploy
```

**Vercel:**
```bash
cd deploy/vercel
./scripts/deploy-fullstack.sh production
```

---

## ��� Testing Deployment

### Health Checks

```bash
# Frontend
curl https://yourdomain.com/healthz
# Expected: HTTP 200

# Backend
curl https://yourdomain.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### End-to-End Tests

```bash
# Test booking flow
curl -X POST https://yourdomain.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"serviceId":1,"date":"2025-11-01","time":"10:00"}'

# Test AI chat
curl -X POST https://yourdomain.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

---

## ��� Troubleshooting

### Frontend Can't Connect to Backend

**Docker:**
```bash
# Check backend is running
docker ps | grep spa-backend

# Check network
docker network inspect spa-network

# Check VITE_API_URL
docker exec spa-frontend cat /usr/share/nginx/html/env.js
```

**Vercel:**
```bash
# Check environment variables
vercel env ls

# Check CORS settings
# Make sure CORS_ORIGIN includes your frontend domain
```

### Database Connection Failed

```bash
# Test connection string
psql $DATABASE_URL

# Check Supabase project status
# https://supabase.com/dashboard

# Verify IP whitelist (if using Supabase)
# Settings → Database → Connection pooler
```

### Deployment Fails

**Docker:**
```bash
# Check build logs
docker compose logs

# Rebuild from scratch
make clean
make build
```

**Vercel:**
```bash
# Check build logs in Vercel Dashboard
# Deployments → [Your Deployment] → Build Logs

# Redeploy
vercel --force
```

---

## ��� Monitoring

### Docker

```bash
# View logs
make logs          # All services
make logs-fe       # Frontend only
make logs-be       # Backend only

# Check resource usage
docker stats

# Health status
make status
```

### Vercel

```bash
# View logs in Vercel Dashboard
# https://vercel.com/[team]/[project]/logs

# Or use CLI
vercel logs [deployment-url]
```

---

## ��� Production Checklist

- [ ] Environment variables configured (all VITE_*, DB, API keys)
- [ ] Database migrations run (`make db-migrate` or `npx prisma migrate deploy`)
- [ ] Database seeded (optional, `make db-seed`)
- [ ] CORS origins configured correctly
- [ ] API keys rotated from development values
- [ ] SSL/HTTPS enabled
- [ ] Health checks passing
- [ ] Backup strategy in place (for Docker)
- [ ] Monitoring configured
- [ ] Error tracking setup (optional: Sentry)

---

## ��� Support

**Documentation:**
- [Docker Deployment](./DEPLOYMENT_DOCKER.md)
- [Vercel Deployment](./DEPLOYMENT_VERCEL.md)
- [Backend Deployment](./BACKEND_DEPLOYMENT.md)
- [Environment Variables](./ENV.md)

**Issues:** https://github.com/scaletto-dev/spa-hackathon/issues  
**Email:** doanhaiduydev@gmail.com

---

**��� Full stack deployment complete!**

Your application is now running with:
- ✅ Frontend (React + Vite + Nginx/CDN)
- ✅ Backend (Express + TypeScript + Prisma)
- ✅ Database (PostgreSQL)
- ✅ Automatic deployments
- ✅ Health monitoring
- ✅ Zero downtime updates
