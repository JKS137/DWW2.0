import React from 'react';
import * as Sentry from '@sentry/react';
import { captureMessage, addBreadcrumb } from '@/services/sentryService';

export const SentryTestButton: React.FC = () => {
  const handleThrowError = () => {
    addBreadcrumb('User clicked error test button', 'test');
    throw new Error('This is a test error from Sentry integration!');
  };

  const handleCaptureMessage = () => {
    addBreadcrumb('User sent test message', 'test');
    captureMessage('This is a test message to Sentry', 'info');
  };

  const handleCaptureWarning = () => {
    addBreadcrumb('User sent test warning', 'test');
    captureMessage('This is a test warning to Sentry', 'warning');
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleThrowError}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        title="Throws an error to test Sentry error tracking"
      >
        Test Error
      </button>

      <button
        onClick={handleCaptureMessage}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        title="Sends a test message to Sentry"
      >
        Test Message
      </button>

      <button
        onClick={handleCaptureWarning}
        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition"
        title="Sends a test warning to Sentry"
      >
        Test Warning
      </button>
    </div>
  );
};

export default SentryTestButton;
