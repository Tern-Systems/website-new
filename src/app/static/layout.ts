import {Route} from "@/app/static/routing";

import SVG_DISCORD from "/public/images/icons/discord.svg";
import SVG_STACKOVERFLOW from "/public/images/icons/stack-overflow.svg";
import SVG_GITHUB from "/public/images/icons/github.svg";
import SVG_X from "/public/images/icons/x-twitter.svg";
import SVG_REDDIT from "/public/images/icons/reddit.svg";
import SVG_LINKEDIN from "/public/images/icons/linkedin.svg";
import SVG_FACEBOOK from "/public/images/icons/facebook.svg";
import SVG_YOUTUBE from "/public/images/icons/youtube.svg";
import SVG_INSTAGRAM from "/public/images/icons/instagram.svg";
import SVG_TWITCH from "/public/images/icons/twitch.svg";

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

const DROPDOWN_ROUTES: Record<string, Record<string, string>> = {
    [Route.Support]: {
        [Route.Support]: 'Support',
        'Todo': 'Support 1',
        'Todo0': 'Miscellaneous 2',
    },
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

const CONTACT_LINKS = {
    Discord: {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
    'Stack overflow': {svg: SVG_STACKOVERFLOW, href: 'https://stackoverflow.com/users/24470835/tern'},
    GitHub: {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    X: {svg: SVG_X, href: 'https://x.com/Tern_Systems'},
    Reddit: {svg: SVG_REDDIT, href: 'https://www.reddit.com/user/Tern_Systems'},
    LinkedIn: {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys'},
    Facebook: {svg: SVG_FACEBOOK, href: 'https://www.facebook.com/ternsystemsinc'},
};

const MEDIA_LINKS = {
    Instagram: {svg: SVG_INSTAGRAM, href: 'https://www.instagram.com/ternsystems/'},
    YouTube: {svg: SVG_YOUTUBE, href: 'https://www.youtube.com/@Tern_Systems'},
    Twitch: {svg: SVG_TWITCH, href: 'https://www.twitch.tv/tern_systems'},
};

const MISC_LINKS = {
    Careers: 'https://www.linkedin.com/company/tern-sys/jobs/',
    Events: 'https://www.eventbrite.com/o/tern-103937850401',
    TernKey: 'https://tern.ac/ternkey',
    TernKeyDemo: 'https://www.youtube.com/watch?v=uMb2KI6PHPQ',
};


export {
    NavLink,
    MAPPED_NAV_ROUTES,
    SPECIAL_NAV_ROUTES,
    ALWAYS_MAPPED_ROUTES,
    MAPPED_SUB_NAV_ROUTES,
    DROPDOWN_ROUTES,
    LAYOUT,
    CONTACT_LINKS,
    MEDIA_LINKS,
    MISC_LINKS,
};
