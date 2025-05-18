/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        indigo: {
          50: '#f0f1fe',
          100: '#e2e3fc',
          200: '#c9cafa',
          300: '#a9a8f5',
          400: '#8782f0',
          500: '#6e64e7',
          600: '#5271FF', // Custom primary
          700: '#4e43c7',
          800: '#3a309d',
          900: '#312b7e',
          950: '#1f1a49',
        },
        pink: {
          50: '#fef1f7',
          100: '#fee5f0',
          200: '#ffcbe2',
          300: '#ffaace',
          400: '#ff7db7',
          500: '#ff5999',
          600: '#FFB7C5', // Custom secondary
          700: '#df1d67',
          800: '#bf1958',
          900: '#9e194c',
          950: '#5f0828',
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-once': 'pulse 0.5s ease-in-out'
      },
    },
  },
  plugins: [],
};