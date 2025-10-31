/**
 * Shared types for chat components
 */

export type MessageType = 'bot' | 'user' | 'agent' | 'system';

export interface Message {
    type: MessageType;
    text: string;
    timestamp?: Date;
    actions?: MessageAction[];
    bookingData?: BookingData;
}

export interface MessageAction {
    type: 'button' | 'booking' | 'link';
    label: string;
    action: string;
    data?: Record<string, unknown>;
}

export interface BookingData {
    serviceId?: string;
    serviceName: string;
    slots: Array<{
        datetime: string;
        branchName: string;
        price: number;
    }>;
}

export interface AgentInfo {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'typing' | 'offline';
}
