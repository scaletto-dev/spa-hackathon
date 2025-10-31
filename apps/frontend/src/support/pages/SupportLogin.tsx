import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircleIcon, SparklesIcon, CheckCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { toast } from '../../utils/toast';

/**
 * Support Dashboard Login Page
 * Staff authentication with real login
 */
export default function SupportLogin() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStaffLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error(t('support.login.emailRequired'));
            return;
        }

        try {
            setIsLoading(true);
            await login({ email, password });

            // Check if user has staff or admin role
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const user = JSON.parse(userData);
                const roleUpper = user.role.toUpperCase();
                if (roleUpper === 'STAFF' || roleUpper === 'ADMIN' || roleUpper === 'SUPER_ADMIN') {
                    toast.success(t('support.login.loginSuccess'));
                    navigate('/support-dashboard');
                } else {
                    toast.error('Access denied. Staff or Admin role required.');
                    localStorage.removeItem('user_data');
                    localStorage.removeItem('accessToken');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage =
                error instanceof Error ? error.message : t('support.login.loginFailed');
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-300/20 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/50">
                    {/* Header - Enhanced */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="relative inline-block mb-4"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/40">
                                <MessageCircleIcon className="w-10 h-10 text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-pink-500/30 rounded-3xl blur-xl -z-10"
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2"
                        >
                            Support Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-600 text-sm md:text-base"
                        >
                            {t('support.login.subtitle')}
                        </motion.p>
                    </div>

                    {/* Login Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onSubmit={handleStaffLogin}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('support.login.email')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('support.login.emailPlaceholder')}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('support.login.password')}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('support.login.passwordPlaceholder')}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{
                                scale: isLoading ? 1 : 1.03,
                                boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
                            }}
                            whileTap={{ scale: isLoading ? 1 : 0.97 }}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-3 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    {t('support.login.loggingIn')}
                                </>
                            ) : (
                                <>
                                    <MessageCircleIcon className="w-5 h-5" />
                                    {t('support.login.login')}
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Features - Enhanced with Stagger Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                ✨ Features
                            </p>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        </div>
                        <ul className="space-y-2.5">
                            {[
                                {
                                    text: t('support.login.features.realtime'),
                                    icon: CheckCircleIcon,
                                    color: 'pink',
                                },
                                {
                                    text: t('support.login.features.ai'),
                                    icon: SparklesIcon,
                                    color: 'purple',
                                },
                                {
                                    text: t('support.login.features.management'),
                                    icon: CheckCircleIcon,
                                    color: 'pink',
                                },
                                {
                                    text: t('support.login.features.indicators'),
                                    icon: CheckCircleIcon,
                                    color: 'purple',
                                },
                            ].map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-3 text-sm text-gray-700 group"
                                >
                                    <feature.icon
                                        className={`w-4 h-4 text-${feature.color}-600 group-hover:scale-110 transition-transform`}
                                    />
                                    <span className="group-hover:text-gray-900 transition-colors">
                                        {feature.text}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
