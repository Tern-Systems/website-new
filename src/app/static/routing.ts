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
    ARCodeToolCreate = '/Service/CreationTool',
    ARCodeToolEdit = '/Service/SavedCodes/Edit',
    ServiceUserManual = '/Service/UserManual',
    ServicePricing = '/Service/PricingAndPlans',
    ServiceSubscribe = '/Subscribe/ARCH',
    SavedCodes = '/Service/SavedCodes',

    // /Product
    Products = '/Products',
    TernKey = '/Products/TernKey',
    TernKeyPricing = '/Products/TernKey/PricingAndPlans',
    TernKeyProductManual = '/Products/TernKey/UserManual',
    TernKeySubscribe = '/Subscribe/TernKey',
    Dot = '/Products/Dot',
    DotPricing = '/Products/Dot/Pricing',
    DotProductManual = '/Products/Dot/UserManual',

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
}

const TERN_AC_HREF = 'https://tern.ac/ternkey';


export {Route, TERN_AC_HREF};