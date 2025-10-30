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
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                logger.error('GEMINI_API_KEY not found in environment variables!');
                throw new Error('GEMINI_API_KEY is required');
            }

            logger.info(`Initializing AI Service with API key: ${apiKey.substring(0, 10)}...`);

            // Fast model for chat and quick tasks
            this.flashModel = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
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
     * Chat Widget - Main conversation handler
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

            // Quick intent handling: if user asks to "see services" or similar,
            // return a structured, nicely formatted response directly from DB
            const lowerMessage = message.toLowerCase();
            if (
                lowerMessage.includes('dịch vụ') ||
                lowerMessage.includes('các dịch vụ') ||
                lowerMessage.includes('services') ||
                lowerMessage.includes('xem dịch vụ')
            ) {
                try {
                    const services = await prisma.service.findMany({
                        where: { active: true },
                        select: { id: true, name: true, price: true, duration: true, description: true },
                        orderBy: { createdAt: 'desc' },
                        take: 20,
                    });

                    const replyLines = services.map((s, index) => {
                        const price = s.price ? `${Number(s.price).toLocaleString('vi-VN')} VNĐ` : 'Liên hệ';
                        const duration = s.duration ? `${s.duration} phút` : '';
                        const desc = s.description ? `\n   ${s.description}` : '';
                        return `${index + 1}. ${s.name}\n   ⏱ ${duration} | 💰 ${price}${desc}`;
                    });

                    const reply = `🌟 Các dịch vụ hiện có tại BeautyAI Spa:\n\n${replyLines.join('\n\n')}`;

                    const actions: Array<{
                        type: 'navigate' | 'book' | 'call';
                        label: string;
                        url?: string;
                        data?: any;
                    }> = services.slice(0, 3).map((s) => ({
                        type: 'navigate',
                        label: `Xem ${s.name}`,
                        url: `/services/${s.id}`,
                    }));

                    return {
                        reply,
                        suggestions: ['Tôi cần tư vấn thêm', 'Xem dịch vụ', 'Đặt lịch'],
                        sessionId,
                        actions,
                        metadata: {
                            responseTime: Date.now() - startTime,
                            confidence: 0.95,
                            fallbackUsed: false,
                        },
                    };
                } catch (dbErr) {
                    logger.error('Failed to fetch services for quick intent:', dbErr);
                    // fall through to normal flow and use Gemini/fallback
                }
            }

            // Build system prompt with real data from database
            const systemPrompt = await this.buildChatSystemPrompt(context);

            // Combine system prompt with user message
            const fullPrompt = `${systemPrompt}

User: ${message}

Respond in Vietnamese if the user wrote in Vietnamese, English if in English. Be helpful, concise (max 100 words), and friendly.`;

            logger.info(`Calling Gemini API with message: ${message.substring(0, 50)}...`);
            logger.info(`Prompt length: ${fullPrompt.length} chars`);

            const result = await this.flashModel.generateContent(fullPrompt);
            logger.info(`Gemini API responded successfully`);

            const response = result.response;
            logger.info(`Response object:`, {
                hasText: !!response.text,
                candidates: response.candidates?.length,
                promptFeedback: response.promptFeedback,
            });

            const reply = response.text();

            // Validate response - Gemini sometimes returns empty
            if (!reply || reply.trim() === '') {
                logger.warn('Gemini returned empty response, using fallback');
                throw new Error('Empty response from Gemini');
            }

            logger.info(`Gemini reply length: ${reply.length} chars`);

            // Extract suggestions and actions
            const suggestions = this.extractSuggestions(reply, message);
            const actions = this.extractActions(message, reply);

            const responseTime = Date.now() - startTime;

            return {
                reply: reply.trim(),
                suggestions,
                sessionId,
                actions,
                metadata: {
                    responseTime,
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
        // Fetch real data from database
        const [services, branches] = await Promise.all([
            prisma.service.findMany({
                where: { active: true },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    duration: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                take: 20, // Limit to avoid huge prompts
            }),
            prisma.branch.findMany({
                where: { active: true },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    phone: true,
                    email: true,
                    operatingHours: true,
                },
            }),
        ]);

        // Format services list
        const servicesText = services
            .map((s) => {
                const price = s.price ? `$${s.price}` : 'Contact for price';
                const duration = s.duration ? ` (${s.duration} mins)` : '';
                const category = s.category?.name ? ` [${s.category.name}]` : '';
                return `- ${s.name}${category}${duration}: ${price}\n  ${s.description || ''}`;
            })
            .join('\n');

        // Format branches list
        const branchesText = branches
            .map((b) => {
                // operatingHours is JSON, parse it
                let hoursText = 'Mon-Sat 9AM-8PM, Sun 10AM-6PM';
                try {
                    if (b.operatingHours && typeof b.operatingHours === 'object') {
                        const hours = b.operatingHours as any;
                        hoursText = Object.entries(hours)
                            .map(([day, time]) => `${day}: ${time}`)
                            .join(', ');
                    }
                } catch (e) {
                    // Use default if parsing fails
                }

                const email = b.email ? ` | Email: ${b.email}` : '';
                return `- ${b.name}: ${b.address}\n  Phone: ${b.phone}${email}\n  Hours: ${hoursText}`;
            })
            .join('\n\n');

        const basePrompt = `You are a helpful AI assistant for BeautyAI Spa, a luxury beauty clinic.

Your capabilities:
- Answer questions about spa services, pricing, and treatments
- Help users book appointments
- Provide skincare advice
- Give information about branch locations and hours

Available Services:
${servicesText}

Our Branches:
${branchesText}

Important notes:
- Always provide accurate pricing from the list above
- If asked about a service not listed, politely say we don't offer it currently
- Recommend booking through our website for best availability
- Be warm, professional, and helpful`;

        if (context?.currentPage) {
            return `${basePrompt}\n\nUser is currently on: ${context.currentPage} page`;
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
}

export const aiService = new AIService();
