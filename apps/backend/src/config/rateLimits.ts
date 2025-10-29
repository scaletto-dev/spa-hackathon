import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter Configurations
 * 
 * Protects API endpoints from abuse by limiting the number of requests
 * from a single IP address within a time window.
 */

/**
 * Auth Rate Limiter
 * 
 * Applied to authentication endpoints (/api/v1/auth/*)
 * Limit: 5 requests per minute per IP
 * 
 * Prevents brute force attacks on OTP verification and login endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'TooManyRequestsError',
      message: 'Too many authentication attempts, please try again later',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * General Rate Limiter
 * 
 * Applied to all other public endpoints
 * Limit: 100 requests per minute per IP
 * 
 * Prevents API scraping and abuse while allowing normal usage.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'TooManyRequestsError',
      message: 'Too many requests, please try again later',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    });
  },
});
