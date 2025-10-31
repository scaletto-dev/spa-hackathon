import { CorsOptions } from 'cors';

/**
 * CORS Configuration
 *
 * Allows cross-origin requests from the frontend application.
 *
 * Configuration:
 * - origin: Frontend URL from environment variable (default: http://localhost:5173)
 * - credentials: true (allows cookies and Authorization headers)
 * - optionsSuccessStatus: 200 (for legacy browser support)
 */

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173', // Vite development server
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and Authorization headers
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
