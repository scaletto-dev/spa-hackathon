/**
 * Support Service - Handles support chat conversations and messages
 */

import prisma from '@/config/database';
import { ConversationStatus, MessageSender } from '@prisma/client';

export interface CreateConversationInput {
  customerName: string;
  customerEmail?: string;
  initialMessage?: string;
}

export interface SendMessageInput {
  conversationId: string;
  sender: MessageSender;
  senderName?: string;
  content: string;
}

export interface AssignConversationInput {
  conversationId: string;
  staffId: string;
}

export interface ConversationFilters {
  status?: ConversationStatus;
  assignedStaffId?: string;
  search?: string;
}

class SupportService {
  /**
   * Create a new support conversation
   */
  async createConversation(data: CreateConversationInput) {
    const conversation = await prisma.supportConversation.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        status: ConversationStatus.PENDING,
        unreadCount: 1,
        lastMessage: data.initialMessage || 'New conversation',
      },
      include: {
        messages: true,
      },
    });

    // Create initial message if provided
    if (data.initialMessage) {
      await prisma.supportMessage.create({
        data: {
          conversationId: conversation.id,
          sender: MessageSender.CUSTOMER,
          senderName: data.customerName || null,
          content: data.initialMessage,
        },
      });
    }

    return conversation;
  }

  /**
   * Update conversation details
   */
  async updateConversation(
    conversationId: string,
    data: { customerName?: string; customerEmail?: string }
  ) {
    const conversation = await prisma.supportConversation.update({
      where: { id: conversationId },
      data: {
        ...(data.customerName && { customerName: data.customerName }),
        ...(data.customerEmail && { customerEmail: data.customerEmail }),
      },
      include: {
        messages: true,
      },
    });

    return conversation;
  }

  /**
   * Get all conversations with optional filters
   */
  async getConversations(filters: ConversationFilters = {}) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.assignedStaffId) {
      where.assignedStaffId = filters.assignedStaffId;
    }

    if (filters.search) {
      where.OR = [
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const conversations = await prisma.supportConversation.findMany({
      where,
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations;
  }

  /**
   * Get single conversation by ID
   */
  async getConversation(conversationId: string) {
    return await prisma.supportConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /**
   * Get all messages for a conversation
   */
  async getMessages(conversationId: string) {
    return await prisma.supportMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(data: SendMessageInput) {
    // Check if conversation exists first
    const conversation = await prisma.supportConversation.findUnique({
      where: { id: data.conversationId },
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${data.conversationId} not found`);
    }

    const message = await prisma.supportMessage.create({
      data: {
        conversationId: data.conversationId,
        sender: data.sender,
        senderName: data.senderName || null,
        content: data.content,
      },
    });

    // Update conversation's last message and unread count
    const updateData: any = {
      lastMessage: data.content,
      updatedAt: new Date(),
    };

    // Increment unread count if message is from customer
    if (data.sender === MessageSender.CUSTOMER) {
      updateData.unreadCount = {
        increment: 1,
      };
    }

    await prisma.supportConversation.update({
      where: { id: data.conversationId },
      data: updateData,
    });

    return message;
  }

  /**
   * Assign conversation to a staff member
   */
  async assignConversation(data: AssignConversationInput) {
    return await prisma.supportConversation.update({
      where: { id: data.conversationId },
      data: {
        assignedStaffId: data.staffId,
        status: ConversationStatus.ACTIVE,
      },
    });
  }

  /**
   * Mark conversation as read (reset unread count)
   */
  async markAsRead(conversationId: string) {
    return await prisma.supportConversation.update({
      where: { id: conversationId },
      data: {
        unreadCount: 0,
      },
    });
  }

  /**
   * Close a conversation
   */
  async closeConversation(conversationId: string) {
    return await prisma.supportConversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.CLOSED,
      },
    });
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string) {
    await prisma.supportConversation.delete({
      where: { id: conversationId },
    });
  }

  /**
   * Bulk delete conversations
   */
  async bulkDeleteConversations(conversationIds: string[]) {
    await prisma.supportConversation.deleteMany({
      where: {
        id: {
          in: conversationIds,
        },
      },
    });
  }

  /**
   * Get conversation statistics
   */
  async getStatistics() {
    const [total, pending, active, closed] = await Promise.all([
      prisma.supportConversation.count(),
      prisma.supportConversation.count({ where: { status: ConversationStatus.PENDING } }),
      prisma.supportConversation.count({ where: { status: ConversationStatus.ACTIVE } }),
      prisma.supportConversation.count({ where: { status: ConversationStatus.CLOSED } }),
    ]);

    return {
      total,
      pending,
      active,
      closed,
    };
  }
}

export default new SupportService();
