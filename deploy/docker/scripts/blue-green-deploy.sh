#!/bin/bash
set -euo pipefail

# ========================================
# Blue-Green Deployment Script
# ========================================
# Simple zero-downtime deployment using two containers
# Switches traffic between blue and green versions

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/../docker-compose.yml"

# Color outputs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="${IMAGE_NAME:-spa-hackathon-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONTAINER_BLUE="spa-frontend-blue"
CONTAINER_GREEN="spa-frontend-green"
NGINX_CONFIG="/etc/nginx/conf.d/upstream.conf"
PORT_BLUE=8081
PORT_GREEN=8082
HEALTHCHECK_URL="http://localhost"
HEALTHCHECK_RETRIES=30
HEALTHCHECK_INTERVAL=2

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

# Get current active environment
get_active_env() {
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_BLUE}$"; then
        if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_BLUE" 2>/dev/null)" = "true" ]; then
            echo "blue"
            return
        fi
    fi
    
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_GREEN}$"; then
        if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_GREEN" 2>/dev/null)" = "true" ]; then
            echo "green"
            return
        fi
    fi
    
    echo "none"
}

# Get inactive environment
get_inactive_env() {
    local active=$(get_active_env)
    if [ "$active" = "blue" ]; then
        echo "green"
    elif [ "$active" = "green" ]; then
        echo "blue"
    else
        echo "blue"  # Default to blue for first deployment
    fi
}

# Health check
healthcheck() {
    local port=$1
    local retries=$HEALTHCHECK_RETRIES
    
    log "Performing health check on port $port..."
    
    for i in $(seq 1 $retries); do
        if curl -sf "${HEALTHCHECK_URL}:${port}/healthz" > /dev/null 2>&1; then
            log "✅ Health check passed (attempt $i/$retries)"
            return 0
        fi
        
        if [ $i -eq $retries ]; then
            error "❌ Health check failed after $retries attempts"
            return 1
        fi
        
        info "Health check attempt $i/$retries failed, retrying in ${HEALTHCHECK_INTERVAL}s..."
        sleep $HEALTHCHECK_INTERVAL
    done
    
    return 1
}

# Build new image
build_image() {
    log "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
    
    cd "$PROJECT_ROOT"
    
    docker build \
        -f deploy/docker/Dockerfile.frontend \
        -t "${IMAGE_NAME}:${IMAGE_TAG}" \
        --build-arg NODE_ENV=production \
        .
    
    if [ $? -eq 0 ]; then
        log "✅ Image built successfully"
    else
        error "❌ Image build failed"
        exit 1
    fi
}

# Deploy to environment
deploy_env() {
    local env=$1
    local container_name
    local port
    
    if [ "$env" = "blue" ]; then
        container_name=$CONTAINER_BLUE
        port=$PORT_BLUE
    else
        container_name=$CONTAINER_GREEN
        port=$PORT_GREEN
    fi
    
    log "Deploying to $env environment (container: $container_name, port: $port)"
    
    # Stop and remove old container if exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"; then
        warn "Stopping old container: $container_name"
        docker stop "$container_name" 2>/dev/null || true
        docker rm "$container_name" 2>/dev/null || true
    fi
    
    # Load environment variables
    if [ -f "$PROJECT_ROOT/.env" ]; then
        source "$PROJECT_ROOT/.env"
    fi
    
    # Start new container
    log "Starting new container: $container_name"
    docker run -d \
        --name "$container_name" \
        --restart unless-stopped \
        -p "${port}:8080" \
        -e "VITE_API_URL=${VITE_API_URL:-http://localhost:3000}" \
        -e "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" \
        -e "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" \
        -e "VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}" \
        -e "VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}" \
        -e "VITE_APP_ENV=${VITE_APP_ENV:-production}" \
        -e "VITE_APP_VERSION=${IMAGE_TAG}" \
        "${IMAGE_NAME}:${IMAGE_TAG}"
    
    if [ $? -eq 0 ]; then
        log "✅ Container started successfully"
    else
        error "❌ Container start failed"
        exit 1
    fi
    
    # Wait for container to be healthy
    sleep 3
    
    if ! healthcheck "$port"; then
        error "❌ Deployment failed: health check failed"
        docker logs "$container_name" --tail 50
        docker stop "$container_name"
        exit 1
    fi
    
    log "✅ Deployment to $env successful!"
}

# Switch traffic
switch_traffic() {
    local new_env=$1
    local new_port
    
    if [ "$new_env" = "blue" ]; then
        new_port=$PORT_BLUE
    else
        new_port=$PORT_GREEN
    fi
    
    log "Switching traffic to $new_env environment (port: $new_port)"
    
    # Note: This is simplified. In production, you'd update a load balancer or reverse proxy
    # For example, update Nginx upstream configuration:
    # echo "upstream frontend { server localhost:$new_port; }" > $NGINX_CONFIG
    # nginx -s reload
    
    info "Traffic switched to $new_env"
    info "Active port: $new_port"
}

# Cleanup old environment
cleanup_old() {
    local old_env=$1
    local container_name
    
    if [ "$old_env" = "blue" ]; then
        container_name=$CONTAINER_BLUE
    elif [ "$old_env" = "green" ]; then
        container_name=$CONTAINER_GREEN
    else
        return
    fi
    
    warn "Cleaning up old environment: $old_env"
    
    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        docker stop "$container_name"
        docker rm "$container_name"
        log "✅ Old container removed: $container_name"
    fi
}

# Rollback
rollback() {
    local current=$(get_active_env)
    
    if [ "$current" = "none" ]; then
        error "❌ No active environment to rollback to"
        exit 1
    fi
    
    warn "Rolling back to previous environment..."
    
    local previous
    if [ "$current" = "blue" ]; then
        previous="green"
    else
        previous="blue"
    fi
    
    switch_traffic "$previous"
    cleanup_old "$current"
    
    log "✅ Rollback completed!"
}

# Main deployment flow
main() {
    local command=${1:-deploy}
    
    case "$command" in
        deploy)
            log "Starting Blue-Green deployment..."
            
            # Get environments
            local active=$(get_active_env)
            local target=$(get_inactive_env)
            
            info "Current active: $active"
            info "Target deployment: $target"
            
            # Build image
            build_image
            
            # Deploy to inactive environment
            deploy_env "$target"
            
            # Switch traffic
            switch_traffic "$target"
            
            # Cleanup old environment
            if [ "$active" != "none" ]; then
                cleanup_old "$active"
            fi
            
            log "��� Blue-Green deployment completed successfully!"
            log "Active environment: $target"
            ;;
            
        rollback)
            rollback
            ;;
            
        status)
            local active=$(get_active_env)
            info "Active environment: $active"
            
            docker ps --filter "name=spa-frontend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
            ;;
            
        *)
            error "Unknown command: $command"
            echo "Usage: $0 {deploy|rollback|status}"
            exit 1
            ;;
    esac
}

# Run
main "$@"
