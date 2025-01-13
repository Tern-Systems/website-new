import {useEffect, useState} from "react";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";


type Breakpoint = 'sm' | 'md' | 'lg';

const TailwindConfig = resolveConfig(tailwindConfig);
const {sm, md, lg} = TailwindConfig.theme.screens ?? {};
const BREAKPOINT = {
    // @ts-expect-error min is not defined in tailwind.config.tsx
    sm: {max: parseFloat(sm?.max)},
    // @ts-expect-error min is not defined in tailwind.config.tsx
    md: {min: parseFloat(md?.min), max: parseFloat(md?.max)},
    // @ts-expect-error min is not defined in tailwind.config.tsx
    lg: {min: parseFloat(lg?.min)},
};


const useBreakpointCheck = () => {
    const [isSmScreen, setSmScreenState] = useState<Breakpoint | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const {innerWidth} = window;

            if (innerWidth < BREAKPOINT.sm.max)
                setSmScreenState('sm');
            else if (BREAKPOINT.md.min <= innerWidth && innerWidth < BREAKPOINT.md.max)
                setSmScreenState('md');
            else if (innerWidth >= BREAKPOINT.lg.min)
                setSmScreenState('lg');
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return isSmScreen;
}


export {useBreakpointCheck};
