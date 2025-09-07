import React, { ReactNode } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Branding (Left) */}
      <aside className="order-1 md:order-1 relative">
        {/* Background styling */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" aria-hidden="true"></div>
        <div className="relative h-full w-full flex flex-col px-8 lg:px-12 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-brand-primary" />
            <span className="text-lg font-semibold text-content-primary">DigitalWarrantyVault</span>
          </div>

          {/* Centered Welcome copy */}
          <div className="flex-1 grid place-items-center">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-extrabold text-content-primary tracking-tight">Welcome to DigitalWarrantyVault</h2>
              <p className="mt-3 text-content-secondary text-base">Your Digital Warranty Partner — securely store receipts, track coverage, and get reminded before they expire.</p>

              {/* Decorative card */}
              <div className="mt-8 p-5 rounded-2xl bg-base-200/50 backdrop-blur-md border border-base-300/50 shadow-xl">
                <p className="text-sm text-content-secondary">
                  Organize warranties with AI-powered extraction, share read-only links, and stay ahead of expirations with automated reminders.
                </p>
              </div>
            </div>
          </div>

          {/* Footer small text */}
          <div className="text-xs text-content-secondary/80">
            © {new Date().getFullYear()} DigitalWarrantyVault
          </div>
        </div>
      </aside>

      {/* Form (Right) */}
      <section className="order-2 md:order-2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
