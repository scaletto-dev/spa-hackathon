#!/bin/bash
set -euo pipefail

# ========================================
# Vercel Deployment Script
# ========================================
# Deploy spa-hackathon frontend to Vercel

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
VERCEL_DIR="$PROJECT_ROOT/deploy/vercel"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    log "✅ Vercel CLI version: $(vercel --version)"
}

# Build project
build_project() {
    log "Building frontend..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install
    fi
    
    # Build frontend
    log "Building frontend with Vite..."
    npm run build -w @spa-hackathon/frontend
    
    # Generate Vercel Build Output API v3 structure
    log "Generating Vercel Build Output API v3 structure..."
    node "$VERCEL_DIR/scripts/build-output.js"
    
    log "✅ Build completed successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    local env="${1:-preview}"
    
    cd "$VERCEL_DIR"
    
    log "Deploying to Vercel ($env)..."
    
    if [ "$env" = "production" ]; then
        vercel deploy --prod --yes
    else
        vercel deploy --yes
    fi
    
    log "✅ Deployment successful!"
}

# Main
main() {
    local command="${1:-deploy}"
    local env="${2:-preview}"
    
    case "$command" in
        build)
            log "Starting build only..."
            check_vercel_cli
            build_project
            ;;
            
        deploy)
            log "Starting deployment to $env..."
            check_vercel_cli
            build_project
            deploy_to_vercel "$env"
            ;;
            
        preview)
            log "Deploying preview..."
            check_vercel_cli
            build_project
            deploy_to_vercel "preview"
            ;;
            
        production)
            log "Deploying to production..."
            check_vercel_cli
            build_project
            deploy_to_vercel "production"
            ;;
            
        *)
            error "Unknown command: $command"
            echo ""
            echo "Usage: $0 {build|deploy|preview|production} [env]"
            echo ""
            echo "Commands:"
            echo "  build           Build project only"
            echo "  deploy [env]    Deploy to Vercel (preview or production)"
            echo "  preview         Deploy preview"
            echo "  production      Deploy to production"
            exit 1
            ;;
    esac
}

main "$@"
