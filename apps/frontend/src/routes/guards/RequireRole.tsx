import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useAuth } from '../../auth/useAuth';

interface RequireRoleProps {
    role: 'admin' | 'client';
}

/**
 * RequireRole Guard (RBAC)
 * Checks user role matches required role
 * - Admin trying to access client-only page -> redirect to /admin
 * - Client trying to access admin page -> redirect to / (home)
 * - No user (admin role) -> redirect to /admin/login
 * - No user (client role) -> redirect to /login
 */
export function RequireRole({ children, role }: PropsWithChildren<RequireRoleProps>) {
    const { user, isLoading } = useAuth();

    // Wait for auth check to complete
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
            </div>
        );
    }

    // Not logged in -> redirect to appropriate login page
    if (!user) {
        if (role === 'admin') {
            return <Navigate to='/admin/login' replace />;
        }
        return <Navigate to='/login' replace />;
    }

    // Role mismatch handling
    if (role === 'admin' && user.role !== 'admin') {
        // Client trying to access admin area -> redirect home
        return <Navigate to='/' replace />;
    }

    if (role === 'client' && user.role === 'admin') {
        // Admin trying to access client-only page -> redirect to admin dashboard
        return <Navigate to='/admin' replace />;
    }

    // Role matches -> render children
    return <>{children}</>;
}
