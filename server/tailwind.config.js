const {heroui} = require('@heroui/theme');
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/form.js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};