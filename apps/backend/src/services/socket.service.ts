/**
 * Socket.IO Service - Handles real-time WebSocket communication
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import logger from '../config/logger';
import supportService from './support.service';
import { MessageSender } from '@prisma/client';

interface SocketUser {
    socketId: string;
    userId?: string;
    role?: 'customer' | 'staff';
}

class SocketService {
    private io: SocketIOServer | null = null;
    private connectedUsers: Map<string, SocketUser> = new Map();
    private conversationRooms: Map<string, Set<string>> = new Map();

    /**
     * Initialize Socket.IO server
     */
    initialize(httpServer: HTTPServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true,
            },
            transports: ['websocket', 'polling'],
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`✅ Client connected: ${socket.id}`);
            this.handleConnection(socket);
        });

        logger.info('��� Socket.IO server initialized');
    }

    /**
     * Handle socket connection and events
     */
    private handleConnection(socket: Socket) {
        // Store connected user
        this.connectedUsers.set(socket.id, { socketId: socket.id });

        // Join conversation room
        socket.on('conversation:join', async (data: { conversationId: string }) => {
            try {
                socket.join(`conversation:${data.conversationId}`);
                logger.info(`User ${socket.id} joined conversation ${data.conversationId}`);

                // Track room membership
                if (!this.conversationRooms.has(data.conversationId)) {
                    this.conversationRooms.set(data.conversationId, new Set());
                }
                this.conversationRooms.get(data.conversationId)!.add(socket.id);

                // Mark conversation as read
                await supportService.markAsRead(data.conversationId);
            } catch (error) {
                logger.error('Error joining conversation:', error);
                socket.emit('error', { message: 'Failed to join conversation' });
            }
        });

        // Leave conversation room
        socket.on('conversation:leave', (data: { conversationId: string }) => {
            socket.leave(`conversation:${data.conversationId}`);
            logger.info(`User ${socket.id} left conversation ${data.conversationId}`);

            // Remove from room tracking
            this.conversationRooms.get(data.conversationId)?.delete(socket.id);
        });

        // Send message
        socket.on(
            'message:send',
            async (data: {
                conversationId: string;
                content: string;
                sender: 'customer' | 'staff' | 'ai';
                senderName?: string;
            }) => {
                try {
                    // Save message to database
                    const message = await supportService.sendMessage({
                        conversationId: data.conversationId,
                        sender: data.sender.toUpperCase() as MessageSender,
                        senderName: data.senderName || 'Anonymous',
                        content: data.content,
                    });

                    // Broadcast to all users in the conversation room
                    this.io!.to(`conversation:${data.conversationId}`).emit('message:new', {
                        id: message.id,
                        conversationId: message.conversationId,
                        sender: message.sender ? message.sender.toLowerCase() : 'customer',
                        senderName: message.senderName || 'Anonymous',
                        content: message.content,
                        createdAt: message.createdAt.toISOString(),
                    });

                    // Notify conversation list update - but ONLY once per conversation
                    // Use broadcast to avoid sending to the sender socket
                    socket.broadcast.emit('conversation:updated', {
                        conversationId: data.conversationId,
                        lastMessage: data.content.substring(0, 100),
                        timestamp: new Date().toISOString(),
                    });

                    logger.info(`Message sent in conversation ${data.conversationId}`);
                } catch (error) {
                    logger.error('Error sending message:', error);
                    socket.emit('error', { message: 'Failed to send message' });
                }
            },
        );

        // Typing indicator
        socket.on('user:typing', (data: { conversationId: string; isTyping: boolean }) => {
            socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
                conversationId: data.conversationId,
                isTyping: data.isTyping,
            });
        });

        // Assign conversation to staff
        socket.on('conversation:assign', async (data: { conversationId: string; staffId: string }) => {
            try {
                await supportService.assignConversation({
                    conversationId: data.conversationId,
                    staffId: data.staffId,
                });

                // Notify all staff members
                socket.broadcast.emit('conversation:assigned', {
                    conversationId: data.conversationId,
                    staffId: data.staffId,
                });

                logger.info(`Conversation ${data.conversationId} assigned to ${data.staffId}`);
            } catch (error) {
                logger.error('Error assigning conversation:', error);
                socket.emit('error', { message: 'Failed to assign conversation' });
            }
        });

        // Close conversation
        socket.on('conversation:close', async (data: { conversationId: string }) => {
            try {
                await supportService.closeConversation(data.conversationId);

                // Notify all users in the conversation
                this.io!.to(`conversation:${data.conversationId}`).emit('conversation:closed', {
                    conversationId: data.conversationId,
                });

                logger.info(`Conversation ${data.conversationId} closed`);
            } catch (error) {
                logger.error('Error closing conversation:', error);
                socket.emit('error', { message: 'Failed to close conversation' });
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            logger.info(`❌ Client disconnected: ${socket.id}`);
            this.connectedUsers.delete(socket.id);

            // Clean up conversation rooms
            this.conversationRooms.forEach((users, conversationId) => {
                users.delete(socket.id);
                if (users.size === 0) {
                    this.conversationRooms.delete(conversationId);
                }
            });
        });
    }

    /**
     * Emit event to specific conversation room
     */
    emitToConversation(conversationId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`conversation:${conversationId}`).emit(event, data);
        }
    }

    /**
     * Emit event to all connected clients
     */
    emitToAll(event: string, data: any) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }

    /**
     * Get Socket.IO instance
     */
    getIO(): SocketIOServer | null {
        return this.io;
    }

    /**
     * Get connected users count
     */
    getConnectedUsersCount(): number {
        return this.connectedUsers.size;
    }
}

export default new SocketService();
