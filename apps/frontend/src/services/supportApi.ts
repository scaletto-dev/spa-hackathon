/**
 * Support Chat API Service
 * Handles REST API calls for support conversations
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface ConversationResponse {
    id: string;
    customerName: string;
    customerEmail?: string;
    status: 'PENDING' | 'ACTIVE' | 'CLOSED';
    assignedStaffId?: string;
    lastMessage?: string;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
    messages?: MessageResponse[];
}

export interface MessageResponse {
    id: string;
    conversationId: string;
    sender: 'CUSTOMER' | 'STAFF' | 'AI';
    senderName?: string;
    content: string;
    createdAt: string;
}

export interface CreateConversationRequest {
    customerName: string;
    customerEmail?: string;
    initialMessage?: string;
}

export interface SendMessageRequest {
    conversationId: string;
    sender: 'customer' | 'staff' | 'ai';
    senderName?: string;
    content: string;
}

/**
 * Get all conversations with optional filters
 */
export async function getConversations(filters?: {
    status?: string;
    assignedStaffId?: string;
    search?: string;
}) {
    const response = await axios.get<{
        success: boolean;
        data: ConversationResponse[];
        count: number;
    }>(`${API_URL}/support/conversations`, {
        params: filters,
    });
    return response.data.data;
}

/**
 * Get single conversation with messages
 */
export async function getConversation(id: string) {
    const response = await axios.get<{
        success: boolean;
        data: ConversationResponse;
    }>(`${API_URL}/support/conversations/${id}`);
    return response.data.data;
}

/**
 * Create new conversation
 */
export async function createConversation(data: CreateConversationRequest) {
    const response = await axios.post<{
        success: boolean;
        data: ConversationResponse;
    }>(`${API_URL}/support/conversations`, data);
    return response.data.data;
}

/**
 * Update conversation details (e.g., customer name, email)
 */
export async function updateConversation(
    conversationId: string,
    data: { customerName?: string; customerEmail?: string }
) {
    const response = await axios.patch<{
        success: boolean;
        data: ConversationResponse;
    }>(`${API_URL}/support/conversations/${conversationId}`, data);
    return response.data.data;
}

/**
 * Assign conversation to staff
 */
export async function assignConversation(conversationId: string, staffId: string) {
    const response = await axios.post<{
        success: boolean;
        data: ConversationResponse;
    }>(`${API_URL}/support/conversations/${conversationId}/assign`, {
        staffId,
    });
    return response.data.data;
}

/**
 * Close conversation
 */
export async function closeConversation(conversationId: string) {
    const response = await axios.post<{
        success: boolean;
        data: ConversationResponse;
    }>(`${API_URL}/support/conversations/${conversationId}/close`);
    return response.data.data;
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversationId: string) {
    const response = await axios.get<{
        success: boolean;
        data: MessageResponse[];
        count: number;
    }>(`${API_URL}/support/conversations/${conversationId}/messages`);
    return response.data.data;
}

/**
 * Send a message (HTTP fallback)
 */
export async function sendMessage(data: SendMessageRequest) {
    const response = await axios.post<{
        success: boolean;
        data: MessageResponse;
    }>(`${API_URL}/support/messages`, data);
    return response.data.data;
}

/**
 * Get conversation statistics
 */
export async function getStatistics() {
    const response = await axios.get<{
        success: boolean;
        data: {
            total: number;
            pending: number;
            active: number;
            closed: number;
        };
    }>(`${API_URL}/support/statistics`);
    return response.data.data;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string) {
    const response = await axios.delete<{
        success: boolean;
        data: { message: string };
    }>(`${API_URL}/support/conversations/${conversationId}`);
    return response.data.data;
}

/**
 * Bulk delete conversations
 */
export async function bulkDeleteConversations(conversationIds: string[]) {
    const response = await axios.post<{
        success: boolean;
        data: { message: string };
    }>(`${API_URL}/support/conversations/bulk-delete`, {
        ids: conversationIds,
    });
    return response.data.data;
}

/**
 * Get AI-generated reply suggestions for a conversation
 */
export async function getAISuggestions(
    conversationId: string,
    language?: string
): Promise<
    {
        id: string;
        content: string;
        confidence: number;
        reasoning: string;
    }[]
> {
    const response = await axios.get<{
        success: boolean;
        data: {
            id: string;
            content: string;
            confidence: number;
            reasoning: string;
        }[];
    }>(`${API_URL}/support/conversations/${conversationId}/ai-suggestions`, {
        params: language ? { language } : undefined,
    });
    return response.data.data;
}
