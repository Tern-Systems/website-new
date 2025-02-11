import { useEffect, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';


enum Breakpoint {'x3s', 'xxs', 'xs', 'sm', 'md', 'lg'}

const TailwindConfig = resolveConfig(tailwindConfig);
// @ts-expect-error min is not defined in tailwind.config.tsx
const { x3s, xxs, xs, sm, md, lg } = TailwindConfig.theme.screens ?? {};
const BREAKPOINT = {
    x3s: { max: parseFloat(x3s?.max) },
    xxs: { min: parseFloat(xxs?.min), max: parseFloat(xxs?.max) },
    xs: { min: parseFloat(xs?.min), max: parseFloat(xs?.max) },
    // @ts-expect-error min is not defined in tailwind.config.tsx
    sm: { min: parseFloat(sm?.min), max: parseFloat(sm?.max) },
    // @ts-expect-error min is not defined in tailwind.config.tsx
    md: { min: parseFloat(md?.min), max: parseFloat(md?.max) },
    // @ts-expect-error min is not defined in tailwind.config.tsx
    lg: { min: parseFloat(lg?.min) },
};


const useBreakpointCheck = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(Breakpoint.sm);

    useEffect(() => {
        const handleResize = () => {
            const { innerWidth } = window;

            if (innerWidth < BREAKPOINT.x3s.max)
                setBreakpoint(Breakpoint.x3s);
            else if (BREAKPOINT.xxs.min <= innerWidth && innerWidth < BREAKPOINT.xxs.max)
                setBreakpoint(Breakpoint.xxs);
            else if (BREAKPOINT.xs.min <= innerWidth && innerWidth < BREAKPOINT.xs.max)
                setBreakpoint(Breakpoint.xs);
            else if (BREAKPOINT.sm.min <= innerWidth && innerWidth < BREAKPOINT.sm.max)
                setBreakpoint(Breakpoint.sm);
            else if (BREAKPOINT.md.min <= innerWidth && innerWidth < BREAKPOINT.md.max)
                setBreakpoint(Breakpoint.md);
            else if (BREAKPOINT.lg.min <= innerWidth)
                setBreakpoint(Breakpoint.lg);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};


export { useBreakpointCheck, Breakpoint };
