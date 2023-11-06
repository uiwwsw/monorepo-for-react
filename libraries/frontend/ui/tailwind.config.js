/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        skeleton: 'skeleton 1.5s infinite',
        pulseBorder: 'pulseBorder 1s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        modalOpen: 'modalOpen .3s',
        modalClose: 'modalClose .3s forwards',
        toastOpen: 'toastOpen .3s',
        toastClose: 'toastClose .3s forwards',
        show: 'show .3s forwards',
        hide: 'hide .3s forwards',
        shake: 'shake 150ms 2 linear',
        countDown: 'countDown 5s linear forwards',
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
        modalOpen: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.07)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        modalClose: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '80%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        toastOpen: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toastClose: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        pulseBorder: {
          '50%': {
            'border-color': '#3B82F6', // Assuming this is the color for blue.600
          },
        },
        show: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
        countDown: {
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
