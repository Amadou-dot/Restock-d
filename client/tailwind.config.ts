import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(alert|button|card|image|input|link|modal|navbar|number-input|pagination|skeleton|spinner|toast|ripple|form).js"
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};

export default config;
