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


const NAV_LINKS: Route[] = [Route.About, Route.Products, Route.Service, Route.Contact];
const BREADCRUMBS_NAV_ROUTES: string[] = [Route.Documentation, Route.Credo, Route.ARCodeToolEdit, Route.Dot, Route.TernKey];


interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setMovingAnimationState: Dispatch<SetStateAction<boolean>>;
    isInsigniaMovedAnim: boolean;
    setInsigniaMoved: Dispatch<SetStateAction<boolean>>;
    isInsigniaMoved: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
    navLinks: Route[];
    subNavLinks: Route[] | null;
    isBreadCrumbsNav: boolean;
}

const LayoutContext = createContext<ILayoutContext | null>(null);

const LayoutProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const route = usePathname();
    const isSmScreen = useBreakpointCheck();

    const [isNoLayout, setNoLayoutState] = useState(false);
    const [isFade, setFadeState] = useState(false);

    const [isInsigniaMoved, setInsigniaMoved] = useState(false);
    const [isInsigniaMovedAnim, setMovingAnimationState] = useState(false);

    const fullscreenRef = useRef<HTMLDivElement | null>(null);


    let navLinks: Route[] = NAV_LINKS;
    const isBreadCrumbsNav: boolean = !isSmScreen && BREADCRUMBS_NAV_ROUTES.some((subRoute) => checkSubRoute(route, subRoute));
    if (isBreadCrumbsNav) {
        switch (true) {
            case checkSubRoute(route, Route.Documentation):
                navLinks = [Route.Profile, Route.Documentation];
                break;
            case checkSubRoute(route, Route.Credo):
                navLinks = [Route.About, Route.Credo];
                break;
            case checkSubRoute(route, Route.Dot):
                navLinks = [Route.Products, Route.Dot];
                break;
            case checkSubRoute(route, Route.TernKey) || checkSubRoute(route, Route.TernKeyPricing) || checkSubRoute(route, Route.TernKeyProductManual):
                navLinks = [Route.Products, Route.TernKey];
                break;
            default:
                break;
        }
    } else if (route?.includes(Route.Profile) && isSmScreen)
        navLinks = LAYOUT.profileLinks;

    let subNavLinks: Route[] | null = null;
    switch (route) {
        case Route.Documentation:
            subNavLinks = isSmScreen ? [Route.Documentation] : null;
            break;
        case Route.Credo:
            subNavLinks = isSmScreen ? [Route.Credo] : null;
            break;
        case Route.MyTern:
        case Route.Profile:
        case Route.Billing:
            subNavLinks = isSmScreen ? null : LAYOUT.profileLinks;
            break;
        case Route.Products:
            subNavLinks = [Route.Products, Route.Dot, Route.TernKey];
            break;
        case Route.TernKeyPricing:
        case Route.TernKeyProductManual:
        case Route.TernKey:
            subNavLinks = [Route.TernKey, Route.TernKeyPricing, Route.TernKeyProductManual];
            break;
        case Route.Dot:
        case Route.DotPricing:
        case Route.DotProductManual:
            subNavLinks = [Route.Dot, Route.DotPricing, Route.DotProductManual];
            break;
        case Route.TernKeyManual:
        case Route.ARHostingManual:
        case Route.TernKitManual:
        case Route.GHandbook:
        case Route.TernHandbook:
        case Route.BTMCHandbook:
            subNavLinks = [
                Route.TernKeyManual,
                Route.ARHostingManual,
                Route.TernKitManual,
                Route.GHandbook,
                Route.TernHandbook,
                Route.BTMCHandbook,
            ];
            break;
        case Route.Service:
        case Route.ARCodeToolCreate:
        case Route.ServicePricing:
        case Route.SavedCodes:
        case Route.ServiceUserManual:
            subNavLinks = [
                Route.Service,
                Route.ARCodeToolCreate,
                Route.ServicePricing,
                Route.SavedCodes,
                Route.ServiceUserManual,
            ];
            break
    }


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
                setMovingAnimationState,
                isInsigniaMovedAnim,
                setInsigniaMoved,
                isInsigniaMoved,
                setFadeState,
                isFade,
                navLinks,
                subNavLinks,
                isBreadCrumbsNav
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

export {LayoutProvider, useLayout}
