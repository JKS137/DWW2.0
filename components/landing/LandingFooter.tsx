import React from 'react';

const LandingFooter: React.FC = () => (
  <footer className="border-t border-base-300/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-content-secondary">
          &copy; {new Date().getFullYear()} Digital Warranty Vault. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" className="text-content-secondary hover:text-content-primary">Terms</a>
          <a href="#" className="text-content-secondary hover:text-content-primary">Privacy</a>
          <a href="#" className="text-content-secondary hover:text-content-primary">Support</a>
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
