import React from 'react';
import { SecureCloudIcon } from '../icons/SecureCloudIcon';
import { SmartOCRIcon } from '../icons/SmartOCRIcon';
import { RemindersIcon } from '../icons/RemindersIcon';
import { SyncIcon } from '../icons/SyncIcon';
import { ExportIcon } from '../icons/ExportIcon';
import { ShareIcon } from '../icons/ShareIcon';

const Features: React.FC = () => {
  const featureList = [
    { name: 'Secure Cloud Vault', icon: SecureCloudIcon, description: 'Your data is encrypted and stored securely in the cloud.' },
    { name: 'Smart OCR Extraction', icon: SmartOCRIcon, description: 'AI-powered receipt scanning saves you manual data entry.' },
    { name: 'Expiry Reminders', icon: RemindersIcon, description: "Automated email notifications so you're always prepared." },
    { name: 'Multi-Device Sync', icon: SyncIcon, description: 'Access your vault from anywhere, on any device.' },
    { name: 'Export (PDF/CSV)', icon: ExportIcon, description: 'Download your warranty data for personal records or insurance.' },
    { name: 'Family/Team Sharing', icon: ShareIcon, description: 'Share access to warranties with family members or colleagues.' },
  ];

  return (
    <section id="features" className="py-20 bg-base-200/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Everything you need, all in one place.</h2>
          <p className="text-content-secondary mt-2">Powerful features to give you complete peace of mind.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <div
              key={feature.name}
              className="flex items-start space-x-4 p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-shrink-0 p-2 bg-base-100 rounded-lg border border-brand-secondary/50">
                <feature.icon className="h-6 w-6 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.name}</h3>
                <p className="text-content-secondary text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
