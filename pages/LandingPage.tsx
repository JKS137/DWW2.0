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

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const ArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 12h14.5m-6-6 6 6-6 6" />
  </svg>
);

const LandingNavbar: React.FC<LandingPageProps> = ({ onNavigateLogin, onNavigateSignup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Your privacy', href: '#privacy' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-6">
        <a href="#" aria-label="Digital Warranty Vault home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-white sm:text-base">Warranty Vault</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">Digital warranty manager</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-200">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={onNavigateLogin} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white">
            Log in
          </button>
          <motion.button
            onClick={onNavigateSignup}
            variants={pulseGlow}
            animate="animate"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:bg-cyan-200"
          >
            Create your vault <ArrowIcon className="h-4 w-4" />
          </motion.button>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-white/10 p-2 text-slate-200 md:hidden"
        >
          {isOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-3 mt-2 rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/5">
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <button onClick={() => { onNavigateLogin(); setIsOpen(false); }} className="rounded-xl border border-white/10 px-3 py-3 text-sm font-semibold text-white">Log in</button>
            <button onClick={() => { onNavigateSignup(); setIsOpen(false); }} className="rounded-xl bg-cyan-300 px-3 py-3 text-sm font-bold text-slate-950">Get started</button>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC<LandingPageProps> = ({ onNavigateSignup, onNavigateLogin }) => (
  <section className="relative isolate overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute -right-32 top-48 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="absolute -left-32 top-96 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.3) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'linear-gradient(to bottom, black, transparent 85%)' }} />
    </div>

    <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
      <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-cyan-100 sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          Every receipt has a place. Every warranty has a plan.
        </div>

        <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.35rem]">
          Keep what you bought.
          <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Protect what comes next.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">
          One calm, organized place for receipts, product details, and warranty dates. Spend less time searching through emails and drawers—and more time knowing where everything is.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          <button onClick={onNavigateSignup} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
            Build your free vault <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={onNavigateLogin} className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.08]">
            I already have an account
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-400 sm:text-sm lg:justify-start">
          <span className="inline-flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-cyan-300" /> Easy to organize</span>
          <span className="inline-flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-cyan-300" /> Smart receipt scanning</span>
          <span className="inline-flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-cyan-300" /> Expiry reminders</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
        <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-indigo-500/15 blur-2xl" />
        <div className="relative rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.025] p-2 shadow-2xl shadow-black/50 sm:p-3">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900">
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/90" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">Your warranty dashboard</span>
              <ShieldCheckIcon className="h-5 w-5 text-cyan-200" />
            </div>
            <img src="/warranty-vault-hero.svg" alt="Illustration of a warranty dashboard with product records, receipts and reminders" className="block h-auto w-full" />
          </div>
        </div>
        <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-xl sm:-left-5 sm:p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><RemindersIcon className="h-5 w-5" /></span>
          <span><span className="block text-xs font-bold text-white sm:text-sm">Stay one step ahead</span><span className="mt-0.5 block text-[11px] text-slate-400 sm:text-xs">Know what needs attention</span></span>
        </div>
        <div className="absolute -right-1 top-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2.5 shadow-xl sm:flex">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="text-xs font-semibold text-slate-200">Your records, together</span>
        </div>
      </div>
    </div>
  </section>
);

const IntroStrip: React.FC = () => (
  <section className="border-y border-white/[0.08] bg-white/[0.025] px-4 py-7 sm:px-6">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
      <p className="max-w-sm text-sm font-semibold leading-6 text-slate-300">The paperwork behind your purchases, finally in one place.</p>
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:gap-x-9">
        <span className="inline-flex items-center gap-2"><UploadIcon className="h-4 w-4 text-cyan-300" /> Capture</span>
        <span className="inline-flex items-center gap-2"><SmartOCRIcon className="h-4 w-4 text-cyan-300" /> Extract</span>
        <span className="inline-flex items-center gap-2"><CalendarIconFallback /> Track</span>
        <span className="inline-flex items-center gap-2"><RemindersIcon className="h-4 w-4 text-cyan-300" /> Remember</span>
      </div>
    </div>
  </section>
);

const CalendarIconFallback: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 text-cyan-300">
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
  </svg>
);

