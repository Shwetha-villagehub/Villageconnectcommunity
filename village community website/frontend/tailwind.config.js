/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f3d2e',    // Dark green
        'brand-medium': '#1f7a5a',  // Medium green
        'brand-bright': '#38b48b',  // Bright green
        'brand-light': '#d1fae5',   // Light green accents
        'natural-green': '#38b48b', // Mapping existing variable for compatibility
        'futuristic-blue': '#38b48b',
        'dark-slate': '#0f3d2e',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        heading: ['"Arial Black"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}