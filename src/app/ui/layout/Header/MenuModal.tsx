import {FC, ReactElement, useEffect} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

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
    const userCtx = useUser();
    const modalCtx = useModal();

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!document.querySelector('#modal')?.contains(event.target as Node))
                modalCtx.closeModal();
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [modalCtx])


    const renderSubNav = (): ReactElement[] | undefined => subNavLinks?.map((link, idx, array) => {
        const isProfilePath = route?.includes(Route.Profile);

        const isActive = checkSubRoute(route, link, true);
        const isNextActive = checkSubRoute(route, array[idx + 1], true); // last+1 always undefined
        const routeName = getRouteName(mappedRoutes?.[link], idx === 0);

        return (
            <PageLink
                key={link + idx}
                href={link}
                icon={!isActive ? 'forward' : undefined}
                style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 1 : 1) * 0.6 : 2) + 'rem'}}
                className={cn(`relative`, `justify-center place-content-start`, `pr-[1.125rem]`, NAV_CN, {
                    [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                    ['border-b-small']: isNextActive,
                    ['[&]:border-t-0']: !idx,
                })}
            >
                {routeName ? <span>{routeName}</span> : null}
            </PageLink>
        );
    });

    // Elements
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
                    className={cn(`justify-center`, NAV_CN, {
                        [ACTIVE_ROUTE_CN]: isActive,
                        ['mx-[1.25rem]']: !isActive,
                        ['border-b-small']: !isNextActive
                    })}
                />
                {isActive ? renderSubNav() : null}
            </span>
        );
    });

    return (
        <BaseModal adaptSmScreen className={'ml-auto w-full    [&]:text-content-small     sm:landscape:max-w-[46dvw]'}>
            <ul className={`flex flex-col  gap-x-[--p-small]   cursor-pointer`}>
                {NavLinks}
            </ul>
            {/*TODO add language support*/}
            <div className={`lg:hidden md:hidden    flex items-center self-start    gap-x-[0.63rem] p-[1.25rem]`}>
                <Image src={SVG_GLOBE} alt={'globe'} className={'size-[1.125rem]'}/>
                <span>{userCtx.userData ? LANGUAGE[userCtx.userData.preferredLanguage] : '--'}</span>
            </div>
        </BaseModal>
    )
}

export {
    MenuModal
};