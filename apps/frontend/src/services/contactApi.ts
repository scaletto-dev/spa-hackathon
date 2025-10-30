/**
 * Contact API Client
 * 
 * Handles contact form submission API calls
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    messageType: 'general_inquiry' | 'service_question' | 'booking_assistance' | 'feedback' | 'other';
    message: string;
}

export interface ContactSubmissionResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        messageType: string;
        message: string;
        status: string;
        createdAt: string;
    };
}

export const contactApi = {
    /**
     * Submit contact form
     */
    submitContactForm: async (data: ContactFormData): Promise<ContactSubmissionResponse> => {
        const response = await axios.post<ContactSubmissionResponse>(
            `${API_URL}/api/v1/contact`,
            data
        );
        return response.data;
    },
};

// Re-export types for convenience
export type { ContactFormData as ContactData };

