import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 *
 * Ensures a single instance of Prisma Client is used throughout the application
 * to avoid connection pool exhaustion and improve performance.
 */

// Extend global namespace for development hot-reload support
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing instance in development to prevent multiple instances during hot-reload
const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Store instance globally in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
