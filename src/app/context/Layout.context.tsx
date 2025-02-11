'use client';

import React, {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { usePathname } from 'next/navigation';

import { Breakpoint } from '@/app/hooks/useBreakpointCheck';
import { BLOG_ROUTES, LAYOUT, NavLink, Route } from '@/app/static';

import { checkSubRoute } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';
import { useUser } from '@/app/context/User.context';


type SetState<T> = Dispatch<SetStateAction<T>>

enum NavigationState { FREE, BLOCKED, TRY_NAVIGATE}

// Main links, sub links, sub sub links
type NavLinks = [Route[], Route[] | null, Route[] | null];


const getSubNavs = (route: Route | null, breakpoint: Breakpoint): [Route[], Route[] | null, Route[] | null] => {
    const isSm = breakpoint <= Breakpoint.sm;

    let navLinks: Route[] = LAYOUT.navLinks;
    let subNavLinks: Route[] | null = [];
    let sub2NavLinks: Route[] | null = [];

    // Much specific routes should be kept at the top (e.g. Route.MyDocumentation is mush specific than Route.Profile as it's nested under Route.Profile)
    switch (true) {
        case checkSubRoute(route, Route.MyDocumentation):
            subNavLinks = isSm ? [Route.MyDocumentation] : null;
            break;
        case checkSubRoute(route, Route.Profile):
            navLinks = LAYOUT.profileLinks;
            subNavLinks = isSm ? null : LAYOUT.profileLinks;
            break;
        case checkSubRoute(route, Route.Documentation):
            subNavLinks = [Route.MyDocumentation];
            sub2NavLinks = isSm
                ? [route as Route]
                : [
                    Route.BTMCDoc,
                    Route.GDoc,
                    Route.TernDoc,
                    Route.TernKeyDoc,
                    Route.TernKitDoc,
                ];
            break;
        case checkSubRoute(route, Route.AllWays):
            let routes = BLOG_ROUTES;
            if (breakpoint <= Breakpoint.sm)
                routes = [routes[0], routes[4], routes[2], routes[3]];
            sub2NavLinks = [
                Route.AllWays,
                ...routes,
            ];
            break;
        case checkSubRoute(route, Route.TernKey):
            sub2NavLinks = [
                Route.TernKey,
                Route.TernKeyPricing,
                Route.TernKeyProductManual,
            ];
            break;
        default:
            break;
    }
    return [navLinks, subNavLinks, sub2NavLinks];
};


interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
    navLinks: NavLinks;
    isBreadCrumbsNav: boolean;
    getSubNavs: (route: Route, breakpoint: Breakpoint) => [Route[], Route[] | null, Route[] | null];
    navigateState: [NavigationState, SetState<NavigationState>, Route | null, SetState<Route | null>];
}

const LayoutContext = createContext<ILayoutContext | null>(null);

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const isSm = breakpoint <= Breakpoint.sm;
    const userCtx = useUser();

    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);


    const [navigationState, setNavigationState] = useState<NavigationState>(NavigationState.FREE);
    const [blockedRoute, setBlockedRoute] = useState<Route | null>(null);
    const fullscreenRef = useRef<HTMLDivElement | null>(null);


    let navLinks: NavLinks = [[], null, null];
    const isBreadCrumbsNav: boolean = LAYOUT.breadcrumbsRoutes.some((subRoute) => checkSubRoute(route, subRoute));
    if (!isSm && isBreadCrumbsNav) {
        switch (true) {
            case checkSubRoute(route, Route.Documentation):
                navLinks[NavLink.Nav] = [
                    userCtx.isLoggedIn ? Route.MyTern : Route.Home,
                    userCtx.isLoggedIn ? Route.MyDocumentation : Route.Documentation,
                ];
                break;
            default:
                break;
        }
    }

    navLinks = getSubNavs(route as Route, breakpoint);


    useEffect(() => {
        if (sessionStorage.getItem('pip-mode-child') !== null)
            return handleNoLayoutState();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape')
                setNoLayoutState(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleNoLayoutState = () => setNoLayoutState(document.fullscreenElement === null);

    const toggleFullscreen = () => {
        handleNoLayoutState();
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            fullscreenRef.current?.requestFullscreen();
    };

    return (
        <LayoutContext.Provider
            value={{
                toggleFullscreen,
                isNoLayout,
                setFadeState,
                isFade,
                navLinks,
                isBreadCrumbsNav,
                getSubNavs,
                navigateState: [navigationState, setNavigationState, blockedRoute, setBlockedRoute],
            }}>
            <span ref={fullscreenRef}>
                {props.children}
            </span>
        </LayoutContext.Provider>
    );
};


const useLayout = (): ILayoutContext => {
    const context = useContext(LayoutContext);
    if (!context)
        throw new Error('useLayout must be used within a ModalProvider!');
    return context;
};


export type { NavLinks };
export { NavigationState, LayoutProvider, useLayout };
