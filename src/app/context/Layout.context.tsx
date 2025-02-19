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
import { LAYOUT, NavLink, Route } from '@/app/static';

import { checkSubRoute, getRouteLeave } from '@/app/utils';
import { useBreakpointCheck } from '@/app/hooks';
import { useUser } from '@/app/context/User.context';

type SetState<T> = Dispatch<SetStateAction<T>>;

enum NavigationState {
    FREE,
    BLOCKED,
    TRY_NAVIGATE,
}

// Main links, sub links, sub sub links
type NavLinks = [Route[], Route[] | null, Route[] | null];

const getSubNavs = (route: Route | null, breakpoint: Breakpoint): [Route[], Route[] | null, Route[] | null] => {
    const isSm = breakpoint <= Breakpoint.sm;

    let navLinks: Route[] = LAYOUT.navLinks;
    let breadCrumbLinks: Route[] | null = [];
    let subNavLinks: Route[] | null = [];

    if (route !== Route.Home) {
        // Much specific routes should be kept at the top (e.g. Route.MyDocumentation is mush specific than Route.Profile as it's nested under Route.Profile)
        switch (true) {
            case checkSubRoute(route, Route.MyDocumentation, true):
                navLinks = [Route.Billing, Route.MyDocumentation, Route.Resources, Route.Training];
                breadCrumbLinks = isSm ? [Route.MyDocumentation] : null;
                break;
            case checkSubRoute(route, Route.Profile):
                navLinks = LAYOUT.profileLinks;
                breadCrumbLinks = isSm ? null : LAYOUT.profileLinks;
                break;
            case checkSubRoute(route, Route.Documentation):
                breadCrumbLinks = [Route.MyDocumentation];
                subNavLinks = isSm
                    ? [route as Route]
                    : [Route.BTMCDoc, Route.GDoc, Route.TernDoc, Route.TernKeyDoc, Route.TernKitDoc];
                break;
            case checkSubRoute(route, Route.AllWays):
                let routes = LAYOUT.blogLinks;
                if (breakpoint <= Breakpoint.sm) routes = [routes[0], routes[4], routes[2], routes[3]];
                subNavLinks = [Route.AllWays, ...routes];
                break;
            case checkSubRoute(route, Route.TernKey):
                subNavLinks = [Route.TernKey, Route.TernKeyPricing, Route.TernKeyProductManual];
                break;
            default:
                break;
        }
    }
    return [navLinks, breadCrumbLinks, subNavLinks];
};

interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
    navLinks: NavLinks;
    getSubNavs: (route: Route, breakpoint: Breakpoint) => [Route[], Route[] | null, Route[] | null];
    navigateState: [NavigationState, SetState<NavigationState>, Route | null, SetState<Route | null>];
}

const LayoutContext = createContext<ILayoutContext | null>(null);

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const userCtx = useUser();

    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);

    const [navigationState, setNavigationState] = useState<NavigationState>(NavigationState.FREE);
    const [blockedRoute, setBlockedRoute] = useState<Route | null>(null);
    const fullscreenRef = useRef<HTMLDivElement | null>(null);

    const navLinks: NavLinks = getSubNavs(route as Route, breakpoint);
    switch (true) {
        case checkSubRoute(route, Route.Documentation):
            navLinks[NavLink.Breadcrumbs] = [
                userCtx.isLoggedIn ? Route.MyTern : Route.Home,
                userCtx.isLoggedIn ? Route.MyDocumentation : Route.Documentation,
                getRouteLeave(route) as Route,
            ];
            break;
        case checkSubRoute(route, Route.Credo):
            navLinks[NavLink.Breadcrumbs] = [Route.About, Route.Credo];
            break;
        case checkSubRoute(route, Route.ManageSubscriptions):
            navLinks[NavLink.Breadcrumbs] = [Route.Billing, Route.ManageSubscriptions];
            break;
        default:
            break;
    }

    useEffect(() => {
        if (sessionStorage.getItem('pip-mode-child') !== null) return handleNoLayoutState();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setNoLayoutState(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleNoLayoutState = () => setNoLayoutState(document.fullscreenElement === null);

    const toggleFullscreen = () => {
        handleNoLayoutState();
        if (document.fullscreenElement) document.exitFullscreen();
        else fullscreenRef.current?.requestFullscreen();
    };

    return (
        <LayoutContext.Provider
            value={{
                toggleFullscreen,
                isNoLayout,
                setFadeState,
                isFade,
                navLinks,
                getSubNavs,
                navigateState: [navigationState, setNavigationState, blockedRoute, setBlockedRoute],
            }}
        >
            <span ref={fullscreenRef}>{props.children}</span>
        </LayoutContext.Provider>
    );
};

const useLayout = (): ILayoutContext => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error('useLayout must be used within a ModalProvider!');
    return context;
};

export type { NavLinks };
export { NavigationState, LayoutProvider, useLayout };
