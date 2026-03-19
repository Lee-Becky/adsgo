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
    },
  },
  plugins: [],
}
