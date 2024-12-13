import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

import {FADE_DURATION, Route} from "@/app/static";
import {useModal} from "@/app/context";


const useNavigate = (): [(route: Route) => Promise<void>, AppRouterInstance] => {
    const router = useRouter();
    const modalCtx = useModal();

    const navigate = async (route: Route) => {
        modalCtx.setFadeState(true);
        setTimeout(() => {
            history.pushState({}, '', window.location.href);
            router.push(route);
            modalCtx.setFadeState(false);
        }, FADE_DURATION);
    };

    return [navigate, router];
}

export {useNavigate}
