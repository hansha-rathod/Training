/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#0ea5e9",
        darkBg: "#0f172a",
        lightBg: "#f8fafc"
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
}