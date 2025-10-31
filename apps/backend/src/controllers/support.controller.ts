/**
 * Support Controller - REST API endpoints for support chat
 */

import { Request, Response } from 'express';
import supportService from '../services/support.service';
import logger from '../config/logger';

class SupportController {
    /**
     * GET /api/v1/support/conversations
     * Get all conversations with optional filters
     */
    async getConversations(req: Request, res: Response) {
        try {
            const { status, assignedStaffId, search } = req.query;

            const conversations = await supportService.getConversations({
                status: status as any,
                assignedStaffId: assignedStaffId as string,
                search: search as string,
            });

            res.json({
                success: true,
                data: conversations,
                count: conversations.length,
            });
        } catch (error) {
            logger.error('Error fetching conversations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch conversations',
            });
        }
    }

    /**
     * GET /api/v1/support/conversations/:id
     * Get single conversation with messages
     */
    async getConversation(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            const conversation = await supportService.getConversation(id);

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found',
                });
            }

            res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            logger.error('Error fetching conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch conversation',
            });
        }
    }

    /**
     * POST /api/v1/support/conversations
     * Create new conversation
     */
    async createConversation(req: Request, res: Response) {
        try {
            const { customerName, customerEmail, initialMessage } = req.body;

            if (!customerName) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer name is required',
                });
            }

            const conversation = await supportService.createConversation({
                customerName,
                customerEmail,
                initialMessage,
            });

            res.status(201).json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            logger.error('Error creating conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create conversation',
            });
        }
    }

    /**
     * PATCH /api/v1/support/conversations/:id
     * Update conversation details
     */
    async updateConversation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { customerName, customerEmail } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            const conversation = await supportService.updateConversation(id, {
                customerName,
                customerEmail,
            });

            res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            logger.error('Error updating conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update conversation',
            });
        }
    }

    /**
     * POST /api/v1/support/conversations/:id/assign
     * Assign conversation to staff
     */
    async assignConversation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { staffId } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            if (!staffId) {
                return res.status(400).json({
                    success: false,
                    message: 'Staff ID is required',
                });
            }

            const conversation = await supportService.assignConversation({
                conversationId: id,
                staffId,
            });

            res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            logger.error('Error assigning conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to assign conversation',
            });
        }
    }

    /**
     * POST /api/v1/support/conversations/:id/close
     * Close conversation
     */
    async closeConversation(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            const conversation = await supportService.closeConversation(id);

            res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            logger.error('Error closing conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to close conversation',
            });
        }
    }

    /**
     * GET /api/v1/support/conversations/:id/messages
     * Get all messages for a conversation
     */
    async getMessages(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            const messages = await supportService.getMessages(id);

            res.json({
                success: true,
                data: messages,
                count: messages.length,
            });
        } catch (error) {
            logger.error('Error fetching messages:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch messages',
            });
        }
    }

    /**
     * POST /api/v1/support/messages
     * Send a message (HTTP fallback for Socket.IO)
     */
    async sendMessage(req: Request, res: Response) {
        try {
            const { conversationId, sender, senderName, content } = req.body;

            if (!conversationId || !sender || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                });
            }

            const message = await supportService.sendMessage({
                conversationId,
                sender: sender.toUpperCase(),
                senderName,
                content,
            });

            res.status(201).json({
                success: true,
                data: message,
            });
        } catch (error) {
            logger.error('Error sending message:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message',
            });
        }
    }

    /**
     * GET /api/v1/support/statistics
     * Get conversation statistics
     */
    async getStatistics(req: Request, res: Response) {
        try {
            const statistics = await supportService.getStatistics();

            res.json({
                success: true,
                data: statistics,
            });
        } catch (error) {
            logger.error('Error fetching statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch statistics',
            });
        }
    }

    /**
     * DELETE /api/v1/support/conversations/:id
     * Delete a conversation
     */
    async deleteConversation(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            await supportService.deleteConversation(id);

            res.json({
                success: true,
                data: { message: 'Conversation deleted successfully' },
            });
        } catch (error) {
            logger.error('Error deleting conversation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete conversation',
            });
        }
    }

    /**
     * POST /api/v1/support/conversations/bulk-delete
     * Bulk delete conversations
     */
    async bulkDeleteConversations(req: Request, res: Response) {
        try {
            const { ids } = req.body;

            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation IDs array is required',
                });
            }

            await supportService.bulkDeleteConversations(ids);

            res.json({
                success: true,
                data: { message: `${ids.length} conversations deleted successfully` },
            });
        } catch (error) {
            logger.error('Error bulk deleting conversations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete conversations',
            });
        }
    }

    /**
     * GET /api/v1/support/conversations/:id/ai-suggestions
     * Get AI-generated reply suggestions for a conversation
     */
    async getAISuggestions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { language } = req.query; // Get language from query params

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Conversation ID is required',
                });
            }

            // Import AI service dynamically to avoid circular dependency
            const { aiService } = await import('../services/ai.service');
            const result = await aiService.generateSupportSuggestions(id, language as string | undefined);

            res.json({
                success: true,
                data: result.suggestions,
            });
        } catch (error) {
            logger.error('Error generating AI suggestions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate AI suggestions',
            });
        }
    }
}

export default new SupportController();
