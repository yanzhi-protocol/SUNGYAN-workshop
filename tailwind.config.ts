import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F2ED",
        text: "#2C2416",
        muted: "#B0A89E",
        card: "#EFECE6",
        border: "#DDD8CF",
        accent: "#4ADE80",
        terminal: "#1E1E1E",
      },
      fontFamily: {
        mono: [
          "SF Mono",
          "Consolas",
          "Menlo",
          "Monaco",
          "Courier New",
          "monospace",
        ],
      },
      maxWidth: {
        content: "680px",
      },
    },
  },
  plugins: [],
};
export default config;
