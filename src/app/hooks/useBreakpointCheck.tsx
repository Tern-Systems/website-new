import {useEffect, useState} from "react";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";


const TailwindConfig = resolveConfig(tailwindConfig);


const useBreakpointCheck = () => {
    const [isSmScreen, setSmScreenState] = useState<boolean | null>(null);

    useEffect(() => {
        const handleResize = () => {
            // @ts-expect-error min is not defined in tailwind.config.tsx
            setSmScreenState(parseFloat(TailwindConfig.theme.screens.md?.min ?? '') > window.innerWidth);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return isSmScreen;
}


export {useBreakpointCheck};
