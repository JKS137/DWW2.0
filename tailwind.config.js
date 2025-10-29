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
        'brand-primary': '#3b82f6',
        'brand-secondary': '#14b8a6',
        'brand-pink': '#ec4899',
        'base-100': '#0f172a',
        'base-200': '#1e293b',
        'base-300': '#334155',
        'content-primary': '#f8fafc',
        'content-secondary': '#cbd5e1',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.25)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.25)',
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(20, 184, 166, 0.25)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgba(88, 28, 135, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
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
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    }
  },
  plugins: [],
}