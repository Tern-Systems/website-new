import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {FADE_DURATION, Route} from "@/app/static";

import {useLayout} from "@/app/context";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const route = usePathname();
    const router = useRouter();
    const layoutCtx = useLayout();

    const [currentRoute, setCurrentRoute] = useState<string | null>(null);

    useEffect(() => {
        setCurrentRoute(route);
    }, []);

    useEffect(() => {
        layoutCtx.setFadeState(false);
    }, [route]);

    useEffect(() => {
        setTimeout(() => {
            if (currentRoute === route)
                layoutCtx.setFadeState(false);
        }, 5 * FADE_DURATION);
    }, [layoutCtx.isFade]);

    const navigate = async (route: Route) => {
        layoutCtx.setFadeState(true);
        history.pushState(null, '', window.location.href);
        setTimeout(() => {
            router.replace(route);
        }, FADE_DURATION);
    };

    return [navigate, router];
}

export {useNavigate}
