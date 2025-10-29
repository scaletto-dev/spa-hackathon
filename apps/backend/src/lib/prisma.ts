import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';

/**
 * Prisma Client Singleton Instance
 * 
 * Ensures a single PrismaClient instance is used across the application
 * to prevent connection pool exhaustion.
 * 
 * In development, the instance is attached to globalThis to survive
 * hot module reloading.
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Log database connection status
prisma.$connect()
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  });

export default prisma;
