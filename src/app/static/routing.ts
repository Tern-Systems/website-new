import SVG_DISCORD from '@/assets/images/icons/discord.svg';
import SVG_STACKOVERFLOW from '@/assets/images/icons/stack-overflow.svg';
import SVG_GITHUB from '@/assets/images/icons/github.svg';
import SVG_X from '@/assets/images/icons/x-twitter.svg';
import SVG_REDDIT from '@/assets/images/icons/reddit.svg';
import SVG_LINKEDIN from '@/assets/images/icons/linkedin.svg';
import SVG_FACEBOOK from '@/assets/images/icons/facebook.svg';
import SVG_YOUTUBE from '@/assets/images/icons/youtube.svg';
import SVG_INSTAGRAM from '@/assets/images/icons/instagram.svg';
import SVG_TWITCH from '@/assets/images/icons/twitch.svg';

enum Route {
    Home = '/',

    Credo = '/about/credo',
    About = '/about',
    SupportHub = '/support',
    Terms = '/terms',
    Cookies = '/cookies',
    Privacy = '/privacy',

    // /product
    // Products = '/products/all',
    Tidal = '/product',
    TidalPlans = '/product/plans',
    TidalProductManual = '/product/manual',
    TidalSubscribe = '/subscribe/tidal',
    TidalFAQs = '/product/faqs',
    // Dot = '/products/dot',
    // DotPricing = '/products/dot/pricing',
    // DotProductManual = '/products/dot/user_manual',

    // /profile
    Profile = '/profile',
    MyTern = '/profile/my_tern',
    MyDocumentation = '/profile/my_tern/documentation',

    Billing = '/profile/billing',
    Invoice = '/profile/billing/order',
    ManageSubscriptions = '/profile/billing/manage_subscriptions',
    PurchasingInformation = '/profile/billing/purchasing_information',
    EditPaymentMethod = '/profile/billing/purchasing_information/edit_payment_method',
    AddPaymentMethod = '/profile/billing/purchasing_information/add_payment_method',

    // /support
    Resources = '/support/resources',
    Community = '/support/community',
    CommunityEvents = '/support/community/events',
    Training = '/support/training',
    Downloads = '/support/downloads',
    Cases = '/support/cases',
    Tips = '/support/tips',
    TipsVideos = '/support/tips/videos',
    TipsReads = '/support/tips/reads',
    Contact = '/support/contact',
    GeneralFAQs = '/support/faqs',
    Documentation = '/support/documentation',
    TidalDoc = '/support/documentation/tidal',
    GDoc = '/support/documentation/g',
    TernKitDoc = '/support/documentation/tern_kit',
    TernDoc = '/support/documentation/tern',
    BTMCDoc = '/support/documentation/btmc',

    // /all_ways
    AllWays = '/all_ways',
    AllWaysArticle = '/all_ways/article',
    Artificial = '/all_ways/artificial_intelligence',
    Cloud = '/all_ways/cloud',
    Data = '/all_ways/data',
    Security = '/all_ways/security',
    Videos = '/all_ways/videos',
    Podcasts = '/all_ways/podcasts',
    Events = '/all_ways/events',
    More = '/all_ways/more',
}

const CONTACT_LINKS = {
    Discord: { svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f' },
    'Stack overflow': { svg: SVG_STACKOVERFLOW, href: 'https://stackoverflow.com/users/24470835/tern' },
    GitHub: { svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems' },
    X: { svg: SVG_X, href: 'https://x.com/Tern_Systems' },
    Reddit: { svg: SVG_REDDIT, href: 'https://www.reddit.com/user/Tern_Systems' },
    LinkedIn: { svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys' },
    Facebook: { svg: SVG_FACEBOOK, href: 'https://www.facebook.com/ternsystemsinc' },
};

const MEDIA_LINKS = {
    Instagram: { svg: SVG_INSTAGRAM, href: 'https://www.instagram.com/ternsystems/' },
    YouTube: { svg: SVG_YOUTUBE, href: 'https://www.youtube.com/@Tern_Systems' },
    Twitch: { svg: SVG_TWITCH, href: 'https://www.twitch.tv/tern_systems' },
};

const Tidal = 'https://tern.ac/tidal';
const MISC_LINKS = {
    Careers: 'https://www.linkedin.com/company/tern-sys/jobs/',
    Events: 'https://www.eventbrite.com/o/tern-103937850401',
    Tidal,
    TidalExploreKeys: Tidal + '/explore',
    TidalDemo: 'https://www.youtube.com/watch?v=uMb2KI6PHPQ',
    TidalDemoEmbed: 'https://www.youtube.com/embed/uMb2KI6PHPQ?si=gktgx0tR4UuY2VPW',
};

export { Route, CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS };
