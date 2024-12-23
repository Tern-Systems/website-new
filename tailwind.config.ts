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
                sm: {max: '833.9px'},
                md: {min: '834px', max: '1439.9px'},
                lg: {min: '1440px'}
            },
            backgroundImage: {
                content: "url('../assets/images/bg-content.gif')"
            },
            colors: {
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
                gray: "var(--color-gray)",
                placeholder: "var(--color-placeholder)",
                blue: "var(--color-blue)",
                'blue-l0': "var(--color-blue-l0)",
                red: "var(--color-red)",
            },
            backgroundColor: {
                'control-gray': "var(--bg-control-gray)",
                'control-gray-l0': "var(--bg-control-gray-l0)",
                'control-white-d1': "var(--bg-control-white-d1)",
                'control-white-d0': "var(--bg-control-white-d0)",
                'control-white': "var(--bg-control-white)",
                'control-blue': "var(--bg-control-blue)",
                'control-red': "var(--bg-control-red)",
                'control-navy': "var(--bg-section-navy)",
            },
            borderRadius: {
                smallest1: 'var(--br-smallest-1)',
                smallest: 'var(--br-smallest)',
                small: 'var(--br-small)',
            },
            borderColor: {
                section: "var(--b-section)",
                'control-gray': "var(--b-control-gray)",
                'control-gray-l0': "var(--b-control-gray-l0)",
                'control-grayL1': "var(--b-control-gray-l1)",
                'control-white-d0': "var(--b-control-white-d0)",
                'control-white': "var(--b-control-white)",
                'control-blue': "var(--b-control-blue)",
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
                note: 'var(--fz-note)',
                small: 'var(--fz-small)',
                content: 'var(--fz-content)',
                contentSmall: 'var(--fz-content-small)',
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
