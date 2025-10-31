import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import aiController from '../controllers/ai.controller';

const router = Router();

/**
 * AI Routes
 * 
 * Defines API endpoints for AI-powered features
 * All endpoints are rate-limited to prevent abuse
 */

// Rate limiters for different AI features
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: 'Too many chat requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const analysisLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 requests per 5 minutes
    message: 'Too many analysis requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const generationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 requests per 15 minutes (blog generation is expensive)
    message: 'Too many generation requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * GET /api/v1/ai/health
 * Health check for AI service
 * 
 * Response:
 * - status: operational status
 * - model: AI model being used
 */
router.get('/health', aiController.health.bind(aiController));

/**
 * POST /api/v1/ai/chat
 * AI Chat Widget endpoint
 * Rate limit: 20 requests per minute
 * 
 * Body:
 * - message: string (required, max 1000 chars)
 * - sessionId: string (optional)
 * - context: object (optional) - currentPage, userId, previousMessages
 * 
 * Response:
 * - reply: AI response text
 * - suggestions: array of suggested follow-up questions
 * - actions: array of action buttons (navigate, book, call)
 * - metadata: responseTime, confidence, fallbackUsed
 */
router.post('/chat', chatLimiter, aiController.chat.bind(aiController));

/**
 * POST /api/v1/ai/skin-analysis
 * Analyze skin quiz results
 * Rate limit: 10 requests per 5 minutes
 * 
 * Body:
 * - answers: array of { questionId, question, answer }
 * 
 * Response:
 * - analysisId: unique analysis ID
 * - analysis: { skinType, primaryConcern, riskLevel }
 * - recommendations: array of recommended services
 * - tips: array of skincare tips
 */
router.post('/skin-analysis', analysisLimiter, aiController.analyzeSkin.bind(aiController));

/**
 * POST /api/v1/ai/sentiment
 * Analyze review sentiment
 * Rate limit: 10 requests per 5 minutes
 * 
 * Body:
 * - reviewText: string (required, 10-5000 chars)
 * 
 * Response:
 * - sentiment: positive|neutral|negative
 * - score: 0.0-1.0
 * - confidence: 0.0-1.0
 * - aspects: { service, staff, cleanliness, value }
 * - keywords: array of key phrases
 */
router.post('/sentiment', analysisLimiter, aiController.analyzeSentiment.bind(aiController));

/**
 * POST /api/v1/ai/blog-generate
 * Generate blog content
 * Rate limit: 3 requests per 15 minutes (expensive operation)
 * 
 * Body:
 * - topic: string (required)
 * - keywords: array of strings (required, max 10)
 * 
 * Response:
 * - title: blog title
 * - content: full HTML content
 * - metaDescription: SEO description
 * - excerpt: short excerpt
 */
router.post('/blog-generate', generationLimiter, aiController.generateBlog.bind(aiController));

export default router;
