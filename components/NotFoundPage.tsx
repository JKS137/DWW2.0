import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-extrabold text-brand-primary drop-shadow-glow-blue">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-content-primary">Page Not Found</h2>
        <p className="mt-2 text-content-secondary">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary"
          >
            <ArrowLeftIcon className="mr-2 -ml-1 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
