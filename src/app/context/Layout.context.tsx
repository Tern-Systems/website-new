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
    useState
} from 'react';
import {usePathname} from "next/navigation";

import {LAYOUT, Route} from "@/app/static";

import {checkSubRoute} from "@/app/utils";
import {useBreakpointCheck} from "@/app/hooks";
import {useUser} from "@/app/context/User.context";


// Main links, sub links, sub sub links
enum NavLink {Nav, SubNav, Sub2Nav}

type NavLinks = [Route[], Route [] | null, Route[] | null];


const NAV_LINKS: Route[] = [Route.About, Route.TernKey, Route.Contact, Route.AllWays];
const BREADCRUMBS_NAV_ROUTES: string[] = [Route.Documentation];


interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
    navLinks: NavLinks;
    isBreadCrumbsNav: boolean;
    getSubNavs: (route: Route) => [Route [] | null, Route[] | null];
}

const LayoutContext = createContext<ILayoutContext | null>(null);

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const route = usePathname();
    const isSmScreen = useBreakpointCheck() === 'sm';
    const userCtx = useUser();

    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);

    const fullscreenRef = useRef<HTMLDivElement | null>(null);


    const getSubNavs = (route: Route | null): [Route [] | null, Route[] | null] => {
        let subNavLinks: Route [] | null = [];
        let sub2NavLinks: Route [] | null = [];

        switch (route) {
            case Route.MyDocumentation:
                subNavLinks = isSmScreen ? [Route.MyDocumentation] : null;
                break;
            case Route.MyTern:
            case Route.Profile:
            case Route.Billing:
                sub2NavLinks = isSmScreen ? null : LAYOUT.profileLinks;
                break;
            // case Route.Products:
            // links = [Route.Products, Route.Dot, Route.TernKey];
            // if (isSmScreen)
            //     subNavLinks = links;
            // else
            //     sub2NavLinks = links;
            // break;
            // case Route.TernKeyPricing:
            // case Route.TernKeyProductManual:
            // case Route.TernKey:
            //     links = [Route.TernKeyPricing, Route.TernKeyProductManual];
            //     if (!userCtx.userData) links.shift();
            //     if (isSmScreen)
            //         subNavLinks = links;
            //     else
            //         sub2NavLinks = links;
            //     break;
            // case Route.Dot:
            // case Route.DotPricing:
            // case Route.DotProductManual:
            //     subNavLinks = [Route.Products, Route.Dot, Route.TernKey];
            //     sub2NavLinks = [Route.Dot, Route.DotPricing, Route.DotProductManual];
            //     break;
            case Route.BTMCDoc:
            case Route.GDoc:
            case Route.TernDoc:
            case Route.TernKeyDoc:
            case Route.TernKitDoc:
                subNavLinks = [Route.MyDocumentation];
                sub2NavLinks = isSmScreen
                    ? [route as Route]
                    : [
                        Route.BTMCDoc,
                        Route.GDoc,
                        Route.TernDoc,
                        Route.TernKeyDoc,
                        Route.TernKitDoc,
                    ];
                break;
        }

        return [subNavLinks, sub2NavLinks];
    }


    const navLinks: NavLinks = [NAV_LINKS, null, null];
    const isBreadCrumbsNav: boolean = BREADCRUMBS_NAV_ROUTES.some((subRoute) => checkSubRoute(route, subRoute));
    if (!isSmScreen && isBreadCrumbsNav) {
        switch (true) {
            case checkSubRoute(route, Route.Documentation):
                navLinks[NavLink.Nav] = [
                    userCtx.isLoggedIn ? Route.MyTern : Route.Home,
                    userCtx.isLoggedIn ? Route.MyDocumentation : Route.Documentation,
                ];
                break;
            // case checkSubRoute(route, Route.TernKey):
            //     navLinks[NavLink.Nav] = [Route.Products, Route.TernKey];
            //     break;
            default:
                break;
        }
    } else if (route?.includes(Route.Profile) && isSmScreen)
        navLinks[NavLink.Nav] = LAYOUT.profileLinks;

    const subNavs = getSubNavs(route as Route);
    navLinks[NavLink.SubNav] = subNavs[0];
    navLinks[NavLink.Sub2Nav] = subNavs[1];


    useEffect(() => {
        if (sessionStorage.getItem('pip-mode-child') !== null)
            return handleNoLayoutState();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape')
                setNoLayoutState(false);
        }

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
    }

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


export type {NavLinks};
export {NavLink, LayoutProvider, useLayout}
