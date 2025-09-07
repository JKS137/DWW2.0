/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#3b82f6', // Blue
        'brand-secondary': '#14b8a6', // Teal
        'brand-pink': '#ec4899', // Pink
        'base-100': '#111827', // Even Darker Gray
        'base-200': '#1f2937', // Dark Gray
        'base-300': '#374151', // Medium Gray
        'content-primary': '#f9fafb', // Off-White
        'content-secondary': '#9ca3af', // Lighter Gray
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.6), 0 0 8px rgba(59, 130, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.6), 0 0 8px rgba(236, 72, 153, 0.5)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.6), 0 0 8px rgba(20, 184, 166, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.6), 0 0 8px rgba(139, 92, 246, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0px rgba(59, 130, 246, 0)'
          },
          '50%': {
            transform: 'scale(1.03)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
          }
        }
      },
    }
  },
  plugins: [],
}