import type { Config } from "tailwindcss";

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
        128: "12.8rem",
        90: "9rem",
        60: "6rem",
        45: "4.5rem",
        40: "4rem",
        36: "3.6rem",
        32: "3.2rem",
        25: "2.5rem",
        20: "2rem",
        18: "1.8rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
