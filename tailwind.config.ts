import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        screenReveal: {
          "0%": {
            opacity: "0",
            transform: "translateY(-70%) scaleX(0.85)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(-40%) scaleX(1)",
          },
        },
      },
      animation: {
        screenReveal:
          "screenReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
