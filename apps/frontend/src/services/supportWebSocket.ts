/**
 * Support WebSocket Service
 * Handles real-time Socket.IO connection for support chat
 */

import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export interface SocketMessage {
    id: string;
    conversationId: string;
    sender: 'customer' | 'staff' | 'ai';
    senderName?: string;
    content: string;
    createdAt: string;
}

export interface TypingEvent {
    conversationId: string;
    isTyping: boolean;
}

class SupportWebSocketService {
    private socket: Socket | null = null;
    private conversationId: string | null = null;
    private listeners: Map<string, Set<Function>> = new Map();

    /**
     * Connect to Socket.IO server
     */
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket?.connected) {
                resolve();
                return;
            }

            this.socket = io(WS_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.socket.on('connect', () => {
                console.log('✅ WebSocket connected:', this.socket?.id);
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ WebSocket connection error:', error);
                reject(error);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('❌ WebSocket disconnected:', reason);
                this.emit('disconnected', reason);
            });

            // Set up message listeners
            this.setupListeners();

            // Timeout if connection takes too long
            setTimeout(() => {
                if (!this.socket?.connected) {
                    reject(new Error('Connection timeout'));
                }
            }, 10000);
        });
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect() {
        if (this.conversationId) {
            this.leaveConversation(this.conversationId);
        }
        this.socket?.disconnect();
        this.socket = null;
        this.conversationId = null;
        this.listeners.clear();
    }

    /**
     * Join a conversation room
     */
    joinConversation(conversationId: string) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.conversationId = conversationId;
        this.socket.emit('conversation:join', { conversationId });
        console.log('��� Joined conversation:', conversationId);
    }

    /**
     * Leave a conversation room
     */
    leaveConversation(conversationId: string) {
        if (!this.socket?.connected) return;

        this.socket.emit('conversation:leave', { conversationId });
        this.conversationId = null;
        console.log('��� Left conversation:', conversationId);
    }

    /**
     * Send a message
     */
    sendMessage(conversationId: string, content: string, sender: 'customer' | 'staff' | 'ai', senderName?: string) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('message:send', {
            conversationId,
            content,
            sender,
            senderName,
        });
    }

    /**
     * Send typing indicator
     */
    sendTyping(conversationId: string, isTyping: boolean) {
        if (!this.socket?.connected) return;

        this.socket.emit('user:typing', {
            conversationId,
            isTyping,
        });
    }

    /**
     * Assign conversation to staff
     */
    assignConversation(conversationId: string, staffId: string) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('conversation:assign', {
            conversationId,
            staffId,
        });
    }

    /**
     * Close conversation
     */
    closeConversation(conversationId: string) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('conversation:close', {
            conversationId,
        });
    }

    /**
     * Set up event listeners from server
     */
    private setupListeners() {
        if (!this.socket) return;

        // New message received
        this.socket.on('message:new', (data: SocketMessage) => {
            this.emit('message', data);
        });

        // User typing
        this.socket.on('user:typing', (data: TypingEvent) => {
            this.emit('typing', data);
        });

        // Conversation assigned
        this.socket.on('conversation:assigned', (data: { conversationId: string; staffId: string }) => {
            this.emit('assigned', data);
        });

        // Conversation closed
        this.socket.on('conversation:closed', (data: { conversationId: string }) => {
            this.emit('closed', data);
        });

        // Error from server
        this.socket.on('error', (data: { message: string }) => {
            this.emit('error', data);
        });
    }

    /**
     * Register event listener
     */
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    /**
     * Unregister event listener
     */
    off(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback);
    }

    /**
     * Emit event to listeners
     */
    private emit(event: string, data: any) {
        this.listeners.get(event)?.forEach((callback) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in listener for ${event}:`, error);
            }
        });
    }

    /**
     * Check if connected
     */
    get isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Get current conversation ID
     */
    get currentConversation(): string | null {
        return this.conversationId;
    }
}

// Export singleton instance
export const supportWebSocket = new SupportWebSocketService();
