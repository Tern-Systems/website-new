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
    TernKeyDoc = '/Profile/MyTern/Documentation/TernKey',
    GDoc = '/Profile/MyTern/Documentation/G',
    TernKitDoc = '/Profile/MyTern/Documentation/TernKit',
    TernDoc = '/Profile/MyTern/Documentation/TERN',
    ARCHDoc = '/Profile/MyTern/Documentation/ARCH',
    BTMCDoc = '/Profile/MyTern/Documentation/BTMC',
}

const TERN_AC_HREF = 'https://tern.ac/ternkey';


export {Route, TERN_AC_HREF};