import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#003BE2", dark: "#0030B8" },
        lime: { DEFAULT: "#D4FB20", dark: "#C2EA0C" },
        ink: "#040819",
        mute: "#82868E",
        line: "#CED0D3",
        pill: "#F2F2F3",
        surface: "#F5F5F6",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        brand: ["var(--font-syne)", "var(--font-poppins)", "sans-serif"],
      },
      maxWidth: { page: "1200px" },
      boxShadow: {
        float: "0 20px 50px -20px rgba(4, 8, 25, 0.35)",
        card: "0 1px 2px rgba(4, 8, 25, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
