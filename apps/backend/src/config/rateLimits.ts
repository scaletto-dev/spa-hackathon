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

/**
 * Contact Form Rate Limiter
 * 
 * Applied to contact form submission endpoint (/api/v1/contact)
 * Limit: 3 requests per hour per IP
 * 
 * Prevents spam and abuse of contact form while allowing legitimate inquiries.
 */
export const contactFormRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: 'Too many contact form submissions from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'TooManyRequestsError',
      message: 'Too many contact form submissions. Please try again in an hour.',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Upload Image Rate Limiter
 * 
 * Applied to image upload endpoint (/api/v1/upload/image)
 * Limit: 10 requests per hour per IP
 * 
 * Prevents abuse of storage resources while allowing normal image uploads.
 */
export const uploadImageRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: 'Too many image uploads from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'TooManyRequestsError',
      message: 'Too many image uploads. Please try again in an hour.',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Registration Rate Limiter
 * 
 * Applied to registration endpoint (/api/v1/auth/register)
 * Limit: 3 requests per hour per IP
 * 
 * Prevents spam registration attempts while allowing legitimate sign-ups.
 */
export const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 3 registration attempts per hour
  message: 'Too many registration attempts from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'TooManyRequestsError',
      message: 'Too many registration attempts. Please try again in an hour.',
      statusCode: 429,
      timestamp: new Date().toISOString(),
    });
  },
});
