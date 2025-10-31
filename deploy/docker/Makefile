# ==========================================
# SPA Hackathon - Docker Makefile
# ==========================================

.PHONY: help build-fe build-be build up down restart logs status clean deploy test

# Variables
IMAGE_NAME_FE := spa-frontend
IMAGE_NAME_BE := spa-backend
IMAGE_TAG := latest
COMPOSE_FILE := docker-compose.yml
COMPOSE_FILE_FULL := docker-compose.full.yml
DOCKERFILE_FE := Dockerfile.frontend
DOCKERFILE_BE := Dockerfile.backend

# Default target
help:
@echo "Ì∫Ä SPA Hackathon - Docker Commands"
@echo ""
@echo "Frontend Only:"
@echo "  make build-fe      - Build frontend Docker image"
@echo "  make run-fe        - Run frontend container"
@echo ""
@echo "Backend Only:"
@echo "  make build-be      - Build backend Docker image"
@echo "  make run-be        - Run backend container"
@echo ""
@echo "Full Stack:"
@echo "  make build         - Build both frontend & backend"
@echo "  make up            - Start all services (FE + BE + DB)"
@echo "  make down          - Stop all services"
@echo "  make restart       - Restart all services"
@echo ""
@echo "Utilities:"
@echo "  make logs          - View logs"
@echo "  make logs-fe       - View frontend logs"
@echo "  make logs-be       - View backend logs"
@echo "  make status        - Check service status"
@echo "  make clean         - Remove containers and images"
@echo "  make deploy        - Blue-green deployment"
@echo "  make test          - Test health endpoints"

# ==========================================
# Frontend Commands
# ==========================================

build-fe:
@echo "Ì¥® Building frontend image..."
docker build -f $(DOCKERFILE_FE) -t $(IMAGE_NAME_FE):$(IMAGE_TAG) ../..

run-fe:
@echo "Ì∫Ä Starting frontend container..."
docker run -d \
--name spa-frontend \
-p 8080:8080 \
--env-file .env \
$(IMAGE_NAME_FE):$(IMAGE_TAG)

# ==========================================
# Backend Commands
# ==========================================

build-be:
@echo "Ì¥® Building backend image..."
docker build -f $(DOCKERFILE_BE) -t $(IMAGE_NAME_BE):$(IMAGE_TAG) ../..

run-be:
@echo "Ì∫Ä Starting backend container..."
docker run -d \
--name spa-backend \
-p 3000:3000 \
--env-file backend.env \
$(IMAGE_NAME_BE):$(IMAGE_TAG)

# ==========================================
# Full Stack Commands
# ==========================================

build: build-fe build-be
@echo "‚úÖ All images built successfully"

up:
@echo "ÔøΩÔøΩ Starting all services..."
docker compose -f $(COMPOSE_FILE_FULL) up -d

down:
@echo "Ìªë Stopping all services..."
docker compose -f $(COMPOSE_FILE_FULL) down

restart: down up
@echo "Ì¥Ñ Services restarted"

# ==========================================
# Logs & Monitoring
# ==========================================

logs:
docker compose -f $(COMPOSE_FILE_FULL) logs -f

logs-fe:
docker logs -f spa-frontend

logs-be:
docker logs -f spa-backend

logs-db:
docker logs -f spa-postgres

status:
@echo "Ì≥ä Service Status:"
@docker ps --filter "label=com.spa-hackathon.service" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# ==========================================
# Cleanup
# ==========================================

clean:
@echo "Ì∑π Cleaning up..."
docker compose -f $(COMPOSE_FILE_FULL) down -v
docker rmi $(IMAGE_NAME_FE):$(IMAGE_TAG) $(IMAGE_NAME_BE):$(IMAGE_TAG) 2>/dev/null || true
@echo "‚úÖ Cleanup complete"

# ==========================================
# Deployment
# ==========================================

deploy:
@echo "Ì∫Ä Running blue-green deployment..."
./scripts/blue-green-deploy.sh deploy

rollback:
@echo "‚è™ Rolling back deployment..."
./scripts/blue-green-deploy.sh rollback

# ==========================================
# Testing
# ==========================================

test:
@echo "Ì∑™ Testing health endpoints..."
@echo "Frontend:"
@curl -f http://localhost:8080/healthz && echo "‚úÖ Frontend healthy" || echo "‚ùå Frontend unhealthy"
@echo ""
@echo "Backend:"
@curl -f http://localhost:3000/api/health && echo "‚úÖ Backend healthy" || echo "‚ùå Backend unhealthy"

# ==========================================
# Database Commands
# ==========================================

db-migrate:
@echo "Ì≥¶ Running database migrations..."
docker compose -f $(COMPOSE_FILE_FULL) exec backend npx prisma migrate deploy

db-seed:
@echo "Ìº± Seeding database..."
docker compose -f $(COMPOSE_FILE_FULL) exec backend npx prisma db seed

db-reset:
@echo "‚ö†Ô∏è  Resetting database..."
docker compose -f $(COMPOSE_FILE_FULL) exec backend npx prisma migrate reset --force
