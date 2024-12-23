import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {LAYOUT, Route} from "@/app/static";

import {useLayout} from "@/app/context";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const pageRoute = usePathname();
    const router = useRouter();
    const layoutCtx = useLayout();

    const [currentRoute, setCurrentRoute] = useState<string | null>(null);

    useEffect(() => {
        setCurrentRoute(pageRoute);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        setTimeout(() => {
            layoutCtx.setFadeState(false);
        }, 1.5 * LAYOUT.fadeDuration);
        //eslint-disable-next-line
    }, [pageRoute]);

    useEffect(() => {
        if (!layoutCtx.isFade)
            return;

        setTimeout(() => {
            if (currentRoute === pageRoute)
                layoutCtx.setFadeState(false);
        }, 5 * LAYOUT.fadeDuration);
        //eslint-disable-next-line
    }, [layoutCtx.isFade]);

    const navigate = async (route: Route) => {
        if (pageRoute === route)
            return;
        layoutCtx.setFadeState(true);
        history.pushState(null, '', window.location.href);
        setTimeout(() => {
            router.push(route);
        }, 1.5 * LAYOUT.fadeDuration);
    };

    return [navigate, router];
}

export {useNavigate}