const HowItWorks: React.FC = () => {
  const steps = [
    { number: '01', title: 'Add a receipt', description: 'Upload a receipt image and keep the proof of purchase with the product it belongs to.', icon: UploadIcon },
    { number: '02', title: 'Review the details', description: 'Use smart extraction to help capture product and purchase information, then check the details.', icon: SmartOCRIcon },
    { number: '03', title: 'Keep an eye on dates', description: 'See your warranty records in one dashboard and get reminders before important dates.', icon: RemindersIcon },
  ];
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">A simpler system</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">From paper chaos to peace of mind.</h2>
          <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">No more guessing where you put the receipt or when coverage ends. Keep the important details easy to find.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article key={step.number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.08 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-black tracking-[0.2em] text-cyan-200">{step.number}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.07] text-cyan-200 transition group-hover:scale-105 group-hover:bg-cyan-200/10"><Icon className="h-6 w-6" /></span>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const featureList = [
    { name: 'Smart receipt scanning', icon: SmartOCRIcon, description: 'Let OCR help pull key details from receipt images, so you spend less time typing.' },
    { name: 'One organized vault', icon: SecureCloudIcon, description: 'Keep product details, purchase information and warranty records together.' },
    { name: 'Expiry reminders', icon: RemindersIcon, description: 'Get a timely nudge about upcoming warranty dates, instead of relying on memory.' },
    { name: 'Access across devices', icon: SyncIcon, description: 'Sign in and find your records when you need them, from your supported devices.' },
    { name: 'Export your records', icon: ExportIcon, description: 'Download warranty details as a CSV for your own records and reference.' },
    { name: 'Share when needed', icon: ShieldCheckIcon, description: 'Use warranty sharing features when you need to pass relevant details along.' },
  ];
  return (
    <section id="features" className="relative overflow-hidden border-y border-white/[0.07] bg-slate-900/45 px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden="true" className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-[100px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Everything in its place</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Small details. Big difference.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-base">Designed to make the everyday admin around purchases feel lighter, clearer and easier to manage.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article key={feature.name} className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-slate-900/80">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.07] text-cyan-200"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-base font-bold text-white">{feature.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PrivacySection: React.FC = () => (
  <section id="privacy" className="px-4 py-20 sm:px-6 sm:py-24">
    <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-100"><ShieldCheckIcon className="h-4 w-4" /> Your account, your records</span>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Your purchases are personal. Your records should be, too.</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Warranty Vault is built around an account-based workflow, so you can organize your purchase records in one place and return to them when you need them. Use a strong, unique password and keep your sign-in details private.</p>
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-200/20 bg-emerald-200/[0.07] text-emerald-200 lg:h-24 lg:w-24">
        <ShieldCheckIcon className="h-10 w-10 lg:h-12 lg:w-12" />
      </div>
    </div>
  </section>
);

const FinalCTA: React.FC<LandingPageProps> = ({ onNavigateSignup, onNavigateLogin }) => (
  <section className="px-4 pb-20 sm:px-6 sm:pb-28">
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-cyan-300 via-sky-300 to-blue-400 px-6 py-12 text-center shadow-2xl shadow-cyan-950/30 sm:px-12 sm:py-16">
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[36px] border-white/15" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-12 h-72 w-72 rounded-full border-[48px] border-white/10" />
      <div className="relative mx-auto max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-800/70">A little more peace of mind</p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Make room for what matters. We’ll help keep the paperwork in order.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-800/80 sm:text-base">Start organizing your warranty records today. You can create an account or return to your existing vault.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onNavigateSignup} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800">Create your vault <ArrowIcon className="h-4 w-4" /></button>
          <button onClick={onNavigateLogin} className="rounded-xl border border-slate-950/20 bg-white/30 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-white/50">Log in</button>
        </div>
      </div>
    </div>
  </section>
);

const LandingFooter: React.FC = () => (
  <footer className="border-t border-white/[0.08] px-4 py-8 sm:px-6">
    <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="#" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300 text-slate-950"><ShieldCheckIcon className="h-5 w-5" /></span>
        <span className="text-sm font-bold text-white">Warranty Vault</span>
      </a>
      <p className="text-xs leading-5 text-slate-500">© {new Date().getFullYear()} Digital Warranty Vault. Keep your purchase records close.</p>
      <div className="flex gap-5 text-xs font-medium text-slate-400">
        <a href="#privacy" className="transition hover:text-cyan-200">Privacy</a>
        <a href="#features" className="transition hover:text-cyan-200">Features</a>
      </div>
    </div>
  </footer>
);

const LandingPage: React.FC<LandingPageProps> = (props) => (
  <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
    <LandingNavbar {...props} />
    <Hero {...props} />
    <IntroStrip />
    <HowItWorks />
    <Features />
    <PrivacySection />
    <FinalCTA {...props} />
    <LandingFooter />
  </main>
);

export default LandingPage;
