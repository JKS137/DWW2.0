import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AuthChangeEvent } from '@supabase/gotrue-js';

// Add at the top of context/AuthContext.tsx
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: any | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
  updateUserPassword: (password: string) => Promise<{ error: any }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Custom error to use when Supabase is not initialized.
const createConfigError = () => {
  throw Error("Supabase is not correctly initialized. Please check your config.");
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase!.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      // For OAuth, redirect to the provider's URL
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase!.auth.signInWithOAuth({ provider: 'github' });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error signing in with Github:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase!.auth.getSession();

        setSession(session);
        setUser(session?.user || null);
      } catch (error: any) {
        console.error("Error getting session:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
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

  const value: AuthContextType = {
  user,
  session,
  loading,
  signUp,
  signIn,
  signOut,
  signInWithGoogle,
  signInWithGithub,
  sendPasswordResetEmail,
  updateUserPassword,
  resendVerificationEmail,
 };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
