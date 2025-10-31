import { Navigate, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useAuth } from '../../auth/useAuth';

/**
 * ProtectedRoute Guard
 * Requires user to be authenticated
 * Redirects to /login if not authenticated, preserving intended destination
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // While checking auth, return null (Suspense boundary will handle loading)
    if (isLoading) {
        return null;
    }

    // Not authenticated -> redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Authenticated -> render children
    return <>{children}</>;
}
