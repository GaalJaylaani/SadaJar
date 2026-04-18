/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a227',
          light: '#f5e6b8',
          subtle: '#fdf8e8',
          dark: '#9b7a0a',
        },
        cream: {
          DEFAULT: '#faf7f0',
          dark: '#f0e8d5',
        },
        islamic: {
          green: '#2d6a4a',
          dark: '#1a3328',
          teal: '#3d8a6a',
          bg: '#1a3328',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

