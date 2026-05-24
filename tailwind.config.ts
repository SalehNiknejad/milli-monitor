/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdfbf5",
          100: "#fbf5e5",
          200: "#f5e5c0",
          300: "#efd09a",
          400: "#e8b870",
          500: "#d4a54a",
          600: "#b8882a",
          700: "#8f6820",
          800: "#6b4f1a",
          900: "#4a3610",
        },
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
