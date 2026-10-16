/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#dce8f3',
          200: '#b8d0e6',
          300: '#8baed3',
          400: '#5b87b8',
          500: '#3b6a9e',
          600: '#2c5483',
          700: '#23456b',
          800: '#1c3856',
          900: '#16293f',
          950: '#0d1a2b',
        },
        teal: {
          50: '#effcf9',
          100: '#cbf7ef',
          200: '#98eddf',
          300: '#5ddcca',
          400: '#2cc3b1',
          500: '#14a89a',
          600: '#0d877c',
          700: '#106b65',
          800: '#115552',
          900: '#124745',
          950: '#042726',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
