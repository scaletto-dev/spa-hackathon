# ��� Environment Variables Guide

Hướng dẫn cấu hình environment variables cho dự án **Beauty Clinic Care Website** trong Docker deployment.

---

## ��� Overview

Dự án sử dụng **runtime environment injection** để:
- ✅ Không cần rebuild image khi thay đổi config
- ✅ Dễ dàng deploy trên nhiều môi trường (dev, staging, prod)
- ✅ Bảo mật secrets (không hardcode trong code)

---

## ���️ Architecture

```
Container Start
      │
      ▼
┌─────────────────────┐
│  inject-env.sh      │  ← Read ENV vars từ container
│  (entrypoint)       │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│  Generate env.js    │  ← Generate window.ENV object
│  /usr/share/nginx/  │
│  html/env.js        │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│  index.html loads   │  ← SPA loads env.js
│  <script src=       │
│  "/env.js"></script>│
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│  React App accesses │  ← Use window.ENV.VITE_*
│  window.ENV.*       │
└─────────────────────┘
```

---

## ��� Environment Variables

### Frontend Variables

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `VITE_API_URL` | string | ✅ Yes | `http://localhost:3000` | Backend API base URL |
| `VITE_SUPABASE_URL` | string | ✅ Yes | - | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | string | ✅ Yes | - | Supabase anonymous key |
| `VITE_GOOGLE_MAPS_API_KEY` | string | ⚠️ Optional | - | Google Maps API key |
| `VITE_GOOGLE_CLIENT_ID` | string | ⚠️ Optional | - | Google OAuth Client ID |
| `VITE_APP_ENV` | string | ⚠️ Optional | `production` | Environment name |
| `VITE_APP_VERSION` | string | ⚠️ Optional | `1.0.0` | Application version |

---

## ��� Configuration Files

### 1. `.env` (Root Directory)

Dùng cho **local development** (Vite dev server):

```env
# Backend API
VITE_API_URL=http://localhost:3000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Services
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# App Config
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

### 2. `deploy/docker/.env` (Docker Deployment)

Dùng cho **Docker deployment** (runtime injection):

```env
# Frontend
VITE_API_URL=https://api.spa-hackathon.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### 3. GitHub Secrets (CI/CD)

Cấu hình trong **GitHub Repository Settings → Secrets**:

```
# Staging Environment
STAGING_HOST=staging.spa-hackathon.com
STAGING_USER=deploy
STAGING_SSH_KEY=<SSH private key>
STAGING_API_URL=https://api-staging.spa-hackathon.com

# Production Environment
PRODUCTION_HOST=spa-hackathon.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<SSH private key>
PRODUCTION_API_URL=https://api.spa-hackathon.com

# Shared Secrets
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_GOOGLE_MAPS_API_KEY=<google maps key>
VITE_GOOGLE_CLIENT_ID=<google client id>

# Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

## ��� Usage

### Local Development (Vite)

```bash
# 1. Create .env file
cp .env.example .env

# 2. Update values
nano .env

# 3. Run dev server
npm run dev
```

Vite sẽ tự động load `.env` và inject vào `import.meta.env.VITE_*`

### Docker Development

```bash
# 1. Create .env file in deploy/docker/
cd deploy/docker
cp .env.example .env

# 2. Update values
nano .env

# 3. Run with Docker Compose
docker compose up -d

# 4. Verify env.js was generated
curl http://localhost:8080/env.js
```

### Docker Production

```bash
# 1. Run with inline environment variables
docker run -d \
  --name spa-frontend \
  -p 8080:8080 \
  -e VITE_API_URL=https://api.spa-hackathon.com \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  spa-hackathon-frontend:latest

# 2. Or with .env file
docker run -d \
  --name spa-frontend \
  -p 8080:8080 \
  --env-file .env \
  spa-hackathon-frontend:latest

# 3. Verify env.js
docker exec spa-frontend cat /usr/share/nginx/html/env.js
```

---

## ��� Runtime ENV Injection

### How It Works

**Script:** `deploy/docker/scripts/inject-env.sh`

```bash
#!/bin/sh
# Runs at container startup (Docker entrypoint)

