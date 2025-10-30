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
    role: 'admin' | 'client' | 'staff';
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; password: string }) => Promise<void>;
    loginWithGoogle: (buttonElementId?: string) => Promise<void>;
    loginAdmin: (credentials: { email: string; password: string }) => Promise<void>;
    loginWithGoogleAdmin: (buttonElementId?: string) => Promise<void>;
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
        // Check auth from localStorage (auth_token + user_data)
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('accessToken');
                const userStr = localStorage.getItem('user_data');
                if (token && userStr) {
                    const userData = JSON.parse(userStr);
                    const user: User = {
                        id: userData.id,
                        name: userData.fullName,
                        email: userData.email,
                        role: userData.role === 'ADMIN' ? 'admin' : 'client',
                    };
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
        // Clear all auth-related data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user_data');
        localStorage.removeItem('refresh_token');
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
                    .join(''),
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
     *
     * Note: This method renders a button in the provided element ID.
     * Call this function and pass the button container element ID.
     */
    const loginWithGoogle = async (buttonElementId?: string): Promise<void> => {
        try {
            // Load Google Identity Services script
            await loadGoogleScript();

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
            if (!clientId) {
                throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env');
            }

            // Initialize Google Sign-In
            await new Promise<void>((resolve, reject) => {
                if (!window.google?.accounts?.id) {
                    reject(new Error('Google Identity Services not loaded'));
                    return;
                }

                // Callback when user signs in
                const handleCredentialResponse = (response: GoogleCredentialResponse) => {
                    console.log('✅ Google callback triggered!', response);

                    try {
                        // Parse JWT payload (client-side - DEMO ONLY)
                        // TODO: Send response.credential to backend for verification
                        const payload = parseJwt(response.credential);
                        console.log('✅ JWT parsed:', payload);

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
                        console.log('✅ User saved to localStorage:', user);

                        setAuthState({
                            isAuthenticated: true,
                            isLoading: false,
                            user,
                        });
                        console.log('✅ Auth state updated');

                        resolve();
                    } catch (error) {
                        console.error('❌ Error in callback:', error);
                        reject(error);
                    }
                };

                // Initialize with FedCM enabled (required for future Google updates)
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false, // Don't auto-select previously signed-in user
                    cancel_on_tap_outside: true,
                    // FedCM is now enabled by default - don't disable it
                });

                // If button element ID provided, render button instead of One Tap
                if (buttonElementId) {
                    const buttonElement = document.getElementById(buttonElementId);
                    if (!buttonElement) {
                        reject(new Error(`Element with id "${buttonElementId}" not found`));
                        return;
                    }

                    // Render Google Sign-In button (more reliable than One Tap)
                    window.google.accounts.id.renderButton(buttonElement, {
                        theme: 'outline',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rectangular',
                        width: buttonElement.offsetWidth || 300,
                    });

                    console.log('Google Sign-In button rendered');

                    // Resolve immediately - callback will handle auth when user clicks button
                    resolve();
                } else {
                    // Fallback: Try One Tap prompt (may be blocked by browser)
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed()) {
                            const reason = notification.getNotDisplayedReason();
                            console.warn('Google One Tap not displayed:', reason);

                            // One Tap blocked - suggest using button instead
                            reject(
                                new Error('Google One Tap is blocked. Please use the Google Sign-In button instead.'),
                            );
                        } else if (notification.isSkippedMoment()) {
                            const reason = notification.getSkippedReason();
                            if (reason === 'user_cancel' || reason === 'tap_outside') {
                                reject(new Error('Sign-in cancelled by user'));
                            } else {
                                reject(new Error(`Sign-in skipped: ${reason}`));
                            }
                        }
                        // If displayed successfully, callback will be called
                    });
                }
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
     *
     * Note: This method renders a button in the provided element ID.
     * Call this function and pass the button container element ID.
     */
    const loginWithGoogleAdmin = async (buttonElementId?: string): Promise<void> => {
        try {
            // Load Google Identity Services script
            await loadGoogleScript();

            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
            if (!clientId) {
                throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env');
            }

            // Get allowed domains for admin (comma-separated)
            const allowedDomainsStr = import.meta.env.VITE_GOOGLE_ALLOWED_DOMAINS as string | undefined;
            const allowedDomains = allowedDomainsStr ? allowedDomainsStr.split(',').map((d) => d.trim()) : [];

            if (allowedDomains.length === 0) {
                console.warn('VITE_GOOGLE_ALLOWED_DOMAINS not configured. All domains allowed for demo.');
            }

            // Initialize and prompt for Google Sign-In
            await new Promise<void>((resolve, reject) => {
                if (!window.google?.accounts?.id) {
                    reject(new Error('Google Identity Services not loaded'));
                    return;
                }

                // Callback when admin signs in
                const handleCredentialResponse = (response: GoogleCredentialResponse) => {
                    console.log('✅ Google Admin callback triggered!', response);

                    try {
                        // Parse JWT payload (client-side - DEMO ONLY)
                        // TODO: Send response.credential to backend for verification
                        const payload = parseJwt(response.credential);
                        console.log('✅ Admin JWT parsed:', payload);

                        // Check domain whitelist
                        const emailDomain = payload.email.split('@')[1];
                        if (allowedDomains.length > 0 && emailDomain && !allowedDomains.includes(emailDomain)) {
                            console.error('❌ Domain not allowed:', emailDomain);
                            reject(
                                new Error(
                                    `Admin access requires authorized email domain. Allowed: ${allowedDomains.join(
                                        ', ',
                                    )}`,
                                ),
                            );
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
                        console.log('✅ Admin saved to localStorage:', user);

                        setAuthState({
                            isAuthenticated: true,
                            isLoading: false,
                            user,
                        });
                        console.log('✅ Admin auth state updated');

                        resolve();
                    } catch (error) {
                        console.error('❌ Error in admin callback:', error);
                        reject(error);
                    }
                };

                // Initialize with FedCM enabled
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                // If button element ID provided, render button
                if (buttonElementId) {
                    const buttonElement = document.getElementById(buttonElementId);
                    if (!buttonElement) {
                        reject(new Error(`Element with id "${buttonElementId}" not found`));
                        return;
                    }

                    // Render Google Sign-In button for admin
                    window.google.accounts.id.renderButton(buttonElement, {
                        theme: 'filled_blue', // Different theme for admin
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        width: buttonElement.offsetWidth || 300,
                    });

                    console.log('Google Admin Sign-In button rendered');

                    // Resolve immediately - callback will handle auth when admin clicks button
                    resolve();
                } else {
                    // Fallback: Try One Tap (may be blocked)
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed()) {
                            const reason = notification.getNotDisplayedReason();
                            console.warn('Google Admin One Tap not displayed:', reason);
                            reject(new Error('Google One Tap blocked. Please use the sign-in button.'));
                        } else if (notification.isSkippedMoment()) {
                            const reason = notification.getSkippedReason();
                            if (reason === 'user_cancel' || reason === 'tap_outside') {
                                reject(new Error('Admin sign-in cancelled'));
                            } else {
                                reject(new Error(`Admin sign-in skipped: ${reason}`));
                            }
                        }
                    });
                }
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
 *
 * Usage in browser console:
 * - Admin: window.mockLogin('admin')
 * - Client: window.mockLogin('client')
 */
export function mockLogin(role: 'admin' | 'client' = 'client') {
    const user: User = {
        id: '1',
        name: role === 'admin' ? 'Admin User' : 'Client User',
        email: role === 'admin' ? 'admin@example.com' : 'client@example.com',
        role,
    };

    // Mock token expires in 30 minutes
    const expiresAt = Date.now() + 30 * 60 * 1000;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth/token', 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9));
    localStorage.setItem('auth/expiresAt', expiresAt.toString());
    localStorage.setItem('auth/provider', 'mock');

    console.log(`✅ Mock login as ${role}:`, user);
    console.log(`🕐 Token expires at: ${new Date(expiresAt).toLocaleTimeString()}`);

    window.location.reload();
}

/**
 * Legacy mock logout function
 * TODO: Remove after real auth is implemented
 */
export function mockLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('auth/token');
    localStorage.removeItem('auth/expiresAt');
    localStorage.removeItem('auth/provider');
    localStorage.removeItem('auth/googleCredential');

    console.log('✅ Logged out');
    window.location.reload();
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
    (window as unknown as { mockLogin: typeof mockLogin; mockLogout: typeof mockLogout }).mockLogin = mockLogin;
    (window as unknown as { mockLogin: typeof mockLogin; mockLogout: typeof mockLogout }).mockLogout = mockLogout;
}
