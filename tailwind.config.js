/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'shake-scale': 'shakeAndScale 4s ease-in-out infinite 1s',
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        gradient: 'gradient 6s linear infinite',
        'gradient-x': 'gradient 15s ease infinite',
      },
    },
      colors: {
        blue1: "#1B69FA",
        blue2: "#1B44FA",
        offwhite: "#f5fdff",
      },
      fontFamily: {
        'georama': ['Georama', 'sans-serif'],
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
      },
      backgroundImage: {
        'gradient-radial': 'var(--gradient-bg)',
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