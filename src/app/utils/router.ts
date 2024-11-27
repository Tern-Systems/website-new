import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const navigate = <T extends string, P extends string>(section: T, router: AppRouterInstance | undefined, params?: Record<P, string>) => {
    history.pushState({}, '', window.location.href);

    let href = `/?section=${section}`;
    if (params)
        href = href + '&' + new URLSearchParams(params).toString();
    if (router)
        router.replace(href);
};

export {navigate}