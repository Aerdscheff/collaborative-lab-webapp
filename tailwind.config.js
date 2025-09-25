/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./web/**/*.{js,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        exo2: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        primary: '#E25C5C',        // rose Äerdschëff
        primaryLight: '#F8D7DA',  // rose clair
        secondary: '#7C3AED',     // violet moderne
        turquoise: '#40E0D0',     // accent glow turquoise
        background: '#FDF7F7',    // fond aquarelle clair
      },
      boxShadow: {
        glow: '0 0 10px 2px rgba(64, 224, 208, 0.6)', // glow turquoise
      },
    },
  },
  plugins: [],
};
