import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const navigate = <T extends string>(section: T, router: AppRouterInstance | undefined) => {
    history.pushState({}, '', window.location.href);
    if (router)
        router.replace(`/?section=${section}`);
};

export {navigate}