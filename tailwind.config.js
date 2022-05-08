/* eslint-disable no-undef */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}", "./src/*.{vue, js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#00BFA6",
          light: "#3af0d1",
        },
        danger: {
          dark: "#F50057",
          light: "#f2384e",
        },
      },
    },
  },
  daisyui: {
    themes: ["light"],
    darkMode: "light",
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
};
