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
          primary: "var(--color-primary)",
      },
      backgroundColor: {
          control: "var(--bg-control)",
          control2: "var(--bg-control-2)",
          section: "var(--bg-section)",
          section2: "var(--bg-section-2)",
      },
      borderRadius: {
          small: 'var(--br-small)',
      },
      borderColor: {
          section: "var(--b-section)",
          control: "var(--b-control)",
          control2: "var(--b-control-2)",
          control3: "var(--b-control-3)",
      },
      borderWidth : {
       small: 'var(--b-small)',
      },
      fontFamily: {
        caslon: ['"Adobe Caslon Pro"', 'serif'],
        neo: ['"Neo Sans W1G"', 'sans-serif'],
        oxygen: ['"Oxygen"', 'sans-serif'],
      },
      fontSize: {
        content: '2.25rem'
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
