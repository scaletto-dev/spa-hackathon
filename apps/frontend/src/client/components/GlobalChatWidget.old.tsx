// Global Chat Widget - Fixed position, appears on all client pages
// Enhanced with: Live Chat, FAQ, Quick Booking
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircleIcon,
    XIcon,
    SendIcon,
    SparklesIcon,
    UserIcon,
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    BotIcon,
    UsersIcon,
    Trash2Icon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatWidget } from '../../contexts/ChatWidgetContext';
import { toast } from '../../utils/toast';
import { chatWithAI } from '../../services/aiApi';
import { useLocation } from 'react-router-dom';

// Message types
type MessageType = 'bot' | 'user' | 'agent' | 'system';
type ChatMode = 'ai' | 'live' | 'booking';

interface Message {
    type: MessageType;
    text: string;
    timestamp?: Date;
    actions?: MessageAction[];
    bookingData?: BookingData;
}

interface MessageAction {
    type: 'button' | 'booking' | 'link';
    label: string;
    action: string;
    data?: Record<string, unknown>;
}

interface BookingData {
    serviceId?: string;
    serviceName: string;
    slots: Array<{
        datetime: string;
        branchName: string;
        price: number;
    }>;
}

interface AgentInfo {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'typing' | 'offline';
}

const STORAGE_KEY_MESSAGES = 'beautyai-chat-messages';
const STORAGE_KEY_SESSION = 'beautyai-chat-session';

