# ⚡ Docker Quick Start

**5-minute guide** để deploy Beauty Clinic Care Website với Docker.

---

## ��� Prerequisites

```bash
# Check Docker installed
docker --version  # Should be 20.10+
docker compose version  # Should be 2.0+
```

---

## ��� Option 1: Docker Compose (Recommended)

```bash
cd deploy/docker

# 1. Setup environment
cp .env.example .env
# Edit .env với values của bạn

# 2. Start
docker compose up -d

# 3. Verify
curl http://localhost:8080/healthz
open http://localhost:8080
```

**Done!** ��� Application running at http://localhost:8080

---

## ��� Option 2: Docker CLI

```bash
# 1. Build image
docker build \
  -f deploy/docker/Dockerfile.frontend \
  -t spa-frontend:latest \
  .

# 2. Run container
docker run -d \
  --name spa-frontend \
  -p 8080:8080 \
  -e VITE_API_URL=http://localhost:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  spa-frontend:latest

# 3. Check logs
docker logs -f spa-frontend
```

---

## ��� Option 3: Makefile Commands

```bash
cd deploy/docker

# Show all commands
make help

# Quick start
make build    # Build image
make up       # Start containers
make logs     # View logs

# Blue-green deployment
make deploy   # Deploy new version
make status   # Check status
make rollback # Rollback if needed
```

---

## ��� Common Commands

```bash
# View logs
docker compose logs -f frontend

# Restart
docker compose restart frontend

# Stop
docker compose down

# Update and redeploy
git pull
docker compose up -d --build

# Access container shell
docker compose exec frontend sh

# Check health
curl http://localhost:8080/healthz

# View env.js
curl http://localhost:8080/env.js
```

---

## ��� Troubleshooting

### Container won't start

```bash
# Check logs
docker logs spa-frontend

# Remove and recreate
docker rm -f spa-frontend
docker compose up -d
```

### Port already in use

```bash
# Find process using port 8080
netstat -tuln | grep 8080
lsof -i :8080  # macOS/Linux

# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead
```

### ENV not working

```bash
# Check if env.js generated
docker exec spa-frontend cat /usr/share/nginx/html/env.js

# Verify environment variables
docker exec spa-frontend env | grep VITE_

# Restart container
docker restart spa-frontend
```

---

## ��� Next Steps

- ��� Read full guide: [docs/DEPLOYMENT_DOCKER.md](../../docs/DEPLOYMENT_DOCKER.md)
- ��� Setup CI/CD: [.github/workflows/docker-deploy.yml](../../.github/workflows/docker-deploy.yml)
- ��� Configure ENV: [docs/ENV.md](../../docs/ENV.md)

---

**Built with ❤️ by 2003 Hackathon Team**
