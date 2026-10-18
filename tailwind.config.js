/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbcfe4',
          300: '#f8a5cc',
          400: '#f36da7',
          500: '#e2136e', // bKash iconic magenta
          600: '#cc0b5e',
          700: '#ab074d',
          800: '#8e0941',
          900: '#770d39',
          950: '#46021e',
        },
        cyber: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          emerald: '#10b981',
          purple: '#8b5cf6',
          gold: '#f59e0b',
          dark: '#0B0F19',
          card: '#111827',
          border: '#1f2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.75', transform: 'scale(1.05)' },
        },
        wave: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
