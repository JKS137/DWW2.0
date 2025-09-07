import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iekpbucrgxvrgrzprzim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla3BidWNyZ3h2cmdyenByemltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDU1MjAsImV4cCI6MjA3MjY4MTUyMH0.Tg1-4Ru_YAHw873nMUVa0jZ5dCT7KSG_XR2u3uXhE84';

// This file initializes the Supabase client.
// It uses `@supabase/supabase-js`, which is the correct V2 package.

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