import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { SuccessResponse } from '../types/api';
import { ValidationError } from '../utils/errors';

/**
 * AI Controller
 *
 * Handles HTTP requests for AI-powered features:
 * - Chat Widget (conversational AI)
 * - Skin Analysis (quiz analysis)
 * - Sentiment Analysis (review analysis)
 * - Blog Generation (content creation)
 */
export class AIController {
    /**
     * POST /api/v1/ai/chat
     * AI Chat Widget endpoint
     */
    async chat(
        req: Request<{}, {}, { message: string; sessionId?: string; context?: any }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { message, sessionId, context } = req.body;

            // Validation
            if (!message || typeof message !== 'string') {
                throw new ValidationError('Message is required and must be a string');
            }

            if (message.length > 1000) {
                throw new ValidationError('Message too long (max 1000 characters)');
            }

            // Generate or use existing session ID
            const currentSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

            // Call AI service
            const result = await aiService.chat(message, currentSessionId, context);

            const response: SuccessResponse<typeof result> = {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/ai/skin-analysis
     * Analyze skin quiz results
     */
    async analyzeSkin(
        req: Request<{}, {}, { answers: Array<{ questionId: number; question: string; answer: string }> }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { answers } = req.body;

            // Validation
            if (!answers || !Array.isArray(answers) || answers.length === 0) {
                throw new ValidationError('Answers array is required');
            }

            if (answers.length < 3) {
                throw new ValidationError('At least 3 questions must be answered');
            }

            // Call AI service
            const result = await aiService.analyzeSkin(answers);

            const response: SuccessResponse<typeof result> = {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/ai/sentiment
     * Analyze review sentiment
     */
    async analyzeSentiment(
        req: Request<{}, {}, { reviewText: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { reviewText } = req.body;

            // Validation
            if (!reviewText || typeof reviewText !== 'string') {
                throw new ValidationError('Review text is required');
            }

            if (reviewText.length < 10) {
                throw new ValidationError('Review text too short (min 10 characters)');
            }

            if (reviewText.length > 5000) {
                throw new ValidationError('Review text too long (max 5000 characters)');
            }

            // Call AI service
            const result = await aiService.analyzeSentiment(reviewText);

            const response: SuccessResponse<typeof result> = {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/ai/blog-generate
     * Generate blog content
     */
    async generateBlog(
        req: Request<{}, {}, { topic: string; keywords: string[] }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { topic, keywords } = req.body;

            // Validation
            if (!topic || typeof topic !== 'string') {
                throw new ValidationError('Topic is required');
            }

            if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
                throw new ValidationError('At least one keyword is required');
            }

            if (keywords.length > 10) {
                throw new ValidationError('Too many keywords (max 10)');
            }

            // Call AI service
            const result = await aiService.generateBlog(topic, keywords);

            const response: SuccessResponse<typeof result> = {
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/ai/health
     * Health check for AI service
     */
    async health(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: SuccessResponse<{ status: string; model: string }> = {
                success: true,
                data: {
                    status: 'AI service is operational',
                    model: 'gemini-2.0-flash',
                },
                timestamp: new Date().toISOString(),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new AIController();
