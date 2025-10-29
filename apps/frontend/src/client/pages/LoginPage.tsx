import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, SparklesIcon } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Get the page user tried to access before being redirected to login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

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
            // TODO: Replace with real API call
            await login({ email: formData.email, password: formData.password });

            toast.success('Welcome back!');

            // Redirect to original destination or home
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6 py-12'>
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
                        <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                            <SparklesIcon className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            BeautyAI
                        </h1>
                    </motion.div>
                    <p className='text-gray-600'>Welcome back! Please login to your account.</p>
                </div>

                {/* Login Form Card */}
                <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'>
                    {/* Google Sign-In Button */}
                    <button
                        type='button'
                        onClick={async () => {
                            setIsGoogleLoading(true);
                            try {
                                await loginWithGoogle();
                                toast.success('Signed in with Google!');
                                navigate(from, { replace: true });
                            } catch (error) {
                                const message = error instanceof Error ? error.message : 'Google Sign-In failed';
                                toast.error(message);
                            } finally {
                                setIsGoogleLoading(false);
                            }
                        }}
                        disabled={isGoogleLoading || isLoading}
                        className='w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isGoogleLoading ? (
                            <div className='w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin' />
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
                        <span className='font-medium text-gray-700 group-hover:text-gray-900'>
                            Continue with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className='relative my-6'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-200' />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-4 bg-white/70 text-gray-500'>Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <MailIcon className='w-5 h-5 text-gray-400' />
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
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-pink-200'
                                    } focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder='Enter your email'
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                            </div>
                            {errors.email && (
                                <p id='email-error' className='mt-1 text-sm text-red-600' role='alert'>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LockIcon className='w-5 h-5 text-gray-400' />
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
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-pink-200'
                                    } focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder='Enter your password'
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-pink-600 transition-colors'
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className='w-5 h-5 text-gray-400' />
                                    ) : (
                                        <EyeIcon className='w-5 h-5 text-gray-400' />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p id='password-error' className='mt-1 text-sm text-red-600' role='alert'>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className='flex items-center justify-between'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className='w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-200'
                                />
                                <span className='text-sm text-gray-600'>Remember me</span>
                            </label>
                            <Link
                                to='/forgot-password'
                                className='text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors'
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type='submit'
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                            }`}
                        >
                            {isLoading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Sign Up Link */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600'>
                            Don't have an account?{' '}
                            <Link
                                to='/register'
                                className='text-pink-600 hover:text-pink-700 font-semibold transition-colors'
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className='mt-6 text-center'>
                    <Link to='/' className='text-sm text-gray-500 hover:text-pink-600 transition-colors'>
                        ← Back to home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
