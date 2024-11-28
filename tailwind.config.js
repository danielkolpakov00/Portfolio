/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      colors: {
        blue1: "#1B69FA",
        blue2: "#1B44FA",
        offwhite: "#f5fdff",
        },


    },
  },
  plugins: [],
}