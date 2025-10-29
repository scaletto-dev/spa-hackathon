import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * Provides access to Supabase services:
 * - Storage: For image uploads
 * - Auth: For authentication (configured separately)
 * - Database: For PostgreSQL access (via Prisma)
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured. Storage features will be disabled.');
}

/**
 * Supabase client instance
 * Used for file uploads to Supabase Storage
 */
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Storage bucket name for images
 */
export const STORAGE_BUCKET = 'images';
