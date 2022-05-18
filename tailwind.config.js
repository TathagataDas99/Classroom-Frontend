/* eslint-disable no-undef */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}", "./src/*.{vue, js}"],
  theme: {
    extend: {
      fontFamily:{
        heading: "'Lora', serif",
        body: "'Nunito', sans-serif"
      },
      colors: {
        bgdark: {
          base : "1E293B",
          shade: "64748B",
        },
        bglight: {
          base : "F8FAFC",
          shade: "E2E8F0",
        },
        

        primary: {
          dark: "#0BDA9D",
          light: "#05F3A9",
        },
        danger: {
          dark: "#F5003D",
          light: "#EC1D64",
        },
        info:{
          dark:"00B0FF",
          light:"4CCAF1"
        },
        warning:{
          dark:"F9A826",
          light:"F3B155"

        }
      },
    },
  },
  daisyui: {
    themes: ["light"],
    darkMode: "light",
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
};
