import React from 'react';
import { UploadIcon } from '../icons/UploadIcon';
import { SmartOCRIcon } from '../icons/SmartOCRIcon';
import { RemindersIcon } from '../icons/RemindersIcon';

const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-content-secondary mt-2">Get organized in three simple steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Upload Receipt', description: 'Snap a photo or upload a file. Our AI gets to work instantly.', icon: UploadIcon },
          { title: 'Track Expiry', description: 'We automatically extract details and set up expiry tracking.', icon: SmartOCRIcon },
          { title: 'Get Reminders', description: 'Receive email alerts before a warranty expires so you never miss a claim.', icon: RemindersIcon },
        ].map((step, index) => (
          <div
            key={step.title}
            className="text-center p-6 bg-base-200/50 backdrop-blur-md border border-base-300/50 rounded-xl animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-base-100 border-2 border-brand-primary shadow-glow-blue mb-4">
              <step.icon className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-content-secondary mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
