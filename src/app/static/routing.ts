enum Route {
    Start = '/',
    Home = '/Home',

    About = '/About',
    Credo = '/About/OurCredo',
    Contact = '/Contact',
    Terms = '/Terms',
    Cookies = '/Cookies',
    Privacy = '/Privacy',

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
    Invoice = '/Profile/Billing/Order',
    ManageSubscriptions = '/Profile/Billing/ManageSubscriptions',
    PurchasingInformation = '/Profile/Billing/PurchasingInformation',
    EditPaymentMethod = '/Profile/Billing/PurchasingInformation/Edit',
    AddPaymentMethod = '/Profile/Billing/PurchasingInformation/Add',
    MyTern = '/Profile/MyTern',

    Help = '/Profile/MyTern/FAQs',
    Documentation = '/Profile/MyTern/Documentation',
    TernKeyManual = '/Profile/MyTern/Documentation/TernKeyManual',
    GHandbook = '/Profile/MyTern/Documentation/GHandbook',
    ARHostingManual = '/Profile/MyTern/Documentation/ARHostingManual',
    TernKitManual = '/Profile/MyTern/Documentation/TernKitManual',
    TernHandbook = '/Profile/MyTern/Documentation/TERNHandbook',
    ARCHManual = '/Profile/MyTern/Documentation/ARCHManual',
    BTMCHandbook = '/Profile/MyTern/Documentation/BTMCHandbook',

    // Managing
    Subscribe = '/Subscribe',
}

const TERN_AC_HREF = 'https://tern.ac/ternkey';


export {Route, TERN_AC_HREF};