import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { ALWAYS_MAPPED_ROUTES, MAPPED_SUB_NAV_ROUTES, NavLink, Route, SPECIAL_NAV_ROUTES } from '@/app/static';

import { checkSubRoute, getRouteLeave, getIdName, getRouteRoot, sliceRoute } from '@/app/utils';
import { useLayout } from '@/app/context';
import { PageLink } from '@/app/ui/layout';
import { BaseModal } from '@/app/ui/modals';

const NAV_CN = 'justify-between flex-row-reverse [&_span]:mr-auto py-[1.25rem] [&_path]:fill-[--bg-blue]';
const ACTIVE_ROUTE_CN = `border-s border-blue mx-0 px-[1.125rem] border-l-[0.2rem]`;

interface Props {
    singleSubLink?: boolean;
    openedState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Menu: FC<Props> = (props: Props) => {
    const { singleSubLink, openedState } = props;

    const [opened, setOpened] = openedState;

    const route = usePathname();
    const { navLinks, getSubNavs } = useLayout();
    //eslint-disable-next-line

    const [isFirstActive, setFirstActiveState] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (opened && !ref.current?.contains(event.target as Node)) setOpened(false);
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [setOpened, opened]);

    const renderSub2Nav = (): ReactElement[] | undefined =>
        navLinks[NavLink.Sub2Nav]?.map((link, idx) => {
            const isProfilePath = route?.includes(Route.Profile);

            const isActive = checkSubRoute(route, link, true);

            const routeName = getIdName(MAPPED_SUB_NAV_ROUTES?.[link] ?? link);

            return (
                <span
                    key={link + idx}
                    className={'contents'}
                >
                    <PageLink
                        href={link}
                        timeout={0}
                        icon={!isActive ? 'forward' : undefined}
                        style={{
                            marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 2 : 2) * 0.6 : 2.6) + 'rem',
                        }}
                        className={cn(`relative`, `place-content-start justify-center`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
                        })}
                    >
                        {routeName ? <span>{routeName}</span> : null}
                    </PageLink>
                </span>
            );
        });

    const renderSubNav = (): ReactElement[] | undefined =>
        navLinks[NavLink.SubNav]?.map((link, idx) => {
            const isProfilePath = route?.includes(Route.Profile);

            const subNavRoute = singleSubLink ? route : link;

            const isActive = checkSubRoute(route, link, singleSubLink || !idx);

            const subNav = getSubNavs(subNavRoute as Route, Breakpoint.xs)[NavLink.Sub2Nav];

            const hasSubRoutes = subNav !== null && subNav?.length > 0;
            const renderSubRoutes =
                hasSubRoutes &&
                route &&
                link.length <= route.length &&
                (checkSubRoute(route, link) || singleSubLink) &&
                !subNavRoute?.split(subNav?.[0] ?? '').filter((link) => link).length;

            const mappedLink = MAPPED_SUB_NAV_ROUTES?.[link];
            const mapRoute =
                mappedLink &&
                ALWAYS_MAPPED_ROUTES.some(
                    (check) =>
                        getRouteLeave(link).includes(check) ||
                        (isActive && !renderSubRoutes) ||
                        (!isActive && checkSubRoute(route, link) && !renderSubRoutes),
                );

            const routeName = getIdName(SPECIAL_NAV_ROUTES?.[link] ?? (mapRoute ? mappedLink : link));

            return (
                <span
                    key={link + idx}
                    className={'contents'}
                >
                    <PageLink
                        href={link}
                        timeout={0}
                        icon={!isActive ? 'forward' : undefined}
                        style={{
                            marginLeft: (isActive || isProfilePath ? (isProfilePath ? idx + 1 : 1) * 0.6 : 1.6) + 'rem',
                        }}
                        className={cn(`relative`, `place-content-start justify-center`, `pr-[1.125rem]`, NAV_CN, {
                            [ACTIVE_ROUTE_CN]: isActive || isProfilePath,
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
            if (routes?.length === Route.Profile.length) routes[0] = route;
        }

        const mappedLink = MAPPED_SUB_NAV_ROUTES?.[link];

        const isActive = route !== Route.Home && checkSubRoute(routes[1], getRouteRoot(routes[0]));
        const isNextActive = route !== Route.Home && checkSubRoute(routes[2], getRouteRoot(routes[0]));

        if (isActive) {
            if (!idx && !isFirstActive) setFirstActiveState(true);
            else if (idx && isFirstActive) setFirstActiveState(false);
        }

        return (
            <span
                key={link + idx}
                className={'contents'}
            >
                <PageLink
                    href={link}
                    timeout={0}
                    className={cn(`justify-center`, NAV_CN, isActive ? ACTIVE_ROUTE_CN : 'px-xs', {
                        ['border-b-s']: !isNextActive,
                    })}
                >
                    <span>{mappedLink ? mappedLink : getIdName(SPECIAL_NAV_ROUTES?.[link] ?? link)}</span>
                </PageLink>
                {isActive ? renderSubNav() : null}
            </span>
        );
    });

    return (
        <BaseModal
            adaptBreakpoint={Breakpoint.sm}
            adaptedDefault
            className={cn(`ml-auto w-full sm:landscape:x-[!max-w-[46dvw],!w-[46dvw],text-section-s]`, {
                ['[&_hr]:hidden']: isFirstActive,
            })}
            classNameContent={'h-[calc(100dvh-var(--h-heading-modal))] overflow-y-scroll'}
        >
            <ul>{NavLinks}</ul>
        </BaseModal>
    );
};

export { Menu };
