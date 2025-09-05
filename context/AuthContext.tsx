

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { AuthError, Session, User, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authEvent: AuthChangeEvent | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);

  useEffect(() => {
    if (!supabase) {
        setLoading(false);
        return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setAuthEvent(event);

      // If a user signs in, check if their profile exists. If not, create it.
      // This handles new users signing up via OAuth.
      if (event === 'SIGNED_IN' && currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', currentUser.id)
          .single();

        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: currentUser.id, email: currentUser.email });
          if (profileError) {
            console.error("Error creating profile for new OAuth user:", profileError);
          }
        }
      }
      
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const createConfigError = (): { error: AuthError } => ({
      error: { 
          name: 'ConfigurationError', 
          message: 'Supabase client is not configured.',
      } as AuthError
  });

  const signIn = async (email: string, password: string) => {
    if (!supabase) return createConfigError();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!supabase) return createConfigError();
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return createConfigError();
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (!error && data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: data.user.id, email: data.user.email });
        if (profileError) {
            console.error("Error creating profile:", profileError);
        }
    }
    
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return createConfigError();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const sendPasswordResetEmail = async (email: string) => {
    if (!supabase) return createConfigError();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });
    return { error };
  };

  const updateUserPassword = async (password: string) => {
      if (!supabase) return createConfigError();
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
  };

  const resendVerificationEmail = async (email: string) => {
    if (!supabase) return createConfigError();
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    authEvent,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    sendPasswordResetEmail,
    updateUserPassword,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
