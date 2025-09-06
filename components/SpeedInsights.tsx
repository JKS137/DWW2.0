import React, { useEffect } from 'react';

/**
 * SpeedInsights component for Vercel Speed Insights
 * This component adds Vercel Speed Insights to the application without requiring the npm package
 * It dynamically loads the Speed Insights script when the component mounts
 */
export const SpeedInsights: React.FC = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Don't load in development environment
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = '/_vercel/speed-insights/script.js';
    script.defer = true;
    script.dataset.sdkn = 'custom-implementation';
    script.dataset.sdkv = '1.0.0';
    
    // Append to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default SpeedInsights;