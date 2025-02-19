import { IModalContext } from '@/app/context/Modal.context';
import { NavDropdownDict } from '@/app/types/layout';
import { Route } from '@/app/static/routing';

import { HelpModal } from '@/app/ui/modals';

enum NavLink {
    Nav,
    Breadcrumbs,
    SubNav,
}

const LAYOUT: {
    fadeDuration: number;
    profileLinks: Route[];
    navLinks: Route[];
    blogLinks: Route[];
} = {
    fadeDuration: 500,
    profileLinks: [Route.MyTern, Route.Profile, Route.Billing],
    navLinks: [Route.About, Route.TernKey, Route.Contact, Route.SupportHub, Route.AllWays],
    blogLinks: [
        Route.Artificial,
        Route.Batteries,
        Route.Cloud,
        Route.Cybersecurity,
        Route.Data,
        Route.Centers,
        Route.Robotics,
        Route.Semiconductors,
        Route.Videos,
        Route.Podcasts,
        Route.Events,
        Route.More,
    ],
};

const ROUTES_WITH_INDEX: Record<string, true> = { [Route.Profile]: true };

const MAPPED_NAV_ROUTES: Record<string, string> = {};

const SPECIAL_NAV_ROUTES: Record<string, string> = {
    [Route.TernKey]: 'TernKey',
    [Route.TernKeyDoc]: 'TernKey',
};

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    [Route.TernKey]: 'Home',
    [Route.BTMCDoc]: 'BTMC',
};

const ALWAYS_MAPPED_ROUTES: string[] = ['TBD'];

const DROPDOWN_NAV_ROUTES: NavDropdownDict = {
    [Route.SupportHub]: {
        name: 'Support',
        columns: [
            {
                Billing: Route.Billing,
                'Billing resolution center': (modalCtx: IModalContext) =>
                    modalCtx.openModal(<HelpModal type={'brc'} />),
                'View your subscriptions': Route.ManageSubscriptions,
            },
            {
                Documentation: Route.MyDocumentation,
                'All Documentation': Route.Documentation,
                'TernKey user manual': Route.TernKeyDoc,
                'G handbook': Route.GDoc,
            },
            {
                Resources: '', // TODO links
                'Open a case': Route.Contact,
                'Support hub': (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'} />),
                'View your cases': Route.Contact, // TODO links
            },
            {
                Training: '', // TODO links
                Courses: '',
                'Professional certificates': '',
            },
        ],
    },
};

const DROPDOWN_SUB_NAV_ROUTES: Record<string, Record<string, string>> = {
    [Route.Videos]: {
        [Route.Videos]: 'Videos',
        Todo: 'Development',
        Todo0: 'Miscellaneous',
        Todo1: 'Promotional',
        Todo2: 'Tutorial',
    },
    [Route.Podcasts]: {
        [Route.Podcasts]: 'Podcasts',
        Todo: 'Your tern',
        Todo0: 'Bleeding Edge',
    },
    [Route.Events]: {
        [Route.Events]: 'Events',
        Todo: 'Chicago',
        Todo0: 'New York',
        Todo1: 'San Jose',
        Todo2: 'Request your city',
    },
    [Route.More]: {
        [Route.More]: 'More',
        Todo: 'Masterclass',
        Todo0: 'Insights',
        Todo1: 'News',
        Todo2: 'Newsletter',
    },
};

export {
    NavLink,
    ROUTES_WITH_INDEX,
    MAPPED_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    ALWAYS_MAPPED_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    DROPDOWN_NAV_ROUTES,
    DROPDOWN_SUB_NAV_ROUTES,
    LAYOUT,
};
