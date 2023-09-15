/** @type {import('tailwindcss').Config} */
import tailwindForms from "@tailwindcss/forms";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.blue[600],
          DEFAULT: colors.blue[800],
          dark: colors.blue[900],
        },
        secondary: {
          light: colors.purple[600],
          DEFAULT: colors.purple[800],
          dark: colors.purple[900],
        },
        accent: {
          light: colors.red[400],
          DEFAULT: colors.red[600],
          dark: colors.red[800],
        },
        neutral: {
          50: colors.gray[50],
          100: colors.gray[100],
          200: colors.gray[200],
          300: colors.gray[300],
          700: colors.gray[700],
          800: colors.gray[800],
          900: colors.gray[900],
          950: colors.gray[950],
        },
      },
    },
  },
  plugins: [tailwindForms()],
};
