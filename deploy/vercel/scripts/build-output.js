#!/usr/bin/env node

/**
 * Vercel Build Output API v3 Generator
 * Generates .vercel/output structure from Vite build
 * 
 * Structure:
 * .vercel/output/
 *   ├── config.json          # Build metadata
 *   ├── static/              # Static files from dist/
 *   └── config/
 *       ├── routes.json      # Routing rules
 *       └── headers.json     # HTTP headers
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const ROOT_DIR = path.resolve(__dirname, '../../..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'apps/frontend');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const OUTPUT_DIR = path.join(ROOT_DIR, '.vercel/output');
const STATIC_DIR = path.join(OUTPUT_DIR, 'static');
const CONFIG_DIR = path.join(OUTPUT_DIR, 'config');

console.log('��� Generating Vercel Build Output API v3 structure...\n');

// Step 1: Clean output directory
console.log('��� Cleaning output directory...');
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(STATIC_DIR, { recursive: true });
fs.mkdirSync(CONFIG_DIR, { recursive: true });

// Step 2: Copy dist to static
console.log('�� Copying build artifacts to static/...');
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: dist/ not found. Run build first.');
  process.exit(1);
}

copyRecursive(DIST_DIR, STATIC_DIR);
console.log('✅ Static files copied');

// Step 3: Generate runtime env.js
console.log('��� Generating runtime env.js...');

// Read env from vercel.json
const vercelConfigPath = path.join(ROOT_DIR, 'vercel.json');
let vercelEnv = {};
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  vercelEnv = vercelConfig.env || {};
}

const envJsContent = `
// Runtime Environment Configuration for Vercel
// Auto-generated at build time, populated at runtime
(function() {
  try {
    // Get runtime config from Vercel environment variables
    const config = {
      VITE_API_URL: "${vercelEnv.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:3000'}",
      VITE_SUPABASE_URL: "${vercelEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''}",
      VITE_SUPABASE_ANON_KEY: "${vercelEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''}",
      VITE_GOOGLE_MAPS_API_KEY: "${vercelEnv.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || ''}",
      VITE_GOOGLE_CLIENT_ID: "${vercelEnv.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ''}",
      VITE_APP_ENV: "${vercelEnv.VITE_APP_ENV || process.env.VITE_APP_ENV || 'production'}",
      VITE_APP_VERSION: "${vercelEnv.VITE_APP_VERSION || process.env.VITE_APP_VERSION || '1.0.0'}",
    };

    window.ENV = config;
    console.log('[Vercel ENV] Runtime configuration loaded:', config.VITE_APP_ENV);
  } catch (error) {
    console.error('[Vercel ENV] Failed to load runtime config:', error);
    window.ENV = {};
  }
})();
`.trim();

fs.writeFileSync(path.join(STATIC_DIR, 'env.js'), envJsContent);
console.log('✅ env.js generated');

// Step 4: Update index.html to load env.js
console.log('��� Updating index.html to load env.js...');
const indexPath = path.join(STATIC_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Inject env.js script before other scripts
  if (!indexHtml.includes('env.js')) {
    indexHtml = indexHtml.replace(
      '<head>',
      '<head>\n    <script src="/env.js"></script>'
    );
    fs.writeFileSync(indexPath, indexHtml);
    console.log('✅ index.html updated');
  }
}

// Step 5: Generate config.json
console.log('��� Generating config.json...');
const config = {
  version: 3,
  routes: 'config/routes.json',
  overrides: {}
};
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'config.json'),
  JSON.stringify(config, null, 2)
);
console.log('✅ config.json created');

// Step 6: Generate routes.json (SPA routing)
console.log('��� Generating routes.json...');
const routes = {
  version: 3,
  routes: [
    // Health check endpoint
    {
      src: '/healthz',
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
      continue: false
    },
    // Runtime env.js - no cache
    {
      src: '/env.js',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/javascript'
      }
    },
    // Static assets - immutable cache
    {
      src: '/assets/(.*)',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    // Fonts - long cache
    {
      src: '/(.*\\.(woff2?|ttf|otf|eot))',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    // Images - long cache
    {
      src: '/(.*\\.(jpg|jpeg|png|gif|ico|svg|webp))',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    // Service worker - short cache
    {
      src: '/sw.js',
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    },
    // SPA fallback - all other routes to index.html
    {
      src: '/(.*)',
      dest: '/index.html'
    }
  ]
};
fs.writeFileSync(
  path.join(CONFIG_DIR, 'routes.json'),
  JSON.stringify(routes, null, 2)
);
console.log('✅ routes.json created');

// Step 7: Generate headers.json (Security headers)
console.log('��� Generating headers.json...');
const headers = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()'
        }
      ]
    },
    {
      source: '/index.html',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate'
        }
      ]
    }
  ]
};
fs.writeFileSync(
  path.join(CONFIG_DIR, 'headers.json'),
  JSON.stringify(headers, null, 2)
);
console.log('✅ headers.json created');

// Summary
console.log('\n✨ Vercel Build Output API v3 structure generated successfully!\n');
console.log('��� Output structure:');
console.log('   .vercel/output/');
console.log('   ├── config.json');
console.log('   ├── static/        (static files)');
console.log('   └── config/');
console.log('       ├── routes.json');
console.log('       └── headers.json\n');

// Helper functions
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
