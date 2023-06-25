/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/applications/**/*.{html,js,hbs,mjs}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
