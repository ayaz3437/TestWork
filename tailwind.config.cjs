/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // update this line
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        alternative: 'var(--color-alternative)',
        alternativeDark: 'var(--color-alternative-dark)',
        alternativeBright: 'var(--color-alternative-bright)',
        secondary: 'var(--color-secondary)',
        primaryDark: 'var(--color-primary-dark)',
        currentColor: 'var(--currentColor)',
      },
      fontFamily: {
        sans: [
          // "Poppins",
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [],
};
