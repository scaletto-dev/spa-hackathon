/**
 * Authentication adapter
 * TODO: Connect to real auth system when available (Context/Redux/Backend API)
 * Current: Mock implementation for routing guards
 */

import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'client';
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

/**
 * Mock auth hook - Replace with real implementation
 * TODO: Integrate with actual auth provider (e.g., AuthContext, Redux, JWT)
 */
export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
    });

    useEffect(() => {
        // TODO: Replace with real auth check (e.g., validate token, check session)
        // For now, check localStorage for demo purposes
        const checkAuth = () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr) as User;
                    setAuthState({
                        isAuthenticated: true,
                        isLoading: false,
                        user,
                    });
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                    });
                }
            } catch {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                });
            }
        };

        checkAuth();
    }, []);

    return authState;
}

/**
 * Mock login function for testing
 * TODO: Replace with real API call
 */
export function mockLogin(role: 'admin' | 'client' = 'client') {
    const user: User = {
        id: '1',
        name: role === 'admin' ? 'Admin User' : 'Client User',
        email: role === 'admin' ? 'admin@example.com' : 'client@example.com',
        role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload();
}

/**
 * Mock logout function
 * TODO: Replace with real API call
 */
export function mockLogout() {
    localStorage.removeItem('user');
    window.location.reload();
}
