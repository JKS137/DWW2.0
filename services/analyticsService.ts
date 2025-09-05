// This placeholder should be replaced by your actual Google Analytics Measurement ID.
// In a typical build environment (like Next.js or Vite), this would be read from an environment variable
// such as `process.env.NEXT_PUBLIC_GA_ID`. For this setup, it's read from the script in index.html.
const GA_MEASUREMENT_ID = '%%NEXT_PUBLIC_GA_ID%%';

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
      console.error("Error tracking page view with Google Analytics:", error);
    }
  }
};
