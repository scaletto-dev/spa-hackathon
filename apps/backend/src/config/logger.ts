import winston from 'winston';

/**
 * Winston Logger Configuration
 *
 * Provides structured logging with multiple transports:
 * - Console: All environments with colorized output in development
 * - File: Production only with JSON format for log aggregation
 *
 * Log Levels (most to least severe): error, warn, info, http, debug
 */

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0 && meta.stack === undefined) {
            msg += ` ${JSON.stringify(meta)}`;
          }
          if (meta.stack) {
            msg += `\n${meta.stack}`;
          }
          return msg;
        })
      ),
    }),
  ],
});

// Add file transport for production
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.json(),
    })
  );
}

export default logger;
