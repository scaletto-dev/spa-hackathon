import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useAuth } from '../../auth/useAuth';

interface RequireRoleProps {
    role: 'admin' | 'client' | 'staff';
}

/**
 * RequireRole Guard (RBAC)
 * Checks user role matches required role
 *
 * Redirect Rules:
 * - No user (admin role) -> redirect to /admin/login
 * - No user (staff role) -> redirect to /support
 * - No user (client role) -> redirect to /login
 * - Admin trying to access client page -> redirect to /admin
 * - Client trying to access admin page -> redirect to / (home)
 * - Non-staff trying to access support -> redirect to / (home)
 */
export function RequireRole({ children, role }: PropsWithChildren<RequireRoleProps>) {
    const { user, isLoading } = useAuth();

    // Wait for auth check to complete
    if (isLoading) {
        console.log('⏳ Auth loading...');
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
            </div>
        );
    }

    // Not logged in -> redirect to appropriate login page
    if (!user) {
        console.log('❌ No user, redirecting to login');
        if (role === 'admin') {
            return <Navigate to='/admin/login' replace />;
        }
        if (role === 'staff') {
            return <Navigate to='/support' replace />;
        }
        return <Navigate to='/login' replace />;
    }

    // Role mismatch handling
    if (role === 'admin' && user.role !== 'admin') {
        console.log('❌ User is not admin, redirecting to home');
        // Client trying to access admin area -> redirect home
        return <Navigate to='/' replace />;
    }

    if (role === 'client' && user.role === 'admin') {
        console.log('❌ Admin trying to access client page, redirecting to admin');
        // Admin trying to access client-only page -> redirect to admin dashboard
        return <Navigate to='/admin' replace />;
    }

    if (role === 'staff' && user.role !== 'staff' && user.role !== 'admin') {
        console.log('❌ User is not staff or admin, redirecting to home');
        // Non-staff and non-admin trying to access support dashboard -> redirect home
        // Admin and staff can both access support dashboard
        return <Navigate to='/' replace />;
    }

    console.log('✅ Role check passed, rendering children');
    // Role matches -> render children
    return <>{children}</>;
}
