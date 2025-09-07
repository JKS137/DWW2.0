
import { supabase } from '../utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string | undefined;
  plan: 'free' | 'starter' | 'pro';
  created_at: string;
}

/**
 * Fetches the user's profile from the 'profiles' table.
 * @param user The authenticated user object from Supabase.
 * @returns A promise that resolves with the user's profile data or null if not found.
 */
export const getProfile = async (user: User): Promise<Profile | null> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // 'PGRST116' is the code for "no rows found", which is not a throw-worthy error.
        if (error && error.code !== 'PGRST116') {
            throw new Error(error.message);
        }

        return data as Profile | null;
    } catch (err: any) {
                throw err;
    }
};
