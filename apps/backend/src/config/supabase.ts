import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * Provides access to Supabase services:
 * - Storage: For image uploads
 * - Auth: For user authentication and registration
 * - Database: For PostgreSQL access (via Prisma)
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not configured. Storage and Auth features will be disabled.');
}

/**
 * Supabase client instance
 * Used for file uploads to Supabase Storage and authentication
 */
export const supabase: SupabaseClient | null = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // Backend doesn't need to persist sessions
        detectSessionInUrl: false,
      },
    })
  : null;

/**
 * Storage bucket name for images
 */
export const STORAGE_BUCKET = 'images';
