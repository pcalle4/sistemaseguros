import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#0f766e',
          600: '#115e59',
        },
        sand: {
          50: '#fffdf8',
          100: '#f5efe2',
        },
      },
    },
  },
  plugins: [],
};

export default config;
