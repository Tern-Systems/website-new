import {FC, ReactElement, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import cn from "classnames";

import {Breakpoint} from "@/app/hooks/useBreakpointCheck";
import {ALWAYS_MAPPED_ROUTES, LANGUAGE, MAPPED_SUB_NAV_ROUTES, NavLink, Route, SPECIAL_NAV_ROUTES} from "@/app/static";

import {checkSubRoute, getRouteLeave, getRouteName, getRouteRoot, sliceRoute} from "@/app/utils";
import {useLayout, useModal, useUser} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {PageLink} from "@/app/ui/layout";

import SVG_GLOBE from "/public/images/icons/globe.svg";


const NAV_CN = 'justify-between flex-row-reverse [&_span]:mr-auto py-[1.25rem] [&_path]:fill-[--bg-blue]';
const ACTIVE_ROUTE_CN = `border-s border-blue mx-0 px-[1.125rem] border-l-[0.2rem]`;


interface Props {
    singleSubLink?: boolean;
}

const MenuModal: FC<Props> = (props: Props) => {
    const {singleSubLink} = props;

    const route = usePathname();
    const userCtx = useUser();
    const {navLinks, getSubNavs} = useLayout();
    //eslint-disable-next-line
    const modalCtx = useModal();

    const [isFirstActive, setFirstActiveState] = useState(false);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!document.querySelector('#modal')?.contains(event.target as Node))
                modalCtx.closeModal();
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
        // eslint-disable-next-line
    }, [])


    const renderSub2Nav = (): ReactElement[] | undefined =>
        navLinks[NavLink.Sub2Nav]?.map((link, idx, array) => {
            const isProfilePath = route?.includes(Route.Profile);

            const isActive = checkSubRoute(route, link, true);
            const isNextActive = checkSubRoute(route, array[idx + 1], true); // last+1 always undefined

            const routeName = getRouteName(MAPPED_SUB_NAV_ROUTES?.[link] ?? link);

            return (
                <span key={link + idx} className={'contents'}>
                    <PageLink
                        href={link}
                        timeout={0}
                        icon={!isActive ? 'forward' : undefined}
                        style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 2 : 2) * 0.6 : 2.6) + 'rem'}}
                        className={cn(`relative`, `justify-center place-content-start`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                            ['border-b-s']: !isNextActive,
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

            const subNavRoute = singleSubLink ? route : link;

            const isActive = checkSubRoute(route, link, singleSubLink || !idx);
            const isNextActive = checkSubRoute(route, array[idx + 1], singleSubLink); // last+1 always undefined

            const subNav = getSubNavs(subNavRoute as Route, Breakpoint.xs)[NavLink.Sub2Nav];

            const hasSubRoutes = subNav !== null && subNav?.length > 0;
            const renderSubRoutes = hasSubRoutes
                && route && link.length <= route.length
                && (checkSubRoute(route, link) || singleSubLink)
                && !subNavRoute?.split(subNav?.[0] ?? '').filter(link => link).length;

            const mappedLink = MAPPED_SUB_NAV_ROUTES?.[link];
            const mapRoute = mappedLink && ALWAYS_MAPPED_ROUTES.some(check => (
                    getRouteLeave(link).includes(check))
                || isActive && !renderSubRoutes
                || !isActive && checkSubRoute(route, link) && !renderSubRoutes
            );

            const routeName = getRouteName(SPECIAL_NAV_ROUTES?.[link] ?? (mapRoute ? mappedLink : link));

            return (
                <span key={link + idx} className={'contents'}>
                    <PageLink
                        href={link}
                        timeout={0}
                        icon={!isActive ? 'forward' : undefined}
                        style={{marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 1 : 1) * 0.6 : 1.6) + 'rem'}}
                        className={cn(`relative`, `justify-center place-content-start`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                            ['border-b-s']: !isNextActive,
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

        const mappedLink = MAPPED_SUB_NAV_ROUTES?.[link];

        const isActive = route !== Route.Home && checkSubRoute(routes[1], getRouteRoot(routes[0]));
        const isNextActive = route !== Route.Home && checkSubRoute(routes[2], getRouteRoot(routes[0]));

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
                    timeout={0}
                    icon={!isActive ? 'forward' : undefined}
                    className={cn(`justify-center`, NAV_CN, {
                        [ACTIVE_ROUTE_CN]: isActive,
                        ['mx-[1.25rem]']: !isActive,
                        ['border-b-s']: !isNextActive
                    })}
                >
                    <span>
                          {mappedLink ? mappedLink : getRouteName(SPECIAL_NAV_ROUTES?.[link] ?? link)}
                    </span>
                </PageLink>
                {isActive ? renderSubNav() : null}
            </span>
        );
    });

    return (
        <BaseModal adaptSmScreen smScreenOnly
                   className={cn(
                       `ml-auto w-full sm:landscape:x-[!max-w-[46dvw],!w-[46dvw],text-section-s]`,
                       {['[&_hr]:hidden']: isFirstActive}
                   )}
                   classNameContent={'h-[calc(100dvh-var(--h-heading-modal))] overflow-y-scroll'}
        >
            <ul className={`flex flex-col  gap-x-l`}>
                {NavLinks}
            </ul>
            {/*TODO add language support*/}
            <div className={`lg:hidden md:hidden    flex items-center self-start    gap-x-[0.63rem] p-[1.25rem]`}>
                <Image src={SVG_GLOBE} alt={'globe'} className={'w-[1.125rem] h-auto'}/>
                <span>{userCtx.userData ? LANGUAGE[userCtx.userData.language] : '--'}</span>
            </div>
        </BaseModal>
    )
}

export {MenuModal};
