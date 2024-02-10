import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "#212121",
      white: "#ffffff",
      blue: "#496EB5",
      pink: "#DE6B9B",
    },
    fontFamily: {
      zyzol: ["Zyzol", "sans-serif"],
      zyzolRound: ["Zyzol Round", "sans-serif"],
      zyzolOutline: ["Zyzol Outline", "sans-serif"],
    },
    extend: {
      fontSize: {
        165: "16.5rem",
        132: "13.2rem",
        128: "12.8rem",
        90: "9rem",
        75: "7.5rem",
        65: "6.5rem",
        60: "6rem",
        45: "4.5rem",
        43: "4.3rem",
        40: "4rem",
        38: "3.8rem",
        34: "3.4rem",
        36: "3.6rem",
        32: "3.2rem",
        29: "2.9rem",
        25: "2.5rem",
        22: "2.2rem",
        20: "2rem",
        18: "1.8rem",
        16: "1.6rem",
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(20rem, 25rem))",
      },
      screens: {
        xs: "580px",
      },
    },
  },
  plugins: [],
} satisfies Config
