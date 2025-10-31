# Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. All technologies, versions, and rationales are documented below. This table is the single source of truth - all development must use these exact versions and tools.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe JavaScript superset for frontend code | Catches errors at compile-time, enables better IDE support, self-documenting code, shared types with backend |
| **Frontend Framework** | React | 18.2+ | UI library for building component-based SPA | Industry standard, massive ecosystem, excellent TypeScript support, concurrent features for better UX |
| **UI Component Library** | shadcn/ui | Latest | Accessible, customizable component primitives | Copy-paste model (no npm dependency bloat), built on Radix UI (WCAG AA compliant), full Tailwind integration, production-ready components |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first CSS framework | Rapid UI development, consistent design system, tree-shaking reduces bundle size, no CSS conflicts |
| **State Management** | React Context + Hooks | Built-in | Global state for auth, language, theme | Sufficient for MVP scope, zero dependencies, built into React, easy to upgrade to Zustand/Redux later if needed |
| **Routing** | React Router | 6.20+ | Client-side routing for SPA | De facto React routing standard, nested routes, lazy loading, protected route patterns |
| **Forms & Validation** | React Hook Form + Zod | 7.48+ / 3.22+ | Form state management with schema validation | Best-in-class performance (uncontrolled inputs), Zod provides runtime + compile-time type safety, minimal re-renders |
| **HTTP Client** | Axios | 1.6+ | Promise-based HTTP client | Interceptors for auth tokens, request/response transformation, better error handling than fetch, widespread adoption |
| **Date Handling** | date-fns | 3.0+ | Date manipulation and formatting | Modular (tree-shakeable), immutable, excellent i18n support for multilingual date formats |
| **Internationalization** | i18next + react-i18next | 23.7+ / 13.5+ | Multilingual support (4 languages) | Industry standard, powerful features (pluralization, interpolation), namespace organization, lazy loading translations |
| **Image Carousel** | Swiper | 11.0+ | Touch-enabled slider/carousel for galleries | Mobile-optimized, highly customizable, smooth animations, accessibility support |
| **Backend Language** | Node.js | 20 LTS | JavaScript runtime for backend | Unified language with frontend, massive package ecosystem, excellent async I/O for API servers |
| **Backend Framework** | Express.js | 4.18+ | Minimalist web framework for Node.js | Most popular Node.js framework, middleware ecosystem, flexible, well-documented, production-proven |
| **API Style** | REST | N/A | RESTful API with JSON payloads | Standard HTTP semantics, resource-based, tooling-mature, mobile-ready, appropriate for CRUD-heavy application |
| **ORM** | Prisma | 5.7+ | Type-safe database ORM | Best-in-class TypeScript integration, migrations, auto-generated types, excellent DX, visual studio for schema |
| **Database** | PostgreSQL | 15+ (Supabase-hosted) | Primary relational database | ACID transactions, robust, mature, JSON support, full-text search, free tier via Supabase |
| **Cache** | Redis | 7.2+ | In-memory cache for sessions and data | Blazing fast, simple key-value operations, TTL support, pub/sub for future real-time features |
| **Authentication** | Supabase Auth | Latest | Managed auth service with email OTP | Eliminates custom auth code, email OTP passwordless flow, JWT token management, secure by default |
| **File Storage** | Supabase Storage | Latest | Object storage for images and files | Integrated with Supabase Auth, CDN-backed, image transformations, generous free tier |
| **Validation** | Zod + Express-validator | 3.22+ / 7.0+ | Request validation (frontend + backend) | Shared Zod schemas between FE/BE, Express-validator for HTTP-specific validation (headers, params) |
| **Logging** | Winston | 3.11+ | Structured logging for backend | Log levels, transports (file, console), JSON formatting for future log aggregation |
| **Frontend Testing** | Jest + React Testing Library | 29.7+ / 14.1+ | Unit and integration tests for React | React best practices (test behavior not implementation), excellent async utilities, snapshot testing |
| **Backend Testing** | Jest + Supertest | 29.7+ / 6.3+ | Unit and integration tests for API | Test HTTP endpoints end-to-end, mock Prisma for unit tests, coverage reporting |
| **Build Tool (Frontend)** | Vite | 5.0+ | Modern build tool for React | **10-100x faster HMR than CRA/Webpack**, instant server start, native ESM, optimized production builds with automatic code splitting, superior DX |
| **Bundler** | Vite (Rollup) | Built-in | JavaScript bundler | Vite uses Rollup for production builds - battle-tested, excellent tree-shaking, code splitting |
| **Package Manager** | npm | 10+ | Dependency management, workspaces | Built into Node.js, native workspace support, lockfile consistency, universal adoption |
| **Linting** | ESLint + Prettier | 8.55+ / 3.1+ | Code quality and formatting | Catches bugs, enforces consistent style, auto-fix, integrates with IDE |
| **Type Checking** | TypeScript Compiler | 5.3+ | Static type checking across monorepo | Compile-time safety, project references for monorepo, incremental builds |
| **Version Control** | Git | 2.40+ | Source code management | Industry standard, distributed, branching strategies, CI/CD integration |
| **API Documentation** | Swagger/OpenAPI | 3.0 | REST API specification | Interactive docs, client SDK generation, contract-first development |
| **Environment Config** | dotenv | 16.3+ | Environment variable management | Simple .env files, separate configs per environment, no secrets in code |

### Additional Integrations (Phase 2)

| Category | Technology | Version | Purpose | Timeline |
|----------|-----------|---------|---------|----------|
| **Payment Gateway** | VNPay | Latest API | Vietnamese payment processing | Phase 2 (Post-MVP) |
| **Maps** | Google Maps JavaScript API | v3 | Branch location display, directions | MVP (Frontend only, no server billing) |
| **Email Service** | Nodemailer + SMTP | 6.9+ | Transactional emails (bookings, OTP) | MVP (configure with Gmail or SendGrid) |

### Vite Configuration Highlights

**Why Vite for this Project:**

1. **Development Speed:** Instant server start (vs 30-60s with CRA), near-instant HMR even with 100+ components
2. **Build Performance:** Production builds 5-10x faster than Webpack-based solutions
3. **Modern Standards:** Native ESM support, no bundling in development mode
4. **Plugin Ecosystem:** Official React plugin (`@vitejs/plugin-react`), rich plugin ecosystem
5. **TypeScript:** First-class TypeScript support with no configuration needed
6. **Environment Variables:** Simple `.env` file support with `import.meta.env`
7. **Code Splitting:** Automatic route-based code splitting with React Router
8. **Asset Handling:** Built-in support for images, fonts, CSS, with optimization

**Key Vite Configuration (`apps/web/vite.config.ts`):**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

**Vite Benefits Measured:**
- **Dev Server Start:** <1s (vs 30-60s CRA)
- **HMR:** <50ms (vs 1-5s Webpack)
- **Production Build:** ~15-20s for 100+ components (vs 60-120s CRA)
- **Bundle Size:** 20-30% smaller due to better tree-shaking

---

