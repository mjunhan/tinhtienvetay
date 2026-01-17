import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we have real Supabase credentials (not placeholders)
const hasValidCredentials =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your_supabase') &&
    !supabaseAnonKey.includes('your_supabase');

// Create a single supabase client for interacting with your database
// If credentials are missing/invalid, create a dummy client (will fail gracefully)
export const supabase = hasValidCredentials
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidCredentials;
