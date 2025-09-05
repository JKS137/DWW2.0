
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize client and error to null
let supabaseClient: SupabaseClient | null = null;
let configurationError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
    configurationError = "Supabase environment variables are missing. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to connect to the database.";
} else {
    try {
        // Attempt to create the client
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e: any) {
        // Catch any errors during initialization
        configurationError = `Failed to initialize Supabase client: ${e.message}`;
        supabaseClient = null; // Ensure client is null on error
    }
}

export const supabase = supabaseClient;
export const supabaseConfigurationError = configurationError;