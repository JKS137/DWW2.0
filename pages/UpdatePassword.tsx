import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useAuth } from '../context/AuthContext';

interface UpdatePasswordProps {
  onPasswordUpdated: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onPasswordUpdated }) => {
  const { updateUserPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    const { error } = await updateUserPassword(password);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onPasswordUpdated();
      }, 2000); // Redirect after 2 seconds
    }
    setLoading(false);
  };

  if (success) {
    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="w-full max-w-md p-8 space-y-6 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50 text-center animate-slide-up"
            >
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-secondary" />
                <h2 className="text-2xl font-bold text-content-primary">Password Updated!</h2>
                <p className="text-content-secondary">Your password has been changed successfully. Redirecting you to the dashboard...</p>
            </div>
        </main>
    );
  }


  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div 
        className="w-full max-w-md p-8 space-y-8 bg-base-200/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300/50 animate-slide-up"
      >
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-content-primary">
            Set a New Password
          </h2>
          <p className="mt-2 text-sm text-content-secondary">
            Please enter your new password below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">New Password</label>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm"
                placeholder="New Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-4 py-3 bg-base-100/70 border border-base-300 placeholder-content-secondary text-content-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
            
          {error && <p className="text-brand-pink text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow-blue hover:scale-105 active:scale-95"
            >
              {loading ? 'Saving...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdatePassword;