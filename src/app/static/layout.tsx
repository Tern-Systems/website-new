import {IModalContext} from "@/app/context/Modal.context";
import {NavDropdownDict} from "@/app/types/layout";
import {Route} from "@/app/static/routing";

import {HelpModal} from "@/app/ui/modals";


enum NavLink {Nav, SubNav, Sub2Nav}


const LAYOUT: {
    fadeDuration: number;
    profileLinks: Route[];
    navLinks: Route[];
    breadcrumbsRoutes: Route[]
} = {
    fadeDuration: 500,
    profileLinks: [Route.MyTern, Route.Profile, Route.Billing],
    navLinks: [Route.About, Route.TernKey, Route.Contact, Route.Support, Route.AllWays],
    breadcrumbsRoutes: [Route.Documentation],
}

const MAPPED_NAV_ROUTES: Record<string, string> = {
    // [Route.Products]: 'Products',
    // [Route.ARCH]: 'Services',
    [Route.Home]: 'Home',
    [Route.TernKey]: 'TernKey',

}

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    // [Route.Products]: 'All',
    [Route.TernKey]: 'Home',
    // [Route.Dot]: 'Download',
    // [Route.TBD0]: 'TBD',
    // [Route.TBD1]: 'TBD',
    // [Route.TBD2]: 'TBD',
}

const SPECIAL_NAV_ROUTES: Record<string, string> = {
    [Route.BTMCDoc]: 'BTMC',
    [Route.TernKey]: 'TernKey',
    [Route.TernKeyDoc]: 'TernKey',
};

const ALWAYS_MAPPED_ROUTES: string[] = ['TBD'];

const DROPDOWN_NAV_ROUTES: NavDropdownDict = {
    [Route.Support]: {
        name: 'Support',
        columns: [
            {
                'Billing': Route.Billing,
                'Billing resolution center': (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'brc'}/>),
                'View your subscriptions': Route.ManageSubscriptions,
            },
            {
                'Documentation': Route.MyDocumentation,
                'All Documentation': Route.Documentation,
                'TernKey user manual': Route.TernKeyDoc,
                'G handbook': Route.GDoc,
            },
            {
                'Resources': '', // TODO links
                'Open a case': Route.Contact,
                'Support hub': (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'}/>),
                'View your cases': Route.Contact, // TODO links
            },
            {
                'Training': '', // TODO links
                'Courses': '',
                'Professional certificates': '',
            },
        ],
    },
}

const DROPDOWN_SUB_NAV_ROUTES: Record<string, Record<string, string>> = {
    [Route.Videos]: {
        [Route.Videos]: 'Videos',
        'Todo': 'Development',
        'Todo0': 'Miscellaneous',
        'Todo1': 'Promotional',
        'Todo2': 'Tutorial',
    },
    [Route.Podcasts]: {
        [Route.Podcasts]: 'Podcasts',
        'Todo': 'Your tern',
        'Todo0': 'Bleeding Edge',
    },
    [Route.Events]: {
        [Route.Events]: 'Events',
        'Todo': 'Chicago',
        'Todo0': 'New York',
        'Todo1': 'San Jose',
        'Todo2': 'Request your city',
    },
    [Route.More]: {
        [Route.More]: 'More',
        'Todo': 'Masterclass',
        'Todo0': 'Insights',
        'Todo1': 'News',
        'Todo2': 'Newsletter'
    },
};


export {
    NavLink,
    MAPPED_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    ALWAYS_MAPPED_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    DROPDOWN_NAV_ROUTES,
    DROPDOWN_SUB_NAV_ROUTES,
    LAYOUT,
};
