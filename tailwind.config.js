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
          dark: "#ba293a",
          light: "#f2384e",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
};
