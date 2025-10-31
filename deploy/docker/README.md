# Docker Deployment

Complete Docker deployment setup cho **Beauty Clinic Care Website** với production-ready configuration.

---

## ��� Quick Start

```bash
# 1. Setup environment variables
cp .env.example .env
nano .env

# 2. Build and run
docker compose up -d

# 3. Verify
curl http://localhost:8080/healthz
```

---

## ��� Cấu Trúc

```
deploy/docker/
├── Dockerfile.frontend          # Multi-stage build cho frontend
├── docker-compose.yml           # Docker Compose configuration
├── .env.example                 # Environment variables template
├── nginx/
│   ├── nginx.conf              # Main nginx config
│   └── default.conf            # Server block config
├── scripts/
│   ├── inject-env.sh           # Runtime ENV injection
│   └── blue-green-deploy.sh    # Zero-downtime deployment
├── config/                     # Additional configs
└── README.md                   # This file
```

---

## ��� Commands

### Build

```bash
# Build frontend image
docker build -f Dockerfile.frontend -t spa-frontend:latest ../..

# Build với Docker Compose
docker compose build
```

### Run

```bash
# Start all services
docker compose up -d

# Start with logs
docker compose up

# Stop services
docker compose down
```

### Blue-Green Deployment

```bash
# Deploy new version
./scripts/blue-green-deploy.sh deploy

# Check status
./scripts/blue-green-deploy.sh status

# Rollback
./scripts/blue-green-deploy.sh rollback
```

### Maintenance

```bash
# View logs
docker compose logs -f

# Restart service
docker compose restart frontend

# Update and redeploy
git pull
docker compose up -d --build
```

---

## ��� Documentation

- **[Complete Deployment Guide](../../docs/DEPLOYMENT_DOCKER.md)** - Full instructions
- **[Environment Variables](../../docs/ENV.md)** - ENV configuration guide
- **[GitHub Actions Workflow](../../.github/workflows/docker-deploy.yml)** - CI/CD setup

---

## ✨ Features

- ✅ Multi-stage build (Builder + Runtime)
- ✅ Optimized Nginx configuration
- ✅ Gzip compression + Security headers
- ✅ Runtime environment injection
- ✅ Health check endpoint
- ✅ Blue-green deployment
- ✅ Non-root user (security)
- ✅ CI/CD ready

---

## ��� Support

Xem [docs/DEPLOYMENT_DOCKER.md](../../docs/DEPLOYMENT_DOCKER.md) để có hướng dẫn chi tiết.
