# Ì∫Ä Full Stack Quick Start Guide

**Time:** 5-10 minutes  
**Result:** Complete application running (Frontend + Backend + Database)

---

## ÌæØ Choose Your Deployment Method

### Ì∞≥ Option 1: Docker (Recommended for Local Testing)

**Best for:** Full control, local development, production self-hosting

```bash
# 1. Navigate to Docker directory
cd deploy/docker

# 2. Configure environment
cp .env.example .env
cp backend.env.example backend.env
# Edit both files with your credentials

# 3. Start all services
make up

# 4. Check status
make status

# ‚úÖ Done! Access:
# - Frontend: http://localhost:8080
# - Backend:  http://localhost:3000/api/health
# - Database: localhost:5432
```

**Commands:**
```bash
make logs          # View all logs
make logs-fe       # Frontend logs only
make logs-be       # Backend logs only
make down          # Stop all services
make restart       # Restart services
make test          # Test health endpoints
```

---

### ‚ö° Option 2: Vercel (Fastest Cloud Deployment)

**Best for:** Production deployment, global CDN, zero config

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Navigate to Vercel directory
cd deploy/vercel

# 4. Deploy full stack
./scripts/deploy-fullstack.sh production

# ‚úÖ Done! Your app is live at:
# https://[your-project].vercel.app
```

**Configure Environment:**
1. Go to https://vercel.com/dashboard
2. Select your project ‚Üí Settings ‚Üí Environment Variables
3. Add variables from `deploy/vercel/.env.example` and `deploy/vercel/backend.env.example`

---

## Ì≥ã Prerequisites

### Required for All:

- ‚úÖ **Node.js 20+** - `node --version`
- ‚úÖ **npm/pnpm** - `npm --version`
- ‚úÖ **Git** - `git --version`

### Required for Docker:

- ‚úÖ **Docker 24+** - `docker --version`
- ‚úÖ **Docker Compose** - `docker compose version`

### Required for Vercel:

- ‚úÖ **Vercel Account** - Free tier available
- ‚úÖ **Supabase Account** - For managed database

---

## Ì¥ë Environment Variables

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000  # Docker: localhost | Vercel: your-backend-url

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Services
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
VITE_GOOGLE_CLIENT_ID=your-client-id

# Application
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### Backend (backend.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI & Services
GEMINI_API_KEY=your-gemini-api-key
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# Payment Gateway
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret

# CORS
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

---

## Ì∑ÑÔ∏è Database Setup

### Docker (Local PostgreSQL)

Automatically created when running `make up`. No configuration needed!

**Connection:**
```bash
DATABASE_URL=postgresql://spa_user:spa_password@postgres:5432/spa_hackathon
```

### Vercel (Supabase - Recommended)

1. Create project at https://supabase.com
2. Copy connection string from Settings ‚Üí Database
3. Add to Vercel environment variables

**Connection:**
```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

---

## Ì∑™ Verify Deployment

### Docker

```bash
# Check services are running
make status

# Test health endpoints
make test

# Or manually:
curl http://localhost:8080/healthz        # Frontend
curl http://localhost:3000/api/health     # Backend
```

### Vercel

```bash
# Test frontend
curl https://your-project.vercel.app

# Test backend API
curl https://your-project.vercel.app/api/health
```

---

## Ìæ® Next Steps

1. **Run database migrations:**
   ```bash
   # Docker
   make db-migrate
   
   # Vercel
   vercel env pull && cd apps/backend && npx prisma migrate deploy
   ```

2. **Seed database (optional):**
   ```bash
   # Docker
   make db-seed
   
   # Vercel
   cd apps/backend && npx prisma db seed
   ```

3. **Test the application:**
   - Visit booking page
   - Test AI chatbot
   - Try payment flow (VNPay sandbox)

---

## Ì∞õ Troubleshooting

### Frontend can't connect to backend

**Docker:**
```bash
# Check VITE_API_URL in .env
docker exec spa-frontend cat /usr/share/nginx/html/env.js
```

**Vercel:**
```bash
# Check environment variables
vercel env ls
# Make sure VITE_API_URL points to your backend URL
```

### Backend can't connect to database

```bash
# Verify DATABASE_URL
# Docker: Should point to 'postgres' service
# Vercel: Should point to Supabase connection string

# Test connection
psql $DATABASE_URL
```

### Port already in use

```bash
# Docker: Change ports in docker-compose.full.yml
# Or stop conflicting services:
lsof -ti:3000 | xargs kill -9  # Kill port 3000
lsof -ti:8080 | xargs kill -9  # Kill port 8080
```

---

## Ì≥ö Documentation

**Complete Guides:**
- [Full Stack Deployment](../docs/04-DEPLOYMENT-DOCS/FULLSTACK_DEPLOYMENT.md)
- [Docker Deployment](../docs/04-DEPLOYMENT-DOCS/DEPLOYMENT_DOCKER.md)
- [Vercel Deployment](../docs/04-DEPLOYMENT-DOCS/DEPLOYMENT_VERCEL.md)
- [Backend Deployment](../docs/04-DEPLOYMENT-DOCS/BACKEND_DEPLOYMENT.md)
- [Environment Variables](../docs/04-DEPLOYMENT-DOCS/ENV.md)

**Quick References:**
- [Docker README](./docker/README.md)
- [Vercel README](./vercel/README.md)
- [Deployment Summary](./DEPLOYMENT_SUMMARY.md)

---

## Ì≥û Support

**Issues:** https://github.com/scaletto-dev/spa-hackathon/issues  
**Email:** doanhaiduydev@gmail.com

---

**Ìæâ You're all set!**

Your full stack application is now running:
- ‚úÖ React frontend with Vite
- ‚úÖ Express backend with TypeScript
- ‚úÖ PostgreSQL database
- ‚úÖ AI chatbot (Gemini)
- ‚úÖ Payment gateway (VNPay)
- ‚úÖ Email notifications (Resend)
