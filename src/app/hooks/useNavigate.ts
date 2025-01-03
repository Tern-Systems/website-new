import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {LAYOUT, Route} from "@/app/static";

import {useLayout, useModal} from "@/app/context";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const pageRoute = usePathname();
    const router = useRouter();
    const layoutCtx = useLayout();
    const modalCtx = useModal();

    useEffect(() => {
        layoutCtx.setFadeState(false);
        //eslint-disable-next-line
    }, [pageRoute]);

    const navigate = async (route: Route) => {
        if (pageRoute === route)
            return;
        layoutCtx.setFadeState(true);
        history.pushState(null, '', window.location.href);
        setTimeout(() => {
            router.push(route);
            modalCtx.closeModal();
        }, LAYOUT.fadeDuration);
    };

    return [navigate, router];
}

export {useNavigate}
