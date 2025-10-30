/**
 * AI Chat Tab - Handles AI-powered conversations
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatWithAI } from '../../../services/aiApi';
import { toast } from '../../../utils/toast';
import { useLocation } from 'react-router-dom';
import { Message, MessageAction } from './types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

const STORAGE_KEY_AI_MESSAGES = 'beautyai-ai-chat-messages';
const STORAGE_KEY_AI_SESSION = 'beautyai-ai-chat-session';

interface AIChatTabProps {
    isActive: boolean;
    onRequestAgent: () => void;
    onRequestBooking: () => void;
}

export function AIChatTab({ isActive, onRequestAgent, onRequestBooking }: AIChatTabProps) {
    const { t } = useTranslation('common');
    const location = useLocation();

    const [sessionId, setSessionId] = useState<string>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_AI_SESSION);
        return stored || `ai-session-${Date.now()}`;
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_AI_MESSAGES);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Message[];
                return parsed.map((msg) => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                }));
            } catch (e) {
                console.error('Failed to parse stored messages:', e);
            }
        }

        return [
            {
                type: 'bot',
                text: t('chat.greeting'),
                timestamp: new Date(),
                actions: [
                    { type: 'booking', label: t('chat.showAvailableSlots'), action: 'show_slots' },
                    { type: 'button', label: t('chat.talkToAgent'), action: 'request_agent' },
                    { type: 'link', label: t('chat.browseServices'), action: '/services' },
                ],
            },
        ];
    });

    const [isAITyping, setIsAITyping] = useState(false);

    // Persist messages
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_AI_MESSAGES, JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_AI_SESSION, sessionId);
    }, [sessionId]);

    const handleSend = async (text: string) => {
        const userMessage: Message = {
            type: 'user',
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        setIsAITyping(true);
        try {
            const conversationHistory = messages
                .slice(-10)
                .map((msg) => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                .filter(Boolean);

            const aiResponse = await chatWithAI({
                message: text,
                sessionId: sessionId,
                context: {
                    currentPage: location.pathname,
                    ...(conversationHistory.length > 0 && {
                        previousMessages: conversationHistory,
                    }),
                },
            });

            setSessionId(aiResponse.sessionId);

            if (!aiResponse.reply || aiResponse.reply.trim() === '') {
                console.warn('AI returned empty response, using fallback');
                const fallbackMessage = getFallbackResponse(text);
                setMessages((prev) => [...prev, fallbackMessage]);
                return;
            }

            const actions = aiResponse.actions?.map((action) => ({
                type: (action.type === 'navigate' ? 'link' : 'button') as 'button' | 'booking' | 'link',
                label: action.label,
                action: action.url || action.type,
                data: action.data,
            }));

            const botMessage: Message = {
                type: 'bot',
                text: aiResponse.reply,
                timestamp: new Date(),
                ...(actions && { actions }),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('AI chat error:', error);
            const fallbackMessage = getFallbackResponse(text);
            setMessages((prev) => [...prev, fallbackMessage]);
            toast.error(t('chat.errorMessage') || 'Failed to get AI response');
        } finally {
            setIsAITyping(false);
        }
    };

    const getFallbackResponse = (userInput: string): Message => {
        const input = userInput.toLowerCase();

        if (input.includes('hours') || input.includes('opening') || input.includes('giờ')) {
            return { type: 'bot', text: t('chat.faq.hours'), timestamp: new Date() };
        }

        if (input.includes('book') || input.includes('appointment') || input.includes('đặt lịch')) {
            return {
                type: 'bot',
                text: t('chat.bookingIntent'),
                timestamp: new Date(),
                actions: [
                    { type: 'booking', label: t('chat.showAvailableSlots'), action: 'show_slots' },
                    { type: 'button', label: t('chat.talkToAgent'), action: 'request_agent' },
                ],
            };
        }

        if (input.includes('price') || input.includes('cost') || input.includes('giá')) {
            return {
                type: 'bot',
                text: t('chat.faq.pricing'),
                timestamp: new Date(),
                actions: [{ type: 'link', label: t('chat.viewPricing'), action: '/services' }],
            };
        }

        return {
            type: 'bot',
            text: t('chat.defaultResponse'),
            timestamp: new Date(),
            actions: [
                { type: 'button', label: t('chat.talkToAgent'), action: 'request_agent' },
                { type: 'link', label: t('chat.browseServices'), action: '/services' },
            ],
        };
    };

    const handleAction = (action: MessageAction) => {
        if (action.action === 'request_agent') {
            onRequestAgent();
        } else if (action.action === 'show_slots') {
            onRequestBooking();
        } else if (action.type === 'link') {
            window.location.href = action.action;
        }
    };

    const clearChat = () => {
        const initialMessage: Message = {
            type: 'bot',
            text: t('chat.greeting'),
            timestamp: new Date(),
            actions: [
                { type: 'booking', label: t('chat.showAvailableSlots'), action: 'show_slots' },
                { type: 'button', label: t('chat.talkToAgent'), action: 'request_agent' },
                { type: 'link', label: t('chat.browseServices'), action: '/services' },
            ],
        };

        setMessages([initialMessage]);
        setSessionId(`ai-session-${Date.now()}`);
        localStorage.removeItem(STORAGE_KEY_AI_MESSAGES);
        localStorage.removeItem(STORAGE_KEY_AI_SESSION);
        toast.success('Chat cleared!');
    };

    if (!isActive) return null;

    return (
        <div className='flex flex-col h-full'>
            <MessageList messages={messages} onAction={handleAction} />
            {isAITyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex items-center gap-2 px-4 pb-2'
                >
                    <div className='w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center'>
                        <SparklesIcon className='w-4 h-4 text-white' />
                    </div>
                    <div className='bg-white border border-gray-200 rounded-2xl px-3 py-2'>
                        <div className='flex gap-1'>
                            <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
            <ChatInput onSend={handleSend} onClear={clearChat} placeholder={t('chat.placeholder')} />
        </div>
    );
}
