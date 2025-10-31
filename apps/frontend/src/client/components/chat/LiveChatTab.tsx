/**
 * LiveChatTab - Real-time chat with staff via WebSocket
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, LoaderIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Message, AgentInfo } from './types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { supportWebSocket, SocketMessage } from '../../../services/supportWebSocket';
import { createConversation, updateConversation } from '../../../services/supportApi';
import { toast } from '../../../utils/toast';
import { useAuth } from '../../../auth/useAuth';

const STORAGE_KEY_CONVERSATION = 'beautyai-live-conversation-id';
const STORAGE_KEY_MESSAGES = 'beautyai-live-messages';

interface LiveChatTabProps {
    isActive: boolean;
    onSwitchToAI: () => void;
}

export function LiveChatTab({ isActive, onSwitchToAI }: LiveChatTabProps) {
    const { t } = useTranslation('common');
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (stored) {
            try {
                return JSON.parse(stored).map((msg: Message) => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                }));
            } catch {
                return [];
            }
        }
        return [];
    });
    const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(() => {
        return localStorage.getItem(STORAGE_KEY_CONVERSATION);
    });
    const [connectionStatus, setConnectionStatus] = useState<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected');
    const isInitializedRef = useRef(false);
    const handlersSetupRef = useRef(false);

    // Persist messages to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
        }
    }, [messages]);

    // Persist conversation ID
    useEffect(() => {
        if (conversationId) {
            localStorage.setItem(STORAGE_KEY_CONVERSATION, conversationId);
        }
    }, [conversationId]);

    // Update conversation when user logs in
    useEffect(() => {
        const updateUserInfo = async () => {
            if (!conversationId || !user) return;

            try {
                // Update conversation with real user info
                await updateConversation(conversationId, {
                    customerName: user.name,
                    ...(user.email && { customerEmail: user.email }),
                });
                console.log('✅ Updated conversation with user info:', user.name);
            } catch (error) {
                console.error('Failed to update conversation with user info:', error);
            }
        };

        updateUserInfo();
    }, [user, conversationId]); // Run when user logs in or conversation changes

    // Initialize WebSocket and conversation when tab becomes active
    useEffect(() => {
        if (!isActive) return;

        const initializeChat = async () => {
            // If already initialized and have conversation, just reconnect
            if (isInitializedRef.current && conversationId) {
                if (!supportWebSocket.isConnected) {
                    try {
                        await supportWebSocket.connect();
                        supportWebSocket.joinConversation(conversationId);
                        setConnectionStatus('connected');
                    } catch (error) {
                        console.error('Reconnection failed:', error);
                        setConnectionStatus('disconnected');
                    }
                }
                return;
            }

            // Fresh initialization
            if (isInitializedRef.current) return;
            isInitializedRef.current = true;

            try {
                setIsConnecting(true);
                setConnectionStatus('connecting');

                setMessages([
                    {
                        type: 'system',
                        text: t('chat.connectingToSupport'),
                        timestamp: new Date(),
                    },
                ]);

                // Connect to WebSocket if not connected
                if (!supportWebSocket.isConnected) {
                    await supportWebSocket.connect();
                }
                setConnectionStatus('connected');

                // Get customer name from auth or default to Guest
                const customerName = user?.name || 'Guest Customer';
                const customerEmail = user?.email;

                // Reuse existing conversation or create new one
                let convId = conversationId;
                if (convId) {
                    // Verify conversation still exists in database
                    try {
                        const { getConversation } = await import('../../../services/supportApi');
                        await getConversation(convId);
                        console.log('✅ Existing conversation found:', convId);
                    } catch {
                        console.warn('⚠️ Stored conversation not found, creating new one');
                        convId = null;
                        // Clear invalid conversation from storage
                        localStorage.removeItem(STORAGE_KEY_CONVERSATION);
                        localStorage.removeItem(STORAGE_KEY_MESSAGES);
                        setMessages([]);
                    }
                }

                if (!convId) {
                    const conversation = await createConversation({
                        customerName,
                        ...(customerEmail && { customerEmail }),
                        initialMessage: 'Customer requesting live support',
                    });
                    convId = conversation.id;
                    setConversationId(convId);
                    console.log('✅ Created new conversation:', convId);
                }

                // Join conversation room
                supportWebSocket.joinConversation(convId);

                // Set up WebSocket event listeners ONLY ONCE
                if (!handlersSetupRef.current) {
                    handlersSetupRef.current = true;

                    const handleMessage = (data: SocketMessage) => {
                        // Only handle messages for this conversation
                        if (data.conversationId !== convId) return;

                        if (data.sender === 'staff') {
                            setMessages((prev) => {
                                // Use message ID for deduplication - much more reliable than content
                                const exists = prev.some(
                                    (msg) =>
                                        msg.text === data.content &&
                                        msg.type === 'agent' &&
                                        // Check timestamp within 1 second window
                                        msg.timestamp &&
                                        Math.abs(
                                            msg.timestamp.getTime() -
                                                new Date(data.createdAt).getTime()
                                        ) < 1000
                                );

                                if (exists) {
                                    console.log(
                                        '🚫 Duplicate message detected, ignoring:',
                                        data.content.substring(0, 30)
                                    );
                                    return prev;
                                }

                                console.log('✅ New agent message:', data.content.substring(0, 30));
                                return [
                                    ...prev,
                                    {
                                        type: 'agent',
                                        text: data.content,
                                        timestamp: new Date(data.createdAt),
                                    },
                                ];
                            });
                            setIsAgentTyping(false);

                            // Set agent info if not already set
                            if (data.senderName) {
                                setAgentInfo((prev) =>
                                    prev
                                        ? prev
                                        : {
                                              id: 'agent-' + Date.now(),
                                              name: data.senderName!,
                                              status: 'online',
                                          }
                                );
                            }
                        }
                    };

                    const handleTyping = (data: { conversationId: string; isTyping: boolean }) => {
                        if (data.conversationId === convId) {
                            setIsAgentTyping(data.isTyping);
                        }
                    };

                    const handleDisconnect = () => {
                        setConnectionStatus('disconnected');
                        setMessages((prev) => [
                            ...prev,
                            {
                                type: 'system',
                                text: t('chat.connectionLost'),
                                timestamp: new Date(),
                            },
                        ]);
                    };

                    const handleError = (data: { message: string }) => {
                        toast.error(data.message);
                    };

                    supportWebSocket.on('message', handleMessage);
                    supportWebSocket.on('typing', handleTyping);
                    supportWebSocket.on('disconnected', handleDisconnect);
                    supportWebSocket.on('error', handleError);
                }

                // Update UI to show connected
                if (messages.length <= 1) {
                    setMessages([
                        {
                            type: 'system',
                            text: t('chat.connectedWaitingForAgent'),
                            timestamp: new Date(),
                        },
                    ]);
                }
            } catch (error) {
                console.error('Failed to initialize live chat:', error);
                setConnectionStatus('disconnected');
                setMessages([
                    {
                        type: 'system',
                        text: t('chat.connectionFailed'),
                        timestamp: new Date(),
                    },
                ]);
                toast.error('Failed to connect to live chat');
            } finally {
                setIsConnecting(false);
            }
        };

        initializeChat();

        // Don't cleanup on tab change - only on unmount
        // This prevents creating new conversations on every tab switch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]); // Only re-run when isActive changes

    const handleSend = (text: string) => {
        if (!conversationId || connectionStatus !== 'connected') {
            toast.error('Not connected to live chat');
            return;
        }

        try {
            // Add message to local state immediately
            const userMessage: Message = {
                type: 'user',
                text,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);

            // Send via WebSocket
            supportWebSocket.sendMessage(conversationId, text, 'customer', 'Guest Customer');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleEndChat = () => {
        if (conversationId) {
            try {
                supportWebSocket.closeConversation(conversationId);
                supportWebSocket.leaveConversation(conversationId);
            } catch (error) {
                console.error('Failed to close conversation:', error);
            }
        }

        setMessages([]);
        setAgentInfo(null);
        setConversationId(null);
        setConnectionStatus('disconnected');
        onSwitchToAI();
        toast.success('Chat ended');
    };

    if (!isActive) return null;

    return (
        <div className="flex flex-col h-full">
            {/* Connection status header */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {connectionStatus === 'connecting' ? (
                            <LoaderIcon className="w-4 h-4 text-blue-600 animate-spin" />
                        ) : connectionStatus === 'connected' ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                            {connectionStatus === 'connecting'
                                ? t('chat.connecting')
                                : connectionStatus === 'connected'
                                  ? agentInfo
                                      ? t('chat.connectedWith', { name: agentInfo.name })
                                      : t('chat.connected')
                                  : t('chat.disconnected')}
                        </span>
                    </div>
                    {agentInfo && (
                        <div className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">
                                {agentInfo.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} />

            {/* Typing indicator */}
            {isAgentTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 pb-2"
                >
                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2">
                        <div className="flex gap-1">
                            <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Input */}
            <ChatInput
                onSend={handleSend}
                onClear={handleEndChat}
                placeholder={
                    connectionStatus === 'connected'
                        ? t('chat.placeholder')
                        : t('chat.waitingForConnection')
                }
                disabled={isConnecting || connectionStatus !== 'connected'}
            />
        </div>
    );
}
