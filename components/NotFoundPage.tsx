import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-content-primary">
      <ShieldCheckIcon className="h-12 w-12 text-brand-primary mb-4" />
      <h1 className="text-3xl font-semibold mb-2">404 - Page Not Found</h1>
      <p className="text-content-secondary mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
