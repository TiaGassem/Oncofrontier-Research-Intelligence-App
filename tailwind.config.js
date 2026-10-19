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
        // Warm neutral surface (replaces harsh pure-white backgrounds)
        paper: {
          50: '#fbfaf7',
          100: '#f5f3ee',
          200: '#eae6de',
        },
        // Dusty blue
        steel: {
          50: '#f2f6fa',
          100: '#e1eaf3',
          200: '#c3d5e7',
          300: '#9db9d4',
          400: '#7296ba',
          500: '#537aa0',
          600: '#436184',
          700: '#384e6b',
        },
        // Soft lavender
        lavender: {
          50: '#f7f6fb',
          100: '#edebf6',
          200: '#dbd7ee',
          300: '#bcb4de',
          400: '#9c90cd',
          500: '#7f6fba',
          600: '#65569b',
        },
        // Sage green
        sage: {
          50: '#f4f7f3',
          100: '#e5ece2',
          200: '#cbd8c6',
          300: '#a8bda1',
          400: '#84a07c',
          500: '#66845e',
          600: '#4f6849',
        },
        clay: {
          50: '#fbf5f2',
          100: '#f6e8e1',
          200: '#edd0c3',
          300: '#dcab97',
          400: '#c6856e',
          500: '#a96750',
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
