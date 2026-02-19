/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom brand colors here if you like
        primary: "#4f46e5", // Indigo-600
      },
    },
  },
  plugins: [],
}