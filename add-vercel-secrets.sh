#!/bin/bash

# Read from .env and add as Vercel secrets
echo "Ì≥ù Adding secrets to Vercel..."

# Database
DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2-)
echo "$DATABASE_URL" | vercel secrets add database_url

# Supabase
SUPABASE_URL=$(grep "^SUPABASE_URL=" .env | cut -d '=' -f2-)
echo "$SUPABASE_URL" | vercel secrets add supabase_url

SUPABASE_ANON_KEY=$(grep "^SUPABASE_ANON_KEY=" .env | cut -d '=' -f2-)
echo "$SUPABASE_ANON_KEY" | vercel secrets add supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env | cut -d '=' -f2-)
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel secrets add supabase_service_role_key

# Gemini
GEMINI_API_KEY=$(grep "^GEMINI_API_KEY=" .env | cut -d '=' -f2-)
echo "$GEMINI_API_KEY" | vercel secrets add gemini_api_key

# Resend
RESEND_API_KEY=$(grep "^RESEND_API_KEY=" .env | cut -d '=' -f2-)
echo "$RESEND_API_KEY" | vercel secrets add resend_api_key

# VNPay
VNPAY_TMN_CODE=$(grep "^VNPAY_TMN_CODE=" .env | cut -d '=' -f2-)
echo "$VNPAY_TMN_CODE" | vercel secrets add vnpay_tmn_code

VNPAY_SECRET_KEY=$(grep "^VNPAY_SECRET_KEY=" .env | cut -d '=' -f2-)
echo "$VNPAY_SECRET_KEY" | vercel secrets add vnpay_secret_key

echo "‚úÖ Secrets added successfully!"
