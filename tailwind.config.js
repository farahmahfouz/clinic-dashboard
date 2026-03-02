/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-grey-50)",
        surface: "var(--color-grey-0)",
        hoverGray: "var(--color-grey-100)",
        border: "var(--color-grey-200)",
        text: "var(--color-grey-700)",
        textLight: "var(--color-grey-500)",

        primary: "var(--color-indigo-700)",
        primaryLight: "var(--color-indigo-100)",

        success: "var(--color-green-700)",
        warning: "var(--color-yellow-700)",
        danger: "var(--color-red-700)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [require("daisyui")],
}

