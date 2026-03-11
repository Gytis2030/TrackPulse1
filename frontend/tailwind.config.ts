import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,58,237,.3), 0 16px 60px rgba(124,58,237,.35)'
      }
    }
  },
  plugins: []
};

export default config;
