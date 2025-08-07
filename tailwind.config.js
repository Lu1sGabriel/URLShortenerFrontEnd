/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode ativado via data-attribute selector
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
