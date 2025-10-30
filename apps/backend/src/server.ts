import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { createServer } from 'http';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';
import { configureRoutes } from './routes';
import logger from './config/logger';
import socketService from './services/socket.service';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for Socket.IO
const httpServer = createServer(app);

/**
 * Middleware Configuration
 *
 * CRITICAL: Middleware must be applied in this specific order:
 * 1. helmet() - Security headers (first)
 * 2. cors() - CORS handling
 * 3. express.json() - JSON body parsing
 * 4. express.urlencoded() - URL-encoded body parsing
 * 5. requestLogger - Request logging
 * 6. Routes - Application routes
 * 7. notFoundHandler - 404 handler
 * 8. errorHandler - Global error handler (MUST BE LAST)
 */

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors(corsOptions));

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request logging
app.use(requestLogger);

// 5. Configure all routes
configureRoutes(app);

// 6. 404 handler (after all routes)
app.use(notFoundHandler);

// 7. Global error handler (MUST BE LAST)
app.use(errorHandler);

// Initialize Socket.IO
socketService.initialize(httpServer);

// Start server
httpServer.listen(PORT, () => {
    logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
    logger.info(`� Socket.IO server ready on ws://localhost:${PORT}`);
    logger.info(`�📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
    logger.info(`💬 Support Chat API: http://localhost:${PORT}/api/v1/support`);
});

// Export app and server for testing
export default app;
export { httpServer };
