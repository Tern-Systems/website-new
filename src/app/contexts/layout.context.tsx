'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

import { Route } from '@/app/static';
import { Breakpoint } from '@/app/static';

type ScrollState = { scrollTop: number; scrollHeight: number; autoScroll: boolean };

type SetState<T> = Dispatch<SetStateAction<T>>;

enum NavigationState {
    FREE,
    BLOCKED,
    TRY_NAVIGATE,
}

// Main links, sub links, sub sub links
type NavLinks = [Route[], Route[] | null, Route[] | null];

interface ILayoutContext {
    toggleFullscreen: () => void;
    isNoLayout: boolean;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
    scrollState: [ScrollState, Dispatch<SetStateAction<ScrollState>>];
    navLinks: NavLinks;
    getSubNavs: (route: Route, breakpoint: Breakpoint) => [Route[], Route[] | null, Route[] | null];
    navigateState: [NavigationState, SetState<NavigationState>, Route | null, SetState<Route | null>];
}

const LayoutContext = createContext<ILayoutContext | null>(null);

export type { ILayoutContext, NavLinks, ScrollState };
export { NavigationState, LayoutContext };
