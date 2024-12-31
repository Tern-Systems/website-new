import type {Config} from "tailwindcss";
import Tailwind from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                sm: {max: '834px'},
                md: {min: '835px', max: '1441px'},
                lg: {min: '1442px'}
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
                'control-gray-l1': "var(--b-control-gray-l1)",
                'control-white-d0': "var(--b-control-white-d0)",
                'control-white': "var(--b-control-white)",
                'control-blue': "var(--b-control-blue)",
                'control-red': "var(--b-control-red)",
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
                'content-small': 'var(--fz-content-small)',
                default: 'var(--fz-default)',
                header: 'var(--fz-header)',
                'section-header': 'var(--fz-section-header)',
                'header-l': 'var(--fz-header-l)',
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
                        transform: 'translate(var(--2dr),1.1rem) scale(var(--insignia-scale-moved))',
                        transformOrigin: 'top left'
                    }
                }
            }
        },
    },
    plugins: [
        Tailwind(({matchUtilities}) => {
            matchUtilities({
                'x': (value) => ({
                    [`@apply ${value.replaceAll(',', ' ')}`]: {}
                })
            })
        })
    ],
};
export default config;
