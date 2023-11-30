/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        skeleton: 'skeleton 1.5s infinite',
        'pulse-border': 'pulse-border 1s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'modal-open': 'modal-open .3s',
        'modal-close': 'modal-close .3s forwards',
        'toast-open': 'toast-open .3s',
        'toast-close': 'toast-close .3s forwards',
        show: 'show .3s forwards',
        hide: 'hide .3s forwards',
        shake: 'shake 150ms 2 linear',
        'count-down': 'count-down 5s linear forwards',
        ripple: 'ripple 0.6s linear',
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundColor: '#e0e0e0' },
          '50%': { backgroundColor: '#f5f5f5' },
          '100%': { backgroundColor: '#e0e0e0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'modal-open': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.07)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'modal-close': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '80%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'toast-open': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-close': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-border': {
          '50%': {
            'border-color': '#3B82F6', // Assuming this is the color for blue.600
          },
        },
        show: {
          '0%': { opacity: '0', zIndex: 99 },
          '100%': { opacity: '1', zIndex: 99 },
        },
        hide: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shake: {
          '0%': {
            transform: 'translate(3px, 0)',
          },
          '50%': {
            transform: 'translate(-3px, 0)',
          },
          '100%': {
            transform: 'translate(0, 0)',
          },
        },
        'count-down': {
          '0%': {
            transform: 'scaleX(1)',
            backgroundColor: 'black',
          },
          '75%': {
            backgroundColor: 'red',
          },
          '80%': {
            backgroundColor: 'white',
          },
          '85%': {
            backgroundColor: 'red',
          },
          '87.5%': {
            backgroundColor: 'white',
          },
          '90%': {
            backgroundColor: 'red',
          },
          '92.5%': {
            backgroundColor: 'white',
          },
          '95%': {
            backgroundColor: 'red',
          },
          '97.5%': {
            backgroundColor: 'white',
          },
          '100%': {
            backgroundColor: 'red',
            transform: 'scaleX(0)',
          },
        },
        ripple: {
          '0%': {
            opacity: '0',
            transform: 'scale(0)',
          },
          '10%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};
