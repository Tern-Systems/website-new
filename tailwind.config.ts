import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: { min: '375px', max: '833.9px'},
        md: { min: '834px', max: '1439.9px'},
        lg: { min: '1440px' }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        caslon: ['"Adobe Caslon Pro"', 'serif'],
        neo: ['"Neo Sans W1G"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
