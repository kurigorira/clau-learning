import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Hiragino Sans'", "'Yu Gothic'", "Meiryo", "sans-serif"],
        display: ["'M PLUS Rounded 1c'", "'Hiragino Sans'", "sans-serif"],
      },
      colors: {
        sage: {
          50: "#f5f7ff",
          100: "#e9edff",
          200: "#c8d2ff",
          400: "#7c8cff",
          600: "#4a5ad6",
          800: "#2a317a",
          900: "#1a1f4d",
        },
        magic: {
          gold: "#f5c842",
          ember: "#ff8c42",
          violet: "#9b6cff",
          mint: "#5dd6a5",
        },
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sparkle: {
          "0%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
          "100%": { opacity: "0", transform: "scale(0) rotate(360deg)" },
        },
      },
      animation: {
        twinkle: "twinkle 2.4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        sparkle: "sparkle 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
