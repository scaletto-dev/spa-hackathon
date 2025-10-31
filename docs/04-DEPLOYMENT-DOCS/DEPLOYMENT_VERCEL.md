# ⚡ Vercel Deployment Guide

Hướng dẫn triển khai dự án **Beauty Clinic Care Website** lên **Vercel** với Build Output API v3, runtime ENV injection, và tối ưu performance.

---

## ��� Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Yêu Cầu](#-yêu-cầu)
- [Cấu Trúc](#-cấu-trúc)
- [Quick Start](#-quick-start)
- [Build Output API v3](#-build-output-api-v3)
- [Environment Variables](#-environment-variables)
- [Deployment Options](#-deployment-options)
- [Performance Optimization](#-performance-optimization)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)

---

## ��� Tổng Quan

### Kiến Trúc Vercel Deployment

```
┌─────────────────────────────────────────────┐
│         Build Process                        │
│  ┌──────────────┐    ┌──────────────┐       │
│  │  Vite Build  │───▶│ Build Output │       │
│  │  npm build   │    │  API v3      │       │
│  │  → dist/     │    │  → .vercel/  │       │
│  └──────────────┘    └──────────────┘       │
└─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│       .vercel/output Structure               │
│  ├── config.json         (metadata)         │
│  ├── static/             (from dist/)       │
│  │   ├── index.html                         │
│  │   ├── env.js          (runtime config)   │
│  │   └── assets/                            │
│  └── config/                                 │
│      ├── routes.json     (SPA routing)      │
│      └── headers.json    (security)         │
└─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Vercel Edge Network                  │
│  - Global CDN                                │
│  - HTTP/2 & HTTP/3                           │
│  - Automatic SSL                             │
│  - Gzip & Brotli compression                 │
│  - Smart caching                             │
└─────────────────────────────────────────────┘
```

### Tính Năng Chính

✅ **Build Output API v3** - Vercel's native build system  
✅ **Runtime ENV injection** - No rebuild for ENV changes  
✅ **SPA routing** - Automatic fallback to index.html  
✅ **Smart caching** - Immutable cache for assets  
✅ **Security headers** - XSS, CSP, frame protection  
✅ **Global CDN** - Edge network với 100+ locations  
✅ **Zero config SSL** - Automatic HTTPS  
✅ **Preview deployments** - Per-branch previews  
✅ **Rollback** - Instant rollback to any deployment

---

## ��� Yêu Cầu

### Local Development

- **Node.js**: 20+
- **npm**: 9+
- **Vercel CLI**: Latest (will auto-install if missing)

### Vercel Account

- Free tier: https://vercel.com/signup
- GitHub account (for automatic deployments)

---

## ��� Cấu Trúc

```
spa-hackathon/
├── deploy/
│   └── vercel/
│       ├── vercel.json              # Vercel configuration
│       ├── .env.example             # Environment template
│       ├── README.md                # Vercel docs
│       ├── QUICKSTART.md            # Quick start guide
│       ├── scripts/
│       │   ├── build-output.js     # Build Output API v3 generator
│       │   └── deploy.sh           # Deployment script
│       └── config/                  # Additional configs
├── .vercelignore                    # Vercel ignore rules
├── .vercel/                         # Vercel artifacts (git-ignored)
│   └── output/                      # Build Output API v3 structure
│       ├── config.json
│       ├── static/
│       └── config/
└── apps/frontend/                   # React app
```

---

## ��� Quick Start

### Option 1: Vercel CLI (Manual)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project (first time only)
cd deploy/vercel
vercel link

# 4. Deploy preview
./scripts/deploy.sh preview

# 5. Deploy production
./scripts/deploy.sh production
```

### Option 2: GitHub Integration (Automatic)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Import project on Vercel
# - Go to https://vercel.com/new
# - Import your GitHub repository
# - Select "deploy/vercel" as root directory
# - Configure environment variables
# - Deploy!

# Auto deployments:
# - Push to main → Preview deployment
# - Push to production → Production deployment
```

### Option 3: Vercel Dashboard (Web UI)

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Configure:
   - **Root Directory**: `deploy/vercel`
   - **Framework Preset**: Other
   - **Build Command**: (auto-detected from vercel.json)
   - **Output Directory**: `.vercel/output`
4. Add environment variables
5. Deploy!

---

## ���️ Build Output API v3

### Cách Hoạt Động

**Build Output API v3** là chuẩn build của Vercel, cho phép:
- ✅ Custom build logic
- ✅ Static file serving
- ✅ Dynamic routing
- ✅ Edge Functions (optional)
- ✅ Middleware (optional)

### Structure Generated

```
.vercel/output/
├── config.json              # Build metadata
│   {
│     "version": 3,
│     "routes": "config/routes.json"
│   }
├── static/                  # Static files (from dist/)
│   ├── index.html
│   ├── env.js              # Runtime config
│   ├── assets/
│   │   ├── index-abc123.js
│   │   └── index-xyz789.css
│   └── ...
└── config/
    ├── routes.json         # Routing rules
    └── headers.json        # HTTP headers
```

### Build Script

File: `deploy/vercel/scripts/build-output.js`

```javascript
// Automatically generates .vercel/output structure
// Run by Vercel during build process

// Steps:
// 1. Clean .vercel/output/
// 2. Copy dist/ → static/
// 3. Generate env.js with runtime config
// 4. Update index.html to load env.js
// 5. Generate config.json
// 6. Generate routes.json (SPA routing)
// 7. Generate headers.json (security)
```

### Manual Build

```bash
# Build Vite app
npm run build -w @spa-hackathon/frontend

# Generate Build Output API v3 structure
node deploy/vercel/scripts/build-output.js

# Verify output
ls -la .vercel/output/
```

---

## ��� Environment Variables

### Configuration Methods

#### 1. Vercel Dashboard (Recommended)

```
Project → Settings → Environment Variables

Add variables:
┌─────────────────────────────┬──────────────────────────┬───────────────┐
│ Name                        │ Value                    │ Scope         │
├─────────────────────────────┼──────────────────────────┼───────────────┤
│ VITE_API_URL               │ https://api.example.com  │ Production    │
│ VITE_SUPABASE_URL          │ https://xxx.supabase.co  │ All           │
│ VITE_SUPABASE_ANON_KEY     │ eyJhb...                 │ All           │
│ VITE_GOOGLE_MAPS_API_KEY   │ AIza...                  │ All           │
│ VITE_GOOGLE_CLIENT_ID      │ 123-abc.apps.google...   │ All           │
│ VITE_APP_ENV               │ production               │ Production    │
│ VITE_APP_VERSION           │ 1.0.0                    │ All           │
└─────────────────────────────┴──────────────────────────┴───────────────┘
```

**Scopes:**
- **Production** - Used for production deployments
- **Preview** - Used for branch preview deployments
- **Development** - Used for `vercel dev`

#### 2. Vercel CLI

```bash
# Set environment variable
vercel env add VITE_API_URL production

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local
```

#### 3. .env File (Local Development Only)

```bash
# Create .env in project root
cp deploy/vercel/.env.example .env

# Edit with your values
nano .env

# Note: .env is NOT uploaded to Vercel
# Use Vercel Dashboard or CLI for production
```

### Required Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `https://api.spa-hackathon.com` | Backend API base URL |
| `VITE_SUPABASE_URL` | ✅ Yes | `https://xxx.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | `eyJhbGc...` | Supabase anonymous key |
| `VITE_GOOGLE_MAPS_API_KEY` | ⚠️ Optional | `AIza...` | Google Maps API key |
| `VITE_GOOGLE_CLIENT_ID` | ⚠️ Optional | `123-abc.apps...` | Google OAuth Client ID |
| `VITE_APP_ENV` | ⚠️ Optional | `production` | Environment name |
| `VITE_APP_VERSION` | ⚠️ Optional | `1.0.0` | App version |

### Runtime ENV Injection

**How it works:**

1. **Build time**: `build-output.js` reads `process.env.*` và generates `env.js`
2. **Runtime**: Browser loads `env.js` → populates `window.ENV`
3. **App code**: Access via `window.ENV.VITE_*`

**Example:**

```typescript
// src/config/env.ts
export const config = {
  apiUrl: window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL,
  supabaseUrl: window.ENV?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
  // ... other configs
};
```

**Benefits:**
- ✅ No rebuild needed for ENV changes
- ✅ Different configs per deployment (preview vs production)
- ✅ Easy rollback without rebuilding

---

## ��� Deployment Options

### 1. Preview Deployment

**Auto** (GitHub integration):
```bash
# Push to any branch
git push origin feature/new-feature

# Vercel automatically creates preview deployment
# URL: https://spa-hackathon-<branch>-<hash>.vercel.app
```

**Manual**:
```bash
cd deploy/vercel
./scripts/deploy.sh preview

# Or with Vercel CLI
vercel deploy
```

**Use cases:**
- Feature testing
- PR previews
- Stakeholder reviews

### 2. Production Deployment

**Auto** (GitHub integration):
```bash
# Push to production branch
git push origin production

# Or merge to main and promote
git checkout main
git merge feature/new-feature
git push origin main

# Then promote via Vercel Dashboard
```

**Manual**:
```bash
cd deploy/vercel
./scripts/deploy.sh production

# Or with Vercel CLI
vercel deploy --prod
```

### 3. Rollback

**Via Dashboard:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Via CLI:**
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url> --scope=<team>
```

**Instant rollback** - No rebuild needed!

---

## ⚡ Performance Optimization

### 1. Caching Strategy

Implemented in `config/routes.json`:

```javascript
{
  // Static assets - immutable cache (1 year)
  "/assets/*": {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  },
  
  // Fonts - long cache
  "*.woff2": {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  },
  
  // Images - long cache
  "*.{jpg,png,svg}": {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  },
  
  // Service worker - short cache
  "/sw.js": {
    headers: {
      "Cache-Control": "public, max-age=3600"
    }
  },
  
  // index.html & env.js - no cache
  "/index.html": {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate"
    }
  }
}
```

### 2. Compression

Vercel automatically applies:
- ✅ **Gzip** - For all text files
- ✅ **Brotli** - For supported browsers (better compression)

**Savings:** ~70% reduction in bundle size

### 3. HTTP/2 & HTTP/3

Vercel enables:
- ✅ **HTTP/2** - Multiplexing, header compression
- ✅ **HTTP/3** (QUIC) - Faster connection, better mobile performance

### 4. Edge Network

- ✅ **100+ edge locations** worldwide
- ✅ **Automatic geo-routing** to nearest edge
- ✅ **Smart CDN** with intelligent caching

### 5. Bundle Optimization

Vite build optimizations:
- Code splitting (per-route)
- Tree shaking
- Minification
- Source map generation (production)

---

## ��� Troubleshooting

### Build Errors

```bash
# Check build logs
vercel logs <deployment-url>

# Local build test
npm run build -w @spa-hackathon/frontend
node deploy/vercel/scripts/build-output.js

# Verify output structure
ls -R .vercel/output/
```

### Environment Variables Not Working

```bash
# Check if variables are set
vercel env ls

# Pull to local
vercel env pull .env.local

# Verify in build logs
# ENV vars should appear in build output
```

### 404 Errors on Routes

Check `routes.json`:
```json
{
  "src": "/(.*)",
  "dest": "/index.html"  // SPA fallback
}
```

### Deployment Failed

```bash
# Check Vercel status
https://www.vercel-status.com/

# Re-deploy
vercel deploy --force

# Check project settings
vercel project ls
```

---

## ��� Best Practices

### 1. Environment Management

- ✅ Use Vercel Dashboard for production secrets
- ✅ Different values per environment (preview vs prod)
- ✅ Never commit secrets to git
- ✅ Use `.env.example` for documentation

### 2. Deployment Strategy

- ✅ Test in preview before production
- ✅ Use PR previews for code review
- ✅ Enable "Preview Deployment Protection" for private repos
- ✅ Set up deployment notifications (Slack, Discord)

### 3. Performance

- ✅ Enable Vercel Analytics
- ✅ Use Lighthouse CI for performance monitoring
- ✅ Monitor Core Web Vitals
- ✅ Optimize images (next/image equivalent)

### 4. Security

- ✅ Security headers in `headers.json`
- ✅ Use environment variables for secrets
- ✅ Enable "Password Protection" for preview deployments
- ✅ Set up custom domains with SSL

### 5. Monitoring

- ✅ Enable Vercel Analytics
- ✅ Set up error tracking (Sentry)
- ✅ Monitor deployment logs
- ✅ Set up uptime monitoring

---

## ��� Comparison: Docker vs Vercel

| Feature | Docker | Vercel |
|---------|--------|--------|
| **Setup Complexity** | Medium | Easy |
| **Build Time** | ~3min | ~2min |
| **Deploy Time** | ~30s (blue-green) | ~10s (instant) |
| **Global CDN** | Manual setup | Built-in (100+ edges) |
| **SSL/TLS** | Manual (Let's Encrypt) | Automatic |
| **Scaling** | Manual | Automatic |
| **Cost** | VPS cost | Free tier → $20/mo |
| **Preview Deployments** | Manual | Automatic |
| **Rollback** | Script-based | One-click |
| **HTTP/3 Support** | Manual nginx config | Automatic |
| **Best For** | Self-hosted, full control | Fast deployment, global scale |

**When to use Docker:**
- Need full server control
- Custom backend integration
- Private cloud/on-premise
- Cost optimization for high traffic

**When to use Vercel:**
- Fast deployment & iteration
- Global edge network needed
- Team collaboration (preview URLs)
- Automatic scaling required

---

## ��� Tài Liệu Liên Quan

- [Vercel Documentation](https://vercel.com/docs)
- [Build Output API v3](https://vercel.com/docs/build-output-api/v3)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Docker Deployment Guide](./DEPLOYMENT_DOCKER.md)
- [ENV Configuration](./ENV.md)

---

## ��� Support

**Issues?**
1. Check [Troubleshooting](#-troubleshooting)
2. View build logs: `vercel logs`
3. Verify env.js: `https://your-app.vercel.app/env.js`
4. Open issue on GitHub

---

**Built with ❤️ by 2003 Hackathon Team**
