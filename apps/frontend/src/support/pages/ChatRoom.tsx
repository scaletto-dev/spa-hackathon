import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, SmileIcon, PaperclipIcon, ArrowLeftIcon, UserIcon, SparklesIcon } from 'lucide-react';
import { Message } from '../types';
import { useSocket } from '../../contexts/SocketContext';
import { toast } from '../../utils/toast';
import { AIHintPanel } from '../components/AIHintPanel';
import * as supportApi from '../../services/supportApi';

function ChatRoom() {
    const { t } = useTranslation();
    const { conversationId } = useParams<{ conversationId: string }>();
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showAIPanel, setShowAIPanel] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [customerName, setCustomerName] = useState('Customer');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Fetch messages from API
    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const [messagesData, conversationData] = await Promise.all([
                    supportApi.getMessages(conversationId),
                    supportApi.getConversation(conversationId),
                ]);

                setMessages(
                    messagesData.map((msg) => {
                        const message: Message = {
                            id: msg.id,
                            conversationId: msg.conversationId,
                            sender: msg.sender.toLowerCase() as 'customer' | 'staff' | 'ai',
                            content: msg.content,
                            createdAt: msg.createdAt,
                        };
                        if (msg.senderName) {
                            message.senderName = msg.senderName;
                        }
                        return message;
                    }),
                );

                setCustomerName(conversationData.customerName);

                // Join the conversation room via socket
                if (socket) {
                    socket.emit('conversation:join', { conversationId });
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                toast.error(t('support.chat.failedToLoad'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        return () => {
            if (socket && conversationId) {
                socket.emit('conversation:leave', { conversationId });
            }
        };
    }, [conversationId, socket, t]);

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;

        socket.on(
            'message:new',
            (newMessage: {
                id: string;
                conversationId: string;
                sender: string;
                senderName?: string;
                content: string;
                createdAt: string;
            }) => {
                if (newMessage.conversationId === conversationId) {
                    setMessages((prev) => {
                        // Deduplication check - prevent duplicate messages
                        const exists = prev.some(
                            (msg) =>
                                msg.content === newMessage.content &&
                                msg.sender === newMessage.sender.toLowerCase() &&
                                // Check timestamp within 2 second window
                                Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) <
                                    2000,
                        );

                        if (exists) {
                            console.log(
                                '🚫 Duplicate message detected, ignoring:',
                                newMessage.content.substring(0, 30),
                            );
                            return prev;
                        }

                        const message: Message = {
                            id: newMessage.id,
                            conversationId: newMessage.conversationId,
                            sender: newMessage.sender.toLowerCase() as 'customer' | 'staff' | 'ai',
                            content: newMessage.content,
                            createdAt: newMessage.createdAt,
                        };
                        if (newMessage.senderName) {
                            message.senderName = newMessage.senderName;
                        }

                        console.log('✅ New message received:', newMessage.content.substring(0, 30));
                        return [...prev, message];
                    });
                }
            },
        );

        socket.on('user:typing', (data: { conversationId: string; isTyping: boolean }) => {
            if (data.conversationId === conversationId) {
                setIsTyping(data.isTyping);
            }
        });

        return () => {
            socket.off('message:new');
            socket.off('user:typing');
        };
    }, [socket, conversationId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !conversationId) return;

        const messageContent = inputValue.trim();
        setInputValue('');

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        // Optimistic update - Add message to UI immediately
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            conversationId,
            sender: 'staff',
            senderName: 'Support Staff',
            content: messageContent,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            // Send via socket for real-time delivery
            if (socket && isConnected) {
                socket.emit('message:send', {
                    conversationId,
                    content: messageContent,
                    sender: 'staff',
                    senderName: 'Support Staff',
                });
            } else {
                // Fallback to HTTP if socket not connected
                await supportApi.sendMessage({
                    conversationId,
                    content: messageContent,
                    sender: 'staff',
                    senderName: 'Support Staff',
                });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error(t('support.chat.failedToSend'));
            // Remove optimistic message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
        }
    };

    const handleTyping = () => {
        if (socket && conversationId) {
            socket.emit('user:typing', { conversationId, isTyping: true });
            setTimeout(() => {
                socket.emit('user:typing', { conversationId, isTyping: false });
            }, 1000);
        }
    };

    // Auto-resize textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            // Max height: 200px (roughly 8-10 lines)
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
    };

    // Adjust height when inputValue changes
    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    const handleCloseConversation = async () => {
        if (!conversationId) return;

        try {
            await supportApi.closeConversation(conversationId);

            if (socket) {
                socket.emit('conversation:close', { conversationId });
            }

            toast.success(t('support.chat.conversationClosed'));
            navigate('/support-dashboard');
        } catch (error) {
            console.error('Failed to close conversation:', error);
            toast.error(t('support.chat.failedToClose'));
        }
    };

    const formatTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
            </div>
        );
    }

    return (
        <div className='flex h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30 overflow-hidden'>
            {/* Main Chat Area */}
            <div className='flex-1 flex flex-col'>
                {/* Header - Glassmorphism */}
                <div className='bg-white/70 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <motion.button
                                onClick={() => navigate('/support-dashboard')}
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className='w-10 h-10 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-gray-200/50'
                            >
                                <ArrowLeftIcon className='w-5 h-5 text-gray-700' />
                            </motion.button>

                            <div className='relative'>
                                <div className='w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30'>
                                    <UserIcon className='w-6 h-6 md:w-7 md:h-7 text-white' />
                                </div>
                                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse' />
                            </div>

                            <div>
                                <h2 className='font-bold text-lg md:text-xl text-gray-900'>{customerName}</h2>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            isConnected ? 'bg-green-500' : 'bg-red-500'
                                        } shadow-sm`}
                                    />
                                    <span className='text-xs text-gray-500'>
                                        {isConnected ? t('support.chat.connected') : t('support.chat.disconnected')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <motion.button
                                onClick={() => setShowAIPanel(!showAIPanel)}
                                whileHover={{ scale: 1.05, rotate: showAIPanel ? -10 : 10 }}
                                whileTap={{ scale: 0.95 }}
                                className={`hidden md:flex px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                                    showAIPanel
                                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white shadow-pink-500/30'
                                        : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50'
                                } gap-2 items-center`}
                            >
                                <SparklesIcon className='w-4 h-4' />
                                <span className='text-sm'>{t('support.chat.aiHints')}</span>
                            </motion.button>
                            <motion.button
                                onClick={handleCloseConversation}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-4 py-2 rounded-xl bg-white/80 hover:bg-red-50 text-red-600 font-medium border border-red-200/50 shadow-md hover:shadow-lg transition-all'
                            >
                                <span className='text-sm'>{t('support.chat.close')}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Improved Scrollbar */}
                <div className='flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400'>
                    <div className='max-w-4xl mx-auto space-y-4'>
                        <AnimatePresence initial={false}>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.03 }}
                                    className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`group max-w-[75%] md:max-w-[65%] ${
                                            message.sender === 'staff' ? 'items-end' : 'items-start'
                                        } space-y-1`}
                                    >
                                        {/* Sender Name - Small Label */}
                                        <div
                                            className={`text-xs font-medium px-1 ${
                                                message.sender === 'staff'
                                                    ? 'text-pink-600 text-right'
                                                    : message.sender === 'ai'
                                                    ? 'text-purple-600'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {message.sender === 'staff'
                                                ? t('support.chat.you')
                                                : message.senderName || t('support.chat.customer')}
                                        </div>

                                        {/* Message Bubble - Enhanced */}
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className={`px-4 md:px-5 py-3 md:py-3.5 rounded-2xl md:rounded-3xl shadow-md group-hover:shadow-lg transition-all ${
                                                message.sender === 'staff'
                                                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white'
                                                    : message.sender === 'ai'
                                                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 border border-purple-200/50'
                                                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200/50'
                                            }`}
                                        >
                                            {message.sender === 'ai' && (
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <motion.div
                                                        animate={{ rotate: [0, 10, -10, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                    >
                                                        <SparklesIcon className='w-4 h-4 text-purple-600' />
                                                    </motion.div>
                                                    <span className='text-xs font-semibold text-purple-700'>
                                                        {t('support.chat.aiSuggestion')}
                                                    </span>
                                                </div>
                                            )}
                                            <p className='text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words'>
                                                {message.content}
                                            </p>
                                        </motion.div>

                                        {/* Timestamp */}
                                        <div
                                            className={`text-xs text-gray-500 px-2 ${
                                                message.sender === 'staff' ? 'text-right' : 'text-left'
                                            }`}
                                        >
                                            {formatTime(message.createdAt)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing Indicator - Enhanced with Gradient */}
                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    className='flex justify-start'
                                >
                                    <div className='bg-gradient-to-r from-white via-white to-purple-50/50 backdrop-blur-sm border border-gray-200/50 px-5 py-3.5 rounded-2xl shadow-md'>
                                        <div className='flex items-center gap-2'>
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 0.6,
                                                        delay: i * 0.1,
                                                        ease: 'easeInOut',
                                                    }}
                                                    className='w-2.5 h-2.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-sm'
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area - Modern Glassmorphism */}
                <div className='bg-white/70 backdrop-blur-xl border-t border-gray-200/50 p-3 md:p-4 shadow-lg'>
                    <div className='max-w-4xl mx-auto'>
                        <div className='flex items-end gap-2 md:gap-3'>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-gray-200/50'
                            >
                                <PaperclipIcon className='w-5 h-5 text-gray-600' />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-gray-200/50'
                            >
                                <SmileIcon className='w-5 h-5 text-gray-600' />
                            </motion.button>

                            <div className='flex-1 relative'>
                                <textarea
                                    ref={textareaRef}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        handleTyping();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder={t('support.chat.typeMessage')}
                                    rows={1}
                                    className='w-full px-4 md:px-5 py-3 md:py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-300 resize-none shadow-md hover:shadow-lg transition-all text-sm md:text-base min-h-[50px]'
                                />
                            </div>

                            <motion.button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all disabled:shadow-none disabled:cursor-not-allowed'
                            >
                                <SendIcon className='w-5 h-5' />
                            </motion.button>
                        </div>

                        <div className='mt-2 text-xs text-gray-500 text-center hidden md:block'>
                            {t('support.chat.enterToSend')}, {t('support.chat.shiftEnterNewLine')}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Hints Panel */}
            <AnimatePresence>
                {showAIPanel && conversationId && (
                    <AIHintPanel
                        conversationId={conversationId}
                        isOpen={showAIPanel}
                        onClose={() => setShowAIPanel(false)}
                        onSelectSuggestion={(content) => {
                            setInputValue(content);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ChatRoom;
