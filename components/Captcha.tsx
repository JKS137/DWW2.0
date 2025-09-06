import React, { useEffect, useRef } from 'react';

// Minimal provider-agnostic captcha renderer for Cloudflare Turnstile or hCaptcha
// Provider and site key are provided via props; token is returned via onVerify

declare global {
  interface Window {
    turnstile?: any;
    hcaptcha?: any;
    onTurnstileLoad?: () => void;
    hcaptchaOnload?: () => void;
  }
}

export type CaptchaProvider = 'turnstile' | 'hcaptcha';

interface CaptchaProps {
  provider: CaptchaProvider;
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ provider, siteKey, onVerify, onExpire }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<any>(null);

  useEffect(() => {
    if (!siteKey) return; // no-op if not configured

    const addScript = (src: string, id: string) => {
      if (document.getElementById(id)) return;
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      s.id = id;
      document.body.appendChild(s);
    };

    if (provider === 'turnstile') {
      (window as any).onTurnstileLoad = () => {
        if (!window.turnstile || !ref.current) return;
        widgetIdRef.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
          'error-callback': () => onExpire?.(),
        });
      };
      addScript('https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit', 'cf-turnstile');
    } else if (provider === 'hcaptcha') {
      (window as any).hcaptchaOnload = () => {
        if (!window.hcaptcha || !ref.current) return;
        widgetIdRef.current = window.hcaptcha.render(ref.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
          'error-callback': () => onExpire?.(),
        });
      };
      addScript('https://js.hcaptcha.com/1/api.js?onload=hcaptchaOnload&render=explicit', 'hcaptcha-script');
    }

    return () => {
      try {
        if (provider === 'turnstile' && window.turnstile && widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }
        if (provider === 'hcaptcha' && window.hcaptcha && widgetIdRef.current) {
          window.hcaptcha.remove(widgetIdRef.current);
        }
      } catch {}
    };
  }, [provider, siteKey, onVerify, onExpire]);

  if (!siteKey) return null;

  return (
    <div className="mt-2" aria-label={`${provider} captcha`}>
      <div ref={ref} />
    </div>
  );
};

export default Captcha;

