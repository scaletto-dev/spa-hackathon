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
 * - No user -> redirect to /login
 */
export function RequireRole({ children, role }: PropsWithChildren<RequireRoleProps>) {
    const { user } = useAuth();

    // Not logged in -> redirect to login
    if (!user) {
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
