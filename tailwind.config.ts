import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/*/.{js,ts,jsx,tsx}",
    "./components/*/.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
        brand: {
          red: "#C8102E",
          gold: "#FFD700",
          black: "#111111",
        },
      },},
  },
  plugins: [],
};

export default config;