export function GlobalChatWidget() {
    const { t } = useTranslation('common');
    const { isOpen, closeChat, toggleChat } = useChatWidget();
    const location = useLocation();

    // Load from localStorage or create new session
    const [sessionId, setSessionId] = useState<string>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_SESSION);
        return stored || `session-${Date.now()}`;
    });

    const [isAITyping, setIsAITyping] = useState(false);

    // Load messages from localStorage or use default greeting
    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Message[];
                // Convert timestamp strings back to Date objects
                return parsed.map((msg) => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                }));
            } catch (e) {
                console.error('Failed to parse stored messages:', e);
            }
        }

        // Default greeting message
        return [
            {
                type: 'bot',
                text: t('chat.greeting'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'booking',
                        label: t('chat.showAvailableSlots'),
                        action: 'show_slots',
                    },
                    {
                        type: 'button',
                        label: t('chat.talkToAgent'),
                        action: 'request_agent',
                    },
                    {
                        type: 'link',
                        label: t('chat.browseServices'),
                        action: '/services',
                    },
                ],
            },
        ];
    });

    const [input, setInput] = useState('');
    const [showHint, setShowHint] = useState(true);
    const [chatMode, setChatMode] = useState<ChatMode>('ai');
    const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
    // Will be used when WebSocket integration is complete
    const [isAgentTyping] = useState(false);
    // Will be used for live agent queue position display
    const [_queuePosition] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }, [messages]);

    // Persist session ID to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_SESSION, sessionId);
    }, [sessionId]);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Auto-scroll to bottom when new messages
    useEffect(() => {
        // Use setTimeout to ensure DOM has updated with new content
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }, 100);
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

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            type: 'user',
            text: input,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        const userInputText = input;
        setInput('');

        // Route message based on chat mode
        if (chatMode === 'live' && agentInfo) {
            // Send to live agent via API (TODO: WebSocket)
            // Mock: Just show message sent
            toast.success(t('chat.messageSent'));
        } else {
            // AI mode - call real AI API
            setIsAITyping(true);
            try {
                // Extract last 5 messages for context (alternating user/bot)
                const conversationHistory = messages
                    .slice(-10) // Last 10 messages (5 exchanges)
                    .map((msg) => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                    .filter(Boolean);

                const aiResponse = await chatWithAI({
                    message: userInputText,
                    sessionId: sessionId,
                    context: {
                        currentPage: location.pathname,
                        ...(conversationHistory.length > 0 && {
                            previousMessages: conversationHistory,
                        }),
                    },
                });

                // Update session ID
                setSessionId(aiResponse.sessionId);

                // Check if reply is empty (Gemini sometimes returns empty response)
                if (!aiResponse.reply || aiResponse.reply.trim() === '') {
                    console.warn('AI returned empty response, using fallback');
                    const fallbackMessage = getBotResponseFallback(userInputText);
                    setMessages((prev) => [...prev, fallbackMessage]);
                    return;
                }

                // Convert AI response to Message format
                const actions = aiResponse.actions?.map((action) => ({
                    type: (action.type === 'navigate' ? 'link' : 'button') as
                        | 'button'
                        | 'booking'
                        | 'link',
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
                // Fallback to rule-based response
                const fallbackMessage = getBotResponseFallback(userInputText);
                setMessages((prev) => [...prev, fallbackMessage]);
                toast.error(t('chat.errorMessage') || 'Failed to get AI response');
            } finally {
                setIsAITyping(false);
            }
        }
    };

    // Fallback function if AI fails
    const getBotResponseFallback = (userInput: string): Message => {
        const input = userInput.toLowerCase();

        // FAQ Patterns
        if (input.includes('hours') || input.includes('opening') || input.includes('giờ')) {
            return {
                type: 'bot',
                text: t('chat.faq.hours'),
                timestamp: new Date(),
            };
        }

        // Booking intent with quick booking
        if (input.includes('book') || input.includes('appointment') || input.includes('đặt lịch')) {
            return {
                type: 'bot',
                text: t('chat.bookingIntent'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'booking',
                        label: t('chat.showAvailableSlots'),
                        action: 'show_slots',
                        data: { serviceType: 'hydrafacial' },
                    },
                    {
                        type: 'button',
                        label: t('chat.talkToAgent'),
                        action: 'request_agent',
                    },
                ],
            };
        }

        // Price inquiry
        if (input.includes('price') || input.includes('cost') || input.includes('giá')) {
            return {
                type: 'bot',
                text: t('chat.faq.pricing'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'link',
                        label: t('chat.viewPricing'),
                        action: '/services',
                    },
                ],
            };
        }

        // Location
        if (input.includes('location') || input.includes('where') || input.includes('địa chỉ')) {
            return {
                type: 'bot',
                text: t('chat.faq.location'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'link',
                        label: t('chat.viewBranches'),
                        action: '/branches',
                    },
                ],
            };
        }

        // Skin analysis
        if (input.includes('skin') || input.includes('analyze') || input.includes('da')) {
            return {
                type: 'bot',
                text: t('chat.faq.skinAnalysis'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'link',
                        label: t('chat.takeQuiz'),
                        action: '/quiz',
                    },
                ],
            };
        }

        // Agent request
        if (input.includes('agent') || input.includes('staff') || input.includes('nhân viên')) {
            return {
                type: 'bot',
                text: t('chat.connectingAgent'),
                timestamp: new Date(),
                actions: [
                    {
                        type: 'button',
                        label: t('chat.requestAgent'),
                        action: 'request_agent',
                    },
                ],
            };
        }

        // Default response
        return {
            type: 'bot',
            text: t('chat.defaultResponse'),
            timestamp: new Date(),
            actions: [
                {
                    type: 'button',
                    label: t('chat.talkToAgent'),
                    action: 'request_agent',
                },
                {
                    type: 'link',
                    label: t('chat.browseServices'),
                    action: '/services',
                },
            ],
        };
    };

    // Handle action button clicks
    const handleAction = (action: MessageAction) => {
        if (action.action === 'request_agent') {
            requestLiveAgent();
        } else if (action.action === 'show_slots') {
            const serviceType = action.data?.serviceType as string | undefined;
            showBookingSlots(serviceType);
        } else if (action.type === 'link') {
            window.location.href = action.action;
        }
    };

    // Toggle between AI and Live mode
    const toggleChatMode = () => {
        if (chatMode === 'ai') {
            requestLiveAgent();
        } else {
            // Switch back to AI
            setChatMode('ai');
            setAgentInfo(null);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'system',
                    text: t('chat.switchedToAI'),
                    timestamp: new Date(),
                },
            ]);
        }
    };

    // Request live agent
    const requestLiveAgent = () => {
        // TODO: Call API POST /api/v1/ai/chat/request-agent
        setMessages((prev) => [
            ...prev,
            {
                type: 'system',
                text: t('chat.requestingAgent'),
                timestamp: new Date(),
            },
        ]);

        // Mock: Simulate agent connection
        setTimeout(() => {
            const mockAgent: AgentInfo = {
                id: 'agent-001',
                name: 'Sarah Johnson',
                status: 'online',
            };
            setAgentInfo(mockAgent);
            setChatMode('live');
            setMessages((prev) => [
                ...prev,
                {
                    type: 'system',
                    text: t('chat.agentConnected', { name: mockAgent.name }),
                    timestamp: new Date(),
                },
                {
                    type: 'agent',
                    text: t('chat.agentGreeting'),
                    timestamp: new Date(),
                },
            ]);
        }, 2000);
    };

    // Clear chat history and start fresh
    const clearChat = () => {
        // Reset to initial greeting
        const initialMessage: Message = {
            type: 'bot',
            text: t('chat.greeting'),
            timestamp: new Date(),
            actions: [
                {
                    type: 'booking',
                    label: t('chat.showAvailableSlots'),
                    action: 'show_slots',
                },
                {
                    type: 'button',
                    label: t('chat.talkToAgent'),
                    action: 'request_agent',
                },
                {
                    type: 'link',
                    label: t('chat.browseServices'),
                    action: '/services',
                },
            ],
        };

        setMessages([initialMessage]);
        setSessionId(`session-${Date.now()}`);
        setChatMode('ai');
        setAgentInfo(null);

        // Clear from localStorage
        localStorage.removeItem(STORAGE_KEY_MESSAGES);
        localStorage.removeItem(STORAGE_KEY_SESSION);

        toast.success('Chat cleared. Starting fresh!');
    };

    // Show booking slots
    const showBookingSlots = (serviceType?: string) => {
        // Switch to booking mode
        setChatMode('booking');

        // TODO: Call API POST /api/v1/ai/chat/suggest-booking
        // When API ready, use serviceType to filter slots by service
        console.log('Booking for service:', serviceType); // Will be used in API call
        const mockBooking: BookingData = {
            serviceName: 'HydraFacial Treatment',
            slots: [
                {
                    datetime: '2025-10-31T14:00:00Z',
                    branchName: 'Downtown Spa',
                    price: 150,
                },
                {
                    datetime: '2025-10-31T15:30:00Z',
                    branchName: 'Downtown Spa',
                    price: 150,
                },
                {
                    datetime: '2025-11-01T10:00:00Z',
                    branchName: 'Westside Spa',
                    price: 150,
                },
            ],
        };

        setMessages((prev) => [
            ...prev,
            {
                type: 'bot',
                text: t('chat.availableSlots'),
                timestamp: new Date(),
                bookingData: mockBooking,
            },
        ]);

        // Force scroll to bottom after booking slots render
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 150);
    };

    // Handle booking selection
    const handleBookSlot = (slot: BookingData['slots'][0], serviceName: string) => {
        // TODO: Call API POST /api/v1/ai/chat/quick-book
        toast.success(t('chat.bookingConfirmed'));

        // Switch back to AI mode after booking
        setChatMode('ai');

        setMessages((prev) => [
            ...prev,
            {
                type: 'system',
                text: t('chat.bookingSuccess', {
                    service: serviceName,
                    time: new Date(slot.datetime).toLocaleString(),
                }),
                timestamp: new Date(),
            },
        ]);
    };

    return (
        <>
            {/* Chat toggle button - Always visible - Color changes with mode */}
            <motion.button
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-300 ${
                    chatMode === 'live'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        : chatMode === 'booking'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-pink-500 to-purple-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                data-testid="chat-toggle-button"
                aria-label={isOpen ? t('chat.closeChat') : t('chat.openChat')}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: 90, opacity: 1 }}
                            exit={{ rotate: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <XIcon className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : chatMode === 'booking' ? (
                        <motion.div
                            key="booking"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CalendarIcon className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : chatMode === 'live' ? (
                        <motion.div
                            key="live"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <UsersIcon className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ai"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircleIcon className="w-7 h-7 text-white" />
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
                        className="fixed bottom-24 right-6 bg-white rounded-xl p-3 shadow-lg max-w-xs z-40 hidden md:block"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{t('chat.needHelp')}</p>
                                <button
                                    className="text-xs text-pink-600 font-medium mt-1 hover:text-pink-700"
                                    onClick={toggleChat}
                                >
                                    {t('chat.startChat')}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowHint(false)}
                                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label={t('chat.closeHint')}
                            >
                                <XIcon className="w-4 h-4 text-gray-400" />
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
                        className="fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl w-[360px] max-w-[90vw] z-40 border border-gray-200 overflow-hidden"
                        style={{ maxHeight: '60vh' }}
                        data-testid="chat-window"
                    >
                        {/* Chat header */}
                        <div
                            className={`p-3 ${
                                chatMode === 'live'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                    : chatMode === 'booking'
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                      : 'bg-gradient-to-r from-pink-500 to-purple-500'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative">
                                        {chatMode === 'booking' ? (
                                            <CalendarIcon className="w-5 h-5 text-white" />
                                        ) : chatMode === 'live' ? (
                                            <>
                                                <UserIcon className="w-5 h-5 text-white" />
                                                {agentInfo?.status === 'online' && (
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                                                )}
                                            </>
                                        ) : (
                                            <SparklesIcon className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">
                                            {chatMode === 'booking'
                                                ? t('chat.bookingAssistant')
                                                : chatMode === 'live' && agentInfo
                                                  ? agentInfo.name
                                                  : t('chat.assistant')}
                                        </h3>
                                        <p className="text-xs text-white/80">
                                            {chatMode === 'booking'
                                                ? t('chat.bookingMode')
                                                : chatMode === 'live'
                                                  ? t('chat.liveSupport')
                                                  : _queuePosition
                                                    ? t('chat.queuePosition', {
                                                          position: _queuePosition,
                                                      })
                                                    : t('chat.aiSupport')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {/* Clear Chat Button */}
                                    <button
                                        onClick={clearChat}
                                        className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                                        aria-label="Clear chat history"
                                        title="Clear chat history"
                                    >
                                        <Trash2Icon className="w-4 h-4 text-white" />
                                    </button>

                                    {/* Booking Mode Button */}
                                    <button
                                        onClick={() => {
                                            if (chatMode === 'booking') {
                                                setChatMode('ai');
                                            } else {
                                                showBookingSlots();
                                            }
                                        }}
                                        className={`p-2 rounded-full transition-all duration-200 ${
                                            chatMode === 'booking'
                                                ? 'bg-white/30'
                                                : 'hover:bg-white/20'
                                        }`}
                                        aria-label={
                                            chatMode === 'booking'
                                                ? t('chat.switchToAI')
                                                : t('chat.switchToBooking')
                                        }
                                        title={
                                            chatMode === 'booking'
                                                ? t('chat.switchToAI')
                                                : t('chat.switchToBooking')
                                        }
                                    >
                                        <CalendarIcon className="w-5 h-5 text-white" />
                                    </button>

                                    {/* Live Agent Mode Button */}
                                    <button
                                        onClick={toggleChatMode}
                                        className={`p-2 rounded-full transition-all duration-200 ${
                                            chatMode === 'live'
                                                ? 'bg-white/30'
                                                : 'hover:bg-white/20'
                                        }`}
                                        aria-label={
                                            chatMode === 'live'
                                                ? t('chat.switchToAI')
                                                : t('chat.switchToLive')
                                        }
                                        title={
                                            chatMode === 'live'
                                                ? t('chat.switchToAI')
                                                : t('chat.switchToLive')
                                        }
                                    >
                                        {chatMode === 'live' ? (
                                            <BotIcon className="w-5 h-5 text-white" />
                                        ) : (
                                            <UsersIcon className="w-5 h-5 text-white" />
                                        )}
                                    </button>

                                    {/* Close Button */}
                                    <button
                                        onClick={closeChat}
                                        className="p-1 hover:bg-white/20 rounded-full transition-colors ml-1"
                                        aria-label={t('chat.closeChat')}
                                    >
                                        <XIcon className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat messages - Scrollable area */}
                        <div
                            className="overflow-y-auto p-4 bg-gray-50 space-y-3"
                            style={{
                                height: 'calc(60vh - 140px)',
                                minHeight: '300px',
                                maxHeight: '500px',
                            }}
                        >
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Avatar for bot/agent/system */}
                                    {message.type !== 'user' && (
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                                                message.type === 'agent'
                                                    ? 'bg-blue-500'
                                                    : message.type === 'system'
                                                      ? 'bg-gray-400'
                                                      : 'bg-gradient-to-br from-pink-400 to-purple-500'
                                            }`}
                                        >
                                            {message.type === 'agent' ? (
                                                <UserIcon className="w-4 h-4 text-white" />
                                            ) : message.type === 'system' ? (
                                                <SparklesIcon className="w-4 h-4 text-white" />
                                            ) : (
                                                <SparklesIcon className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    )}

                                    {/* Message container */}
                                    <div className="max-w-[75%] space-y-2">
                                        {/* Message bubble */}
                                        <div
                                            className={`rounded-2xl px-3 py-2 text-sm ${
                                                message.type === 'user'
                                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                    : message.type === 'agent'
                                                      ? 'bg-blue-50 border border-blue-200 text-gray-800'
                                                      : message.type === 'system'
                                                        ? 'bg-gray-100 border border-gray-300 text-gray-700 text-center italic'
                                                        : 'bg-white border border-gray-200 text-gray-800'
                                            }`}
                                        >
                                            {message.text}
                                        </div>

                                        {/* Action buttons */}
                                        {message.actions && message.actions.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {message.actions.map((action, actionIndex) => (
                                                    <motion.button
                                                        key={actionIndex}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAction(action)}
                                                        className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-md transition-shadow"
                                                    >
                                                        {action.label}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Booking slots */}
                                        {message.bookingData && (
                                            <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                                                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {message.bookingData.serviceName}
                                                </h4>
                                                {message.bookingData.slots.map(
                                                    (slot, slotIndex) => {
                                                        const slotDate = new Date(slot.datetime);
                                                        return (
                                                            <motion.button
                                                                key={slotIndex}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() =>
                                                                    handleBookSlot(
                                                                        slot,
                                                                        message.bookingData!
                                                                            .serviceName
                                                                    )
                                                                }
                                                                className="w-full text-left p-2 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                                                            >
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <ClockIcon className="w-3 h-3 text-pink-500" />
                                                                        <span className="font-medium">
                                                                            {slotDate.toLocaleDateString()}{' '}
                                                                            {slotDate.toLocaleTimeString(
                                                                                [],
                                                                                {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-pink-600 font-semibold">
                                                                        ${slot.price}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 mt-1 text-gray-600">
                                                                    <MapPinIcon className="w-3 h-3" />
                                                                    <span>{slot.branchName}</span>
                                                                </div>
                                                            </motion.button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* AI typing indicator */}
                            {isAITyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <SparklesIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2">
                                        <div className="flex gap-1">
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0ms' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '150ms' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '300ms' }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Agent typing indicator */}
                            {isAgentTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                            <div
                                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.4s' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Scroll anchor with padding */}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Chat input */}
                        <div className="p-3 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={t('chat.placeholder')}
                                    className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-300"
                                    data-testid="chat-input"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    className="w-9 h-9 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0"
                                    data-testid="chat-send-button"
                                    aria-label={t('chat.send')}
                                >
                                    <SendIcon className="w-4 h-4 text-white" />
                                </motion.button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {t('chat.poweredBy')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
