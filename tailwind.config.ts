import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        "cream-dark": "#F0EBE3",
        sage: "#8B9D83",
        "sage-light": "#A8B8A0",
        "sage-dark": "#6B7D63",
        blush: "#D4A0A0",
        "blush-light": "#E8C4C4",
        "blush-dark": "#B07070",
        charcoal: "#2C2C2C",
        "charcoal-light": "#4A4A4A",
        "warm-gray": "#8A8580",
        gold: "#C4A55A",
        border: "#E8E3DC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatDelayed: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        cartBump: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "floatDelayed 4s ease-in-out infinite 0.5s",
        marquee: "marquee 25s linear infinite",
        fadeUp: "fadeUp 0.6s ease-out",
        cartBump: "cartBump 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
