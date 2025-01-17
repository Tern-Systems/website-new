import {Route} from "@/app/static/routing";

const LAYOUT: { fadeDuration: number; profileLinks: Route[] } = {
    fadeDuration: 500,
    profileLinks: [Route.MyTern, Route.Profile, Route.Billing],
}

const MAPPED_NAV_ROUTES: Record<string, string> = {
    // [Route.Products]: 'Products',
    // [Route.ARCH]: 'Services',
    [Route.TernKey]: 'TernKey',

}

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    // [Route.Products]: 'All',
    // [Route.TernKey]: 'Application',
    // [Route.Dot]: 'Download',
    // [Route.TBD0]: 'TBD',
    // [Route.TBD1]: 'TBD',
    // [Route.TBD2]: 'TBD',
}

const SPECIAL_NAV_ROUTES: Record<string, string> = {
    [Route.TernKey]: 'TernKey',
    [Route.TernKeyDoc]: 'TernKey',
    [Route.ARCH]: 'ARCH',
    [Route.ARCHDoc]: 'ARCH',
};
const ALWAYS_MAPPED_ROUTES: string[] = ['TBD'];


export {
    MAPPED_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    ALWAYS_MAPPED_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    LAYOUT
};
