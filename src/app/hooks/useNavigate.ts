import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

type Navigate = <T extends string, P extends string>(section: T, params?: Record<P, string>) => void;

const useNavigate = (): [Navigate, AppRouterInstance] => {
    const router = useRouter();

    const navigate: Navigate = <T extends string, P extends string>(section: T, params?: Record<P, string>) => {
        history.pushState({}, '', window.location.href);

        let href = `/?section=${section}`;
        if (params)
            href = href + '&' + new URLSearchParams(params).toString();
        router.replace(href);
    };

    return [navigate, router];
}

export {useNavigate}