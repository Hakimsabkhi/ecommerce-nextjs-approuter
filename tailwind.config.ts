/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/js/**/*.js",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    extend: {  
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        starsCard: 'var(--color-starsCard)',
        productNameCard: 'var(--color-productNameCard)',
        HomePageTitles: 'var(--color-HomePageTitles)',
      }   
    },  
  },
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs")]
}