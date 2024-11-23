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
      backgroundImage: {
            'content': "url('../assets/images/bg-content.png')"
      },
      colors: {
        bgControl: "var(--bg-control)",
        brSection: "var(--br-section)",
        brControl: "var(--br-control)",
        primary: "var(--color-primary)",
        title: "var(--color-title)",
      },
      fontFamily: {
        caslon: ['"Adobe Caslon Pro"', 'serif'],
        neo: ['"Neo Sans W1G"', 'sans-serif'],
        oxygen: ['"Oxygen"', 'sans-serif'],
      },
      fontSize: {
        primary: '1.3125rem'
      },
      keyframes: {
          insignia: {
              '0%': {
                  top: '45%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) scale(var(--insignia-scale-init))',
                  transformOrigin: 'center center'
              },
              '100%': {
                  top: '0',
                  left: '0',
                  transform: 'translate(calc(var(--px)), var(--insignia-pt-moved)) scale(var(--insignia-scale-moved))',
                  transformOrigin: 'top left'
              }
          }
      }
    },
  },
  plugins: [],
};
export default config;
