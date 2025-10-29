
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import App from './App';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay({ maskAllText: true, blockAllMedia: true }),
  ],
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryRouting(({ children }: { children: React.ReactNode }) => (
  <React.StrictMode>
    {children}
  </React.StrictMode>
));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <SentryRoutes>
    <App />
  </SentryRoutes>
);
