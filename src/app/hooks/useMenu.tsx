import {Route} from "@/app/static";

import {useBreakpointCheck} from "./useBreakpointCheck";
import {useModal} from "@/app/context";

import {MenuModal} from "@/app/ui/modals";


const useMenu = (subNavList?: Route[]): [() => void, () => void] => {
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    const openMenu = () => {
        if (isSmScreen)
            modalCtx.openModal(<MenuModal subNavLinks={subNavList}/>, {doFading: false});
    }

    const closeMenu = () => {
        if (isSmScreen)
            modalCtx.closeModal();
    }

    return [openMenu, closeMenu];
}


export {useMenu};
