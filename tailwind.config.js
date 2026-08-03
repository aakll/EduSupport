/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    keyframes: {
      'idle-float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-8px)' },
      },
      'gradient-shift': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
      },
    },
    animation: {
      'idle-float': 'idle-float 4s ease-in-out infinite',
      'gradient-shift': 'gradient-shift 4s ease infinite',
    },
  },
},
  plugins: [],
}