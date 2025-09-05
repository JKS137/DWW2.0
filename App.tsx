
import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarrantyProvider } from './context/WarrantyContext';
import { Spinner } from './components/icons/Spinner';
import { supabaseConfigurationError } from './services/supabaseClient';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';
import { trackPageView } from './services/analyticsService';

const ConfigurationErrorScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center min-h-screen bg-red-900/50 text-red-200 p-4">
        <div className="w-full max-w-2xl p-8 space-y-4 bg-base-200 rounded-xl shadow-lg border border-red-500/50 text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="text-2xl font-bold">Configuration Error</h2>
            <p className="text-base text-content-secondary">The application cannot start due to a misconfiguration.</p>
            <div className="mt-4 p-4 text-left bg-base-100 text-red-300 rounded-md text-sm whitespace-pre-wrap break-words">
                <code>{message}</code>
            </div>
            <p className="mt-4 text-sm text-content-secondary">Please ensure your environment variables are correctly set up and try again.</p>
        </div>
    </div>
);


const App: React.FC = () => {
  if (supabaseConfigurationError) {
    return <ConfigurationErrorScreen message={supabaseConfigurationError} />;
  }

  return (
    <AuthProvider>
      <WarrantyProvider>
        <MainContent />
      </WarrantyProvider>
    </AuthProvider>
  );
};

const MainContent: React.FC = () => {
  const { user, loading, authEvent } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };
  
  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // When the route changes, send a page view event to Google Analytics.
    trackPageView(route);
  }, [route]);

  useEffect(() => {
    // When Supabase auth state changes to PASSWORD_RECOVERY, navigate the user
    // to the dedicated page to update their password.
    if (authEvent === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
    }
  }, [authEvent]);


  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center min-h-screen">
          <Spinner className="w-10 h-10" />
      </div>
    );
  } else if (user) {
    // Authenticated user routing
    const isPublicRoute = ['/', '/login', '/signup', '/forgot-password'].includes(route);
    
    // If user is on a public page, redirect to dashboard.
    // Exception: Allow access to /update-password if in recovery mode.
    if (isPublicRoute && route !== '/update-password') {
        navigate('/dashboard');
    }
    
    if (route === '/update-password') {
        content = <UpdatePassword onPasswordUpdated={() => navigate('/dashboard')} />;
    } else {
        // All other authenticated traffic goes to the dashboard.
        content = <Dashboard />;
    }

  } else {
    // Unauthenticated user routing
    switch (route) {
      case '/login':
        content = <Login onSwitchToSignup={() => navigate('/signup')} onNavigateHome={() => navigate('/')} onNavigateForgotPassword={() => navigate('/forgot-password')} />;
        break;
      case '/signup':
        content = <Signup onSwitchToLogin={() => navigate('/login')} onNavigateHome={() => navigate('/')} />;
        break;
      case '/forgot-password':
        content = <ForgotPassword onSwitchToLogin={() => navigate('/login')} onNavigateHome={() => navigate('/')} />;
        break;
      case '/':
      default:
        content = <LandingPage onNavigateLogin={() => navigate('/login')} onNavigateSignup={() => navigate('/signup')} />;
        break;
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-content-primary font-sans">
        {content}
    </div>
  );
};

export default App;