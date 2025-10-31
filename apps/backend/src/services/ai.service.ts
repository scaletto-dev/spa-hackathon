/**
 * AI Service - Powered by Google Gemini
 * Handles all AI-related features: Chat, Sentiment Analysis, Blog Generation, etc.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import logger from '../config/logger';
import prisma from '../lib/prisma';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatContext {
    currentPage?: string;
    userId?: string;
    previousMessages?: string[];
}

interface ChatResponse {
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

interface SkinAnalysis {
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

interface Sentiment {
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

class AIService {
    private flashModel: any;
    private proModel: any;

    constructor() {
        try {
            const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDuPRKf5aFq5nSrxmK5dZ5QECNexDeqlDA';
            if (!apiKey) {
                logger.error('GEMINI_API_KEY not found in environment variables!');
                throw new Error('GEMINI_API_KEY is required');
            }

            logger.info(`Initializing AI Service with API key: ${apiKey.substring(0, 10)}...`);

            // Fast model for chat and quick tasks
            this.flashModel = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                },
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ],
            });

            // Pro model for complex tasks
            this.proModel = genAI.getGenerativeModel({
                model: 'gemini-2.5-pro',
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 2000,
                },
            });

            logger.info('AI Service initialized with Gemini models successfully');
        } catch (error) {
            logger.error('Failed to initialize AI Service:', error);
            throw error;
        }
    }

    /**
     * Chat Widget - Main conversation handler with Function Calling
     */
    async chat(message: string, sessionId: string, context?: ChatContext): Promise<ChatResponse> {
        const startTime = Date.now();

        try {
            // Check if models are initialized
            if (!this.flashModel) {
                logger.error('Flash model not initialized!');
                throw new Error('AI model not initialized');
            }

            logger.info(`Chat request received: "${message.substring(0, 100)}"`);

            // Define function declarations for Gemini to call
            const tools = [
                {
                    functionDeclarations: [
                        {
                            name: 'getServices',
                            description:
                                'Fetch available spa services from database. Use this when user asks about services, treatments, or what we offer.',
                            parameters: {
                                type: 'object',
                                properties: {
                                    category: {
                                        type: 'string',
                                        description: 'Optional category filter (e.g., "Facial", "Massage")',
                                    },
                                },
                            },
                        },
                        {
                            name: 'getBranches',
                            description:
                                'Fetch branch locations with addresses and operating hours. Use this when user asks about locations, addresses, or where we are.',
                            parameters: {
                                type: 'object',
                                properties: {},
                            },
                        },
                        {
                            name: 'getServiceDetails',
                            description:
                                'Get detailed information about a specific service including price and duration',
                            parameters: {
                                type: 'object',
                                properties: {
                                    serviceName: {
                                        type: 'string',
                                        description: 'Name of the service to look up',
                                    },
                                },
                                required: ['serviceName'],
                            },
                        },
                    ],
                },
            ];

            // Build system prompt with conversation history
            const systemPrompt = await this.buildChatSystemPrompt(context);

            // Add conversation history if available
            let conversationContext = '';
            if (context?.previousMessages && context.previousMessages.length > 0) {
                conversationContext = `\n\nPrevious conversation:\n${context.previousMessages.join('\n')}`;
            }

            const fullPrompt = `${systemPrompt}${conversationContext}

User: ${message}

Instructions:
- If user asks about services, branches, or specific details, use the available functions to get accurate real-time data
- Respond in Vietnamese if user wrote in Vietnamese, English if in English
- Be helpful, concise (max 150 words), warm and professional
- Remember previous conversation context to provide continuity`;

            logger.info(`Calling Gemini API with function calling enabled`);

            // Call Gemini with function calling
            const chat = this.flashModel.startChat({
                tools,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                },
            });

            const result = await chat.sendMessage(fullPrompt);
            const response = result.response;

            // Check if Gemini wants to call a function
            const functionCall = response.functionCalls()?.[0];

            if (functionCall) {
                logger.info(`AI requested function call: ${functionCall.name}`);

                // Execute the requested function
                const functionResponse = await this.executeFunctionCall(functionCall);

                // Send function result back to Gemini
                const result2 = await chat.sendMessage([
                    {
                        functionResponse: {
                            name: functionCall.name,
                            response: functionResponse,
                        },
                    },
                ]);

                const reply = result2.response.text();

                // Extract suggestions and actions
                const suggestions = this.extractSuggestions(reply, message);
                const actions = this.extractActions(message, reply);

                return {
                    reply: reply.trim(),
                    suggestions,
                    sessionId,
                    actions,
                    metadata: {
                        responseTime: Date.now() - startTime,
                        confidence: 0.9,
                        fallbackUsed: false,
                    },
                };
            }

            // No function call, use direct response
            const reply = response.text();

            // Validate response
            if (!reply || reply.trim() === '') {
                logger.warn('Gemini returned empty response, using fallback');
                throw new Error('Empty response from Gemini');
            }

            logger.info(`Gemini reply length: ${reply.length} chars`);

            // Extract suggestions and actions
            const suggestions = this.extractSuggestions(reply, message);
            const actions = this.extractActions(message, reply);

            return {
                reply: reply.trim(),
                suggestions,
                sessionId,
                actions,
                metadata: {
                    responseTime: Date.now() - startTime,
                    confidence: 0.85,
                    fallbackUsed: false,
                },
            };
        } catch (error: any) {
            logger.error('Chat AI failed with error:', {
                message: error?.message,
                stack: error?.stack,
                name: error?.name,
                response: error?.response?.data,
            });

            // Fallback to rule-based response
            return this.getFallbackChatResponse(message, sessionId, Date.now() - startTime);
        }
    }

    /**
     * Execute function calls requested by Gemini
     */
    private async executeFunctionCall(functionCall: any): Promise<any> {
        const { name, args } = functionCall;

        try {
            switch (name) {
                case 'getServices': {
                    const categoryFilter = args?.category;
                    const services = await prisma.service.findMany({
                        where: {
                            active: true,
                            ...(categoryFilter && {
                                category: {
                                    name: {
                                        contains: categoryFilter,
                                        mode: 'insensitive',
                                    },
                                },
                            }),
                        },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            duration: true,
                            description: true,
                            category: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                        take: 20,
                        orderBy: { createdAt: 'desc' },
                    });

                    return {
                        success: true,
                        data: services.map((s) => ({
                            id: s.id,
                            name: s.name,
                            category: s.category?.name,
                            price: s.price ? Number(s.price) : null,
                            duration: s.duration,
                            description: s.description,
                        })),
                    };
                }

                case 'getBranches': {
                    const branches = await prisma.branch.findMany({
                        where: { active: true },
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            phone: true,
                            email: true,
                            operatingHours: true,
                        },
                    });

                    return {
                        success: true,
                        data: branches.map((b) => ({
                            id: b.id,
                            name: b.name,
                            address: b.address,
                            phone: b.phone,
                            email: b.email,
                            operatingHours: b.operatingHours,
                        })),
                    };
                }

                case 'getServiceDetails': {
                    const serviceName = args?.serviceName;
                    if (!serviceName) {
                        return { success: false, error: 'Service name is required' };
                    }

                    const service = await prisma.service.findFirst({
                        where: {
                            active: true,
                            name: {
                                contains: serviceName,
                                mode: 'insensitive',
                            },
                        },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            duration: true,
                            description: true,
                            category: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    });

                    if (!service) {
                        return { success: false, error: 'Service not found' };
                    }

                    return {
                        success: true,
                        data: {
                            id: service.id,
                            name: service.name,
                            category: service.category?.name,
                            price: service.price ? Number(service.price) : null,
                            duration: service.duration,
                            description: service.description,
                        },
                    };
                }

                default:
                    return { success: false, error: `Unknown function: ${name}` };
            }
        } catch (error) {
            logger.error(`Function call ${name} failed:`, error);
            return { success: false, error: 'Database query failed' };
        }
    }

    /**
     * Skin Analysis - Analyze quiz results
     */
    async analyzeSkin(answers: Array<{ questionId: number; question: string; answer: string }>): Promise<SkinAnalysis> {
        try {
            // Detect language from questions
            const isVietnamese = answers.some((a) =>
                /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(a.question),
            );

            const language = isVietnamese ? 'Vietnamese' : 'English';

            // Use a more structured approach with explicit JSON mode
            const answersText = answers.map((a) => `${a.question}: ${a.answer}`).join('\n');

            const prompt = `You are a professional esthetician. Analyze this skin quiz and provide recommendations in ${language}.

Quiz answers:
${answersText}

Return ONLY a JSON object in ${language} language with this exact structure:
{
  "skinType": "oily or dry or combination or normal or sensitive",
  "primaryConcern": "main skin concern in 5 words",
  "riskLevel": "low or medium or high",
  "concerns": ["concern 1", "concern 2"],
  "tips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}

CRITICAL: 
- All text fields MUST be in ${language}
- Start response with { and end with }
- No markdown, no explanation, just JSON`;

            logger.info('Calling Gemini for skin analysis...');
            logger.info('Answers:', answers);

            const result = await this.flashModel.generateContent(prompt);

            // Check if response was blocked
            const response = result.response;
            logger.info('Response candidates:', response.candidates);
            logger.info('Prompt feedback:', response.promptFeedback);

            if (!response.candidates || response.candidates.length === 0) {
                logger.error('No candidates in response - possibly blocked by safety filters');
                throw new Error('AI response was blocked. Please try again.');
            }

            const responseText = response.text();

            logger.info('=== GEMINI RAW RESPONSE START ===');
            logger.info(responseText);
            logger.info('=== GEMINI RAW RESPONSE END ===');

            // More aggressive cleaning
            let cleanedText = responseText.trim();

            // Remove any text before first {
            const firstBrace = cleanedText.indexOf('{');
            if (firstBrace > 0) {
                cleanedText = cleanedText.substring(firstBrace);
            }

            // Remove any text after last }
            const lastBrace = cleanedText.lastIndexOf('}');
            if (lastBrace !== -1) {
                cleanedText = cleanedText.substring(0, lastBrace + 1);
            }

            // Remove markdown code blocks
            cleanedText = cleanedText.replace(/```json\s*/gi, '');
            cleanedText = cleanedText.replace(/```\s*/g, '');
            cleanedText = cleanedText.trim();

            logger.info('=== CLEANED TEXT START ===');
            logger.info(cleanedText);
            logger.info('=== CLEANED TEXT END ===');

            // Try to parse directly
            let analysis;
            try {
                analysis = JSON.parse(cleanedText);
                logger.info('✅ JSON parsed successfully:', analysis);
            } catch (parseError) {
                logger.error('❌ JSON parse failed:', parseError);
                logger.error('Attempted to parse:', cleanedText);
                throw new Error('Invalid JSON response from AI');
            }

            // Query database for real service recommendations based on skin type
            const services = await prisma.service.findMany({
                where: {
                    active: true,
                    // You can add more sophisticated filtering based on skin type
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    duration: true,
                },
                take: 4,
            });

            // Generate recommendations with real services
            const recommendations = services.map((service, index) => {
                const recommendText = isVietnamese
                    ? `Phù hợp cho da ${analysis.skinType}${
                          analysis.primaryConcern ? ` với vấn đề ${analysis.primaryConcern}` : ''
                      }`
                    : `Recommended for ${analysis.skinType} skin type${
                          analysis.primaryConcern ? ` with ${analysis.primaryConcern}` : ''
                      }`;

                return {
                    serviceId: service.id,
                    serviceName: service.name,
                    reason: recommendText,
                    priority: index + 1,
                    price: service.price ? Number(service.price) : 0,
                };
            });

            // Fallback if no services found
            if (recommendations.length === 0) {
                recommendations.push({
                    serviceId: 'fallback-1',
                    serviceName: 'Consultation',
                    reason: `Personalized consultation for ${analysis.skinType} skin`,
                    priority: 1,
                    price: 0,
                });
            }

            return {
                analysisId: `analysis-${Date.now()}`,
                analysis: {
                    skinType: analysis.skinType,
                    primaryConcern: analysis.primaryConcern || 'General skin health',
                    riskLevel: analysis.riskLevel || 'low',
                },
                recommendations,
                tips: analysis.tips || [],
            };
        } catch (error: any) {
            logger.error('Skin analysis failed:', {
                error: error?.message,
                stack: error?.stack,
            });
            throw new Error('Unable to analyze skin. Please try again.');
        }
    }

    /**
     * Sentiment Analysis - Analyze review sentiment
     */
    async analyzeSentiment(reviewText: string): Promise<Sentiment> {
        try {
            // Quick rule-based check first
            const quickScore = this.quickSentimentCheck(reviewText);

            if (quickScore.confidence > 0.8) {
                return quickScore;
            }

            // Use AI for uncertain cases
            const prompt = `Analyze sentiment of this spa review (Vietnamese or English):
"${reviewText}"

Return ONLY valid JSON:
{
  "sentiment": "positive|neutral|negative",
  "score": 0.0-1.0,
  "aspects": {
    "service": "positive|neutral|negative",
    "staff": "positive|neutral|negative",
    "cleanliness": "positive|neutral|negative",
    "value": "positive|neutral|negative"
  },
  "keywords": ["keyword1", "keyword2"]
}`;

            const result = await this.flashModel.generateContent(prompt);
            const responseText = result.response.text();

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return quickScore;
            }

            const sentiment = JSON.parse(jsonMatch[0]);

            return {
                sentiment: sentiment.sentiment,
                score: sentiment.score,
                confidence: 0.9,
                aspects: sentiment.aspects,
                keywords: sentiment.keywords,
            };
        } catch (error) {
            logger.error('Sentiment analysis failed:', error);
            return this.quickSentimentCheck(reviewText);
        }
    }

    /**
     * Blog Generator - Generate blog content
     */
    async generateBlog(topic: string, keywords: string[]): Promise<any> {
        try {
            const prompt = `Write a professional blog post for a luxury spa website.

Topic: ${topic}
Keywords to include: ${keywords.join(', ')}
Target audience: 25-45 year old women interested in skincare
Tone: Professional but warm and approachable
Length: 800-1000 words
Language: Vietnamese

Structure:
1. Engaging headline
2. Introduction (hook the reader)
3. Main content (3-4 sections with subheadings)
4. Practical tips
5. Call-to-action
6. SEO meta description (max 160 chars)

Format as JSON:
{
  "title": "headline",
  "content": "full HTML content",
  "metaDescription": "SEO description",
  "excerpt": "short excerpt"
}

Respond ONLY with valid JSON.`;

            const result = await this.proModel.generateContent(prompt);
            const responseText = result.response.text();

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON in response');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Blog generation failed:', error);
            throw new Error('Unable to generate blog. Please try again.');
        }
    }

    // ===== PRIVATE HELPER METHODS =====

    private async buildChatSystemPrompt(context?: ChatContext): Promise<string> {
        const basePrompt = `You are a helpful AI assistant for BeautyAI Spa, a luxury beauty and wellness clinic.

Your role:
- Answer questions about spa services, pricing, treatments, and skincare
- Help users discover the right services for their needs
- Provide information about branch locations and operating hours  
- Guide users through the booking process
- Remember conversation context and provide personalized responses

Important guidelines:
- Use the available function calls (getServices, getBranches, getServiceDetails) to fetch real-time accurate data
- Always call functions when users ask about specific information rather than guessing
- Be warm, professional, and conversational
- If asked about something you don't have information about, politely acknowledge and offer alternatives
- Format prices in VNĐ for Vietnamese, $ for English
- Encourage users to book appointments when appropriate`;

        if (context?.currentPage) {
            return `${basePrompt}\n\nContext: User is currently viewing the ${context.currentPage} page`;
        }

        return basePrompt;
    }

    private extractSuggestions(reply: string, userMessage: string): string[] {
        const suggestions: string[] = [];

        if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('giá')) {
            suggestions.push('Xem bảng giá đầy đủ', 'Đặt lịch ngay');
        } else if (userMessage.toLowerCase().includes('book') || userMessage.toLowerCase().includes('đặt')) {
            suggestions.push('Chọn dịch vụ', 'Xem chi nhánh');
        } else {
            suggestions.push('Tôi cần tư vấn thêm', 'Xem dịch vụ', 'Đặt lịch');
        }

        return suggestions.slice(0, 3);
    }

    private extractActions(userMessage: string, aiReply: string): Array<any> {
        const actions: Array<{ type: string; label: string; url?: string; data?: any }> = [];
        const lowerMessage = userMessage.toLowerCase();

        if (
            lowerMessage.includes('book') ||
            lowerMessage.includes('đặt lịch') ||
            lowerMessage.includes('appointment')
        ) {
            actions.push({
                type: 'navigate',
                label: 'Đặt lịch ngay',
                url: '/booking',
            });
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('giá') || lowerMessage.includes('cost')) {
            actions.push({
                type: 'navigate',
                label: 'Xem bảng giá',
                url: '/services',
            });
        }

        if (lowerMessage.includes('location') || lowerMessage.includes('địa chỉ') || lowerMessage.includes('branch')) {
            actions.push({
                type: 'navigate',
                label: 'Xem chi nhánh',
                url: '/branches',
            });
        }

        return actions;
    }

    private getFallbackChatResponse(message: string, sessionId: string, responseTime: number): ChatResponse {
        const lowerMessage = message.toLowerCase();

        let reply = 'Xin chào! Tôi là trợ lý ảo của BeautyAI Spa. Tôi có thể giúp gì cho bạn?';

        if (lowerMessage.includes('price') || lowerMessage.includes('giá')) {
            reply =
                'Giá dịch vụ của chúng tôi từ $80 đến $400. HydraFacial $150, Chemical Peel $120, Microneedling $200. Bạn muốn biết chi tiết dịch vụ nào?';
        } else if (lowerMessage.includes('hour') || lowerMessage.includes('giờ') || lowerMessage.includes('open')) {
            reply = 'Chúng tôi mở cửa: Thứ 2-7: 9AM-8PM, Chủ nhật: 10AM-6PM. Bạn muốn đặt lịch không?';
        } else if (lowerMessage.includes('book') || lowerMessage.includes('đặt')) {
            reply =
                'Tuyệt vời! Bạn muốn đặt dịch vụ nào? Chúng tôi có HydraFacial, Chemical Peel, Microneedling và nhiều dịch vụ khác.';
        }

        return {
            reply,
            suggestions: ['Xem dịch vụ', 'Đặt lịch', 'Xem chi nhánh'],
            sessionId,
            actions: [],
            metadata: {
                responseTime,
                confidence: 0.7,
                fallbackUsed: true,
            },
        };
    }

    private quickSentimentCheck(text: string): Sentiment {
        const lowerText = text.toLowerCase();

        const positiveWords = [
            'tuyệt vời',
            'excellent',
            'amazing',
            'love',
            'great',
            'wonderful',
            'fantastic',
            'perfect',
            'best',
            'tốt',
            'hay',
            'xuất sắc',
        ];
        const negativeWords = [
            'terrible',
            'bad',
            'awful',
            'worst',
            'disappointing',
            'poor',
            'tệ',
            'kém',
            'thất vọng',
            'không tốt',
        ];

        let score = 0;
        positiveWords.forEach((word) => {
            if (lowerText.includes(word)) score += 1;
        });
        negativeWords.forEach((word) => {
            if (lowerText.includes(word)) score -= 1;
        });

        const confidence = Math.abs(score) > 2 ? 0.9 : 0.6;
        const normalizedScore = Math.max(0, Math.min(1, (score + 5) / 10));

        return {
            sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
            score: normalizedScore,
            confidence,
        };
    }

    /**
     * Generate AI-powered support chat suggestions
     */
    async generateSupportSuggestions(
        conversationId: string,
        forceLanguage?: string,
    ): Promise<{
        suggestions: Array<{
            id: string;
            content: string;
            confidence: number;
            reasoning: string;
        }>;
    }> {
        try {
            // Fetch conversation and recent messages
            const conversation = await prisma.supportConversation.findUnique({
                where: { id: conversationId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                },
            });

            if (!conversation) {
                throw new Error('Conversation not found');
            }

            // Build conversation context
            const messageHistory = conversation.messages
                .reverse()
                .map((msg) => `${msg.sender}: ${msg.content}`)
                .join('\n');

            // Use force language if provided, otherwise detect from conversation
            let language: string;
            if (forceLanguage) {
                language = forceLanguage;
            } else {
                const isVietnamese = conversation.messages.some((msg) =>
                    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(msg.content),
                );
                language = isVietnamese ? 'Vietnamese' : 'English';
            }

            const prompt = `You are a professional customer support assistant for a spa and beauty services business.

CRITICAL: You MUST respond in ${language} language ONLY. All suggestions must be in ${language}.

Analyze this customer conversation and provide 3 helpful, professional reply suggestions:

Customer: ${conversation.customerName}
Email: ${conversation.customerEmail || 'N/A'}

Recent conversation:
${messageHistory}

Based on the context above, suggest 3 different professional replies IN ${language} that:
1. Address the customer's most recent message or question
2. Are helpful, empathetic, and solution-oriented
3. Match a professional spa/beauty service tone
4. Include relevant information about services, booking, pricing when applicable
5. MUST be written entirely in ${language} language

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks):
[
  {
    "content": "Your first suggested reply here IN ${language}",
    "reasoning": "Why this reply is appropriate IN ${language}"
  },
  {
    "content": "Your second suggested reply here IN ${language}",
    "reasoning": "Why this reply is appropriate IN ${language}"
  },
  {
    "content": "Your third suggested reply here IN ${language}",
    "reasoning": "Why this reply is appropriate IN ${language}"
  }
]`;

            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON response
            let suggestions;
            try {
                // Clean up the response - remove markdown code blocks if present
                const cleanedText = text
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                suggestions = JSON.parse(cleanedText);
            } catch (parseError) {
                logger.error('Failed to parse AI suggestions JSON:', parseError);
                throw new Error('Failed to parse AI response');
            }

            // Add IDs and confidence scores
            const formattedSuggestions = suggestions.map((suggestion: any, index: number) => ({
                id: `ai-suggestion-${Date.now()}-${index}`,
                content: suggestion.content,
                confidence: 0.9 - index * 0.05, // Decreasing confidence
                reasoning: suggestion.reasoning,
            }));

            return { suggestions: formattedSuggestions };
        } catch (error) {
            logger.error('AI support suggestions error:', error);
            throw error;
        }
    }
}

export const aiService = new AIService();
