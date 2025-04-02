'use client';

import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Breakpoint } from '@/app/static';
import { LAYOUT, NavLink, Route } from '@/app/static';

import { LayoutContext, NavigationState, NavLinks, ScrollState } from '@/app/contexts/layout.context';

import { checkSubRoute, getRouteLeave } from '@/app/utils';
import { useBreakpointCheck, useUser } from '@/app/hooks';

const getSubNavs = (route: Route | null, breakpoint: Breakpoint): [Route[], Route[] | null, Route[] | null] => {
    const sm = breakpoint <= Breakpoint.sm;

    let navLinks: Route[] = LAYOUT.navLinks;
    let breadCrumbLinks: Route[] | null = [];
    let subNavLinks: Route[] | null = [];

    if (route !== Route.Home) {
        // Much specific routes should be kept at the top (e.g. Route.MyDocumentation is mush specific than Route.Profile as it's nested under Route.Profile)
        switch (true) {
            case checkSubRoute(route, Route.MyDocumentation, true):
                navLinks = [Route.Billing, Route.MyDocumentation, Route.Resources, Route.Training];
                breadCrumbLinks = sm ? [Route.MyDocumentation] : null;
                break;
            case checkSubRoute(route, Route.Profile):
                navLinks = LAYOUT.profileLinks;
                breadCrumbLinks = sm ? null : LAYOUT.profileLinks;
                break;
            case checkSubRoute(route, Route.Documentation):
                breadCrumbLinks = [Route.MyDocumentation];
                subNavLinks = sm
                    ? [route as Route]
                    : [Route.BTMCDoc, Route.GDoc, Route.TernDoc, Route.TidalDoc, Route.TernKitDoc];
                break;
            case checkSubRoute(route, Route.Training):
                navLinks = [Route.Billing, Route.Documentation, Route.Resources, Route.Training];
                subNavLinks = [
                    Route.Training,
                    Route.Courses,
                    Route.ProfessionalCertifications,
                    Route.Subscriptions,
                    Route.TrainingFAQs,
                ];
                breadCrumbLinks = [Route.Training];
                break;
            case checkSubRoute(route, Route.AllWays):
                let routes = [Route.AllWays, ...LAYOUT.blogLinks];
                if (breakpoint <= Breakpoint.sm) routes = routes.slice(0, -2);
                else if (breakpoint <= Breakpoint.xxs) subNavLinks = [];
                subNavLinks = routes;
                break;
            case checkSubRoute(route, Route.Tidal):
                subNavLinks = [Route.Tidal, Route.TidalPlans, Route.TidalProductManual, Route.TidalCyrus];
                break;
            default:
                break;
        }
    }
    return [navLinks, breadCrumbLinks, subNavLinks];
};

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const route = usePathname();
    const breakpoint = useBreakpointCheck();
    const userCtx = useUser();

    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);
    const scrollState = useState<ScrollState>({
        scrollTop: 0,
        scrollHeight: 0,
        autoScroll: false,
    });

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
        case checkSubRoute(route, Route.TrainingFAQs):
            navLinks[NavLink.Breadcrumbs] = [Route.Training, Route.TrainingFAQs];
            break;
        case checkSubRoute(route, Route.EditPaymentMethod):
            navLinks[NavLink.Breadcrumbs] = [
                Route.Profile,
                Route.Billing,
                Route.PurchasingInformation,
                Route.EditPaymentMethod,
            ];
            break;
        case checkSubRoute(route, Route.AddPaymentMethod):
            navLinks[NavLink.Breadcrumbs] = [
                Route.Profile,
                Route.Billing,
                Route.PurchasingInformation,
                Route.AddPaymentMethod,
            ];
            break;
        case checkSubRoute(route, Route.Downloads):
            navLinks[NavLink.Breadcrumbs] = [Route.Resources, Route.Downloads];
            break;
        case checkSubRoute(route, Route.CommunityEvents):
            navLinks[NavLink.Breadcrumbs] = [Route.Community, Route.CommunityEvents];
            break;
        case checkSubRoute(route, Route.GeneralFAQs):
            navLinks[NavLink.Breadcrumbs] = [Route.MyTern, Route.GeneralFAQs];
            break;
        case checkSubRoute(route, Route.TidalFAQs):
            navLinks[NavLink.Breadcrumbs] = [Route.Tidal, Route.TidalFAQs];
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
                scrollState,
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

export { LayoutProvider };
