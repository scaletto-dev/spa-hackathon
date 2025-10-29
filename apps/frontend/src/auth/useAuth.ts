/**
 * Authentication adapter
 * TODO: Connect to real auth system when available (Context/Redux/Backend API)
 * Current: Mock implementation for routing guards
 */

import { useState, useEffect } from 'react';
import { loadGoogleScript } from '../utils/loadGoogleScript';

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
    loginWithGoogle: () => Promise<void>;
    loginAdmin: (credentials: { email: string; password: string }) => Promise<void>;
    loginWithGoogleAdmin: () => Promise<void>;
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
        localStorage.removeItem('auth/googleCredential');
        localStorage.removeItem('auth/provider');
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
        });
    };

    /**
     * Parse JWT token (client-side only - NOT VERIFIED)
     * ⚠️ SECURITY: This is for demo purposes only. In production, JWT verification
     * must happen on the backend to prevent tampering.
     */
    const parseJwt = (token: string): GoogleJWTPayload => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) throw new Error('Invalid JWT token');
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as GoogleJWTPayload;
        } catch (error) {
            console.error('Failed to parse JWT:', error);
            throw new Error('Invalid Google credential token');
        }
    };

    /**
     * Login with Google (using Google Identity Services)
     * TODO: Send credential to backend for verification (POST /api/auth/google)
     * Current: Client-side JWT parsing for demo (INSECURE for production)
     */
    const loginWithGoogle = async (): Promise<void> => {
        try {
            // Load Google Identity Services script
            await loadGoogleScript();

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
            if (!clientId) {
                throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env');
            }

            // Initialize and prompt for Google Sign-In
            await new Promise<void>((resolve, reject) => {
                if (!window.google?.accounts?.id) {
                    reject(new Error('Google Identity Services not loaded'));
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response: GoogleCredentialResponse) => {
                        try {
                            // Parse JWT payload (client-side - DEMO ONLY)
                            // TODO: Send response.credential to backend for verification
                            const payload = parseJwt(response.credential);

                            // Create user from Google profile
                            const user: User = {
                                id: payload.sub,
                                name: payload.name,
                                email: payload.email,
                                role: 'client', // New Google users default to client role
                            };

                            // Persist to localStorage (mock)
                            // TODO: Backend should return JWT token and user data
                            localStorage.setItem('auth/googleCredential', response.credential);
                            localStorage.setItem('auth/provider', 'google');
                            localStorage.setItem('user', JSON.stringify(user));

                            setAuthState({
                                isAuthenticated: true,
                                isLoading: false,
                                user,
                            });

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    cancel_on_tap_outside: true,
                    use_fedcm_for_prompt: false, // Disable FedCM to avoid browser blocking issues
                });

                // Show Google One Tap prompt
                window.google.accounts.id.prompt((notification) => {
                    console.log('Google prompt notification:', {
                        isDisplayMoment: notification.isDisplayMoment(),
                        isDisplayed: notification.isDisplayed(),
                        isNotDisplayed: notification.isNotDisplayed(),
                        isSkippedMoment: notification.isSkippedMoment(),
                        isDismissedMoment: notification.isDismissedMoment(),
                        momentType: notification.getMomentType(),
                    });

                    if (notification.isNotDisplayed()) {
                        const reason = notification.getNotDisplayedReason();
                        console.error('Google Sign-In not displayed. Reason:', reason);
                        console.error('Check: 1) Authorized JavaScript origins in Google Console, 2) Client ID is correct, 3) Origin matches exactly');
                        
                        if (reason === 'invalid_client' || reason === 'missing_client_id') {
                            reject(new Error('Invalid Google Client ID. Check VITE_GOOGLE_CLIENT_ID in .env.local'));
                        } else if (reason === 'unregistered_origin') {
                            reject(new Error(`Origin not authorized. Add http://localhost:5174 to Google Console > Credentials > Authorized JavaScript origins`));
                        } else {
                            reject(new Error(`Google Sign-In unavailable: ${reason}. Check browser console for details.`));
                        }
                    } else if (notification.isSkippedMoment()) {
                        const reason = notification.getSkippedReason();
                        console.warn('Google Sign-In skipped. Reason:', reason);
                        
                        if (reason === 'user_cancel' || reason === 'tap_outside') {
                            reject(new Error('Sign-in cancelled by user'));
                        } else {
                            reject(new Error(`Sign-in failed: ${reason}. Check browser console for details.`));
                        }
                    }
                    // If dismissed, the callback will be called (success)
                });
            });
        } catch (error) {
            console.error('Google Sign-In error:', error);
            throw error;
        }
    };

    /**
     * Admin login function
     * TODO: Replace with real API call (POST /api/admin/auth/login)
     */
    const loginAdmin = async (credentials: { email: string; password: string }): Promise<void> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock validation - Accept any email/password for demo
        // TODO: Replace with real API call
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Mock admin check: email must contain "admin" keyword
        // TODO: Backend should verify admin role via database/permissions
        if (!credentials.email.toLowerCase().includes('admin')) {
            throw new Error('Invalid admin credentials. Access denied.');
        }

        // Create mock admin user
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: credentials.email.split('@')[0] ?? 'Admin',
            email: credentials.email,
            role: 'admin', // Set admin role
        };

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
        });
    };

    /**
     * Admin login with Google (with domain whitelist)
     * TODO: Send credential to backend for verification (POST /api/admin/auth/google)
     * Current: Client-side domain check for demo (INSECURE for production)
     */
    const loginWithGoogleAdmin = async (): Promise<void> => {
        try {
            // Load Google Identity Services script
            await loadGoogleScript();

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
            if (!clientId) {
                throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env');
            }

            // Get allowed domains for admin (comma-separated)
            const allowedDomainsStr = import.meta.env.VITE_GOOGLE_ALLOWED_DOMAINS as string | undefined;
            const allowedDomains = allowedDomainsStr ? allowedDomainsStr.split(',').map(d => d.trim()) : [];

            if (allowedDomains.length === 0) {
                console.warn('VITE_GOOGLE_ALLOWED_DOMAINS not configured. All domains allowed for demo.');
            }

            // Initialize and prompt for Google Sign-In
            await new Promise<void>((resolve, reject) => {
                if (!window.google?.accounts?.id) {
                    reject(new Error('Google Identity Services not loaded'));
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response: GoogleCredentialResponse) => {
                        try {
                            // Parse JWT payload (client-side - DEMO ONLY)
                            // TODO: Send response.credential to backend for verification
                            const payload = parseJwt(response.credential);

                            // Check domain whitelist
                            const emailDomain = payload.email.split('@')[1];
                            if (allowedDomains.length > 0 && emailDomain && !allowedDomains.includes(emailDomain)) {
                                reject(new Error(`Admin access requires authorized email domain. Allowed: ${allowedDomains.join(', ')}`));
                                return;
                            }

                            // Create admin user from Google profile
                            const user: User = {
                                id: payload.sub,
                                name: payload.name,
                                email: payload.email,
                                role: 'admin', // Set admin role
                            };

                            // Persist to localStorage (mock)
                            // TODO: Backend should return JWT token with admin role claim
                            localStorage.setItem('auth/googleCredential', response.credential);
                            localStorage.setItem('auth/provider', 'google-admin');
                            localStorage.setItem('user', JSON.stringify(user));

                            setAuthState({
                                isAuthenticated: true,
                                isLoading: false,
                                user,
                            });

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    cancel_on_tap_outside: true,
                    use_fedcm_for_prompt: false, // Disable FedCM to avoid browser blocking issues
                });

                // Show Google One Tap prompt
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed()) {
                        const reason = notification.getNotDisplayedReason();
                        console.error('Google Admin Sign-In not displayed. Reason:', reason);
                        
                        if (reason === 'invalid_client' || reason === 'missing_client_id') {
                            reject(new Error('Invalid Google Client ID. Check VITE_GOOGLE_CLIENT_ID in .env.local'));
                        } else if (reason === 'unregistered_origin') {
                            reject(new Error(`Origin not authorized. Add origin to Google Console credentials.`));
                        } else {
                            reject(new Error(`Google Admin Sign-In unavailable: ${reason}`));
                        }
                    } else if (notification.isSkippedMoment()) {
                        const reason = notification.getSkippedReason();
                        
                        if (reason === 'user_cancel' || reason === 'tap_outside') {
                            reject(new Error('Admin sign-in cancelled'));
                        } else {
                            reject(new Error(`Admin sign-in failed: ${reason}`));
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Google Admin Sign-In error:', error);
            throw error;
        }
    };

    return {
        ...authState,
        login,
        register,
        loginWithGoogle,
        loginAdmin,
        loginWithGoogleAdmin,
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
