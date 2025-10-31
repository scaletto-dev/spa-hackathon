#!/bin/bash
# ==========================================
# Vercel Full Stack Deployment Script
# ==========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
VERCEL_DIR="$PROJECT_ROOT/deploy/vercel"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    print_success "Vercel CLI is installed"
}

deploy_frontend() {
    print_header "Deploying Frontend"
    
    cd "$VERCEL_DIR"
    
    # Build frontend
    print_warning "Building frontend..."
    npm run build -w @spa-hackathon/frontend
    
    # Generate Build Output API v3
    print_warning "Generating Vercel output..."
    node scripts/build-output.js
    
    # Deploy to Vercel
    if [ "$1" == "production" ]; then
        print_warning "Deploying to PRODUCTION..."
        vercel --prod --yes
    else
        print_warning "Deploying PREVIEW..."
        vercel --yes
    fi
    
    print_success "Frontend deployed successfully!"
}

deploy_backend() {
    print_header "Deploying Backend"
    
    cd "$PROJECT_ROOT"
    
    # Build backend
    print_warning "Building backend..."
    npm run build -w @spa-hackathon/backend
    
    # Deploy to Vercel
    cd "$VERCEL_DIR"
    if [ "$1" == "production" ]; then
        print_warning "Deploying to PRODUCTION..."
        vercel --prod --yes -c vercel.backend.json
    else
        print_warning "Deploying PREVIEW..."
        vercel --yes -c vercel.backend.json
    fi
    
    print_success "Backend deployed successfully!"
}

deploy_fullstack() {
    print_header "Full Stack Deployment"
    
    local env_type="$1"
    
    # Check Vercel CLI
    check_vercel_cli
    
    # Deploy frontend
    deploy_frontend "$env_type"
    
    # Deploy backend
    deploy_backend "$env_type"
    
    print_success "Full stack deployment complete!"
    echo ""
    print_warning "Next steps:"
    echo "1. Configure environment variables in Vercel Dashboard"
    echo "2. Run database migrations: vercel env pull && npm run db:migrate"
    echo "3. Test your deployment endpoints"
}

# Main script
case "$1" in
    frontend)
        check_vercel_cli
        deploy_frontend "${2:-preview}"
        ;;
    backend)
        check_vercel_cli
        deploy_backend "${2:-preview}"
        ;;
    fullstack|full)
        deploy_fullstack "${2:-preview}"
        ;;
    production|prod)
        deploy_fullstack "production"
        ;;
    preview)
        deploy_fullstack "preview"
        ;;
    *)
        echo "Usage: $0 {frontend|backend|fullstack|production|preview} [production|preview]"
        echo ""
        echo "Examples:"
        echo "  $0 frontend preview          - Deploy frontend preview"
        echo "  $0 backend production        - Deploy backend to production"
        echo "  $0 fullstack preview         - Deploy full stack preview"
        echo "  $0 production                - Deploy full stack to production"
        exit 1
        ;;
esac
