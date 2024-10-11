import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontSize: {
        '1em': '1em'
      },
      colors: {
        'contentstack': '#7C4DFF',
        'theme-light': '#F3F4F6',
        'theme-dark': '#1F2937',
        'theme-primary': '#3B82F6',
        'theme-secondary': '#10B981',
        'theme-green': '#10B981', // Add green theme color
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;