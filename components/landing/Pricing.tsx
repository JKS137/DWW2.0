import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface PricingProps {
  onNavigateSignup: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigateSignup }) => {
  const plans = [
    { name: 'Free', price: '$0', features: ['5 Warranties', 'Basic OCR', 'Email Reminders'], glow: 'shadow-glow-blue', border: 'border-blue-500' },
    { name: 'Starter', price: '$5', features: ['50 Warranties', 'Advanced OCR', 'Priority Support', 'Export to CSV'], glow: 'shadow-glow-teal', border: 'border-teal-500', popular: true },
    { name: 'Pro', price: '$10', features: ['Unlimited Warranties', 'All Starter Features', 'Family Sharing', 'API Access'], glow: 'shadow-glow-purple', border: 'border-purple-500' },
  ];

  return (
    <section id="pricing" className="py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Choose the plan that's right for you</h2>
          <p className="text-content-secondary mt-2">Start for free, upgrade when you're ready.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-base-200/50 backdrop-blur-md border rounded-xl flex flex-col ${plan.border} transition-all hover:-translate-y-2 hover:${plan.glow} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-semibold text-white bg-brand-secondary rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-content-secondary">/mo</span>
              </p>
              <ul className="mt-6 space-y-4 text-content-secondary flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-brand-secondary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onNavigateSignup}
                className={`mt-8 w-full py-3 font-semibold rounded-lg transition-colors ${plan.popular ? 'bg-brand-secondary text-white' : 'bg-base-300 text-content-primary hover:bg-opacity-80'}`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
