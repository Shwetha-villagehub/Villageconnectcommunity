/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './frontend/index.html',
    './frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f3d2e',
        'brand-medium': '#1f7a5a',
        'brand-bright': '#38b48b',
        'brand-light': '#d1fae5',
        'natural-green': '#38b48b',
        'futuristic-blue': '#38b48b',
        'futuristic-purple': '#8b5cf6',
        'dark-slate': '#0f3d2e',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        heading: ['"Arial Black"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
