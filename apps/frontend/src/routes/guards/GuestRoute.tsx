import { Navigate, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useAuth } from '../../auth/useAuth';

/**
 * GuestRoute Guard
 * Only allows unauthenticated users to access (login/register pages)
 * Redirects authenticated users to dashboard or their intended destination
 */
export function GuestRoute({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // While checking auth, return null (Suspense boundary will handle loading)
    if (isLoading) {
        return null;
    }

    // If authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
        // Get return URL from state or use default based on role
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

        // Determine redirect destination
        let redirectTo = '/dashboard'; // Default for clients

        if (user?.role === 'admin') {
            redirectTo = '/admin';
        } else if (from && !from.includes('/login') && !from.includes('/register')) {
            // If there's a return URL and it's not a login/register page, use it
            redirectTo = from;
        }

        return <Navigate to={redirectTo} replace />;
    }

    // Not authenticated -> render children (login/register page)
    return <>{children}</>;
}
