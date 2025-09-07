import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthCallback: React.FC = () => {
  const { loading, error } = useAuth();

  useEffect(() => {
    // onAuthStateChange in AuthContext will handle the user session
    // Redirect to the dashboard after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="p-8 bg-base-100 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Signing you in...</h2>
        <div className="loader mx-auto my-6"></div>
        {error && <p className="text-brand-pink text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AuthCallback;
