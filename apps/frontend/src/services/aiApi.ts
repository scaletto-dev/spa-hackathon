/**
 * AI API Service
 * Handles all AI-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ===== TYPES =====

export interface ChatRequest {
    message: string;
    sessionId?: string;
    context?: {
        currentPage?: string;
        userId?: string;
        previousMessages?: string[];
    };
}

export interface ChatResponse {
    reply: string;
    suggestions: string[];
    sessionId: string;
    actions?: Array<{
        type: 'navigate' | 'book' | 'call';
        label: string;
        url?: string;
        data?: any;
    }>;
    metadata: {
        responseTime: number;
        confidence: number;
        fallbackUsed: boolean;
    };
}

export interface SkinAnalysisRequest {
    answers: Array<{
        questionId: number;
        question: string;
        answer: string;
    }>;
}

export interface SkinAnalysisResponse {
    analysisId: string;
    analysis: {
        skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
        primaryConcern: string;
        riskLevel: 'low' | 'medium' | 'high';
    };
    recommendations: Array<{
        serviceId: string;
        serviceName: string;
        reason: string;
        priority: number;
        price: number;
    }>;
    tips: string[];
}

export interface SentimentAnalysisRequest {
    reviewText: string;
}

export interface SentimentAnalysisResponse {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
    confidence: number;
    aspects?: {
        service?: string;
        staff?: string;
        cleanliness?: string;
        value?: string;
    };
    keywords?: string[];
}

export interface BlogGenerateRequest {
    topic: string;
    keywords: string[];
}

export interface BlogGenerateResponse {
    title: string;
    content: string;
    metaDescription: string;
    excerpt: string;
}

// ===== API CALLS =====

/**
 * Chat with AI assistant
 */
export async function chatWithAI(request: ChatRequest): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to chat with AI');
        }

        const data = await response.json();
        return data.data; // Backend wraps in { success, data, timestamp }
    } catch (error) {
        console.error('Chat AI error:', error);
        throw error;
    }
}

/**
 * Analyze skin quiz results
 */
export async function analyzeSkin(request: SkinAnalysisRequest): Promise<SkinAnalysisResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/skin-analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to analyze skin');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Skin analysis error:', error);
        throw error;
    }
}

/**
 * Analyze review sentiment
 */
export async function analyzeSentiment(request: SentimentAnalysisRequest): Promise<SentimentAnalysisResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/sentiment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to analyze sentiment');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        throw error;
    }
}

/**
 * Generate blog content
 */
export async function generateBlog(request: BlogGenerateRequest): Promise<BlogGenerateResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/blog-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate blog');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Blog generation error:', error);
        throw error;
    }
}

/**
 * Check AI service health
 */
export async function checkAIHealth(): Promise<{ status: string; model: string }> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/health`);

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('AI health check error:', error);
        throw error;
    }
}

// ===== NEW AI FEATURES =====

export interface TimeSlotSuggestion {
    time: string;
    score: number;
    reason: string;
}

export interface SuggestTimeSlotRequest {
    date: string;
    serviceIds?: string[];
    branchId: string;
}

export interface SuggestTimeSlotResponse {
    suggestedSlots: TimeSlotSuggestion[];
    bestSlot: string;
    confidence: number;
    message?: string;
}

export interface SentimentSummary {
    overall: {
        sentiment: 'positive' | 'neutral' | 'negative';
        score: number;
        change: string;
    };
    avgRating: number;
    totalReviews: number;
    breakdown: {
        service: number;
        staff: number;
        cleanliness: number;
        value: number;
    };
    trends: string[];
}

export interface ServiceDescriptionVariation {
    description: string;
    longDescription: string;
    excerpt: string;
    benefits: string[];
}

export interface GenerateServiceDescriptionRequest {
    serviceName: string;
    category?: string;
    price?: number;
    duration?: number;
}

export interface GenerateServiceDescriptionResponse {
    serviceName: string;
    variations: ServiceDescriptionVariation[];
}

/**
 * Suggest optimal time slots using AI
 */
export async function suggestTimeSlot(request: SuggestTimeSlotRequest): Promise<SuggestTimeSlotResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/suggest-timeslot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to suggest time slot');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Time slot suggestion error:', error);
        throw error;
    }
}

/**
 * Get sentiment analysis summary for reviews
 */
export async function getSentimentSummary(period: 'week' | 'month' | 'year' = 'month'): Promise<SentimentSummary> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/sentiment-summary?period=${period}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get sentiment summary');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Sentiment summary error:', error);
        throw error;
    }
}

/**
 * Generate service description with AI
 */
export async function generateServiceDescription(
    request: GenerateServiceDescriptionRequest,
): Promise<GenerateServiceDescriptionResponse> {
    try {
        const response = await fetch(`${API_URL}/api/v1/ai/generate-service-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate service description');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Service description generation error:', error);
        throw error;
    }
}
