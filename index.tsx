
/// <reference types="vite/client" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SENTRY_DSN as string) : '',
  environment: isDev ? 'development' : 'production',
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  // send default PII (IP addresses etc.) to Sentry. Set to true only when you
  // explicitly want to include PII. This was requested for testing purposes.
  sendDefaultPii: true,
  tracesSampleRate: isDev ? 1.0 : 0.1,
  replaysSessionSampleRate: isDev ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
