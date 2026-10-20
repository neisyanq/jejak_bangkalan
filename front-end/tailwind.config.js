/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        heritageRed: '#A83232',
        heritageBrown: '#8C6228',
        heritageGold: '#B4863A',
        heritageCream: '#FAF6EC',
      },
    },
  },
  plugins: [],
};
