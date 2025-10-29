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
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
}

/**
 * Mock auth hook - Replace with real implementation
 * TODO: Integrate with actual auth provider (e.g., AuthContext, Redux, JWT)
 */
export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<{
        isAuthenticated: boolean;
        isLoading: boolean;
        user: User | null;
    }>({
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

    /**
     * Mock login function
     * TODO: Replace with real API call (POST /api/auth/login)
     */
    const login = async (credentials: { email: string; password: string }): Promise<void> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock validation - Accept any email/password for demo
        // TODO: Replace with real API call
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Create mock user based on email domain
        const isAdmin = credentials.email.includes('admin');
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: credentials.email.split('@')[0] ?? 'User',
            email: credentials.email,
            role: isAdmin ? 'admin' : 'client',
        };

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
        });
    };

    /**
     * Mock register function
     * TODO: Replace with real API call (POST /api/auth/register)
     */
    const register = async (data: { name: string; email: string; password: string }): Promise<void> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation
        // TODO: Replace with real API call
        if (!data.name || !data.email || !data.password) {
            throw new Error('All fields are required');
        }

        // Check if user already exists (mock)
        const existingUserStr = localStorage.getItem('user');
        if (existingUserStr) {
            const existingUser = JSON.parse(existingUserStr) as User;
            if (existingUser.email === data.email) {
                throw new Error('Email already registered');
            }
        }

        // Create new user
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            email: data.email,
            role: 'client', // New users are always clients
        };

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
        });
    };

    /**
     * Logout function
     * TODO: Replace with real API call (POST /api/auth/logout)
     */
    const logout = () => {
        localStorage.removeItem('user');
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
        });
    };

    return {
        ...authState,
        login,
        register,
        logout,
    };
}

/**
 * Legacy mock login function for testing guards
 * TODO: Remove after real auth is implemented
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
 * Legacy mock logout function
 * TODO: Remove after real auth is implemented
 */
export function mockLogout() {
    localStorage.removeItem('user');
    window.location.reload();
}
