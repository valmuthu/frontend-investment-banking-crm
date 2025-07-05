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
          50: '#F0F5FF',
          100: '#D6E4FF',
          200: '#ADC8FF',
          300: '#84A9FF',
          400: '#6690FF',
          500: '#3366FF',  // your primary-500 color
          600: '#254EDB',
          700: '#1939B7',
          800: '#102693',
          900: '#091A7A',
        },
      },
    },
  },
  plugins: [],
}
