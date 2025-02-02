enum Route {
    Home = '/',

    AllWays = '/all_ways',
    About = '/about',
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
    MyDocumentation = '/profile/my_tern/documentation',
    Documentation = '/documentation',
    TernKeyDoc = '/documentation/ternkey',
    GDoc = '/documentation/g',
    TernKitDoc = '/documentation/tern_kit',
    TernDoc = '/documentation/tern',
    BTMCDoc = '/documentation/btmc',
}


export {Route};
