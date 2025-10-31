import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, SparklesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

export function LoginPage() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Get the page user tried to access before being redirected to login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    // Redirect when authenticated (handles Google Sign-In callback)
    useEffect(() => {
        if (isAuthenticated) {
            console.log('✅ User authenticated, redirecting to:', from);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, from, navigate]);

    // Initialize Google Sign-In button when component mounts
    useEffect(() => {
        const initGoogleButton = () => {
            // Call without await - button will handle auth when user clicks
            loginWithGoogle('google-signin-button').catch((error) => {
                console.error('Failed to initialize Google Sign-In:', error);
                toast.error('Could not load Google Sign-In');
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initGoogleButton, 100);
        return () => clearTimeout(timer);
    }, [loginWithGoogle]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = t('auth.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('auth.validEmail');
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = t('auth.passwordRequired');
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
        <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-4"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            BeautyAI
                        </h1>
                    </motion.div>
                    <p className="text-gray-600">{t('auth.welcomeBack')}</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
                    {/* Google Sign-In Button Container */}
                    <div id="google-signin-button" className="w-full mb-6"></div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/70 text-gray-500">
                                {t('auth.orContinueEmail')}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('auth.emailAddress')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
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
                                    placeholder={t('auth.enterYourEmail')}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                            </div>
                            {errors.email && (
                                <p
                                    id="email-error"
                                    className="mt-1 text-sm text-red-600"
                                    role="alert"
                                >
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
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
                                    placeholder={t('auth.enterYourPassword')}
                                    aria-describedby={
                                        errors.password ? 'password-error' : undefined
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-pink-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p
                                    id="password-error"
                                    className="mt-1 text-sm text-red-600"
                                    role="alert"
                                >
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) =>
                                        setFormData({ ...formData, rememberMe: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-200"
                                />
                                <span className="text-sm text-gray-600">
                                    {t('auth.rememberMe')}
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                            >
                                {t('auth.forgotPassword')}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
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
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('auth.signingIn')}
                                </span>
                            ) : (
                                t('auth.signInButton')
                            )}
                        </motion.button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {t('auth.dontHaveAccount')}{' '}
                            <Link
                                to="/register"
                                className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                            >
                                {t('auth.createAccount')}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-pink-600 transition-colors"
                    >
                        {t('common.backHome')}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
