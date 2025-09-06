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
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;