// Cache-busting comment
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.SUPABASE_BUCKET': JSON.stringify(env.SUPABASE_BUCKET || env.VITE_SUPABASE_BUCKET || 'receipts'),
        'process.env.CAPTCHA_PROVIDER': JSON.stringify(env.CAPTCHA_PROVIDER || env.VITE_CAPTCHA_PROVIDER || 'turnstile'),
        'process.env.TURNSTILE_SITE_KEY': JSON.stringify(env.TURNSTILE_SITE_KEY || env.VITE_TURNSTILE_SITE_KEY || ''),
        'process.env.HCAPTCHA_SITE_KEY': JSON.stringify(env.HCAPTCHA_SITE_KEY || env.VITE_HCAPTCHA_SITE_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'next/router': path.resolve(__dirname, 'mocks/next/router.ts'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB
      },
    };
});
