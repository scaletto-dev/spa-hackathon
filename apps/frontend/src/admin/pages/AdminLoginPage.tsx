import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

export function AdminLoginPage() {
    const location = useLocation();
    const { loginAdmin, loginWithGoogleAdmin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Get the admin page user tried to access before login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

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
                    {/* Google Sign-In Button */}
                    <button
                        type='button'
                        onClick={async () => {
                            setIsGoogleLoading(true);
                            try {
                                await loginWithGoogleAdmin();
                                toast.success('Admin signed in with Google!');
                                console.log('✅ Google Admin logged in, redirecting to:', from);
                                window.location.href = from;
                            } catch (error) {
                                const message = error instanceof Error ? error.message : 'Google Sign-In failed';
                                toast.error(message);
                            } finally {
                                setIsGoogleLoading(false);
                            }
                        }}
                        disabled={isGoogleLoading || isLoading}
                        className='w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-600 hover:border-slate-500 bg-slate-700 hover:bg-slate-600 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isGoogleLoading ? (
                            <div className='w-5 h-5 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin' />
                        ) : (
                            <svg className='w-5 h-5' viewBox='0 0 24 24'>
                                <path
                                    fill='#4285F4'
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                />
                                <path
                                    fill='#34A853'
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                />
                                <path
                                    fill='#FBBC05'
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                />
                                <path
                                    fill='#EA4335'
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                />
                            </svg>
                        )}
                        <span className='font-medium text-gray-200 group-hover:text-white'>
                            Sign in with Google (Admin)
                        </span>
                    </button>

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
