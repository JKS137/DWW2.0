import React from 'react';

// Simple test button that throws an error to verify Sentry captures it
const ErrorButton: React.FC = () => {
  const handleClick = () => {
    throw new Error('This is your first error!');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition"
      title="Throw a test error to Sentry"
    >
      Break the world
    </button>
  );
};

export default ErrorButton;
