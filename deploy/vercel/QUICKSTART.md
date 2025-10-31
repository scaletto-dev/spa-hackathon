# ⚡ Vercel Quick Start

**5-minute guide** để deploy Beauty Clinic Care Website lên Vercel.

---

## ��� Prerequisites

```bash
# Check Node.js installed
node --version  # Should be 20+

# Install Vercel CLI (if not already)
npm install -g vercel
```

---

## ��� Option 1: Vercel CLI (Fastest)

```bash
cd deploy/vercel

# 1. Login to Vercel
vercel login

# 2. Link project (first time only)
vercel link
# Follow prompts:
# - Link to existing project or create new
# - Project name: spa-hackathon-frontend
# - Root directory: deploy/vercel

# 3. Deploy preview
./scripts/deploy.sh preview

# 4. Deploy production (when ready)
./scripts/deploy.sh production
```

**Done!** ⚡ Your app is live at `https://your-project.vercel.app`

---

## ��� Option 2: GitHub Integration (Recommended)

### Setup (One-time)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repo: `scaletto-dev/spa-hackathon`
   - Configure:
     - **Root Directory**: `deploy/vercel` ✨
     - **Framework Preset**: Other
     - Build Command: (auto-detected)
     - Output Directory: `.vercel/output`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://api.spa-hackathon.com
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GOOGLE_MAPS_API_KEY=your-api-key (optional)
   VITE_GOOGLE_CLIENT_ID=your-client-id (optional)
   VITE_APP_ENV=production
   VITE_APP_VERSION=1.0.0
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait ~2 minutes
   - ✅ Your app is live!

### Auto Deployments

```bash
# Push to any branch → Preview deployment
git push origin feature/new-feature

# Push to main → Production deployment  
git push origin main
```

**Every commit** gets a unique preview URL! ���

---

## ��� Environment Variables Setup

### Via Vercel Dashboard

1. Go to **Project** → **Settings** → **Environment Variables**
2. Add required variables:
   ```
   VITE_API_URL → Production, Preview, Development
   VITE_SUPABASE_URL → All environments
   VITE_SUPABASE_ANON_KEY → All environments
   ```
3. Save and redeploy

### Via Vercel CLI

```bash
# Add variable
vercel env add VITE_API_URL production
# Enter value when prompted

# List variables
vercel env ls

# Pull to local (for development)
vercel env pull .env.local
```

---

## ��� Common Commands

```bash
# Deploy preview
vercel deploy

# Deploy production
vercel deploy --prod

# View deployments
vercel ls

# View logs
vercel logs <deployment-url>

# Check project info
vercel project ls

# Pull environment variables
vercel env pull
```

---

## ✅ Verify Deployment

```bash
# Check if deployment is live
curl https://your-project.vercel.app/healthz

# Check runtime env.js
curl https://your-project.vercel.app/env.js

# Open in browser
open https://your-project.vercel.app
```

---

## �� Troubleshooting

### Build Failed

```bash
# Check build logs
vercel logs <deployment-url>

# Test build locally
cd ../..
npm run build -w @spa-hackathon/frontend
node deploy/vercel/scripts/build-output.js
```

### Environment Variables Not Working

```bash
# Verify variables are set
vercel env ls

# Check scope (Production vs Preview vs Development)
# Redeploy after adding variables
vercel deploy --force
```

### 404 on Routes

Check `vercel.json` has correct routing:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## ��� Next Steps

### Enable Analytics

1. Go to **Project** → **Analytics**
2. Enable "Vercel Analytics"
3. View real-time traffic and Core Web Vitals

### Custom Domain

1. Go to **Project** → **Settings** → **Domains**
2. Add your domain: `spa-hackathon.com`
3. Update DNS records (provided by Vercel)
4. Wait for SSL provisioning (~5 min)
5. ✅ Live at your domain!

### Preview Deployment Protection

1. Go to **Project** → **Settings** → **General**
2. Enable "Password Protection" for previews
3. Set password
4. Share preview URLs securely

### Deployment Notifications

1. Go to **Project** → **Settings** → **Notifications**
2. Add webhook for Slack/Discord
3. Get notified on every deployment

---

## ��� Resources

- ��� [Full Deployment Guide](../../docs/DEPLOYMENT_VERCEL.md)
- ��� [Vercel Documentation](https://vercel.com/docs)
- ��� [Build Output API v3](https://vercel.com/docs/build-output-api/v3)
- ��� [Docker Alternative](../docker/)

---

## ��� Tips

### Faster Deployments

- ✅ Use build cache (automatic)
- ✅ Optimize bundle size with Vite
- ✅ Enable edge caching

### Better Performance

- ✅ Enable Vercel Analytics
- ✅ Use image optimization
- ✅ Monitor Core Web Vitals
- ✅ Set up proper caching headers

### Team Collaboration

- ✅ Use preview deployments for PRs
- ✅ Enable deployment protection
- ✅ Set up notifications
- ✅ Use deployment comments on GitHub

---

**��� You're all set! Deploy with confidence!**

Built with ❤️ by 2003 Hackathon Team
