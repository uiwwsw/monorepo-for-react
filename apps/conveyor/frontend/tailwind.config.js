/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        modalOpen: 'modalOpen .3s',
        modalClose: 'modalClose .3s forwards',
        toastOpen: 'toastOpen .3s',
        toastClose: 'toastClose .3s forwards',
        show: 'show .3s',
        hide: 'hide .3s forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        modalOpen: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.07)'},
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        modalClose: {
          '0%': { transform: 'scale(1)', opacity: '1', pointerEvent: 'none' },
          '80%': { transform: 'scale(0.8)'},
          '100%': { transform: 'scale(0)', opacity: '0', pointerEvent: 'none' },
        },
        toastOpen: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toastClose: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        show: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        hide: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

