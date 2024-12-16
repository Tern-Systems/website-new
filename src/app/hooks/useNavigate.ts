import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {FADE_DURATION, Route} from "@/app/static";

import {useModal} from "@/app/context";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const route = usePathname();
    const router = useRouter();
    const modalCtx = useModal();

    const [currentRoute, setCurrentRoute] = useState<string | null>(null);

    useEffect(() => {
        setCurrentRoute(route);
    }, []);

    useEffect(() => {
        modalCtx.setFadeState(false);
    }, [route]);

    useEffect(() => {
        setTimeout(() => {
            if (currentRoute === route)
                modalCtx.setFadeState(false);
        }, 5 * FADE_DURATION);
    }, [modalCtx.isFade]);

    const navigate = async (route: Route) => {
        modalCtx.setFadeState(true);
        history.pushState(null, '', window.location.href);
        setTimeout(() => {
            router.replace(route);
        }, FADE_DURATION);
    };

    return [navigate, router];
}

export {useNavigate}
