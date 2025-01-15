enum Route {
    Start = '/',
    Home = '/home',

    AllWays = '/all_ways',
    TBD0 = '/all_ways/TBD0',
    TBD1 = '/all_ways/TBD1',
    TBD2 = '/all_ways/TBD2',
    About = '/about',
    Credo = '/about/our_credo',
    Contact = '/contact',
    Terms = '/terms',
    Cookies = '/cookies',
    Privacy = '/privacy',

    // /service
    Services = '/services/arch',
    ARCodeToolCreate = '/services/create',
    ARCodeToolEdit = '/services/library/edit',
    ServiceUserManual = '/services/user_manual',
    ServicePricing = '/services/plans',
    ServiceSubscribe = '/subscribe/arch',
    SavedCodes = '/services/library',

    // /product
    Products = '/products/all',
    TernKey = '/products/ternkey',
    TernKeyPricing = '/products/ternkey/plans',
    TernKeyProductManual = '/products/ternkey/user_manual',
    TernKeySubscribe = '/subscribe/ternkey',
    Dot = '/products/dot',
    DotPricing = '/products/dot/pricing',
    DotProductManual = '/products/dot/user_manual',

    // /profile
    Profile = '/profile',
    Billing = '/profile/billing',
    Invoice = '/profile/billing/order',
    ManageSubscriptions = '/profile/billing/manage_subscriptions',
    PurchasingInformation = '/profile/billing/purchasing_information',
    EditPaymentMethod = '/profile/billing/purchasing_information/edit',
    AddPaymentMethod = '/profile/billing/purchasing_information/add',
    MyTern = '/profile/my_tern',

    Help = '/profile/my_tern/faqs',
    Documentation = '/profile/my_tern/documentation',
    TernKeyDoc = '/profile/my_tern/documentation/ternkey',
    GDoc = '/profile/my_tern/documentation/g',
    TernKitDoc = '/profile/my_tern/documentation/tern_kit',
    TernDoc = '/profile/my_tern/documentation/tern',
    ARCHDoc = '/profile/my_tern/documentation/arch',
    BTMCDoc = '/profile/my_tern/documentation/btmc',
}

const TERN_AC_HREF = 'https://tern.ac/ternkey';


export {Route, TERN_AC_HREF};