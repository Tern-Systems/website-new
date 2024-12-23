import {FC, ReactElement} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";

import {LANGUAGE, Route} from "@/app/static";

import {checkSubRoute, getRouteName, getRouteRoot, sliceRoute} from "@/app/utils";
import {useModal, useUser} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {PageLink} from "@/app/ui/layout";

import SVG_GLOBE from "@/assets/images/icons/globe.svg";


const NAV_CN = 'justify-between flex-row-reverse [&_span]:mr-auto py-[1.25rem] [&_path]:fill-[--bg-control-blue]';
const ACTIVE_ROUTE_CN = `border-small border-control-blue mx-0 px-[1.125rem] border-l-[0.2rem]`;


interface Props {
    navLinks: Route[];
    subNavLinks: Route[] | null;
    mappedRoutes?: Record<string, string>;
}

const MenuModal: FC<Props> = (props: Props) => {
    const {subNavLinks, navLinks, mappedRoutes} = props;

    const route = usePathname();
    const modalCtx = useModal();
    const userCtx = useUser();


    const renderSubNav = (): ReactElement[] | undefined => subNavLinks?.map((link, idx, array) => {
        const isProfilePath = route?.includes(Route.Profile);

        const isActive = checkSubRoute(route, link, true);
        const isNextActive = getRouteRoot(route) === array[idx + 1]; // last+1 always undefined
        const routeName = getRouteName(mappedRoutes?.[link], idx === 0);

        return (
            <PageLink
                key={link + idx}
                href={link}
                icon={!isActive ? 'forward' : undefined}
                onClick={() => modalCtx.closeModal()}
                style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 1 : 1) * 0.6 : 2) + 'rem'}}
                className={`relative justify-center ${idx === 0 ? '[&]:border-t-0' : ''} ${isActive || isProfilePath ? ACTIVE_ROUTE_CN : ''}
                                 place-content-start pr-[1.125rem] ${NAV_CN} ${isNextActive ? '' : 'border-b-small'}`}
            >
                {routeName ? <span>{routeName}</span> : null}
            </PageLink>
        );
    });

    const NavLinks: ReactElement[] = navLinks.map((link: Route, idx, array) => {
        const isProfilePath = route?.includes(Route.Profile);

        let routes: (string | null)[] = [route, link, array[idx + 1]];
        if (isProfilePath) {
            routes = routes.map((route) => sliceRoute(route, 1));
            if (routes?.length === Route.Profile.length)
                routes[0] = route;
        }

        const isActive = getRouteRoot(routes[0]) === routes[1];
        const isNextActive = getRouteRoot(routes[0]) === routes[2]; // last+1 always undefined

        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    icon={!isActive ? 'forward' : undefined}
                    onClick={() => modalCtx.closeModal()}
                    className={`justify-center ${isActive ? ACTIVE_ROUTE_CN : 'mx-[1.25rem]'}
                                ${NAV_CN} ${isNextActive ? '' : 'border-b-small'}`}
                />
                {isActive ? renderSubNav() : null}
            </span>
        );
    });

    return (
        <BaseModal adaptSmScreen>
            <ul className={`flex cursor-pointer gap-x-[--p-small] flex-col w-full`}>
                {NavLinks}
            </ul>
            {/*TODO add language support*/}
            <div className={`lg:hidden md:hidden flex gap-x-[0.63rem] items-center self-start p-[1.25rem]`}>
                <Image src={SVG_GLOBE} alt={'globe'} className={'size-[1.125rem]'}/>
                <span>{userCtx.userData ? LANGUAGE[userCtx.userData.preferredLanguage] : '--'}</span>
            </div>
        </BaseModal>
    )
}

export {
    MenuModal
};