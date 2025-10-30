import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircleIcon, UserIcon, ShieldIcon } from 'lucide-react';

/**
 * Support Dashboard Login Page
 * Quick access for support staff
 */
export default function SupportLogin() {
    const navigate = useNavigate();

    const handleStaffLogin = () => {
        // Mock staff login
        localStorage.setItem(
            'user_data',
            JSON.stringify({
                id: 'staff-1',
                fullName: 'Support Agent',
                email: 'support@beautyai.com',
                role: 'STAFF',
            }),
        );
        localStorage.setItem('accessToken', 'mock-staff-token');

        // Navigate to support dashboard
        navigate('/support-dashboard');
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className='absolute -top-20 -left-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl'
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className='absolute -bottom-20 -right-20 w-60 h-60 bg-purple-300/20 rounded-full blur-3xl'
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full relative z-10'
            >
                <div className='bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/50'>
                    {/* Header - Enhanced */}
                    <div className='text-center mb-8'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className='relative inline-block mb-4'
                        >
                            <div className='w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/40'>
                                <MessageCircleIcon className='w-10 h-10 text-white' />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className='absolute inset-0 bg-pink-500/30 rounded-3xl blur-xl -z-10'
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2'
                        >
                            Support Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='text-gray-600 text-sm md:text-base'
                        >
                            Customer service portal
                        </motion.p>
                    </div>

                    {/* Login Button - Enhanced */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleStaffLogin}
                        className='w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-3 text-base md:text-lg'
                    >
                        <UserIcon className='w-5 h-5' />
                        Quick Login as Staff
                    </motion.button>

                    {/* Info - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className='mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl'
                    >
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <ShieldIcon className='w-4 h-4 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-sm text-blue-900 font-semibold mb-1'>🚀 Demo Mode</p>
                                <p className='text-xs text-blue-700 leading-relaxed'>
                                    This is a mock login for development. In production, connect to your authentication
                                    system.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features - Enhanced with Stagger Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className='mt-6 space-y-3'
                    >
                        <div className='flex items-center gap-2'>
                            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>✨ Features</p>
                            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
                        </div>
                        <ul className='space-y-2.5'>
                            {[
                                { text: 'Real-time chat with customers', color: 'pink' },
                                { text: 'AI-powered reply suggestions', color: 'purple' },
                                { text: 'Conversation management', color: 'pink' },
                                { text: 'Typing indicators & more', color: 'purple' },
                            ].map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className='flex items-center gap-3 text-sm text-gray-700 group'
                                >
                                    <div
                                        className={`w-2 h-2 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-full shadow-sm group-hover:scale-125 transition-transform`}
                                    />
                                    <span className='group-hover:text-gray-900 transition-colors'>{feature.text}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
