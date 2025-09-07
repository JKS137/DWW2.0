import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { recordAuthAttempt, checkRateLimit } from '../services/rateLimiter';
import { GithubIcon } from '../components/icons/GithubIcon';
import Captcha from '../components/Captcha';
import AuthLayout from '../components/AuthLayout';

interface LoginProps {
  onSwitchToSignup: () => void;
  onNavigateHome: () => void;
  onNavigateForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onNavigateHome, onNavigateForgotPassword }) => {
  const { signIn, signInWithGoogle, signInWithGithub, loading } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const CAPTCHA_PROVIDER = (process.env.CAPTCHA_PROVIDER as 'turnstile' | 'hcaptcha') || 'turnstile';
  const SITE_KEY = (process.env.TURNSTILE_SITE_KEY || process.env.HCAPTCHA_SITE_KEY || '') as string;
  // Temporarily disable CAPTCHA regardless of site key
  const captchaEnabled = false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitError(null);

    const { isLimited, timeLeft } = checkRateLimit('login');
    if (isLimited) {
      setRateLimitError(`Too many attempts. Please try again in ${timeLeft} seconds.`);
      return;
    }

    if (captchaEnabled && !captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    try {
      await signIn(email, password);
      // Redirect handled by AuthContext
    } catch (error: any) {
      console.error("Login error:", error.message);
      setError(error.message);
      recordAuthAttempt('login');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setRateLimitError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
      recordAuthAttempt('login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthLayout>
      <div className="p-8 space-y-6 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50 animate-slide-up">
        <div className="text-center">
            <button onClick={onNavigateHome} className="inline-block">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
            </button>
            <h2 className="mt-6 text-3xl font-extrabold text-content-primary">Welcome Back</h2>
            <p className="mt-2 text-sm text-content-secondary">
                Sign in or{' '}
                <button onClick={onSwitchToSignup} className="font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm">
                  create an account
                </button>
            </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-all hover:scale-105 active:scale-95">
              <GoogleIcon className="h-5 w-5" />
              <span>Sign in with Google</span>
          </button>
          <button
            onClick={async () => {
              setError(null);
              setRateLimitError(null);
              try {
                await signInWithGithub();
              } catch (error: any) {
                setError(error.message);
                recordAuthAttempt('login');
              }
            }}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-all hover:scale-105 active:scale-95"
          >
            <GithubIcon className="h-5 w-5" />
            <span>Sign in with GitHub</span>
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
              <label htmlFor="email-address" className="block text-sm font-medium text-content-secondary mb-1">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-content-secondary mb-1">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>
          </div>

          {captchaEnabled && (
            <div className="mt-2">
              <Captcha provider={CAPTCHA_PROVIDER as any} siteKey={SITE_KEY} onVerify={t => setCaptchaToken(t)} onExpire={() => setCaptchaToken(null)} />
            </div>
          )}

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button type="button" onClick={onNavigateForgotPassword} className="font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm">
                Forgot your password?
              </button>
            </div>
          </div>

          {(rateLimitError || error) && <p className="text-brand-pink text-sm text-center">{rateLimitError || error}</p>}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-blue hover:scale-105 active:scale-95">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;