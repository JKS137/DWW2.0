// The Google Analytics Measurement ID for this application.
const GA_MEASUREMENT_ID = 'G-EVQTZBJLWH';

// Augment the global Window interface to include the `gtag` function
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a page view event using Google Analytics (gtag.js).
 * This function should be called whenever a route change occurs in the application.
 *
 * @param path The new page path to track (e.g., '/dashboard').
 */
export const trackPageView = (path: string): void => {
  // Check if the gtag function is available on the window object and if the ID is a real one
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.startsWith('%%')) {
    try {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
      });
    } catch (error) {
          }
  }
};