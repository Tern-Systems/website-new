'use client';

import { CategoryFallback } from '@/app/static/fallback';

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

    // /products
    // Products = '/products/all',
    Products = '/product',
    TidalPlans = '/products/plans',
    TidalProductManual = '/products/manual',
    TidalSubscribe = '/subscribe/tidal',
    TidalFAQs = '/products/faqs',
    Cyrus = '/products/cyrus',
    Tidal = '/products/tidal',
    Ternact = '/products/ternact',

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
    Events = Route.Community + '/events',
    EventsLibrary = Route.Events + '/library',
    EventsAll = Route.EventsLibrary + '/' + CategoryFallback,
    Training = '/support/training',
    TrainingFAQs = '/support/training/faqs',
    ProfessionalCertifications = '/support/training/certifications',
    Subscriptions = '/support/training/subscriptions',
    Downloads = '/support/downloads',
    Cases = '/support/cases',
    Tips = '/support/tips',
    TipsLibrary = '/support/tips/library',
    TipsAll = Route.TipsLibrary + '/' + CategoryFallback,
    TipsVideos = Route.TipsLibrary + '/videos',
    TipsReads = Route.TipsLibrary + '/reads',
    Contact = '/support/contact',
    GeneralFAQs = '/support/faqs',
    Documentation = '/support/documentation',
    TidalDoc = '/support/documentation/tidal',
    GDoc = '/support/documentation/g',
    TernKitDoc = '/support/documentation/tern_kit',
    TernDoc = '/support/documentation/tern',
    BTMCDoc = '/support/documentation/btmc',

    Courses = '/support/courses',
    CoursesLib = '/support/courses/library',
    CoursesAll = Route.CoursesLib + '/' + CategoryFallback,
    FreeCourses = Route.CoursesLib + '/free',
    PremiumCourses = Route.CoursesLib + '/premium',

    // /all_ways
    AllWays = '/all_ways',
    AllWaysArticle = '/all_ways/article',
    AllWaysAll = Route.AllWays + '/' + CategoryFallback,
    Artificial = '/all_ways/artificial_intelligence',
    Cloud = '/all_ways/cloud',
    Data = '/all_ways/data',
    Security = '/all_ways/security',
    Videos = '/all_ways/videos',
    Podcasts = '/all_ways/podcasts',
    AllWaysEvents = '/all_ways/events',
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

const Tidal = typeof window !== 'undefined' ? `${window.location.origin}/tidal` : 'https://tern.ac/tidal';

const MISC_LINKS = {
    Careers: 'https://www.linkedin.com/company/tern-sys/jobs/',
    Events: 'https://www.eventbrite.com/o/tern-103937850401',
    Tidal,
    TidalExploreKeys: Tidal + '/explore',
    TidalDemo: 'https://www.youtube.com/watch?v=uMb2KI6PHPQ',
    TidalDemoEmbed: 'https://www.youtube.com/embed/uMb2KI6PHPQ?si=gktgx0tR4UuY2VPW',
};

export { Route, CONTACT_LINKS, MEDIA_LINKS, MISC_LINKS };
