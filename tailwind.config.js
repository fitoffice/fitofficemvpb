/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        ripple: {
          '0%': { 
            transform: 'scale(0)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(2)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'scale(3)',
            opacity: '0'
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0'
          },
          '100%': {
            backgroundPosition: '700px 0'
          }
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
            'transform': 'rotate(0deg)'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
            'transform': 'rotate(3deg)'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
            'animation-timing-function': 'ease-in-out'
          },
          '50%': {
            transform: 'translateY(-20px) rotate(5deg)',
            'animation-timing-function': 'ease-in-out'
          }
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'bounce-gentle': {
          '0%, 100%': { 
            transform: 'translateY(-5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'morph': {
          '0%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }
        }
      },
      animation: {
        ripple: 'ripple 1s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
        tilt: 'tilt 10s ease-in-out infinite',
        'gradient-shift': 'gradient 3s ease infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slow-reverse': 'float 7s ease-in-out infinite reverse',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-gentle 3s infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        scale: 'scale 2s ease-in-out infinite',
        morph: 'morph 8s ease-in-out infinite'
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)'
      }
    }
  }
};
