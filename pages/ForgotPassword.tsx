import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useAuth } from '../context/AuthContext';
import { recordAuthAttempt, checkRateLimit } from '../services/rateLimiter';
import AuthLayout from '../components/AuthLayout';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
  onNavigateHome: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin, onNavigateHome }) => {
  const { sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitError(null);

    const { isLimited, timeLeft } = checkRateLimit('resetPassword');
    if (isLimited) {
      setRateLimitError(`Too many requests. Please try again in ${timeLeft} seconds.`);
      return;
    }

    setLoading(true);
    const { error } = await sendPasswordResetEmail(email);
    if (error) {
      setError(error.message);
      recordAuthAttempt('resetPassword');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const SuccessMessage = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-content-primary">Check your email</h2>
      <p className="text-content-secondary mt-4">
          A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email.
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
    <AuthLayout>
      <div className="p-8 space-y-8 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50 animate-slide-up">
        <div className="text-center">
          <button onClick={onNavigateHome} className="inline-block">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
          </button>
          <h2 className="mt-6 text-3xl font-extrabold text-content-primary">
            Reset your Password
          </h2>
          <p className="mt-2 text-sm text-content-secondary">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>
        
        {success ? <SuccessMessage /> : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address-reset" className="block text-sm font-medium text-content-secondary mb-1">Email address</label>
                <input
                  id="email-address-reset"
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
            </div>
            
            {(rateLimitError || error) && <p className="text-brand-pink text-sm text-center">{rateLimitError || error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-blue hover:scale-105 active:scale-95"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </div>
             <div className="text-center">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="mt-4 font-medium text-sm text-brand-primary hover:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-sm"
                >
                    Back to Login
                </button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;