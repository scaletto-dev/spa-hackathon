#!/bin/bash
# ==========================================
# Auto-setup Vercel Environment from .env
# ==========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Vercel Environment Setup${NC}"
echo -e "${BLUE}========================================${NC}"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}‚ö†Ô∏è  .env file not found at $ENV_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}‚úÖ Found .env file${NC}"
echo ""

# Read .env and prepare Vercel commands
echo -e "${YELLOW}Ì≥ù Preparing environment variables...${NC}"

# Frontend variables (VITE_*)
echo ""
echo -e "${BLUE}=== Frontend Variables ===${NC}"
echo "vercel env add VITE_API_URL production"
echo "vercel env add VITE_SUPABASE_URL production"
echo "vercel env add VITE_SUPABASE_ANON_KEY production"
echo "vercel env add VITE_APP_ENV production"
echo "vercel env add VITE_APP_VERSION production"

# Backend variables
echo ""
echo -e "${BLUE}=== Backend Variables ===${NC}"

# Extract values from .env
DATABASE_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2-)
SUPABASE_URL=$(grep "^SUPABASE_URL=" "$ENV_FILE" | cut -d '=' -f2-)
SUPABASE_ANON_KEY=$(grep "^SUPABASE_ANON_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
SUPABASE_SERVICE_ROLE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
GEMINI_API_KEY=$(grep "^GEMINI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
GEMINI_MODEL=$(grep "^GEMINI_MODEL=" "$ENV_FILE" | cut -d '=' -f2-)
RESEND_API_KEY=$(grep "^RESEND_API_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
EMAIL_FROM=$(grep "^EMAIL_FROM=" "$ENV_FILE" | cut -d '=' -f2-)
VNPAY_TMN_CODE=$(grep "^VNPAY_TMN_CODE=" "$ENV_FILE" | cut -d '=' -f2-)
VNPAY_SECRET_KEY=$(grep "^VNPAY_SECRET_KEY=" "$ENV_FILE" | cut -d '=' -f2-)

echo "DATABASE_URL=$DATABASE_URL"
echo "SUPABASE_URL=$SUPABASE_URL"
echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY=***"
echo "GEMINI_API_KEY=***"
echo "RESEND_API_KEY=***"
echo "VNPAY_TMN_CODE=$VNPAY_TMN_CODE"

echo ""
echo -e "${GREEN}‚úÖ Environment variables prepared!${NC}"
echo ""
echo -e "${YELLOW}Ì≥å Next steps:${NC}"
echo "1. Run: vercel login"
echo "2. Run: cd deploy/vercel && vercel"
echo "3. Link to existing project or create new one"
echo "4. Manually add environment variables in Vercel Dashboard"
echo "   OR use the commands above"
