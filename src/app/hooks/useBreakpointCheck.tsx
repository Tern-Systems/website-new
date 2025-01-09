import {useEffect, useState} from "react";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";


const TailwindConfig = resolveConfig(tailwindConfig);


const useBreakpointCheck = () => {
    const [isSmScreen, setSmScreenState] = useState(false);
    const [isMdScreen, setMdScreenState] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // @ts-expect-error min is not defined in tailwind.config.tsx
            setSmScreenState(parseFloat(TailwindConfig.theme.screens.md?.min ?? '') > window.innerWidth);
            setMdScreenState(window.innerWidth >= 835 && window.innerWidth <= 1154);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return { isSmScreen, isMdScreen };
}

export {useBreakpointCheck};