import { IModalContext } from '@/app/contexts/modal.context';
import { NavDropdownDict } from '@/app/types/layout';
import { Route } from '@/app/static/routing';

import { HelpModal } from '@/app/ui/modals';
import cn from 'classnames';

enum NavLink {
    Nav,
    Breadcrumbs,
    SubNav,
}

enum Breakpoint {
    'x3s',
    'xxs',
    'xs',
    'sm',
    'md',
    'lg',
}

const LAYOUT: {
    fadeDuration: number;
    profileLinks: Route[];
    navLinks: Route[];
    blogLinks: Route[];
} = {
    fadeDuration: 500,
    profileLinks: [Route.MyTern, Route.Profile, Route.Billing],
    navLinks: [Route.About, Route.Products, Route.Contact, Route.SupportHub, Route.AllWays],
    blogLinks: [
        Route.Artificial,
        Route.Cloud,
        Route.Data,
        Route.Security,
        Route.Videos,
        Route.Podcasts,
        Route.Events,
        Route.More,
    ],
};

const ROUTES_WITH_INDEX: Record<string, true> = { [Route.Profile]: true };

const MAPPED_NAV_ROUTES: Record<string, string> = {};

const SPECIAL_NAV_ROUTES: Record<string, string> = {
    [Route.Products]: 'Products',
    [Route.TidalDoc]: 'Tidal',
};

const MAPPED_SUB_NAV_ROUTES: Record<string, string> = {
    [Route.Products]: 'All',
    [Route.BTMCDoc]: 'BTMC',
    [Route.TrainingFAQs]: 'FAQs',
    [Route.Training]: 'Training',
    [Route.Courses]: 'Courses',
    [Route.ProfessionalCertifications]: 'Professional Certifications',
    [Route.Subscriptions]: 'Subscriptions',
};

const ALWAYS_MAPPED_ROUTES: string[] = ['TBD', 'FAQs'];

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
                'Tidal user manual': Route.TidalDoc,
                'G handbook': Route.GDoc,
            },
            {
                Resources: Route.Resources, // TODO links
                Downloads: Route.Downloads,
                Tips: Route.Tips,
                'Support hub': (modalCtx: IModalContext) => modalCtx.openModal(<HelpModal type={'support'} />),
                Community: Route.Community, // TODO links
            },
            {
                Training: Route.Training, // TODO links
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
    [Route.Courses]: {
        [Route.Courses]: 'All Courses',
    },
};

const CELL_FALLBACK = <span className={'text-section-xs'}>No data</span>;

const SM_HIDDEN_CN = 'sm:hidden';
const MD_SM_HIDDEN_CN = cn(SM_HIDDEN_CN, ' md:hidden');

export {
    Breakpoint,
    NavLink,
    ROUTES_WITH_INDEX,
    MAPPED_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    ALWAYS_MAPPED_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    DROPDOWN_NAV_ROUTES,
    DROPDOWN_SUB_NAV_ROUTES,
    CELL_FALLBACK,
    MD_SM_HIDDEN_CN,
    SM_HIDDEN_CN,
    LAYOUT,
};
