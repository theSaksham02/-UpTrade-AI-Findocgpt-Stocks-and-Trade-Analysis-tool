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
          bg: '#0A1929',
          surface: '#132F4C',
          hover: '#1A2027',
        },
        accent: {
          blue: '#1976D2',
          lightBlue: '#0288D1',
        },
        status: {
          success: '#4CAF50',
          warning: '#FFA726',
          danger: '#F44336',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0BEC5',
          muted: '#78909C',
        },
        border: '#263238',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
