import {useEffect, useState} from "react";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";


enum Breakpoint { 'xxs', 'xs', 'sm', 'md', 'lg'}

const TailwindConfig = resolveConfig(tailwindConfig);
// @ts-expect-error min is not defined in tailwind.config.tsx
const {xxs, xs, sm, md, lg} = TailwindConfig.theme.screens ?? {};
const BREAKPOINT = {
    xxs: {max: parseFloat(xxs?.max)},
    xs: {min: parseFloat(xs?.min), max: parseFloat(xs?.max)},
    // @ts-expect-error min is not defined in tailwind.config.tsx
    sm: {min: parseFloat(sm?.min), max: parseFloat(sm?.max)},
    // @ts-expect-error min is not defined in tailwind.config.tsx
    md: {min: parseFloat(md?.min), max: parseFloat(md?.max)},
    // @ts-expect-error min is not defined in tailwind.config.tsx
    lg: {min: parseFloat(lg?.min)},
};


const useBreakpointCheck = () => {
    const [isSmScreen, setSmScreenState] = useState<Breakpoint>(Breakpoint.sm);

    useEffect(() => {
        const handleResize = () => {
            const {innerWidth} = window;

            if (innerWidth < BREAKPOINT.xxs.max)
                setSmScreenState(Breakpoint.xxs);
            else if (BREAKPOINT.xs.min <= innerWidth && innerWidth < BREAKPOINT.xs.max)
                setSmScreenState(Breakpoint.xs);
            else if (BREAKPOINT.sm.min <= innerWidth && innerWidth < BREAKPOINT.sm.max)
                setSmScreenState(Breakpoint.sm);
            else if (BREAKPOINT.md.min <= innerWidth && innerWidth < BREAKPOINT.md.max)
                setSmScreenState(Breakpoint.md);
            else if (innerWidth >= BREAKPOINT.lg.min)
                setSmScreenState(Breakpoint.lg);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return isSmScreen;
}


export {useBreakpointCheck, Breakpoint};
