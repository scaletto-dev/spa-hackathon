/**
 * LoginPageOTP Component
 *
 * Story 4.4: Login with Email and Password
 * Direct login with credentials (no OTP required)
 */

import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { login } from '../../services/authApi';
import { toast } from '../../utils/toast';

type LoginStep = 'form' | 'success';

export function LoginPageOTP() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';

    // Form state
    const [step, setStep] = useState<LoginStep>('form');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);

    // UI state
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            const newErrors = { ...errors };
            delete newErrors[name as keyof typeof errors];
            setErrors(newErrors);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validation
        const newErrors: typeof errors = {};

        if (!formData.email) {
            newErrors.email = t('auth.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('auth.validEmail');
        }

        if (!formData.password) {
            newErrors.password = t('auth.passwordRequired');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit login
        setIsSubmitting(true);
        try {
            const response = await login({
                email: formData.email.trim(),
                password: formData.password,
            });

            // Store session
            localStorage.setItem('accessToken', response.session.accessToken);
            localStorage.setItem('refresh_token', response.session.refreshToken);
            localStorage.setItem('user_data', JSON.stringify(response.user));

            toast.show(t('auth.loginSuccessful'), 'success');
            // setStep('success');

            // Redirect after showing success
            setTimeout(() => {
                navigate(returnUrl, { replace: true });
            }, 500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('common.error');
            toast.show(errorMessage, 'error');
            setErrors({ email: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
                    {/* Login Form */}
                    {step === 'form' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    {t('auth.welcomeBack')}
                                </h1>
                                <p className="text-gray-600 mt-2">{t('auth.signInToContinue')}</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t('auth.emailAddress')}{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MailIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className={`block w-full pl-10 pr-3 py-3 border ${
                                                errors.email ? 'border-red-300' : 'border-pink-100'
                                            } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t('auth.password')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            className={`block w-full pl-10 pr-12 py-3 border ${
                                                errors.password
                                                    ? 'border-red-300'
                                                    : 'border-pink-100'
                                            } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                            placeholder={t('auth.enterPassword')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    {t('auth.dontHaveAccount')}{' '}
                                    <Link
                                        to="/register"
                                        className="text-pink-600 hover:text-pink-700 font-semibold"
                                    >
                                        {t('auth.createAccount')}
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Success State */}
                    {step === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                                <CheckCircleIcon className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {t('auth.loginSuccessful')}
                            </h2>
                            <p className="text-gray-600">{t('auth.redirecting')}</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPageOTP;
