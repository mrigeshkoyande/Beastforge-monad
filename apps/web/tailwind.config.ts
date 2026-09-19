import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./game/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mh: {
          bg: "#0B0E14",
          navy: "#10141D",
          card: "#161B26",
          cardHover: "#1E2535",
          border: "#232B3B",

          /* Exact requested Palette */
          maroon: "#8B1E2D",       // rgb(139, 30, 45) - Deep Maroon
          crimson: "#E63946",      // rgb(230, 57, 70) - Electric Crimson / Attack / Live
          gold: "#F4D35E",         // rgb(244, 211, 94) - Warm Solar Gold / Rewards
          steel: "#457B9D",        // rgb(69, 123, 157) - Steel Blue / Defend / Intel

          /* Semantic Aliases */
          primary: "#E63946",
          primaryGlow: "#FF5B69",
          live: "#E63946",
          reward: "#F4D35E",
          defend: "#457B9D",
          win: "#00E676",
          silver: "#8F9DAE",
          monad: "#836EF9",

          /* Neutral Text */
          text: "#FFFFFF",
          text2: "#94A3B8",
          text3: "#64748B",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "Impact", "sans-serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "mh-glow": "0 0 20px rgba(230, 57, 70, 0.4)",
        "mh-maroon-glow": "0 0 20px rgba(139, 30, 45, 0.5)",
        "mh-gold-glow": "0 0 20px rgba(244, 211, 94, 0.4)",
        "mh-steel-glow": "0 0 20px rgba(69, 123, 157, 0.4)",
        "mh-card": "0 8px 24px rgba(0, 0, 0, 0.5)",
        "mh-live": "0 0 15px rgba(230, 57, 70, 0.6)",
      },
      transform: {
        skew12: "skewX(-12deg)",
        unskew12: "skewX(12deg)",
      },
    },
  },
  plugins: [],
};
export default config;
