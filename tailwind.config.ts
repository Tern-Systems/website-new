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
                sm: {max: '835px'},
                md: {min: '835px', max: '1440px'},
                lg: {min: '1440px'},
            },
            minHeight: {
                heading: 'var(--h-heading)',
                'heading-lg': 'var(--h-heading-lg)',
            },
            height: {
                heading: 'var(--h-heading)',
                'heading-lg': 'var(--h-heading-lg)',
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
                'section-navy': "var(--bg-section-navy)",
                'control-navy': "var(--bg-control-navy)",
            },
            borderRadius: {
                smallest1: 'var(--br-smallest-1)',
                smallest: 'var(--br-smallest)',
                small: 'var(--br-small)',
                normal: 'var(--br-normal)',
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

                'heading-l': 'var(--fz-heading-l)',
                heading: 'var(--fz-heading)',
                'heading-s': 'var(--fz-heading-s)',
                documentation: 'var(--fz-documentation)',
                section: 'var(--fz-section)',
                'section-s': 'var(--fz-section-s)',
                basic: 'var(--fz-basic)',
                'section-xs': 'var(--fz-section-xs)',
                'section-xxs': 'var(--fz-section-xxs)',
                'section-3xs': 'var(--fz-section-3xs)',
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
