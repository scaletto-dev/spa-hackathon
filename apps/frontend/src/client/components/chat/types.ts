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
    type: 'button' | 'booking' | 'link' | 'confirm_booking';
    label: string;
    action: string;
    data?: Record<string, string | number | boolean | undefined>;
}

export interface BookingData {
    serviceId?: string;
    serviceName: string;
    slots: Array<{
        datetime: string;
        branchName: string;
        branchId?: string;
        price: number;
    }>;
}

export interface BookingFormData {
    serviceName: string;
    serviceId?: string | undefined;
    date: string;
    time: string;
    branchName: string;
    branchId?: string | undefined;
    price: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
}

export interface AgentInfo {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'typing' | 'offline';
}
