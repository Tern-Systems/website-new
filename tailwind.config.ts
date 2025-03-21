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
    heading: 'var(--h-heading)',
    'insignia': 'var(--insignia-h)',
    'heading-icon': 'var(--h-heading-icon)',
    'heading-modal': 'var(--h-heading-modal)',
    'sub-heading': 'var(--h-sub-heading)',
    'button-xxl': 'var(--h-button-xxl)',
    'button-xl': 'var(--h-button-xl)',
    'button-l': 'var(--h-button-l)',
    'button-n': 'var(--h-button-n)',
    'button-s': 'var(--h-button-s)',
    'card': 'var(--w-card)',
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
                mdmd: { max: '835px', min: '616px'},
                md: { min: '835px', max: '1440px' },
                lg: { min: '1440px' },
            },
            spacing: spacing,
            gap: spacing,
            margin: spacing,
            padding: spacing,
            maxWidth: size,
            minWidth: size,
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
                'gray-d2': 'var(--bg-gray-d2)',
                'gray-d1': 'var(--bg-gray-d1)',
                'gray-d0': 'var(--bg-gray-d0)',
                'gray': 'var(--bg-gray)',
                'gray-l0': 'var(--bg-gray-l0)',
                'gray-l1': 'var(--bg-gray-l1)',
                'gray-l2': 'var(--bg-gray-l2)',
                'white-d2': 'var(--bg-white-d2)',
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
                'black-l0': 'var(--b-black-l0)',
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
                'gray-d2': 'var(--color-gray-d2)',
                placeholder: 'var(--color-placeholder)',
                blue: 'var(--color-blue)',
                'blue-l0': 'var(--color-blue-l0)',
                red: 'var(--color-red)',
            },
            fontFamily: {
                gothic: ['"Abode Gothic Standard"', 'sans-serif'],
                english: ['"Old English Five"', 'serif'],
                oxygen: ['"Oxygen"', 'sans-serif'],
                arial: ['"Arial"', 'serif'],
            },
            fontSize: {
                '96': 'var(--fz-96)',
                '64': 'var(--fz-64)',
                '48': 'var(--fz-48)',
                '40': 'var(--fz-40)',
                '36': 'var(--fz-36)',
                '32': 'var(--fz-32)',
                '30': 'var(--fz-30)',
                '27': 'var(--fz-27)',
                '21': 'var(--fz-21)',
                '24': 'var(--fz-24)',
                '20': 'var(--fz-20)',
                '18': 'var(--fz-18)',
                '16': 'var(--fz-16)',
                '14': 'var(--fz-14)',
                '12': 'var(--fz-12)',
                '10': 'var(--fz-10)',
            },
            lineHeight: {
                's': 'var(--lh-s)',
                'n': 'var(--lh-n)',
                'l': 'var(--lh-l)',
                'xl': 'var(--lh-xl)',
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