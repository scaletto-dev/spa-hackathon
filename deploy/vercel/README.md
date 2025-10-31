# ⚡ Vercel Deployment

Deploy **Beauty Clinic Care Website** to Vercel with Build Output API v3 and runtime environment injection.

---

## ��� Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
./scripts/deploy.sh preview

# Deploy production
./scripts/deploy.sh production
```

---

## ��� Structure

```
deploy/vercel/
├── vercel.json                # Vercel configuration
├── .env.example               # Environment variables template
├── README.md                  # This file
├── QUICKSTART.md              # 5-minute guide
├── scripts/
│   ├── build-output.js       # Build Output API v3 generator
│   └── deploy.sh             # Deployment script
└── config/                    # Additional configs
```

---

## ✨ Features

- ✅ **Build Output API v3** - Native Vercel build system
- ✅ **Runtime ENV injection** - No rebuild for config changes
- ✅ **SPA routing** - Automatic fallback to index.html
- ✅ **Smart caching** - Immutable cache for assets
- ✅ **Security headers** - XSS, CSP, frame protection
- ✅ **Global CDN** - 100+ edge locations
- ✅ **Zero config SSL** - Automatic HTTPS
- ✅ **Preview deployments** - Per-branch previews
- ✅ **Instant rollback** - One-click rollback

---

## ��� Commands

### Deployment

```bash
# Build only (test locally)
./scripts/deploy.sh build

# Deploy preview
./scripts/deploy.sh preview

# Deploy production
./scripts/deploy.sh production
```

### Vercel CLI

```bash
# Link project (first time)
vercel link

# Deploy preview
vercel deploy

# Deploy production
vercel deploy --prod

# View logs
vercel logs <deployment-url>

# List deployments
vercel ls

# Environment variables
vercel env ls
vercel env add VITE_API_URL production
vercel env pull .env.local
```

---

## ��� Environment Variables

Configure in **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

**Required:**

- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Optional:**

- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_APP_ENV` - Environment name
- `VITE_APP_VERSION` - App version

---

## ���️ Build Output API v3

### How It Works

```
Vite Build → dist/
     ↓
build-output.js
     ↓
.vercel/output/
  ├── config.json
  ├── static/         (from dist/)
  │   ├── index.html
  │   ├── env.js      (runtime config)
  │   └── assets/
  └── config/
      ├── routes.json (SPA routing)
      └── headers.json (security)
```

### Manual Build

```bash
# Build Vite app
npm run build -w @spa-hackathon/frontend

# Generate Vercel output
node scripts/build-output.js

# Verify
ls -R ../../.vercel/output/
```

---

## ��� Documentation

- **[Complete Guide](../../docs/DEPLOYMENT_VERCEL.md)** - Full deployment documentation
- **[Quick Start](./QUICKSTART.md)** - 5-minute deployment guide
- **[Docker Deployment](../docker/)** - Alternative deployment method

---

## ��� Docker vs Vercel

| Feature     | Docker      | Vercel       |
| ----------- | ----------- | ------------ |
| Setup       | Medium      | Easy         |
| Deploy Time | ~30s        | ~10s         |
| Global CDN  | Manual      | Built-in     |
| SSL         | Manual      | Automatic    |
| Scaling     | Manual      | Automatic    |
| Best For    | Self-hosted | Global scale |

---

## ��� Support

See [docs/04-DEPLOYMENT-DOCS/DEPLOYMENT_VERCEL.md](../../docs/DEPLOYMENT_VERCEL.md) for complete documentation.
