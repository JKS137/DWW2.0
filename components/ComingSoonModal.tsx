import React from 'react';
import { XIcon } from './icons/XIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-base-200/50 backdrop-blur-lg border border-base-300/50 rounded-lg shadow-xl w-full max-w-sm text-center p-8 transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-content-secondary hover:text-content-primary rounded-full p-1">
          <XIcon className="w-5 h-5" />
        </button>
        <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-primary" />
        <h2 className="text-2xl font-bold text-content-primary mt-4">Coming Soon!</h2>
        <p className="text-content-secondary mt-2">
            {featureName} is currently under development. Stay tuned for updates!
        </p>
        <button 
          onClick={onClose} 
          className="mt-6 w-full px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 transition-all hover:shadow-glow-blue"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
