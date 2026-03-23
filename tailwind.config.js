/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7033F5',
          50: '#f3f0ff',
          100: '#e5dbff',
          200: '#d0bfff',
          300: '#b197fc',
          400: '#9775fa',
          500: '#7033F5',
          600: '#6741d9',
          700: '#5f3dc4',
          hover: '#5f3dc4',
          light: '#f3f0ff',
          mid: '#d0bfff',
          text: '#5f3dc4',
        },
        error: {
          DEFAULT: '#f53f3f',
          50: '#ffece8',
          100: '#fdd',
          500: '#f53f3f',
          600: '#d93636',
          700: '#c9353f',
        },
        success: {
          DEFAULT: '#00b42a',
          50: '#e8fff0',
          100: '#c2ffd9',
          500: '#00b42a',
          700: '#008c21',
        },
        warning: {
          DEFAULT: '#ff7d00',
          50: '#fff7e8',
          500: '#ff7d00',
          700: '#a64d00',
        },
        danger: '#f53f3f',
        secondary: '#6b7280',
        surface: '#ffffff',
        background: '#f9fafb',
        border: '#e5e7eb',
      },
      borderRadius: {
        'checkbox': '4px',
        'tag': '6px',
        'base': '8px',
        'inner': '12px',
        'section': '16px',
      },
      boxShadow: {
        'primary-focus': '0 4px 14px 0 rgba(112,51,245,0.2)',
        'error-focus': '0 4px 14px 0 rgba(245,63,63,0.2)',
        'adsgo-card': '0 1px 3px 0 rgba(0,0,0,0.05)',
        'adsgo-depth': '0 4px 24px rgba(0,0,0,0.04)',
        'adsgo-card-hover': '0 8px 30px -4px rgba(112,51,245,0.12), 0 4px 12px -2px rgba(0,0,0,0.06)',
        'adsgo-card-selected': '0 0 0 2px rgba(112,51,245,0.15), 0 8px 24px -4px rgba(112,51,245,0.12)',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'step-enter': 'stepEnter 0.35s ease-out',
        'progress-indeterminate': 'progressIndeterminate 1.8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'bubble-expand': 'bubbleExpand 0.3s ease-out',
        'bubble-collapse': 'bubbleCollapse 0.25s ease-in forwards',
      },
      keyframes: {
        stepEnter: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressIndeterminate: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '60%', marginLeft: '20%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        pulseSubtle: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(112,51,245,0.2)' },
          '50%': { boxShadow: '0 0 0 6px rgba(112,51,245,0)' },
        },
        bubbleExpand: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        bubbleCollapse: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.3) translateY(10px)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(40px) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
