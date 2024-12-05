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
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.nav-link::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          background: '#1B69FA',
          zIndex: '-1',
          transform: 'scaleX(0)',
          transformOrigin: 'right',
          transition: 'transform 0.3s ease-in-out',
        },
        '.nav-link:hover::before': {
          transform: 'scaleX(1)',
        },
      });
    },
  ],
}