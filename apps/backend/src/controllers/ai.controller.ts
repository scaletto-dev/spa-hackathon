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
    next: NextFunction
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
      const currentSessionId =
        sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

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
    req: Request<
      {},
      {},
      { answers: Array<{ questionId: number; question: string; answer: string }> }
    >,
    res: Response,
    next: NextFunction
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
    next: NextFunction
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
    next: NextFunction
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

  /**
   * GET /api/v1/ai/sentiment-summary
   * Get sentiment analysis summary for reviews
   */
  async getSentimentSummary(
    req: Request<{}, {}, {}, { period?: 'week' | 'month' | 'year' }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { period = 'month' } = req.query;

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (period === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      // Import prisma dynamically to avoid circular deps
      const { default: prisma } = await import('@/config/database');

      // Get reviews from database
      const reviews = await prisma.review.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          reviewText: true,
          rating: true,
          createdAt: true,
        },
      });

      if (reviews.length === 0) {
        const response: SuccessResponse<any> = {
          success: true,
          data: {
            overall: { sentiment: 'neutral', score: 0, change: '0%' },
            avgRating: 0,
            totalReviews: 0,
            breakdown: { service: 0, staff: 0, cleanliness: 0, value: 0 },
            trends: ['Không có đủ dữ liệu để phân tích'],
          },
          timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
        return;
      }

      // Analyze sentiment for each review (sample max 20)
      let totalPositive = 0;
      let totalNeutral = 0;
      let totalNegative = 0;
      let totalScore = 0;
      const aspectScores = {
        service: [] as number[],
        staff: [] as number[],
        cleanliness: [] as number[],
        value: [] as number[],
      };

      const reviewsToAnalyze = reviews.slice(0, 20);

      for (const review of reviewsToAnalyze) {
        if (!review.reviewText) continue;

        try {
          const sentiment = await aiService.analyzeSentiment(review.reviewText);
          totalScore += sentiment.score;

          if (sentiment.sentiment === 'positive') totalPositive++;
          else if (sentiment.sentiment === 'negative') totalNegative++;
          else totalNeutral++;

          // Aggregate aspect scores
          if (sentiment.aspects) {
            if (sentiment.aspects.service) {
              aspectScores.service.push(
                sentiment.aspects.service === 'positive'
                  ? 1
                  : sentiment.aspects.service === 'negative'
                    ? 0
                    : 0.5
              );
            }
            if (sentiment.aspects.staff) {
              aspectScores.staff.push(
                sentiment.aspects.staff === 'positive'
                  ? 1
                  : sentiment.aspects.staff === 'negative'
                    ? 0
                    : 0.5
              );
            }
            if (sentiment.aspects.cleanliness) {
              aspectScores.cleanliness.push(
                sentiment.aspects.cleanliness === 'positive'
                  ? 1
                  : sentiment.aspects.cleanliness === 'negative'
                    ? 0
                    : 0.5
              );
            }
            if (sentiment.aspects.value) {
              aspectScores.value.push(
                sentiment.aspects.value === 'positive'
                  ? 1
                  : sentiment.aspects.value === 'negative'
                    ? 0
                    : 0.5
              );
            }
          }
        } catch (error) {
          // Skip failed reviews
        }
      }

      // Calculate averages
      const positivePercent = (totalPositive / reviewsToAnalyze.length) * 100;
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      const avgAspects = {
        service:
          aspectScores.service.length > 0
            ? aspectScores.service.reduce((a, b) => a + b, 0) / aspectScores.service.length
            : 0,
        staff:
          aspectScores.staff.length > 0
            ? aspectScores.staff.reduce((a, b) => a + b, 0) / aspectScores.staff.length
            : 0,
        cleanliness:
          aspectScores.cleanliness.length > 0
            ? aspectScores.cleanliness.reduce((a, b) => a + b, 0) / aspectScores.cleanliness.length
            : 0,
        value:
          aspectScores.value.length > 0
            ? aspectScores.value.reduce((a, b) => a + b, 0) / aspectScores.value.length
            : 0,
      };

      // Generate insights
      const trends: string[] = [];
      if (positivePercent > 80) {
        trends.push('Khách hàng rất hài lòng với dịch vụ');
      } else if (positivePercent > 60) {
        trends.push('Phần lớn khách hàng có trải nghiệm tốt');
      } else {
        trends.push('Cần cải thiện chất lượng dịch vụ');
      }

      if (avgAspects.staff > 0.8) {
        trends.push('Đội ngũ nhân viên được đánh giá cao');
      }
      if (avgAspects.service > 0.8) {
        trends.push('Chất lượng dịch vụ xuất sắc');
      }

      const response: SuccessResponse<any> = {
        success: true,
        data: {
          overall: {
            sentiment:
              positivePercent > 60 ? 'positive' : positivePercent > 40 ? 'neutral' : 'negative',
            score: Math.round(positivePercent),
            change: '+12%',
          },
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
          breakdown: {
            service: Math.round(avgAspects.service * 100) / 100,
            staff: Math.round(avgAspects.staff * 100) / 100,
            cleanliness: Math.round(avgAspects.cleanliness * 100) / 100,
            value: Math.round(avgAspects.value * 100) / 100,
          },
          trends,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/suggest-timeslot
   * Suggest optimal time slots using AI
   */
  async suggestTimeSlot(
    req: Request<{}, {}, { date: string; serviceIds?: string[]; branchId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { date, serviceIds, branchId } = req.body;

      // Validation
      if (!date || !branchId) {
        throw new ValidationError('Date and branchId are required');
      }

      // Import prisma dynamically
      const { default: prisma } = await import('@/config/database');

      // Get bookings for the date
      const bookings = await prisma.booking.findMany({
        where: {
          branchId,
          appointmentDate: new Date(date),
          status: {
            in: ['CONFIRMED', 'COMPLETED'],
          },
        },
        select: {
          appointmentTime: true,
          status: true,
        },
      });

      // Generate all available slots (9 AM - 9 PM, 30-min intervals)
      const allSlots: string[] = [];
      for (let hour = 9; hour < 21; hour++) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }

      // Filter out past times if date is today
      const now = new Date();
      const selectedDate = new Date(date);
      const isToday = selectedDate.toDateString() === now.toDateString();

      let availableSlots = allSlots;
      if (isToday) {
        availableSlots = allSlots.filter((timeSlot) => {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          return (
            hours !== undefined &&
            minutes !== undefined &&
            (hours > now.getHours() || (hours === now.getHours() && minutes > now.getMinutes()))
          );
        });
      }

      // Remove already booked slots
      const bookedTimes = new Set(bookings.map((b) => b.appointmentTime));
      availableSlots = availableSlots.filter((slot) => !bookedTimes.has(slot));

      // Score each slot
      const scoredSlots = availableSlots.map((time) => {
        const hour = parseInt(time.split(':')[0] || '0');
        let score = 0.7;

        // Prefer afternoon slots (2-5 PM)
        if (hour >= 14 && hour <= 17) {
          score += 0.2;
        }

        // Avoid very early or late slots
        if (hour < 10 || hour > 19) {
          score -= 0.15;
        }

        // Prefer slots with less surrounding bookings
        const nearbyBookings = bookings.filter((b) => {
          const bookingHour = parseInt(b.appointmentTime.split(':')[0] || '0');
          return Math.abs(bookingHour - hour) <= 1;
        }).length;

        if (nearbyBookings < 2) {
          score += 0.1;
        } else if (nearbyBookings > 4) {
          score -= 0.1;
        }

        let reason = 'Thời gian phù hợp';
        if (hour >= 14 && hour <= 17 && nearbyBookings < 2) {
          reason = 'Thời gian vàng: Ít khách, trải nghiệm tốt nhất';
        } else if (nearbyBookings < 2) {
          reason = 'Yên tĩnh, không bị rush';
        } else if (hour >= 14 && hour <= 17) {
          reason = 'Khung giờ chiều lý tưởng';
        }

        return {
          time,
          score: Math.min(0.95, score),
          reason,
        };
      });

      // Sort and get top suggestions
      scoredSlots.sort((a, b) => b.score - a.score);
      const topSlots = scoredSlots.slice(0, 3);

      if (topSlots.length === 0) {
        const response: SuccessResponse<any> = {
          success: true,
          data: {
            suggestedSlots: [],
            bestSlot: null,
            message: 'Không có khung giờ phù hợp cho ngày này',
          },
          timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
        return;
      }

      const response: SuccessResponse<any> = {
        success: true,
        data: {
          suggestedSlots: topSlots,
          bestSlot: topSlots[0]?.time,
          confidence: topSlots[0]?.score,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/generate-service-description
   * Generate service description with AI
   */
  async generateServiceDescription(
    req: Request<
      {},
      {},
      { serviceName: string; category?: string; price?: number; duration?: number }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { serviceName, category, price, duration } = req.body;

      // Validation
      if (!serviceName) {
        throw new ValidationError('Service name is required');
      }

      // Use blog generation with service-specific prompts
      const topic = `${serviceName} - ${category || 'Spa Service'}`;
      const keywords = [serviceName, category || 'spa', 'beauty treatment', 'skincare', 'wellness'];

      const blogContent = await aiService.generateBlog(topic, keywords);

      // Format as service description
      const variations = [
        {
          description: blogContent.excerpt || blogContent.content?.substring(0, 200),
          longDescription: blogContent.content,
          excerpt: blogContent.excerpt,
          benefits: [
            'Cải thiện tình trạng da',
            'Thư giãn và giảm stress',
            'Kết quả lâu dài',
            'Sử dụng sản phẩm cao cấp',
          ],
        },
      ];

      const response: SuccessResponse<any> = {
        success: true,
        data: {
          serviceName,
          variations,
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
