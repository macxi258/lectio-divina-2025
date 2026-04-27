/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2B4A',
          light: '#243860',
        },
        gold: {
          DEFAULT: '#C4A052',
        },
        cream: {
          DEFAULT: '#FAF7F2',
        },
        sand: {
          DEFAULT: '#E8DCC8',
        },
        warm: {
          50: '#FAF7F2',
          100: '#F0EBE1',
          200: '#DDD4C5',
          300: '#C9BAA6',
          400: '#A89280',
          500: '#8B7E74',
          600: '#6B5E52',
          700: '#4A3F35',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
