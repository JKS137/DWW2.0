import React from 'react';
import { XIcon } from './icons/XIcon';

interface OnboardingBannerProps {
  onDismiss: () => void;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onDismiss }) => {
  return (
    <section 
      aria-labelledby="onboarding-heading"
      className="bg-brand-primary/20 border border-brand-primary/50 text-content-primary rounded-lg p-6 mb-8 relative animate-fade-in"
    >
      <button 
        onClick={onDismiss} 
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-brand-primary/30"
        aria-label="Dismiss onboarding guide"
      >
        <XIcon className="h-5 w-5" />
      </button>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="bg-brand-primary p-3 rounded-full">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
          </div>
        </div>
        <div>
          <h2 id="onboarding-heading" className="text-xl font-bold mb-2">Welcome to Your Warranty Vault!</h2>
          <p className="text-content-secondary mb-4">Get started in just a few simple steps:</p>
          <ol className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
            <li className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-primary/50 text-xs font-bold">1</span> Upload your warranty receipt</li>
            <li className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-primary/50 text-xs font-bold">2</span> Track expiry automatically</li>
            <li className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-primary/50 text-xs font-bold">3</span> Get reminders and stay covered</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default OnboardingBanner;
