import rateLimit from "express-rate-limit";

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
   message: "Too many requests from this IP, please try again later",
   standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
   legacyHeaders: false, // Disable `X-RateLimit-*` headers
   handler: (req, res) => {
      res.status(429).json({
         error: "TooManyRequestsError",
         message: "Too many authentication attempts, please try again later",
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
   message: "Too many requests from this IP, please try again later",
   standardHeaders: true,
   legacyHeaders: false,
   handler: (req, res) => {
      res.status(429).json({
         error: "TooManyRequestsError",
         message: "Too many requests, please try again later",
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
   message:
      "Too many contact form submissions from this IP, please try again later",
   standardHeaders: true,
   legacyHeaders: false,
   handler: (req, res) => {
      res.status(429).json({
         success: false,
         error: "TooManyRequestsError",
         message:
            "Too many contact form submissions. Please try again in an hour.",
         statusCode: 429,
         timestamp: new Date().toISOString(),
      });
   },
});

/**
 * Booking Creation Rate Limiter
 *
 * Applied to booking creation and cancellation endpoints
 * Limit: 10 requests per hour per IP
 *
 * Prevents abuse while allowing legitimate booking operations.
 */
export const bookingCreationRateLimiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 1 hour
   max: 10, // Limit each IP to 10 requests per hour
   message: "Too many booking requests from this IP, please try again later",
   standardHeaders: true,
   legacyHeaders: false,
   handler: (req, res) => {
      res.status(429).json({
         success: false,
         error: "TooManyRequestsError",
         message: "Too many booking requests. Please try again in an hour.",
         statusCode: 429,
         timestamp: new Date().toISOString(),
      });
   },
});

/**
 * Rate Limiters Object Export
 *
 * Provides a convenient way to access all rate limiters.
 */
export const rateLimiters = {
   auth: authRateLimiter,
   general: generalRateLimiter,
   contactForm: contactFormRateLimiter,
   bookingCreation: bookingCreationRateLimiter,
   default: generalRateLimiter,
};
