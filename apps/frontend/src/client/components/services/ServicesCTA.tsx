import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MessageCircleIcon, SparklesIcon } from 'lucide-react';
import { useChatWidget } from '../../../contexts/ChatWidgetContext';

export function ServicesCTA() {
    const navigate = useNavigate();
    const { openChat } = useChatWidget();
    return (
        <section className='w-full py-24 px-6 bg-gradient-to-b from-transparent to-pink-50/30'>
            <div className='max-w-6xl mx-auto'>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className='relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-3xl p-1'
                >
                    <div className='bg-white/95 backdrop-blur-xl rounded-3xl p-12'>
                        <div className='text-center max-w-3xl mx-auto space-y-8'>
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className='inline-flex w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl items-center justify-center'
                            >
                                <SparklesIcon className='w-10 h-10 text-white' />
                            </motion.div>
                            <h2 className='text-4xl md:text-5xl font-bold text-gray-800'>
                                Ready to Transform Your Skin?
                            </h2>
                            <p className='text-xl text-gray-600 leading-relaxed'>
                                Book your personalized consultation today and let our AI technology create the perfect
                                treatment plan for you. Experience the future of beauty care.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                                <motion.button
                                    onClick={() => navigate('/booking')}
                                    data-testid='services-cta-book'
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                    className='flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl'
                                >
                                    <CalendarIcon className='w-5 h-5' />
                                    Book Appointment
                                </motion.button>
                                <motion.button
                                    onClick={openChat}
                                    data-testid='services-cta-chat'
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                    }}
                                    className='flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 rounded-full font-semibold border-2 border-pink-200 shadow-lg hover:bg-white transition-colors'
                                >
                                    <MessageCircleIcon className='w-5 h-5' />
                                    Chat with AI
                                </motion.button>
                            </div>
                            <div className='grid md:grid-cols-3 gap-6 pt-8'>
                                <div className='text-center'>
                                    <p className='text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                        10,000+
                                    </p>
                                    <p className='text-gray-600 mt-2'>Happy Clients</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                        98%
                                    </p>
                                    <p className='text-gray-600 mt-2'>Satisfaction Rate</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                        15+
                                    </p>
                                    <p className='text-gray-600 mt-2'>Years Experience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
