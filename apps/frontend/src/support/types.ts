// Support Dashboard Type Definitions

export interface Conversation {
    id: string;
    customerName: string;
    customerAvatar?: string;
    lastMessage: string;
    status: 'active' | 'closed' | 'pending';
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    sender: 'customer' | 'staff' | 'ai';
    senderName?: string;
    senderAvatar?: string;
    content: string;
    createdAt: string;
    isRead?: boolean;
}

export interface AISuggestion {
    id: string;
    content: string;
    confidence: number;
    reasoning?: string;
}

export interface StaffInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
}

export type ConversationFilter = 'all' | 'active' | 'closed' | 'mine';

export interface ConversationSummary {
    customerConcern: string;
    suggestedActions: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
}
