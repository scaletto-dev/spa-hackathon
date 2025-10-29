// Global Chat Widget - Fixed position, appears on all client pages
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, XIcon, SendIcon, SparklesIcon } from 'lucide-react';
import { useChatWidget } from '../../contexts/ChatWidgetContext';

export function GlobalChatWidget() {
    const { isOpen, closeChat, toggleChat } = useChatWidget();
    const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user'; text: string }>>([
        {
            type: 'bot',
            text: "Hello! I'm BeautyAI's virtual assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [showHint, setShowHint] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Auto-scroll to bottom when new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { type: 'user' as const, text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // Simulate bot response after a delay
        setTimeout(() => {
            const botMessage = { type: 'bot' as const, text: getBotResponse(input) };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    const getBotResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('book') || input.includes('appointment')) {
            return 'I can help you book an appointment! You can visit our booking page or I can assist you with finding the right service. What type of treatment are you interested in?';
        }
        if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
            return 'Our treatment prices vary depending on the service. Facials range from $120 to $250, laser treatments from $150 to $400, and body contouring from $300 to $600. Would you like specific pricing for a particular treatment?';
        }
        if (input.includes('location') || input.includes('where') || input.includes('branch')) {
            return 'We have multiple locations across the city. Our main branches are Downtown, Westside, and Eastside. Would you like details about a specific location?';
        }
        if (input.includes('skin') || input.includes('analyze') || input.includes('analysis')) {
            return 'Our AI Skin Analysis uses advanced technology to analyze your skin type, concerns, and recommend personalized treatments. Would you like to book a skin analysis appointment?';
        }
        return 'Thanks for your message! For detailed information about our services, pricing, or to book an appointment, you can navigate to the appropriate section of our website or speak with one of our representatives at (555) 123-4567. (Mocked AI Response)';
    };

    return (
        <>
            {/* Chat toggle button - Always visible */}
            <motion.button
                className='fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                data-testid='chat-toggle-button'
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <XIcon className='w-7 h-7 text-white' />
                ) : (
                    <MessageCircleIcon className='w-7 h-7 text-white' />
                )}
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
                                <p className='text-sm text-gray-800'>Cần giúp đỡ? Hỏi AI assistant của chúng tôi!</p>
                                <button
                                    className='text-xs text-pink-600 font-medium mt-1 hover:text-pink-700'
                                    onClick={toggleChat}
                                >
                                    Bắt đầu chat →
                                </button>
                            </div>
                            <button
                                onClick={() => setShowHint(false)}
                                className='flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors'
                                aria-label='Đóng gợi ý'
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
                        className='fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl w-[360px] max-w-[90vw] z-40 border border-gray-200 overflow-hidden'
                        style={{ maxHeight: '60vh' }}
                        data-testid='chat-window'
                    >
                        {/* Chat header */}
                        <div className='bg-gradient-to-r from-pink-500 to-purple-500 p-3'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center'>
                                        <SparklesIcon className='w-5 h-5 text-white' />
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-white text-sm'>BeautyAI Assistant</h3>
                                        <p className='text-xs text-white/80'>AI-powered support</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeChat}
                                    className='p-1 hover:bg-white/20 rounded-full transition-colors'
                                    aria-label='Close chat'
                                >
                                    <XIcon className='w-5 h-5 text-white' />
                                </button>
                            </div>
                        </div>

                        {/* Chat messages - Scrollable area */}
                        <div
                            className='overflow-y-auto p-4 bg-gray-50 space-y-3'
                            style={{ height: 'calc(60vh - 140px)', minHeight: '250px', maxHeight: '400px' }}
                        >
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'bot' && (
                                        <div className='w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0'>
                                            <SparklesIcon className='w-4 h-4 text-white' />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                                            message.type === 'user'
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                : 'bg-white border border-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat input */}
                        <div className='p-3 border-t border-gray-200 bg-white'>
                            <div className='flex gap-2'>
                                <input
                                    ref={inputRef}
                                    type='text'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder='Type your message...'
                                    className='flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-300'
                                    data-testid='chat-input'
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    className='w-9 h-9 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'
                                    data-testid='chat-send-button'
                                    aria-label='Send message'
                                >
                                    <SendIcon className='w-4 h-4 text-white' />
                                </motion.button>
                            </div>
                            <p className='text-xs text-gray-500 mt-2 text-center'>Powered by BeautyAI Technology</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
