import {useEffect} from "react";

import {useModal, useUser} from "@/app/context";

import {AuthModal} from "@/app/ui/modals";


const useLoginCheck = () => {
    const userCtx = useUser();
    const modalCtx = useModal();

    useEffect(() => {
        if (!userCtx.isLoggedIn)
            modalCtx.openModal(<AuthModal isLoginAction/>, {hideContent: true});
        return () => {
            modalCtx.closeModal();
        }
    }, [userCtx.isLoggedIn, modalCtx.isOpened])


    return userCtx.isLoggedIn;
}


export {useLoginCheck};