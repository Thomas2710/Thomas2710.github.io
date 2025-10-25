import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        blue: {
          400: "#2589FE",
          500: "#0070F3",
          600: "#2F6FEB",
        },
        keyframes: {
          'gradient-x': {
            '0%, 100%': { 'background-position': '0% 50%' },
            '50%': { 'background-position': '100% 50%' },
          },
        },
        animation: {
          'gradient-x': 'gradient-x 15s ease infinite',
        },
        // 🌿 Calm natural palette
        background: "#f9fafb", // soft neutral
        surface: "#ffffff", // pure white surface
        textPrimary: "#1f2937", // deep gray-blue
        textSecondary: "#4b5563", // medium gray
        accentGreen: "#10b981", // calm green
        accentBlue: "#3b82f6", // natural sky blue
        accentHover: "#065f46", // dark green for hover
        borderLight: "#e5e7eb",
        softSky: "#e0f2fe", // pale sky
        softLeaf: "#dcfce7", // pale leaf
        softSand: "#fef9c3", // pale sand
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
