/**
 * Authentication adapter
 * Handles auth state from localStorage (accessToken, user_data, refresh_token)
 * For real backend API integration
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
 * Authentication hook
 * Manages auth state from localStorage
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
        // Check auth from localStorage (accessToken + user_data)
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
     * Login function
     * Calls backend API (POST /api/auth/login)
     */
    const login = async (credentials: { email: string; password: string }): Promise<void> => {
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Call backend API
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();

        // Store tokens and user data from backend
        localStorage.setItem('accessToken', data.session.accessToken);
        if (data.session.refreshToken) {
            localStorage.setItem('refresh_token', data.session.refreshToken);
        }
        localStorage.setItem('user_data', JSON.stringify(data.user));

        // Update auth state
        const user: User = {
            id: data.user.id,
            name: data.user.fullName,
            email: data.user.email,
            role: data.user.role === 'ADMIN' ? 'admin' : 'client',
        };

        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
        });
    };

    /**
     * Register function
     * Calls backend API (POST /api/auth/register)
     */
    const register = async (data: { name: string; email: string; password: string }): Promise<void> => {
        if (!data.name || !data.email || !data.password) {
            throw new Error('All fields are required');
        }

        // Call backend API
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const responseData = await response.json();

        // Store tokens and user data from backend
        localStorage.setItem('accessToken', responseData.session.accessToken);
        if (responseData.session.refreshToken) {
            localStorage.setItem('refresh_token', responseData.session.refreshToken);
        }
        localStorage.setItem('user_data', JSON.stringify(responseData.user));

        // Update auth state
        const user: User = {
            id: responseData.user.id,
            name: responseData.user.fullName,
            email: responseData.user.email,
            role: responseData.user.role === 'ADMIN' ? 'admin' : 'client',
        };

        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
        });
    };

    /**
     * Logout function
     * Clears all auth data from localStorage
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
     * Login with Google (using Google Identity Services)
     * Sends credential to backend for verification (POST /api/auth/google)
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
                const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
                    console.log('✅ Google callback triggered!', response);

                    try {
                        // Send credential to backend for verification
                        const verifyResponse = await fetch('/api/v1/auth/google', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ credential: response.credential }),
                        });

                        if (!verifyResponse.ok) {
                            const error = await verifyResponse.json();
                            throw new Error(error.message || 'Google Sign-In verification failed');
                        }

                        const data = await verifyResponse.json();

                        // Store tokens and user data from backend
                        localStorage.setItem('accessToken', data.session.accessToken);
                        if (data.session.refreshToken) {
                            localStorage.setItem('refresh_token', data.session.refreshToken);
                        }
                        localStorage.setItem('user_data', JSON.stringify(data.user));
                        localStorage.setItem('auth/googleCredential', response.credential);

                        // Update auth state
                        const user: User = {
                            id: data.user.id,
                            name: data.user.fullName,
                            email: data.user.email,
                            role: data.user.role === 'ADMIN' ? 'admin' : 'client',
                        };

                        console.log('✅ User saved from backend:', user);

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
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Call backend API
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Admin login failed');
        }

        const data = await response.json();

        // Store tokens and user data from backend
        localStorage.setItem('accessToken', data.session.accessToken);
        if (data.session.refreshToken) {
            localStorage.setItem('refresh_token', data.session.refreshToken);
        }
        localStorage.setItem('user_data', JSON.stringify(data.user));

        // Update auth state
        const user: User = {
            id: data.user.id,
            name: data.user.fullName,
            email: data.user.email,
            role: data.user.role === 'ADMIN' ? 'admin' : 'client',
        };

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
                const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
                    console.log('✅ Google Admin callback triggered!', response);

                    try {
                        // Send credential to backend for verification
                        const verifyResponse = await fetch('/api/v1/auth/google-admin', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ credential: response.credential }),
                        });

                        if (!verifyResponse.ok) {
                            const error = await verifyResponse.json();
                            throw new Error(error.message || 'Admin Google Sign-In verification failed');
                        }

                        const data = await verifyResponse.json();

                        // Store tokens and user data from backend
                        localStorage.setItem('accessToken', data.session.accessToken);
                        if (data.session.refreshToken) {
                            localStorage.setItem('refresh_token', data.session.refreshToken);
                        }
                        localStorage.setItem('user_data', JSON.stringify(data.user));
                        localStorage.setItem('auth/googleCredential', response.credential);

                        // Update auth state
                        const user: User = {
                            id: data.user.id,
                            name: data.user.fullName,
                            email: data.user.email,
                            role: data.user.role === 'ADMIN' ? 'admin' : 'client',
                        };

                        console.log('✅ Admin saved from backend:', user);

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

    // Store in localStorage for backward compatibility
    localStorage.setItem(
        'user_data',
        JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.name,
            role: role === 'admin' ? 'ADMIN' : 'MEMBER',
        }),
    );
    localStorage.setItem('accessToken', 'mock-token-' + Math.random().toString(36).substr(2, 9));

    console.log(`✅ Mock login as ${role}:`, user);
    window.location.reload();
}

/**
 * Legacy mock logout function
 * TODO: Remove after real auth is implemented
 */
export function mockLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_data');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth/googleCredential');

    console.log('✅ Logged out');
    window.location.reload();
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
    (window as unknown as { mockLogin: typeof mockLogin; mockLogout: typeof mockLogout }).mockLogin = mockLogin;
    (window as unknown as { mockLogin: typeof mockLogin; mockLogout: typeof mockLogout }).mockLogout = mockLogout;
}
