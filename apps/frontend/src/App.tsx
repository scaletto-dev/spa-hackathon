import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route-map';

/**
 * App Component
 *
 * Refactored to use React Router v6 modern approach:
 * - createBrowserRouter with RouteObject[] (see routes/route-map.tsx)
 * - Lazy loading with Suspense for code splitting
 * - Error boundaries for graceful error handling
 * - RBAC guards (RequireRole) for admin routes
 *
 * All routes are now defined in src/routes/route-map.tsx
 */
export function App() {
    return <RouterProvider router={router} />;
}
