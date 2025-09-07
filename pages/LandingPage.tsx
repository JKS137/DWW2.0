import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pulseGlow } from '../services/animations';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { SecureCloudIcon } from '../components/icons/SecureCloudIcon';
import { SmartOCRIcon } from '../components/icons/SmartOCRIcon';
import { RemindersIcon } from '../components/icons/RemindersIcon';
import { SyncIcon } from '../components/icons/SyncIcon';
import { ExportIcon } from '../components/icons/ExportIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
import { XIcon } from '../components/icons/XIcon';
import { GithubIcon } from '../components/icons/GithubIcon';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const LandingNavbar: React.FC<LandingPageProps> = ({ onNavigateLogin, onNavigateSignup }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false); // Close mobile menu after click
    };
    
    return (
        <>
            <nav 
                className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto z-50 px-3 py-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between shadow-lg animate-fade-in"
                style={{ animationDelay: '0.2s' }}
                aria-label="Main"
            >
                {/* Left Side: Logo */}
                <a href="#" className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-6 w-6 text-brand-primary" />
                    <span className="font-semibold text-lg text-content-primary">DigitalWarrantyVault</span>
                </a>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <a key={link.name} href={`#${link.href}`} onClick={(e) => { e.preventDefault(); scrollToSection(link.href.substring(1)); }} className="text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/60 rounded-md px-1 py-1">
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Side: Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-2">
                    {/* GitHub icon link */}
                    <a 
                        href="https://github.com/JKS137/DWW2.0" 
                        target="_blank" 
                        rel="noreferrer" 
                        aria-label="GitHub"
                        className="h-9 w-9 grid place-items-center rounded-lg text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/70"
                    >
                        <GithubIcon className="h-4 w-4" />
                    </a>

                    {/* Auth-aware CTAs */}
                    {!user ? (
                        <>
                            <button 
                                onClick={onNavigateLogin} 
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/60 rounded-lg"
                            >
                                Login
                            </button>
                            <motion.button
                                // @ts-ignore
                                onClick={onNavigateSignup}
                                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/60"
                                variants={pulseGlow}
                                animate="animate"
                            >
                                Get Started
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('/account')} 
                                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/60 rounded-lg"
                            >
                                Account
                            </button>
                            <motion.button
                                // @ts-ignore
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/60"
                                variants={pulseGlow}
                                animate="animate"
                            >
                                Open App
                            </motion.button>
                            <button 
                                onClick={async () => { await signOut(); }} 
                                className="ml-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/60 rounded-lg"
                            >
                                Sign out
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
                        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8 animate-fade-in"
                >
                    {navLinks.map((link) => (
                         <a
                            key={link.name}
                            href={`#${link.href}`}
                            onClick={(e) => { e.preventDefault(); scrollToSection(link.href.substring(1)); }}
                            className="text-2xl font-semibold text-gray-200 hover:text-brand-primary"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="mt-8 pt-8 border-t border-white/10 w-4/5 text-center space-y-4">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => { onNavigateLogin(); setIsOpen(false); }}
                                    className="w-full text-lg font-medium text-gray-200 hover:text-brand-primary transition-transform hover:scale-105 active:scale-95"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { onNavigateSignup(); setIsOpen(false); }}
                                    className="w-full px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full transition-transform hover:scale-105 active:scale-95"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                    className="w-full px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full transition-transform hover:scale-105 active:scale-95"
                                >
                                    Open App
                                </button>
                                <button
                                    onClick={() => { navigate('/account'); setIsOpen(false); }}
                                    className="w-full text-lg font-medium text-gray-200 hover:text-brand-primary transition-transform hover:scale-105 active:scale-95"
                                >
                                    Account
                                </button>
                                <button
                                    onClick={async () => { await signOut(); setIsOpen(false); }}
                                    className="w-full text-lg font-medium text-gray-300 hover:text-white transition-transform"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                        <a 
                            href="https://github.com/JKS137/DWW2.0" 
                            target="_blank" 
                            rel="noreferrer"
                            className="mx-auto inline-flex items-center justify-center gap-2 py-3 px-4 border border-base-300 bg-base-100/70 text-content-primary font-medium rounded-md hover:bg-base-200/50 transition-all"
                            onClick={() => setIsOpen(false)}
                            aria-label="GitHub"
                        >
                            <GithubIcon className="h-5 w-5" />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};


const Hero: React.FC<LandingPageProps> = ({ onNavigateSignup, onNavigateLogin }) => {
    const brands = [
        'Acme',
        'Globex',
        'Initech',
        'Umbrella',
        'Hooli',
        'Stark Industries',
        'Wayne Enterprises',
        'Wonka',
        'Soylent',
        'Cyberdyne',
        'Pied Piper',
        'Vandelay'
    ];

    return (
        <section 
          className="relative pt-40 pb-20 text-center"
        >
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent z-0"></div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-extrabold text-content-primary tracking-tight leading-tight animate-slide-up">
                    Never lose track of your warranties again.
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-content-secondary animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Your digital vault for receipts, warranties, and peace of mind. Securely store, track, and get reminded before they expire.
                </p>
                {/* Trusted by marquee */}
                <div className="mt-16 w-full max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-4">
                        <p className="text-sm font-semibold uppercase tracking-wider text-content-secondary">Trusted by</p>
                    </div>
                    <div className="trusted-by-wrapper relative overflow-hidden">
                        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-base-100 to-transparent"></div>
                        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-base-100 to-transparent"></div>
                        <div className="trusted-by-track flex items-center gap-8 py-4 whitespace-nowrap">
                            {brands.concat(brands).map((name, idx) => (
                                <div key={`${name}-${idx}`} className="h-12 px-5 inline-flex items-center gap-3 rounded-xl bg-base-200/60 border border-white/10 text-content-primary">
                                    <div className="h-8 w-8 rounded-md bg-white/10 grid place-items-center text-sm font-semibold">{name[0]}</div>
                                    <span className="text-sm md:text-base font-medium">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes trusted-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .trusted-by-track {
                    will-change: transform;
                    animation: trusted-marquee 35s linear infinite;
                }
                .trusted-by-wrapper:hover .trusted-by-track {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .trusted-by-track { animation: none; }
                }
            `}</style>
        </section>
    );
};

const HowItWorks: React.FC = () => (
    <section 
      id="how-it-works" 
      className="py-20"
    >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-slide-up">
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="text-content-secondary mt-2">Get organized in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Upload Receipt", description: "Snap a photo or upload a file. Our AI gets to work instantly.", icon: UploadIcon },
                    { title: "Track Expiry", description: "We automatically extract details and set up expiry tracking.", icon: SmartOCRIcon },
                    { title: "Get Reminders", description: "Receive email alerts before a warranty expires so you never miss a claim.", icon: RemindersIcon }
                ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.title} className="text-center p-6 bg-base-200/50 backdrop-blur-md border border-base-300/50 rounded-xl animate-slide-up" style={{ animationDelay: `${i * 0.1}s`}}>
                            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-base-100 border-2 border-brand-primary shadow-glow-blue mb-4">
                               <Icon className="h-8 w-8 text-brand-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-content-secondary mt-2">{step.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

const Features: React.FC = () => {
    const featureList = [
      { name: "Secure Cloud Vault", icon: SecureCloudIcon, description: "Your data is encrypted and stored securely in the cloud." },
      { name: "Smart OCR Extraction", icon: SmartOCRIcon, description: "AI-powered receipt scanning saves you manual data entry." },
      { name: "Expiry Reminders", icon: RemindersIcon, description: "Automated email notifications so you're always prepared." },
      { name: "Multi-Device Sync", icon: SyncIcon, description: "Access your vault from anywhere, on any device." },
      { name: "Export to CSV", icon: ExportIcon, description: "Download your warranty data for personal records or insurance." },
    ];
  
    return (
      <section 
        id="features" 
        className="py-20 bg-base-200/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold">Everything you need, all in one place.</h2>
            <p className="text-content-secondary mt-2">Powerful features to give you complete peace of mind.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="flex items-start space-x-4 p-4">
                   <div className="flex-shrink-0 p-2 bg-base-100 rounded-lg border border-brand-secondary/50">
                      <Icon className="h-6 w-6 text-brand-secondary" />
                   </div>
                  <div>
                    <h3 className="font-semibold">{feature.name}</h3>
                    <p className="text-content-secondary text-sm mt-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
};

const Pricing: React.FC<LandingPageProps> = ({ onNavigateSignup }) => {
    const plans = [
        { 
            name: "Free", 
            price: "$0", 
            features: ["Save 2 Warranties", "Basic Expiry Alerts", "1 Device Sync", "Community Support"], 
            glow: 'shadow-glow-blue', 
            border: 'border-blue-500',
            description: "Perfect for casual users who want to dip their toes in warranty management."
        },
        { 
            name: "Starter", 
            price: "$0.99", 
            yearlyPrice: "$9.99",
            features: ["Save 50 Warranties", "AI-Powered Receipt Scan", "Cloud Backup", "2 Device Sync", "Family Sharing (2 Members)", "Priority Support"], 
            glow: 'shadow-glow-teal', 
            border: 'border-teal-500', 
            popular: true,
            description: "Take the next step! Manage your household warranties with ease for less than a coffee per month."
        },
        { 
            name: "Pro", 
            price: "$2.99",
            yearlyPrice: "$29.99",
            features: ["Unlimited Warranties", "Advanced Search & Tagging", "Export PDFs/CSVs", "Multi-Device Sync (5 Devices)", "Family Sharing (5 Members)", "Premium Support", "Analytics Dashboard"], 
            glow: 'shadow-glow-purple', 
            border: 'border-purple-500',
            description: "Unlock the full potential! Power users and professionals will love the advanced features and unlimited storage."
        }
    ];

    return (
        <section 
          id="pricing" 
          className="py-20"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-3xl font-bold">Choose the plan that's right for you</h2>
                    <p className="text-content-secondary mt-2">Start for free, upgrade when you're ready.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={plan.name} className={`relative p-8 bg-base-200/50 backdrop-blur-md border rounded-xl flex flex-col ${plan.border} transition-all hover:-translate-y-2 hover:${plan.glow} animate-slide-up`} style={{ animationDelay: `${i * 0.1}s`}}>
                            {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-semibold text-white bg-brand-secondary rounded-full">Most Popular</div>}
                            <h3 className="text-2xl font-semibold">{plan.name}</h3>
                            <p className="mt-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-content-secondary">/mo</span>
                                {plan.yearlyPrice && (
                                    <span className="block text-sm">
                                        or <span className="font-semibold">{plan.yearlyPrice}</span>/year
                                    </span>
                                )}
                            </p>
                            <p className="text-content-secondary mt-2">{plan.description}</p>
                            <ul className="mt-6 space-y-4 text-content-secondary flex-grow">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center space-x-2">
                                        <CheckCircleIcon className="h-5 w-5 text-brand-secondary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                              onClick={onNavigateSignup} 
                              className={`mt-8 w-full py-3 font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 ${plan.popular ? 'bg-brand-secondary text-white' : 'bg-base-300 text-content-primary hover:bg-opacity-80'}`}
                            >
                                Choose Plan
                            </button>
                            {plan.yearlyPrice && (
                                <p className="mt-2 text-center text-sm text-content-secondary">Save up to 15% with yearly billing!</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingFooter: React.FC = () => (
    <footer className="border-t border-base-300/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-content-secondary text-center sm:text-left">&copy; {new Date().getFullYear()} DigitalWarrantyVault. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="#" className="text-content-secondary hover:text-content-primary">Terms</a>
                    <a href="#" className="text-content-secondary hover:text-content-primary">Privacy</a>
                    <a href="#" className="text-content-secondary hover:text-content-primary">Support</a>
                </div>
            </div>
        </div>
    </footer>
);


const LandingPage: React.FC<LandingPageProps> = (props) => {
  return (
    <main>
      <LandingNavbar {...props} />
      <Hero {...props} />
      <HowItWorks />
      <Features />
      <Pricing {...props} />
      <LandingFooter />
    </main>
  );
};

export default LandingPage;