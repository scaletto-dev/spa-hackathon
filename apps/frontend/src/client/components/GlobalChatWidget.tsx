/**
 * Global Chat Widget - Tab-based interface with AI Chat, Live Chat, and Quick Booking
 * Enhanced with WebSocket support for real-time communication
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, XIcon, SparklesIcon, UsersIcon, CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatWidget } from '../../contexts/ChatWidgetContext';
import { AIChatTab } from './chat/AIChatTab';
import { LiveChatTab } from './chat/LiveChatTab';
import { BookingTab } from './chat/BookingTab';

type TabType = 'ai' | 'live' | 'booking';

export function GlobalChatWidget() {
    const { t } = useTranslation('common');
    const { isOpen, closeChat, toggleChat } = useChatWidget();
    const [activeTab, setActiveTab] = useState<TabType>('ai');
    const [showHint, setShowHint] = useState(true);

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, closeChat]);

    const getTabColor = () => {
        switch (activeTab) {
            case 'live':
                return 'from-blue-500 to-indigo-500';
            case 'booking':
                return 'from-green-500 to-emerald-500';
            default:
                return 'from-pink-500 to-purple-500';
        }
    };

    const getTabIcon = () => {
        switch (activeTab) {
            case 'live':
                return <UsersIcon className='w-7 h-7 text-white' />;
            case 'booking':
                return <CalendarIcon className='w-7 h-7 text-white' />;
            default:
                return <MessageCircleIcon className='w-7 h-7 text-white' />;
        }
    };

    return (
        <>
            {/* Chat toggle button */}
            <motion.button
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${getTabColor()}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                data-testid='chat-toggle-button'
                aria-label={isOpen ? t('chat.closeChat') : t('chat.openChat')}
            >
                <AnimatePresence mode='wait'>
                    {isOpen ? (
                        <motion.div
                            key='close'
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: 90, opacity: 1 }}
                            exit={{ rotate: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <XIcon className='w-7 h-7 text-white' />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='icon'
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {getTabIcon()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Promotional bubble when closed */}
            <AnimatePresence>
                {!isOpen && showHint && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className='fixed bottom-24 right-6 bg-white rounded-xl p-3 shadow-lg max-w-xs z-40 hidden md:block'
                    >
                        <div className='flex items-start gap-3'>
                            <div className='w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
                                <SparklesIcon className='w-5 h-5 text-white' />
                            </div>
                            <div className='flex-1'>
                                <p className='text-sm text-gray-800'>{t('chat.needHelp')}</p>
                                <button
                                    className='text-xs text-pink-600 font-medium mt-1 hover:text-pink-700'
                                    onClick={toggleChat}
                                >
                                    {t('chat.startChat')}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowHint(false)}
                                className='flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors'
                                aria-label={t('chat.closeHint')}
                            >
                                <XIcon className='w-4 h-4 text-gray-400' />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className='fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl w-[360px] max-w-[90vw] z-40 border border-gray-200 overflow-hidden flex flex-col'
                        style={{ height: '70vh', maxHeight: '700px', minHeight: '500px' }}
                        data-testid='chat-window'
                    >
                        {/* Chat header with tabs */}
                        <div className={`bg-gradient-to-r ${getTabColor()}`}>
                            <div className='p-3 flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center'>
                                        {activeTab === 'live' ? (
                                            <UsersIcon className='w-5 h-5 text-white' />
                                        ) : activeTab === 'booking' ? (
                                            <CalendarIcon className='w-5 h-5 text-white' />
                                        ) : (
                                            <SparklesIcon className='w-5 h-5 text-white' />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-white text-sm'>
                                            {activeTab === 'live'
                                                ? t('chat.liveChat')
                                                : activeTab === 'booking'
                                                ? t('chat.quickBooking')
                                                : t('chat.aiAssistant')}
                                        </h3>
                                        <p className='text-xs text-white/80'>
                                            {activeTab === 'live'
                                                ? t('chat.talkToRealPerson')
                                                : activeTab === 'booking'
                                                ? t('chat.bookInSeconds')
                                                : t('chat.poweredByAI')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeChat}
                                    className='p-1 hover:bg-white/20 rounded-full transition-colors'
                                    aria-label={t('chat.closeChat')}
                                >
                                    <XIcon className='w-5 h-5 text-white' />
                                </button>
                            </div>

                            {/* Tab navigation */}
                            <div className='flex bg-black/10'>
                                <button
                                    onClick={() => setActiveTab('ai')}
                                    className={`flex-1 py-2 px-3 text-xs font-medium transition-all ${
                                        activeTab === 'ai'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <SparklesIcon className='w-3.5 h-3.5' />
                                        <span>{t('chat.aiChat')}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('live')}
                                    className={`flex-1 py-2 px-3 text-xs font-medium transition-all ${
                                        activeTab === 'live'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <UsersIcon className='w-3.5 h-3.5' />
                                        <span>{t('chat.liveChat')}</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('booking')}
                                    className={`flex-1 py-2 px-3 text-xs font-medium transition-all ${
                                        activeTab === 'booking'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    <div className='flex items-center justify-center gap-1'>
                                        <CalendarIcon className='w-3.5 h-3.5' />
                                        <span>{t('chat.booking')}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Tab content */}
                        <div className='flex-1 flex flex-col overflow-hidden'>
                            <AIChatTab
                                isActive={activeTab === 'ai'}
                                onRequestAgent={() => setActiveTab('live')}
                                onRequestBooking={() => setActiveTab('booking')}
                            />
                            <LiveChatTab isActive={activeTab === 'live'} onSwitchToAI={() => setActiveTab('ai')} />
                            <BookingTab isActive={activeTab === 'booking'} />
                        </div>

                        {/* Footer */}
                        <div className='px-3 py-2 text-center border-t border-gray-200'>
                            <p className='text-xs text-gray-500'>{t('chat.poweredBy')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
