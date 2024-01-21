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
        128: "8rem",
        80: "5rem",
        45: "2.812rem",
        40: "2.5rem",
        36: "2.25rem",
        32: "2rem",
        25: "1.562rem",
        20: "1.25rem",
        18: `${18 / 16}rem`,
      },
    },
  },
  plugins: [],
} satisfies Config;
