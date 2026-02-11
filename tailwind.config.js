/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores da Identidade Visual YF Pratas
        'yf-black': '#000000',
        'yf-white': '#FFFFFF',
        'yf-silver': '#BFBFBF',
        'yf-gray': '#F5F5F5',
      }
    },
  },
  plugins: [],
}