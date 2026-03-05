/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7033F5',
        'primary-hover': '#5221CF',
        'primary-light': '#F5F1FF',
        'primary-mid': '#EDE8FF',
        'primary-text': '#5E26D6',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        surface: '#ffffff',
        background: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
