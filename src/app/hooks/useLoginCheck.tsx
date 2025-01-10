import {useEffect} from "react";
import {usePathname} from "next/navigation";

import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks/useNavigate";
import {useLayout, useModal, useUser} from "@/app/context";

import {AuthModal} from "@/app/ui/modals";


const useLoginCheck = () => {
    const route = usePathname();
    const userCtx = useUser();
    const modalCtx = useModal();
    const layoutCtx = useLayout();
    const [navigate] = useNavigate();


    useEffect(() => {
        console.log(userCtx.isLoggedIn)
        if (!userCtx.isLoggedIn && route !== Route.Home && !layoutCtx.isFade) {
            modalCtx.openModal(
                <AuthModal isLoginAction onClose={() => navigate(Route.Home)} preventClose={route !== Route.Home}/>,
                {hideContent: true}
            );
        } else if (userCtx.isLoggedIn || route === Route.Home)
            modalCtx.closeModal();
        //eslint-disable-next-line
    }, [userCtx.isLoggedIn, modalCtx.isOpened, route])


    return userCtx.isLoggedIn;
}


export {useLoginCheck};