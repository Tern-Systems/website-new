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

    About = '/about',
    Credo = Route.About + '/credo',
    Careers = Route.About + '/careers',
    Terms = '/terms',
    Cookies = '/cookies',
    Privacy = '/privacy',

    // /products
    // Products = '/products/all',
    Products = '/products',
    TidalPlans = '/products/plans',
    TidalProductManual = '/products/manual',
    TidalSubscribe = '/subscribe/tidal',
    TidalFAQs = '/products/faqs',
    Cyrus = '/products/cyrus',
    Tidal = '/products/tidal',
    Ternact = '/products/ternact',

    // Subscriptions
    Subscriptions = '/subscriptions',
    SubscriptionsTidal = Route.Subscriptions + '/tidal',
    SubscriptionsNewsletter = Route.Subscriptions + '/newsletter',
    SubscriptionsCourse = Route.Subscriptions + '/course',

    // Profile
    Profile = '/profile',
    MyTern = Route.Profile + '/my_tern',
    MyDocumentation = Route.MyTern + '/documentation',

    Billing = Route.Profile + '/billing',
    Invoice = Route.Billing + '/order',
    ManageSubscriptions = Route.Billing + '/manage_subscriptions',
    PurchasingInformation = Route.Billing + '/purchasing_information',
    EditPaymentMethod = Route.PurchasingInformation + '/edit_payment_method',
    AddPaymentMethod = Route.PurchasingInformation + '/add_payment_method',

    // Support
    Support = '/support',
    Resources = Route.Support + '/resources',

    // Community
    Community = Route.Support + '/community',
    Events = Route.Community + '/events',
    EventsLibrary = Route.Events + '/library',
    EventsAll = Route.EventsLibrary + '/' + CategoryFallback,

    Training = Route.Support + '/training',
    TrainingFAQs = Route.Training + '/faqs',
    ProfessionalCertifications = Route.Training + '/certifications',
    Subscribe = Route.Training + '/subscriptions',
    Credentials = '/support/training/credentials',
    Downloads = Route.Support + '/downloads',
    Cases = Route.Support + '/cases',
    Contact = Route.Support + '/contact',
    GeneralFAQs = Route.Support + '/faqs',

    // Documentation
    Documentation = Route.Support + '/documentation',
    TidalDoc = Route.Documentation + '/tidal',
    GDoc = Route.Documentation + '/g',
    TernKitDoc = Route.Documentation + '/tern_kit',
    TernDoc = Route.Documentation + '/tern',
    BTMCDoc = Route.Documentation + '/btmc',

    // Tips
    Tips = Route.Support + '/tips',
    TipsLibrary = Route.Tips + '/library',
    TipsAll = Route.TipsLibrary + '/' + CategoryFallback,
    TipsVideos = Route.TipsLibrary + '/videos',
    TipsReads = Route.TipsLibrary + '/reads',

    // support
    Courses = Route.Support + '/courses',
    CoursesLib = Route.Courses + '/library',
    CoursesAll = Route.CoursesLib + '/' + CategoryFallback,
    FreeCourses = Route.CoursesLib + '/free',
    PremiumCourses = Route.CoursesLib + '/premium',

    // All_ways
    AllWays = '/all_ways',
    AllWaysArticle = Route.AllWays + '/article',
    AllWaysAll = Route.AllWays + '/' + CategoryFallback,
    Artificial = Route.AllWays + '/artificial_intelligence',
    Cloud = Route.AllWays + '/cloud',
    Data = Route.AllWays + '/data',
    Security = Route.AllWays + '/security',
    Videos = Route.AllWays + '/videos',
    Podcasts = Route.AllWays + '/podcasts',
    AllWaysEvents = Route.AllWays + '/events',
    More = Route.AllWays + '/more',
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
