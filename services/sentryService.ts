import * as Sentry from '@sentry/react';

export const captureException = (error: Error | unknown, context?: Record<string, unknown>) => {
  if (context) {
    Sentry.captureException(error, { extra: context });
  } else {
    Sentry.captureException(error);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (userId: string, userEmail?: string, userName?: string) => {
  Sentry.setUser({
    id: userId,
    email: userEmail,
    username: userName,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

export const addBreadcrumb = (message: string, category: string = 'user-action', level: Sentry.SeverityLevel = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
};

export const captureApiError = (error: unknown, endpoint: string, method: string) => {
  addBreadcrumb(`API Call: ${method} ${endpoint}`, 'api');
  captureException(error, { endpoint, method });
};

export const captureOCRError = (error: unknown, fileName: string) => {
  addBreadcrumb(`OCR Processing: ${fileName}`, 'ocr');
  captureException(error, { fileName });
};

export const captureAuthError = (error: unknown, authAction: string) => {
  addBreadcrumb(`Auth Action: ${authAction}`, 'auth');
  captureException(error, { authAction });
};

export default {
  captureException,
  captureMessage,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  captureApiError,
  captureOCRError,
  captureAuthError,
};