cat > /usr/share/nginx/html/env.js << ENVJS
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:3000}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-}",
  // ... other variables
};
ENVJS
```

**Generated:** `/usr/share/nginx/html/env.js`

```javascript
window.ENV = {
  VITE_API_URL: "https://api.spa-hackathon.com",
  VITE_SUPABASE_URL: "https://your-project.supabase.co",
  VITE_SUPABASE_ANON_KEY: "your-anon-key",
  VITE_GOOGLE_MAPS_API_KEY: "your-google-maps-key",
  VITE_GOOGLE_CLIENT_ID: "your-google-client-id",
  VITE_APP_ENV: "production",
  VITE_APP_VERSION: "1.0.0",
};
```

### Access in React Code

```typescript
// src/config/env.ts
export const config = {
  apiUrl: window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL,
  supabaseUrl: window.ENV?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: window.ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  googleMapsApiKey: window.ENV?.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  googleClientId: window.ENV?.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID,
  appEnv: window.ENV?.VITE_APP_ENV || import.meta.env.VITE_APP_ENV || 'development',
  appVersion: window.ENV?.VITE_APP_VERSION || import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// Usage
import { config } from '@/config/env';

const apiClient = axios.create({
  baseURL: config.apiUrl,
});
```

### TypeScript Types

```typescript
// src/types/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// For runtime env.js
interface Window {
  ENV?: ImportMetaEnv;
}
```

---

## ��� Environment-Specific Configs

### Development

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key
VITE_APP_ENV=development
VITE_APP_VERSION=dev
```

**Features:**
- ✅ Detailed error messages
- ✅ Source maps enabled
- ✅ Hot reload
- ✅ Debug logging

### Staging

```env
VITE_API_URL=https://api-staging.spa-hackathon.com
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_APP_ENV=staging
VITE_APP_VERSION=1.0.0-rc.1
```

**Features:**
- ✅ Production-like environment
- ✅ Test data only
- ✅ Limited error details
- ⚠️ Some debug logging

### Production

```env
VITE_API_URL=https://api.spa-hackathon.com
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

**Features:**
- ✅ Optimized build
- ✅ Error tracking (Sentry)
- ✅ Analytics enabled
- ❌ No debug logging
- ❌ No source maps

---

## ��� Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore
.env
.env.local
.env.*.local
deploy/docker/.env
```

### 2. Use Different Keys per Environment

```
dev-project.supabase.co     → dev-anon-key
staging-project.supabase.co → staging-anon-key
prod-project.supabase.co    → prod-anon-key
```

### 3. Rotate Secrets Regularly

- Update Supabase keys quarterly
- Rotate API keys every 6 months
- Change SSH keys yearly

### 4. Limit Secret Access

- Only DevOps team có access production secrets
- Use GitHub Environments với approval gates
- Enable 2FA cho GitHub account

### 5. Encrypt Secrets at Rest

```bash
# Use SOPS or git-crypt
sops --encrypt .env > .env.encrypted

# Decrypt when needed
sops --decrypt .env.encrypted > .env
```

---

## ��� Testing

### Verify ENV in Container

```bash
# Check if env.js exists
docker exec spa-frontend ls -la /usr/share/nginx/html/env.js

# View env.js content
docker exec spa-frontend cat /usr/share/nginx/html/env.js

# Check environment variables
docker exec spa-frontend env | grep VITE_

# Test via HTTP
curl http://localhost:8080/env.js
```

### Verify ENV in Browser

```javascript
// Open DevTools Console
console.log(window.ENV);

// Check specific variable
console.log(window.ENV.VITE_API_URL);
```

### Verify ENV in React

```typescript
// src/components/EnvDebug.tsx
export const EnvDebug = () => {
  return (
    <div>
      <h3>Environment Variables</h3>
      <pre>{JSON.stringify(window.ENV, null, 2)}</pre>
    </div>
  );
};
```

---

## ��� Troubleshooting

### ENV variables không load

```bash
# 1. Check if inject-env.sh executed
docker logs spa-frontend | grep "Generating runtime env.js"

# 2. Check if env.js exists
curl http://localhost:8080/env.js

# 3. Restart container
docker restart spa-frontend
```

### Wrong values trong env.js

```bash
# 1. Verify environment variables passed to container
docker inspect spa-frontend | grep -A 20 "Env"

# 2. Check .env file
cat deploy/docker/.env

# 3. Rebuild và restart
docker compose down
docker compose up -d --build
```

### window.ENV is undefined

```html
<!-- index.html - Make sure env.js loaded before app -->
<script src="/env.js"></script>
<script type="module" src="/src/main.tsx"></script>
```

---

## ��� References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Supabase Configuration](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

---

**Built with ❤️ by 2003 Hackathon Team**
