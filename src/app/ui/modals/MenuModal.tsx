import {FC, ReactElement, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {NavLink} from "@/app/context/Layout.context";
import {LANGUAGE, MAPPED_SUB_NAV_ROUTES, Route} from "@/app/static";

import {checkSubRoute, getRouteName, getRouteRoot, sliceRoute} from "@/app/utils";
import {useMenu} from "@/app/hooks";
import {useLayout, useUser} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {PageLink} from "@/app/ui/layout";

import SVG_GLOBE from "@/assets/images/icons/globe.svg";


const NAV_CN = 'justify-between flex-row-reverse [&_span]:mr-auto py-[1.25rem] [&_path]:fill-[--bg-control-blue]';
const ACTIVE_ROUTE_CN = `border-small border-control-blue mx-0 px-[1.125rem] border-l-[0.2rem]`;

interface Props {
    isSingleSubLink?: boolean;
}

const MenuModal: FC<Props> = (props: Props) => {
    const {isSingleSubLink} = props;

    const route = usePathname();
    const userCtx = useUser();
    const {navLinks, getSubNavs} = useLayout();
    //eslint-disable-next-line
    const [_, closeMenu] = useMenu();

    const [isFirstActive, setFirstActiveState] = useState(false);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!document.querySelector('#modal')?.contains(event.target as Node))
                closeMenu();
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [closeMenu])


    const renderSub2Nav = (): ReactElement[] | undefined =>
        navLinks[NavLink.Sub2Nav]?.map((link, idx, array) => {
            const isProfilePath = route?.includes(Route.Profile);

            const isActive = checkSubRoute(route, link, true);
            const isNextActive = checkSubRoute(route, array[idx + 1], true); // last+1 always undefined

            const routeName = getRouteName(MAPPED_SUB_NAV_ROUTES?.[link], link === Route.TernKey);

            return (
                <span key={link + idx} className={'contents'}>
                    <PageLink
                        href={link}
                        icon={!isActive ? 'forward' : undefined}
                        style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 2 : 2) * 0.6 : 2.6) + 'rem'}}
                        className={cn(`relative`, `justify-center place-content-start`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                            ['border-b-small']: !isNextActive,
                            ['[&]:border-t-0']: !idx,
                        })}
                    >
                        {routeName ? <span>{routeName}</span> : null}
                    </PageLink>
                </span>
            );
        });

    const renderSubNav = (): ReactElement[] | undefined =>
        navLinks[NavLink.SubNav]?.map((link, idx, array) => {
            const isProfilePath = route?.includes(Route.Profile);

            const subNavRoute = isSingleSubLink ? route : link;

            const isActive = checkSubRoute(route, link, isSingleSubLink || !idx);
            const isNextActive = checkSubRoute(route, array[idx + 1], isSingleSubLink || idx !== 0); // last+1 always undefined

            const subNav = getSubNavs(subNavRoute as Route)[1];

            const hasSubRoutes = subNav !== null && subNav?.length > 0;
            const renderSubRoutes = hasSubRoutes
                && route && link.length <= route.length
                && (checkSubRoute(route, link) || isSingleSubLink)
                && !subNavRoute?.split(subNav?.[0] ?? '').filter(link => link).length;

            const routeName = getRouteName(
                isActive && !renderSubRoutes || !isActive && checkSubRoute(route, link) && !renderSubRoutes ? MAPPED_SUB_NAV_ROUTES?.[link] : link,
                link === Route.TernKey
            );

            return (
                <span key={link + idx} className={'contents'}>
                    <PageLink
                        href={link}
                        preventModalClose={hasSubRoutes}
                        icon={!isActive ? 'forward' : undefined}
                        style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 1 : 1) * 0.6 : 1.6) + 'rem'}}
                        className={cn(`relative`, `justify-center place-content-start`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                            ['border-b-small']: !isNextActive,
                            ['[&]:border-t-0']: !idx,
                        })}
                    >
                        {routeName ? <span>{routeName}</span> : null}
                    </PageLink>
                    {renderSubRoutes && hasSubRoutes ? renderSub2Nav() : null}
                </span>
            );
        });

    // Elements
    const NavLinks: ReactElement[] = navLinks[NavLink.Nav].map((link: Route, idx, array) => {
        const isProfilePath = route?.includes(Route.Profile);

        let routes: (string | null)[] = [route, link, array[idx + 1]];
        if (isProfilePath) {
            routes = routes.map((route) => sliceRoute(route, 1));
            if (routes?.length === Route.Profile.length)
                routes[0] = route;
        }

        const [subNav] = getSubNavs(link as Route);
        const hasSubRoutes = subNav !== null && subNav.length > 0;
        const isActive = getRouteRoot(routes[0]) === routes[1];
        const isNextActive = getRouteRoot(routes[0]) === routes[2]; // last+1 always undefined

        if (isActive) {
            if (!idx && !isFirstActive)
                setFirstActiveState(true);
            else if (idx && isFirstActive)
                setFirstActiveState(false);
        }

        return (
            <span key={link + idx} className={'contents'}>
                <PageLink
                    href={link}
                    preventModalClose={hasSubRoutes}
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
        <BaseModal adaptSmScreen smScreenOnly
                   className={cn(
                       `ml-auto w-full sm:landscape:x-[max-w-[46dvw],text-content-small]`,
                       {['[&_hr]:hidden']: isFirstActive}
                   )}
                   classNameContent={'h-[calc(100dvh-var(--h-modal-header))] overflow-y-scroll'}
        >
            <ul className={`flex flex-col  gap-x-[--s-default]`}>
                {NavLinks}
            </ul>
            {/*TODO add language support*/}
            <div className={`lg:hidden md:hidden    flex items-center self-start    gap-x-[0.63rem] p-[1.25rem]`}>
                <Image src={SVG_GLOBE} alt={'globe'} className={'w-[1.125rem] h-auto'}/>
                <span>{userCtx.userData ? LANGUAGE[userCtx.userData.preferredLanguage] : '--'}</span>
            </div>
        </BaseModal>
    )
}

export {
    MenuModal
};