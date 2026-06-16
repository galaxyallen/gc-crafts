import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c4a265",
          l: "#d4b87a",
          d: "#a08040",
        },
        char: {
          DEFAULT: "#3a3834",
          d: "#2a2826",
          dd: "#1e1c1a",
          ddd: "#141210",
        },
        cream: {
          DEFAULT: "#f2ece2",
          d: "#e4ddd0",
          dd: "#d6cfc2",
        },
        t1: "#e8e2d8",
        t2: "#9a9590",
        t3: "#5a5855",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
