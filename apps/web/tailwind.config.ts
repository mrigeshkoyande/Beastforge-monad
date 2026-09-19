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
          primary: "#836EF9",
          primaryGlow: "#A594FF",
          live: "#FF1A2A",
          reward: "#FFCC00",
          defend: "#00B0FF",
          win: "#00E676",
          silver: "#8F9DAE",
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
        "mh-glow": "0 0 20px rgba(131, 110, 249, 0.4)",
        "mh-card": "0 8px 24px rgba(0, 0, 0, 0.5)",
        "mh-live": "0 0 15px rgba(255, 26, 42, 0.5)",
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
