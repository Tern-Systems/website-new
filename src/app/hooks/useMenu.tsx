import {Breakpoint} from "@/app/hooks/useBreakpointCheck";

import {useBreakpointCheck} from "./useBreakpointCheck";
import {useModal} from "@/app/context";

import {MenuModal} from "@/app/ui/modals";


const useMenu = (isSingleSubLink?: boolean): [() => void, () => void] => {
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck() <= Breakpoint.sm;

    const openMenu = () => {
        if (isSmScreen)
            modalCtx.openModal(<MenuModal singleSubLink={isSingleSubLink}/>, {doFading: false});
    }

    const closeMenu = () => modalCtx.closeModal();

    return [openMenu, closeMenu];
}


export {useMenu};
