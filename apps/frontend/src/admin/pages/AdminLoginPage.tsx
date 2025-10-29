import { useState, FormEvent, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

export function AdminLoginPage() {
    const location = useLocation();
    const { loginAdmin, loginWithGoogleAdmin, isAuthenticated, user } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Get the admin page user tried to access before login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

    // Redirect when admin authenticated (handles Google Sign-In callback)
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            console.log('✅ Admin authenticated, redirecting to:', from);
            toast.success('Welcome back, Admin!');
            // Use window.location for full reload to ensure guards see updated state
            window.location.href = from;
        }
    }, [isAuthenticated, user, from]);

    // Initialize Google Admin Sign-In button when component mounts
    useEffect(() => {
        const initGoogleButton = () => {
            // Call without await - button will handle auth when admin clicks
            loginWithGoogleAdmin('google-admin-signin-button').catch((error) => {
                console.error('Failed to initialize Google Admin Sign-In:', error);
                toast.error('Could not load Google Admin Sign-In');
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initGoogleButton, 100);
        return () => clearTimeout(timer);
    }, [loginWithGoogleAdmin]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await loginAdmin({ email: formData.email, password: formData.password });

            toast.success('Welcome back, Admin!');

            console.log('✅ Admin logged in, redirecting to:', from);

            // Use window.location to force full page reload
            // This ensures RequireRole guard sees the updated localStorage
            window.location.href = from;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Invalid admin credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'
            >
                {/* Logo & Header */}
                <div className='text-center mb-8'>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className='inline-flex items-center gap-2 mb-4'
                    >
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center'>
                            <ShieldCheckIcon className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
                            Admin Portal
                        </h1>
                    </motion.div>
                    <p className='text-gray-400'>Secure access for administrators only</p>
                </div>

                {/* Login Form Card */}
                <div className='bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl p-8'>
                    {/* Google Admin Sign-In Button Container */}
                    <div id='google-admin-signin-button' className='w-full mb-6'></div>

                    {/* Divider */}
                    <div className='relative my-6'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-slate-700' />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-4 bg-slate-800/50 text-gray-400'>Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <MailIcon className='w-5 h-5 text-gray-500' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                                        errors.email
                                            ? 'border-red-500 focus:ring-red-400'
                                            : 'border-slate-600 focus:ring-blue-500'
                                    } bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder='admin@company.com'
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                            </div>
                            {errors.email && (
                                <p id='email-error' className='mt-1 text-sm text-red-400' role='alert'>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LockIcon className='w-5 h-5 text-gray-500' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                                        errors.password
                                            ? 'border-red-500 focus:ring-red-400'
                                            : 'border-slate-600 focus:ring-blue-500'
                                    } bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder='Enter your password'
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300'
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className='w-5 h-5' />
                                    ) : (
                                        <EyeIcon className='w-5 h-5' />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p id='password-error' className='mt-1 text-sm text-red-400' role='alert'>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className='flex items-center justify-between'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className='w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800'
                                />
                                <span className='text-sm text-gray-300'>Remember me</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type='submit'
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                                isLoading
                                    ? 'bg-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                            }`}
                        >
                            {isLoading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In to Admin Portal'
                            )}
                        </motion.button>
                    </form>

                    {/* Security Notice */}
                    <div className='mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl'>
                        <p className='text-xs text-blue-300 text-center'>
                            ��� Admin access is restricted and monitored. Unauthorized access attempts will be logged.
                        </p>
                    </div>
                </div>

                {/* Back to Site */}
                <div className='mt-6 text-center'>
                    <Link to='/' className='text-sm text-gray-400 hover:text-blue-400 transition-colors'>
                        ← Back to main site
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminLoginPage;
