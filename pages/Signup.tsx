import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { GithubIcon } from '../components/icons/GithubIcon';
import { recordAuthAttempt, checkRateLimit } from '../services/rateLimiter';
import Captcha from '../components/Captcha';

interface SignupProps {
  onSwitchToLogin: () => void;
  onNavigateHome: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onNavigateHome }) => {
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setLoading(true);

    const { isLimited, timeLeft } = checkRateLimit('signup');
    if (isLimited) {
        setRateLimitError(`Too many attempts. Please try again in ${timeLeft} seconds.`);
        setLoading(false);
        return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
    }

    if (captchaEnabled && !captchaToken) {
        setError('Please complete the CAPTCHA.');
        setLoading(false);
        return;
    }

    const { error } = await signUp(email, password, captchaToken || undefined);

    if (error) {
      setError(error.message);
      recordAuthAttempt('signup');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setRateLimitError(null);
    const { error } = await signInWithGoogle(captchaToken || undefined);
    if (error) {
        setError(error.message);
    }
  };
  
  const SuccessMessage = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-content-primary">Check your email!</h2>
      <p className="text-content-secondary mt-4">
          We've sent a confirmation link to <strong>{email}</strong>. Please click it to complete your registration.
      </p>
      <button
        onClick={onSwitchToLogin}
        className="mt-6 font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm"
      >
        Back to Login
      </button>
    </div>
  );

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div 
        className="w-full max-w-md p-8 space-y-6 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50 animate-slide-up"
      >
        <div className="text-center">
            <button onClick={onNavigateHome} className="inline-block">
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
            </button>
            <h2 className="mt-6 text-3xl font-extrabold text-content-primary">
                Create your Account
            </h2>
            <p className="mt-2 text-sm text-content-secondary">
                Or{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="font-medium text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm"
                >
                  sign in to your existing account
                </button>
            </p>
        </div>
        
        {success ? <SuccessMessage /> : (
          <>
            <div className="grid grid-cols-1 gap-3">
              <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-all hover:scale-105 active:scale-95"
              >
                  <GoogleIcon className="h-5 w-5" />
                  <span>Sign up with Google</span>
              </button>
              <button
                  onClick={async () => { const { error } = await signInWithGithub(captchaToken || undefined); if (error) setError(error.message); }}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-all hover:scale-105 active:scale-95"
              >
                  <GithubIcon className="h-5 w-5" />
                  <span>Sign up with GitHub</span>
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
                  <label htmlFor="email-address-signup" className="sr-only">Email address</label>
                  <input
                    id="email-address-signup"
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
                  <label htmlFor="password-signup" className="sr-only">Password</label>
                  <input
                    id="password-signup"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Captcha */}
              {captchaEnabled && (
                <div className="mt-2">
                  <Captcha provider={CAPTCHA_PROVIDER as any} siteKey={SITE_KEY} onVerify={t => setCaptchaToken(t)} onExpire={() => setCaptchaToken(null)} />
                </div>
              )}
              
              {(rateLimitError || error) && <p className="text-brand-pink text-sm text-center">{rateLimitError || error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-blue hover:scale-105 active:scale-95"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default Signup;