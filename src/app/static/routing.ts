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


export {Route, BLOG_ROUTES};
