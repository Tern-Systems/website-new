import {useEffect, useState} from "react";

import {Route} from "@/app/static";

import {useBreakpointCheck} from "./useBreakpointCheck";
import {useModal} from "@/app/context";

import {MenuModal} from "@/app/ui/modals";


const useMenu = (subNavList?: Route[]): () => void => {
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    const [isMenuOpened, setMenuOpenState] = useState(false);


    useEffect(() => {
        if (!isSmScreen)
            modalCtx.closeModal();
        // eslint-disable-next-line
    }, [isSmScreen]);


    return () => {
        if (isSmScreen)
            setMenuOpenState(prevState => !prevState);
        if (isMenuOpened)
            modalCtx.closeModal();
        else
            modalCtx.openModal(<MenuModal subNavLinks={subNavList}/>, {doFading: false});
    }
}


export {useMenu};
