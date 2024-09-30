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
        "light-bg": "#FFFDFD",
        "dark-bg": "#212121",
        "light-text-primary": "#24252A",
        primary: "#DBC9FF",
        secondary: "#CEB4FF",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
    screens: {
      desktop: "1200px",
      mobile: "700px",
      tablet: "870px",
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
