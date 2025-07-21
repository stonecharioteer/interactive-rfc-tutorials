/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rfc: {
          blue: "#1e40af",
          green: "#059669",
          amber: "#d97706",
          red: "#dc2626",
          gray: "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
