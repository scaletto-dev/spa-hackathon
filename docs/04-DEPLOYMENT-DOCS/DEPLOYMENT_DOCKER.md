# ��� Docker Deployment Guide

Hướng dẫn triển khai dự án **Beauty Clinic Care Website** với Docker, bao gồm multi-stage build, Nginx optimization, blue-green deployment, và CI/CD.

---

## ��� Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Yêu Cầu](#-yêu-cầu)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Quick Start](#-quick-start)
- [Build Docker Image](#-build-docker-image)
- [Chạy Container](#-chạy-container)
- [Docker Compose](#-docker-compose)
- [Blue-Green Deployment](#-blue-green-deployment)
- [CI/CD với GitHub Actions](#-cicd-với-github-actions)
- [Monitoring & Logs](#-monitoring--logs)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)

---

## ��� Tổng Quan

### Kiến Trúc Docker

```
┌─────────────────────────────────────────────┐
│         Multi-Stage Build                    │
│  ┌──────────────┐    ┌──────────────┐       │
│  │   Builder    │───▶│   Runtime    │       │
│  │  Node 20     │    │  Nginx 1.27  │       │
│  │  pnpm build  │    │  Static SPA  │       │
│  └──────────────┘    └──────────────┘       │
└─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│       Blue-Green Deployment                  │
│  ┌──────────┐        ┌──────────┐          │
│  │  Blue    │◀──────▶│  Green   │          │
│  │  :8081   │        │  :8082   │          │
│  └──────────┘        └──────────┘          │
│         │                  │                 │
│         └──────┬───────────┘                │
│                ▼                             │
│         Load Balancer                        │
│            :8080                             │
└─────────────────────────────────────────────┘
```

### Tính Năng Chính

✅ **Multi-stage build** - Image nhỏ gọn (~50MB)  
✅ **Runtime ENV injection** - Không cần rebuild khi đổi config  
✅ **Nginx optimization** - Gzip, caching, security headers  
✅ **Non-root user** - Chạy với nginx-user (UID 1001)  
✅ **Health check** - `/healthz` endpoint  
✅ **Blue-green deployment** - Zero-downtime  
✅ **CI/CD ready** - GitHub Actions workflow  
✅ **Multi-arch support** - linux/amd64, linux/arm64

---

## ��� Yêu Cầu

### Môi Trường Phát Triển

- **Docker**: 20.10+ hoặc Docker Desktop
- **Docker Compose**: 2.0+
- **Node.js**: 20+ (chỉ cho dev local)
- **pnpm**: 9+ (chỉ cho dev local)

### Môi Trường Production

- **Docker**: 20.10+
- **Server**: Ubuntu 20.04+, Debian 11+, hoặc RHEL 8+
- **RAM**: ≥ 2GB
- **Disk**: ≥ 10GB free
- **Network**: Port 8080 (frontend), 3000 (backend)

---

## ��� Cấu Trúc Thư Mục

```
spa-hackathon/
├── deploy/
│   └── docker/
│       ├── Dockerfile.frontend          # Multi-stage Dockerfile
│       ├── docker-compose.yml           # Local development
│       ├── nginx/
│       │   ├── nginx.conf              # Main nginx config
│       │   └── default.conf            # Server block config
│       ├── scripts/
│       │   ├── inject-env.sh           # Runtime ENV injection
│       │   └── blue-green-deploy.sh    # Zero-downtime deployment
│       └── config/                     # Additional configs
├── .dockerignore                        # Docker ignore rules
├── .github/
│   └── workflows/
│       └── docker-deploy.yml           # CI/CD workflow
└── docs/
    ├── DEPLOYMENT_DOCKER.md            # This file
    └── ENV.md                          # Environment variables guide
```

---

## ��� Quick Start

### 1. Build Image

```bash
cd spa-hackathon

# Build frontend image
docker build \
  -f deploy/docker/Dockerfile.frontend \
  -t spa-hackathon-frontend:latest \
  .
```

### 2. Run Container

```bash
# Chạy với environment variables
docker run -d \
  --name spa-frontend \
  -p 8080:8080 \
  -e VITE_API_URL=http://localhost:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  spa-hackathon-frontend:latest
```

### 3. Verify

```bash
# Health check
curl http://localhost:8080/healthz

# Access application
open http://localhost:8080
```

---

## ���️ Build Docker Image

### Build với Docker CLI

```bash
# Build production image
docker build \
  -f deploy/docker/Dockerfile.frontend \
  -t spa-hackathon-frontend:1.0.0 \
  --build-arg NODE_ENV=production \
  .

# Build với cache từ registry
docker build \
  -f deploy/docker/Dockerfile.frontend \
  -t spa-hackathon-frontend:1.0.0 \
  --cache-from ghcr.io/your-org/spa-hackathon-frontend:latest \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  .

# Multi-arch build (ARM64 + AMD64)
docker buildx build \
  -f deploy/docker/Dockerfile.frontend \
  -t spa-hackathon-frontend:1.0.0 \
  --platform linux/amd64,linux/arm64 \
  --push \
  .
```

### Build với Docker Compose

```bash
cd deploy/docker

# Build tất cả services
docker compose build

# Build chỉ frontend
docker compose build frontend

# Build với no-cache
docker compose build --no-cache
```

### Kiểm Tra Image

```bash
# List images
docker images | grep spa-hackathon

# Inspect image
docker inspect spa-hackathon-frontend:latest

# Check image size
docker images spa-hackathon-frontend:latest --format "{{.Size}}"

# Scan vulnerabilities (nếu có Docker Scout)
docker scout cves spa-hackathon-frontend:latest
```

---

## ��� Chạy Container

### Development Mode

```bash
# Chạy với .env file
docker run -d \
  --name spa-frontend-dev \
  -p 8080:8080 \
  --env-file .env \
  spa-hackathon-frontend:latest

# Chạy với volume mount (hot reload)
docker run -d \
  --name spa-frontend-dev \
  -p 8080:8080 \
  -v $(pwd)/apps/frontend/dist:/usr/share/nginx/html:ro \
  spa-hackathon-frontend:latest
```

### Production Mode

```bash
# Chạy production container
docker run -d \
  --name spa-frontend-prod \
  --restart unless-stopped \
  -p 8080:8080 \
  -e VITE_API_URL=https://api.spa-hackathon.com \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  -e VITE_APP_ENV=production \
  --memory 512m \
  --cpus 1.0 \
  --health-cmd="curl -f http://localhost:8080/healthz || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  spa-hackathon-frontend:latest
```

### Container Management

```bash
# Xem logs
docker logs -f spa-frontend

# Exec vào container
docker exec -it spa-frontend sh

# Stop container
docker stop spa-frontend

# Restart container
docker restart spa-frontend

# Remove container
docker rm -f spa-frontend
```

---

## ��� Docker Compose

### Chạy Full Stack

```bash
cd deploy/docker

# Start all services
docker compose up -d

# Start with build
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop và remove volumes
docker compose down -v
```

### Docker Compose Commands

```bash
# Scale frontend
docker compose up -d --scale frontend=3

# Restart specific service
docker compose restart frontend

# View service status
docker compose ps

# Execute command in service
docker compose exec frontend sh
```

### Environment Variables

Tạo file `.env` trong `deploy/docker/`:

```env
# Frontend
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-api-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

---

## ��� Blue-Green Deployment

### Cách Hoạt Động

Blue-Green deployment cho phép deploy version mới **không downtime**:

1. **Build** image mới
2. **Deploy** vào inactive environment (green)
3. **Health check** green environment
4. **Switch traffic** từ blue → green
5. **Cleanup** old blue environment

### Sử Dụng Script

```bash
cd deploy/docker

# Deploy new version (blue-green)
./scripts/blue-green-deploy.sh deploy

# Check status
./scripts/blue-green-deploy.sh status

# Rollback to previous version
./scripts/blue-green-deploy.sh rollback
```

### Manual Blue-Green

```bash
# Step 1: Build new image
docker build -f deploy/docker/Dockerfile.frontend -t spa-frontend:v2 .

# Step 2: Deploy to green (inactive)
docker run -d --name spa-frontend-green -p 8082:8080 spa-frontend:v2

# Step 3: Health check
curl -f http://localhost:8082/healthz

# Step 4: Switch traffic (update load balancer/nginx)
# Update upstream to port 8082

# Step 5: Stop old blue container
docker stop spa-frontend-blue
docker rm spa-frontend-blue
```

---

## ��� CI/CD với GitHub Actions

### Workflow Overview

File: `.github/workflows/docker-deploy.yml`

**Jobs:**
1. **Build** - Build và push image to registry
2. **Test** - Run container tests
3. **Deploy (Staging)** - Auto deploy to staging on `main` branch
4. **Deploy (Production)** - Auto deploy to production on `production` branch
5. **Rollback** - Manual rollback via workflow_dispatch

### GitHub Secrets Setup

Cấu hình secrets trong repository settings:

```
STAGING_HOST=staging.spa-hackathon.com
STAGING_USER=deploy
STAGING_SSH_KEY=<SSH private key>
STAGING_PORT=22
STAGING_API_URL=https://api-staging.spa-hackathon.com

PRODUCTION_HOST=spa-hackathon.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<SSH private key>
PRODUCTION_PORT=22
PRODUCTION_API_URL=https://api.spa-hackathon.com

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>

SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Trigger Deployment

```bash
# Auto deploy khi push to main
git push origin main

# Auto deploy khi push to production
git push origin production

# Manual deploy via GitHub UI
# Actions → Docker Build & Deploy → Run workflow
```

### Rollback via GitHub Actions

```bash
# 1. Go to GitHub Actions
# 2. Select "Docker Build & Deploy"
# 3. Click "Run workflow"
# 4. Select "rollback" action
```

---

## ��� Monitoring & Logs

### Health Check

```bash
# Container health
docker inspect spa-frontend --format='{{.State.Health.Status}}'

# HTTP health check
curl -f http://localhost:8080/healthz
```

### Logs

```bash
# View logs
docker logs spa-frontend

# Follow logs
docker logs -f spa-frontend

# Tail last 100 lines
docker logs --tail 100 spa-frontend

# Show timestamps
docker logs -t spa-frontend

# Export logs
docker logs spa-frontend > frontend.log 2>&1
```

### Container Metrics

```bash
# Real-time stats
docker stats spa-frontend

# Memory usage
docker stats --no-stream --format "{{.MemUsage}}" spa-frontend

# CPU usage
docker stats --no-stream --format "{{.CPUPerc}}" spa-frontend
```

### Nginx Access Logs

```bash
# View access logs inside container
docker exec spa-frontend cat /var/log/nginx/access.log

# View error logs
docker exec spa-frontend cat /var/log/nginx/error.log

# Follow logs
docker exec spa-frontend tail -f /var/log/nginx/access.log
```

---

## ��� Troubleshooting

### Container không start

```bash
# Check logs
docker logs spa-frontend

# Check if port đã được sử dụng
netstat -tuln | grep 8080

# Remove old container
docker rm -f spa-frontend
```

### Health check fail

```bash
# Test health endpoint manually
curl -v http://localhost:8080/healthz

# Check nginx config
docker exec spa-frontend nginx -t

# View nginx error logs
docker exec spa-frontend cat /var/log/nginx/error.log
```

### Runtime ENV không work

```bash
# Check if env.js được generate
docker exec spa-frontend cat /usr/share/nginx/html/env.js

# Verify environment variables
docker exec spa-frontend env | grep VITE_

# Restart container với đúng ENV
docker restart spa-frontend
```

### Build errors

```bash
# Clear build cache
docker builder prune -f

# Build with no cache
docker build --no-cache -f deploy/docker/Dockerfile.frontend .

# Check .dockerignore
cat .dockerignore
```

### Permission errors

```bash
# Check file ownership
docker exec spa-frontend ls -la /usr/share/nginx/html

# Fix ownership (nếu cần)
docker exec -u root spa-frontend chown -R nginx-user:nginx-user /usr/share/nginx/html
```

---

## ��� Best Practices

### 1. Image Optimization

- ✅ Sử dụng multi-stage build
- ✅ Layer caching hiệu quả (copy package.json trước)
- ✅ Minimize image size (Alpine base image)
- ✅ Remove dev dependencies

### 2. Security

- ✅ Run as non-root user (nginx-user)
- ✅ Scan vulnerabilities với Docker Scout
- ✅ Use specific image versions (nginx:1.27-alpine)
- ✅ Không hardcode secrets trong Dockerfile
- ✅ Security headers trong Nginx

### 3. Performance

- ✅ Gzip compression cho text files
- ✅ Immutable caching cho static assets
- ✅ No cache cho index.html
- ✅ HTTP/2 support (nếu có SSL)

### 4. Monitoring

- ✅ Health check endpoint
- ✅ Structured logging
- ✅ Container metrics collection
- ✅ Alerting cho failures

### 5. Deployment

- ✅ Blue-green deployment cho zero downtime
- ✅ Automated testing trước khi deploy
- ✅ Rollback strategy
- ✅ Version tagging

---

## ��� Tài Liệu Liên Quan

- [Environment Variables Guide](./ENV.md)
- [Nginx Configuration](../deploy/docker/nginx/)
- [GitHub Actions Workflow](../.github/workflows/docker-deploy.yml)
- [Docker Compose](../deploy/docker/docker-compose.yml)

---

## ��� Support

Nếu gặp vấn đề, vui lòng:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review container logs: `docker logs spa-frontend`
3. Check health endpoint: `curl http://localhost:8080/healthz`
4. Open issue trên GitHub repository

---

**Built with ❤️ by 2003 Hackathon Team**
