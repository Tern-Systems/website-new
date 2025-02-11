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


enum Route {
    Home = '/',

    Credo = '/about/credo',
    About = '/about',
    Contact = '/contact',
    Support = '/support',
    Terms = '/terms',
    Cookies = '/cookies',
    Privacy = '/privacy',

    // /product
    // Products = '/products/all',
    TernKey = '/ternkey',
    TernKeyPricing = '/ternkey/plans',
    TernKeyProductManual = '/ternkey/manual',
    TernKeySubscribe = '/subscribe/ternkey',
    // Dot = '/products/dot',
    // DotPricing = '/products/dot/pricing',
    // DotProductManual = '/products/dot/user_manual',

    // /profile
    Profile = '/profile',
    MyTern = '/profile/my_tern',
    Billing = '/profile/billing',
    Invoice = '/profile/billing/order',
    ManageSubscriptions = '/profile/billing/manage_subscriptions',
    PurchasingInformation = '/profile/billing/purchasing_information',
    EditPaymentMethod = '/profile/billing/purchasing_information/edit',
    AddPaymentMethod = '/profile/billing/purchasing_information/add',

    // Docs / help
    Help = '/profile/my_tern/faqs',
    MyDocumentation = '/profile/my_tern/documentation',
    Documentation = '/documentation',
    TernKeyDoc = '/documentation/ternkey',
    GDoc = '/documentation/g',
    TernKitDoc = '/documentation/tern_kit',
    TernDoc = '/documentation/tern',
    BTMCDoc = '/documentation/btmc',

    // /all_ways
    AllWays = '/all_ways',
    AllWaysArticle = '/all_ways/article',
    Artificial = '/all_ways/artificial_intelligence',
    Batteries = '/all_ways/batteries',
    Cloud = '/all_ways/cloud',
    Cybersecurity = '/all_ways/cybersecurity',
    Data = '/all_ways/data',
    Centers = '/all_ways/centers',
    Robotics = '/all_ways/robotics',
    Semiconductors = '/all_ways/semiconductors',
    Videos = '/all_ways/videos',
    Podcasts = '/all_ways/podcasts',
    Events = '/all_ways/events',
    More = '/all_ways/more',
}


const BLOG_ROUTES = [
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
];

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
    Route,
    BLOG_ROUTES,
    CONTACT_LINKS,
    MEDIA_LINKS,
    MISC_LINKS,
};
