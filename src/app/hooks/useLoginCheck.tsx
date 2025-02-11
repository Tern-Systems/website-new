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
        if (userCtx.isLoggedIn === false && route !== Route.Home && !layoutCtx.isFade) {
            modalCtx.openModal(
                <AuthModal onClose={() => navigate(Route.Home)}/>,
                {hideContent: true}
            );
        }
        //eslint-disable-next-line
    }, [userCtx.isLoggedIn, modalCtx.isOpened, layoutCtx.isFade, route])


    return userCtx.isLoggedIn;
}


export {useLoginCheck};