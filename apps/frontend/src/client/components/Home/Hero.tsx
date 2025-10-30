import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, MessageCircleIcon } from 'lucide-react';
import { useChatWidget } from '../../../contexts/ChatWidgetContext';
import { useTranslation } from 'react-i18next';

export function Hero() {
    const navigate = useNavigate();
    const { openChat } = useChatWidget();
    const { t } = useTranslation('common');

    return (
        <section className='relative w-full min-h-screen flex items-center overflow-hidden'>
            {/* Animated gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-50/30 to-rose-100/40' />
            {/* Floating orbs */}
            <motion.div
                className='absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl'
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className='absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full blur-3xl'
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <div className='relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center'>
                {/* Left side - Content */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -50,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                    className='space-y-8'
                >
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-pink-200/50 shadow-lg'>
                        <SparklesIcon className='w-4 h-4 text-pink-500' />
                        <span className='text-sm font-medium text-gray-700'>{t('home.hero.badge')}</span>
                    </div>
                    <h1 className='text-6xl md:text-7xl font-bold leading-tight'>
                        <span className='bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent'>
                            {t('home.hero.title1')}
                        </span>
                        <br />
                        <span className='text-gray-800'>{t('home.hero.title2')}</span>
                    </h1>
                    <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>{t('home.hero.description')}</p>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <motion.button
                            onClick={() => navigate('/booking')}
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            className='relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl overflow-hidden group'
                        >
                            <motion.div
                                className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500'
                                initial={{
                                    x: '100%',
                                }}
                                whileHover={{
                                    x: '0%',
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            />
                            <span className='relative z-10'>{t('home.hero.bookAppointment')}</span>
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/services')}
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            className='px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 rounded-full font-semibold border-2 border-pink-200 shadow-lg hover:bg-white transition-colors'
                        >
                            {t('home.hero.viewServices')}
                        </motion.button>
                    </div>
                    {/* AI Assistant Orb */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.5,
                        }}
                        onClick={openChat}
                        data-testid='ask-ai-button'
                        className='flex items-center gap-3 cursor-pointer group'
                    >
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(236, 72, 153, 0.3)',
                                    '0 0 40px rgba(168, 85, 247, 0.4)',
                                    '0 0 20px rgba(236, 72, 153, 0.3)',
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className='w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'
                        >
                            <MessageCircleIcon className='w-6 h-6 text-white' />
                        </motion.div>
                        <div>
                            <p className='text-sm font-medium text-gray-800'>{t('home.hero.askAI')}</p>
                            <p className='text-xs text-gray-500'>{t('home.hero.askAIDesc')}</p>
                        </div>
                    </motion.div>
                </motion.div>
                {/* Right side - Abstract illustration */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className='relative'
                >
                    <div className='relative w-full h-[600px]'>
                        {/* Glassmorphism cards */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className='absolute top-10 right-10 w-64 h-80 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden'
                        >
                            <img
                                src='https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=600&fit=crop'
                                alt={t('home.hero.beautyTreatment')}
                                className='w-full h-full object-cover'
                            />
                        </motion.div>
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -5, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className='absolute bottom-10 left-10 w-64 h-80 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden'
                        >
                            <img
                                src='https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=600&fit=crop'
                                alt={t('home.hero.skincare')}
                                className='w-full h-full object-cover'
                            />
                        </motion.div>
                        {/* Floating gradient shapes */}
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl'
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
