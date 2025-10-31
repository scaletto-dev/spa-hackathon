#!/bin/sh
set -e

# Runtime environment injection for SPA
# Generates /usr/share/nginx/html/env.js with runtime config

ENV_FILE="/usr/share/nginx/html/env.js"

echo "Generating runtime env.js..."

cat > "$ENV_FILE" << ENVJS
// Runtime Environment Configuration
// Auto-generated at container startup
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:3000}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY:-}",
  VITE_GOOGLE_MAPS_API_KEY: "${VITE_GOOGLE_MAPS_API_KEY:-}",
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID:-}",
  VITE_APP_ENV: "${VITE_APP_ENV:-production}",
  VITE_APP_VERSION: "${VITE_APP_VERSION:-1.0.0}",
};

console.log("[ENV] Runtime configuration loaded", window.ENV);
ENVJS

echo "✅ Runtime env.js generated successfully"
cat "$ENV_FILE"

exec "$@"
