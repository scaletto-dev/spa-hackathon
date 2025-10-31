/**
 * RegisterPage Component
 *
 * User registration form with theme-consistent design.
 * Includes full validation, password strength check, and Terms/Privacy consent.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

interface LocationState {
    from?: string;
}

/**
 * Password strength validator
 * Requirements: ≥8 chars, 1 uppercase, 1 lowercase, 1 number
 */
function validatePassword(password: string, t: (key: string) => string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: t('auth.passwordMinLength') };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: t('auth.passwordUppercase') };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: t('auth.passwordLowercase') };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: t('auth.passwordNumber') };
    }
    return { valid: true, message: t('auth.passwordStrong') };
}

/**
 * Email format validator
 */
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function RegisterPage() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    const from = (location.state as LocationState)?.from ?? '/';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Validate all fields
        const newErrors: typeof errors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('auth.fullNameRequired');
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('auth.nameMinLength');
        }

        if (!formData.email) {
            newErrors.email = t('auth.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('auth.validEmail');
        }

        const passwordValidation = validatePassword(formData.password, t);
        if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.message;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.confirmPasswordRequired');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.passwordMismatch');
        }

        if (!agreeToTerms) {
            newErrors.terms = t('auth.agreeToTermsRequired');
        }

        // If there are errors, show them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit registration
        setIsSubmitting(true);
        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            toast.show(t('auth.registerSuccess'), 'success');

            // Redirect to original destination or home
            navigate(from, { replace: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('auth.registerSuccess');
            toast.show(errorMessage, 'error');
            setErrors({ email: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordStrength = validatePassword(formData.password, t);
    const showPasswordStrength = formData.password.length > 0;

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'
            >
                {/* Card */}
                <div className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                            <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                {t('auth.createAccount')}
                            </h1>
                            <p className='text-gray-600 mt-2'>{t('auth.joinUs')}</p>
                        </motion.div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Full Name */}
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                                {t('auth.fullName')}
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <UserIcon className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.name ? 'border-red-300' : 'border-pink-100'
                                    } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                    placeholder={t('auth.namePlaceholder')}
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                            </div>
                            {errors.name && (
                                <p id='name-error' className='mt-1 text-sm text-red-600'>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                                {t('auth.emailAddress')}
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <MailIcon className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.email ? 'border-red-300' : 'border-pink-100'
                                    } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                    placeholder={t('auth.emailPlaceholder')}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                            </div>
                            {errors.email && (
                                <p id='email-error' className='mt-1 text-sm text-red-600'>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                                {t('auth.password')}
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LockIcon className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-3 border ${
                                        errors.password ? 'border-red-300' : 'border-pink-100'
                                    } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={
                                        errors.password
                                            ? 'password-error'
                                            : showPasswordStrength
                                            ? 'password-strength'
                                            : undefined
                                    }
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                                    ) : (
                                        <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p id='password-error' className='mt-1 text-sm text-red-600'>
                                    {errors.password}
                                </p>
                            )}
                            {showPasswordStrength && !errors.password && (
                                <p
                                    id='password-strength'
                                    className={`mt-1 text-sm ${
                                        passwordStrength.valid ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    {passwordStrength.valid && <CheckCircleIcon className='inline h-4 w-4 mr-1' />}
                                    {passwordStrength.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                                {t('auth.confirmPassword')}
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LockIcon className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-3 border ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-pink-100'
                                    } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                                    placeholder={t('auth.confirmPasswordPlaceholder')}
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOffIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                                    ) : (
                                        <EyeIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p id='confirm-password-error' className='mt-1 text-sm text-red-600'>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms & Privacy */}
                        <div>
                            <label className='flex items-start'>
                                <input
                                    type='checkbox'
                                    checked={agreeToTerms}
                                    onChange={(e) => {
                                        setAgreeToTerms(e.target.checked);
                                        if (errors.terms) {
                                            setErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors.terms;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    className='mt-1 h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded'
                                    aria-invalid={!!errors.terms}
                                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                                />
                                <span className='ml-2 text-sm text-gray-700'>
                                    {t('auth.agreeToTerms')}{' '}
                                    <Link to='/terms' className='text-pink-600 hover:text-pink-700 underline'>
                                        {t('auth.termsAndConditions')}
                                    </Link>{' '}
                                    {t('auth.and')}{' '}
                                    <Link to='/privacy' className='text-pink-600 hover:text-pink-700 underline'>
                                        {t('auth.privacyPolicy')}
                                    </Link>
                                </span>
                            </label>
                            {errors.terms && (
                                <p id='terms-error' className='mt-1 text-sm text-red-600'>
                                    {errors.terms}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type='submit'
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-xl'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className='flex items-center justify-center'>
                                    <svg className='animate-spin h-5 w-5 mr-2' viewBox='0 0 24 24'>
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                            fill='none'
                                        />
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        />
                                    </svg>
                                    {t('auth.creatingAccount')}
                                </span>
                            ) : (
                                t('auth.createAccount')
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600'>
                            {t('auth.alreadyHaveAccount')}{' '}
                            <Link to='/login' className='text-pink-600 hover:text-pink-700 font-semibold'>
                                {t('auth.signIn')}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <p className='text-center text-xs text-gray-500 mt-6'>{t('auth.accountBenefits')}</p>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
