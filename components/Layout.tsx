import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  onOpenComingSoonModal: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenComingSoonModal }) => {
  return (
    <div className="flex h-screen bg-transparent text-content-primary">
      <Sidebar onOpenComingSoonModal={onOpenComingSoonModal} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-40 px-2 sm:px-4 py-2 bg-base-100/60 backdrop-blur-md border-b border-base-300/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Digital Warranty Vault</span>
              <span className="text-xs text-content-secondary hidden sm:inline">Dashboard</span>
            </div>
            <div className="text-xs text-content-secondary">
              <span>Stay organized • Track warranties</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;