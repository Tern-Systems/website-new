enum Route {
    Home = '/',

    AllWays = '/all_ways',
    About = '/about',
    Credo = '/about/our_credo',
    Contact = '/contact',
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

    Help = '/profile/my_tern/faqs',
    Documentation = '/profile/my_tern/documentation',
    TernKeyDoc = '/profile/my_tern/documentation/ternkey',
    GDoc = '/profile/my_tern/documentation/g',
    TernKitDoc = '/profile/my_tern/documentation/tern_kit',
    TernDoc = '/profile/my_tern/documentation/tern',
    BTMCDoc = '/profile/my_tern/documentation/btmc',
}

const TERN_AC_HREF = 'https://tern.ac/ternkey';


export {Route, TERN_AC_HREF};