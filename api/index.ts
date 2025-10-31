// Vercel Serverless Function Entry Point
// Imports the full backend Express app from apps/backend/src/app.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../apps/backend/src/app';

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
