enum Route {
    Start = '/',
    Home = '/Home',

    About = '/About',
    Credo = '/About/Credo',
    Contact = '/Contact',
    Terms = '/Terms',
    Cookies = '/Cookies',
    Privacy = '/Privacy',

    ExploreKeys = '/ExploreKeys',
    CreateKey = '/CreateKey',

    // /Service
    Service = '/Service',
    ARCodeToolCreate = '/Service/Create',
    ARCodeToolEdit = '/Service/SavedCodes/Edit',
    ServiceUserManual = '/Service/UserManual',
    ServicePricing = '/Service/PricingAndPlans',
    SavedCodes = '/Service/SavedCodes',

    // /Product
    Product = '/Product',
    ProductUserManual = '/Product/UserManual',
    ProductPricing = '/Product/PricingAndPlans',

    // /Profile
    Profile = '/Profile',
    Billing = '/Profile/Billing',
    MyTern = '/Profile/MyTern',

    Documentation = '/Profile/MyTern/Documentation',
    TernKeyManual = '/Profile/MyTern/Documentation/TernKeyManual',
    GHandbook = '/Profile/MyTern/Documentation/GHandbook',
    ARHostingManual = '/Profile/MyTern/Documentation/ARHostingManual',
    TernKitManual = '/Profile/MyTern/Documentation/TernKitManual',
    TernHandbook = '/Profile/MyTern/Documentation/TERNHandbook',
    ARCHManual = '/Profile/MyTern/Documentation/ARCHManual',
    BTMCHandbook = '/Profile/MyTern/Documentation/BTMCHandbook',

    OpenCase = '/Open a Case',
    Feedback = '/Feedback',

    // Managing
    Subscribe = '/Subscribe',
    ManageSubscriptions = '/ManageSubscriptions',
    EditPaymentMethod = '/PaymentMethodEdit',
    AddPaymentMethod = '/PaymentMethodAdd',
    PurchasingInformation = '/PurchasingInformation',
    Invoice = '/Invoice',
}


export {Route}