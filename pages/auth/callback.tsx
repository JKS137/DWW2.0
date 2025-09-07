import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const { handleAuthCallback, loading, error } = useAuth();

  useEffect(() => {
    // This function should handle the callback logic (e.g., exchanging code for token)
    handleAuthCallback().then((success: boolean) => {
      if (success) {
        router.replace('/');
      } else {
        router.replace('/login?error=auth_failed');
      }
    });
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
