import type { Config } from 'tailwindcss';
import Tailwind from 'tailwindcss/plugin';


const spacing = {
    '7xl': 'var(--p-7xl)',
    '6xl': 'var(--p-6xl)',
    '5xl': 'var(--p-5xl)',
    '4xl': 'var(--p-4xl)',
    '3xl': 'var(--p-3xl)',
    xxl: 'var(--p-xxl)',
    xl: 'var(--p-xl)',
    l: 'var(--p-l)',
    n: 'var(--p-n)',
    s: 'var(--p-s)',
    xs: 'var(--p-xs)',
    xxs: 'var(--p-xxs)',
    '3xs': 'var(--p-3xs)',
    '4xs': 'var(--p-4xs)',
    '5xs': 'var(--p-5xs)',
};

const size = {
    l: 'var(--h-l)',
    m: 'var(--h-m)',
    n: 'var(--h-n)',
    s: 'var(--h-s)',
    xs: 'var(--h-xs)',
    xxs: 'var(--h-xxs)',
    heading: 'var(--h-heading)',
    'heading-icon': 'var(--h-heading-icon)',
    'heading-modal': 'var(--h-heading-modal)',
    'sub-heading': 'var(--h-sub-heading)',
    'button-xxl': 'var(--h-button-xxl)',
    'button-xl': 'var(--h-button-xl)',
    'button-l': 'var(--h-button-l)',
    'button-n': 'var(--h-button-n)',
};


const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            screens: {
                x3s: { max: '375px' },
                xxs: { max: '616px' },
                xs: { max: '774px' },
                sm: { max: '835px' },
                md: { min: '835px', max: '1440px' },
                lg: { min: '1440px' },
            },
            spacing: spacing,
            gap: spacing,
            margin: spacing,
            padding: spacing,
            maxWidth: size,
            width: size,
            maxHeight: size,
            minHeight: size,
            height: size,
            borderRadius: {
                xxs: 'var(--br-xxs)',
                xs: 'var(--br-xs)',
                s: 'var(--br-s)',
                n: 'var(--br-n)',
                l: 'var(--br-l)',
            },
            backgroundColor: {
                'black-l0': 'var(--bg-black-l0)',
                'gray-d0': 'var(--bg-gray-d0)',
                'gray': 'var(--bg-gray)',
                'gray-l0': 'var(--bg-gray-l0)',
                'white-d1': 'var(--bg-white-d1)',
                'white-d0': 'var(--bg-white-d0)',
                'white': 'var(--bg-white)',
                'blue-l0': 'var(--bg-blue-l0)',
                'blue': 'var(--bg-blue)',
                'red': 'var(--bg-red)',
                'navy-d0': 'var(--bg-navy-d0)',
                'green': 'var(--bg-green)',
                'navy': 'var(--bg-navy)',
            },
            borderColor: {
                'gray': 'var(--b-gray)',
                'gray-l0': 'var(--b-gray-l0)',
                'gray-l1': 'var(--b-gray-l1)',
                'white': 'var(--b-white)',
                'white-d0': 'var(--b-white-d0)',
                'blue': 'var(--b-blue)',
                'blue-d0': 'var(--b-blue-d0)',
                'red': 'var(--b-red)',
            },
            borderWidth: {
                s: 'var(--b-s)',
                n: 'var(--b-n)',
            },
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                gray: 'var(--color-gray)',
                placeholder: 'var(--color-placeholder)',
                blue: 'var(--color-blue)',
                'blue-l0': 'var(--color-blue-l0)',
                red: 'var(--color-red)',
            },
            fontFamily: {
                caslon: ['"Adobe Caslon Pro"', 'serif'],
                neo: ['"Neo Sans W1G"', 'sans-serif'],
                english: ['"Old English Five"', 'serif'],
                oxygen: ['"Oxygen"', 'sans-serif'],
                arial: ['"Arial"', 'serif'],
            },
            fontSize: {
                'heading-4xl': 'var(--fz-heading-4xl)',
                'heading-3xl': 'var(--fz-heading-3xl)',
                'heading-xxl': 'var(--fz-heading-xxl)',
                'heading-xl': 'var(--fz-heading-xl)',
                'heading-l': 'var(--fz-heading-l)',
                'section-xl': 'var(--fz-section-xl)',
                'section-l': 'var(--fz-section-l)',
                heading: 'var(--fz-heading)',
                'heading-s': 'var(--fz-heading-s)',
                documentation: 'var(--fz-documentation)',
                section: 'var(--fz-section)',
                'section-s': 'var(--fz-section-s)',
                basic: 'var(--fz-basic)',
                'section-xs': 'var(--fz-section-xs)',
                'section-xxs': 'var(--fz-section-xxs)',
                'section-3xs': 'var(--fz-section-3xs)',
            },
            lineHeight: {
                'n': 'var(--lh-n)',
            },
        },
    },
    plugins: [
        Tailwind(({ matchUtilities }) => {
            matchUtilities({
                'x': (value) => ({
                    [`@apply ${value.replaceAll(',', ' ')}`]: {},
                }),
            });
        }),
    ],
};
export default config;
