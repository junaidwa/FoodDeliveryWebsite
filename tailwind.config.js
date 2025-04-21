/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        'primary-dark': '#FF5252',
        secondary: '#4ECDC4',
        accent: '#FFD166',
        'warm-orange': '#FF9E2C',
        'sunny-yellow': '#FFD166',
        'soft-teal': '#4ECDC4',
        'primary-50': '#FFF5F5',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'cart-shake': 'cartShake 0.6s ease-in-out',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        cartShake: {
          '0%': { transform: 'rotate(0)' },
          '15%': { transform: 'rotate(5deg)' },
          '30%': { transform: 'rotate(-5deg)' },
          '45%': { transform: 'rotate(4deg)' },
          '60%': { transform: 'rotate(-4deg)' },
          '75%': { transform: 'rotate(2deg)' },
          '85%': { transform: 'rotate(-2deg)' },
          '92%': { transform: 'rotate(1deg)' },
          '100%': { transform: 'rotate(0)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.transform-gpu': {
          transform: 'translateZ(0)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 