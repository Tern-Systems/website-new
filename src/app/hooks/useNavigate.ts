import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {FADE_DURATION, Route} from "@/app/static";
import {useModal} from "@/app/context";
import {useEffect} from "react";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const route = usePathname();
    const router = useRouter();
    const modalCtx = useModal();

    useEffect(() => {
        modalCtx.setFadeState(false);
    }, [route]);

    const navigate = async (route: Route) => {
        modalCtx.setFadeState(true);
        setTimeout(() => {
            router.replace(route);
        }, FADE_DURATION);
    };

    return [navigate, router];
}

export {useNavigate}
