import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const handleLinkClick = <T extends string>(section: T, router: AppRouterInstance) => {
    history.pushState({}, '', window.location.href);
    router.replace(`/?section=${section}`);
};

export {handleLinkClick}