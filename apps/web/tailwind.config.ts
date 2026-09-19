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
        warm: {
          50: "#FFFDF9",
          100: "#FAF7EE",
          200: "#F4EFE0",
          300: "#E9E2CE",
        },
        arcade: {
          black: "#080808",
          blue: "#1D4ED8",
          electric: "#2563EB",
          mint: "#86EFAC",
          mintDark: "#4ADE80",
          coral: "#FDA4AF",
          coralDark: "#FB7185",
          yellow: "#FEF08A",
          yellowDark: "#FDE047",
          purple: "#D8B4FE",
          purpleDark: "#C084FC",
        },
      },
      boxShadow: {
        arcade: "4px 4px 0px #080808",
        "arcade-sm": "2px 2px 0px #080808",
        "arcade-lg": "6px 6px 0px #080808",
        "arcade-xl": "8px 8px 0px #080808",
      },
      borderWidth: {
        "3": "3px",
        "4": "4px",
        "5": "5px",
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px",
      },
      fontFamily: {
        display: ["Impact", "Trebuchet MS", "sans-serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
