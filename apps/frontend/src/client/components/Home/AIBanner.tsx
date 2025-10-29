import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';

export function AIBanner() {
    const navigate = useNavigate();
    return (
        <section className='w-full py-16 px-6'>
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.95,
                }}
                whileInView={{
                    opacity: 1,
                    scale: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.6,
                }}
                className='max-w-6xl mx-auto'
            >
                <div className='relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-3xl p-1'>
                    <div className='bg-white/95 backdrop-blur-xl rounded-3xl p-12'>
                        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                            <div className='flex items-start gap-4'>
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className='w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0'
                                >
                                    <SparklesIcon className='w-8 h-8 text-white' />
                                </motion.div>
                                <div>
                                    <h3 className='text-3xl font-bold text-gray-800 mb-2'>
                                        Unsure which treatment fits you?
                                    </h3>
                                    <p className='text-gray-600 text-lg'>
                                        Try our AI beauty consultant for personalized recommendations based on your skin
                                        type and goals
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={() => navigate('/quiz')}
                                data-testid='start-quiz-button'
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                className='flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl whitespace-nowrap'
                            >
                                Start Skin Quiz
                                <ArrowRightIcon className='w-5 h-5' />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
