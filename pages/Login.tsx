import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { recordAuthAttempt, checkRateLimit } from '../services/rateLimiter';

interface LoginProps {
  onSwitchToSignup: () => void;
  onNavigateHome: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateDashboard?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onNavigateHome, onNavigateForgotPassword, onNavigateDashboard }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitError(null);

    const { isLimited, timeLeft } = checkRateLimit('login');
    if (isLimited) {
      setRateLimitError(`Too many attempts. Please try again in ${timeLeft} seconds.`);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      recordAuthAttempt('login');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setRateLimitError(null);
    const { error } = await signInWithGoogle();
    if (error) {
        setError(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50">
        <div className="text-center relative">
            <button onClick={onNavigateHome} className="inline-block">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
            </button>
            {onNavigateDashboard && (
              <button
                onClick={onNavigateDashboard}
                className="absolute right-0 top-0 text-sm font-medium text-brand-primary hover:text-opacity-90"
              >
                Go to Dashboard
              </button>
            )}
            <h2 className="mt-6 text-3xl font-extrabold text-content-primary">
                Welcome Back
            </h2>
            <p className="mt-2 text-sm text-content-secondary">
                Sign in or{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm"
                >
                  create an account
                </button>
            </p>
        </div>
        
        <div>
            <button
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-colors"
            >
                <GoogleIcon className="h-5 w-5" />
                <span>Sign in with Google</span>
            </button>
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-200 text-content-secondary">OR</span>
            </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {(rateLimitError || error) && <p className="text-brand-pink text-sm text-center">{rateLimitError || error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-blue"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
