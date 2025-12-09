/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Darker, more sophisticated color palette
        'primary-red': '#B91C1C',      // Darker red
        'primary-orange': '#C2410C',   // Darker orange  
        'primary-yellow': '#D97706',   // Darker amber
        'accent-dark': '#7C2D12',      // Very dark orange
        'accent-light': '#EA580C',     // Medium orange
      },
    },
  },
  plugins: [],
}
