import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                sm: {min: '375px', max: '833.9px'},
                md: {min: '834px', max: '1439.9px'},
                lg: {min: '1440px'}
            },
            backgroundImage: {
                content: "url('../assets/images/bg-content.gif')"
            },
            colors: {
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
                form: "var(--color-form)",
                placeholder: "var(--color-placeholder)",
                blue: "var(--color-blue)",
            },
            backgroundColor: {
                control: "var(--bg-control)",
                control2: "var(--bg-control-2)",
                control3: "var(--bg-control-3)",
                control4: "var(--bg-control-4)",
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
                control4: "var(--b-control-4)",
                control5: "var(--b-control-5)",
                control6: "var(--b-control-6)",
            },
            borderWidth: {
                small: 'var(--b-small)',
            },
            fontFamily: {
                caslon: ['"Adobe Caslon Pro"', 'serif'],
                neo: ['"Neo Sans W1G"', 'sans-serif'],
                english: ['"Old English Five"', 'serif'],
                oxygen: ['"Oxygen"', 'sans-serif'],
            },
            fontSize: {
                small: 'var(--fz-small)',
                content: 'var(--fz-content)',
                header: 'var(--fz-header)'
            },
            keyframes: {
                insignia: {
                    '0%': {
                        top: '45%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(var(--insignia-scale-init))',
                        transformOrigin: 'center center',
                    },
                    '100%': {
                        top: '0',
                        left: '0',
                        transform: 'translate(var(--insignia-pl-moved), var(--insignia-pt-moved)) scale(var(--insignia-scale-moved))',
                        transformOrigin: 'top left'
                    }
                }
            }
        },
    },
    plugins: [],
};
export default config;
