// Payment
type CardData = {
    type: string;
    cardNumber: string;
    expirationDate: string;
    cvc: string;
    cardholderName: string;
    billingCountry: string;
    billingAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    state: string;
    nickName: string;
    isDefault: boolean;
}

type Invoice = {
    id: number;
    date: number;
    card: string;
    cost: number;
    status: string;
    item: string
}

// Subscription
type SubscriptionRecurrency = 'annually' | 'monthly';
type Subscription = {
    subscription: string;
    recurrency: SubscriptionRecurrency;
    priceUSD: number;
    type: string;
    isBasicKind: boolean;
}
type SubscriptionPreviewData = {
    icon: string;
    priceUSD: Record<SubscriptionRecurrency, number>;
    benefits: string[];
}
type SubscriptionPreview = Pick<Subscription, 'subscription' | 'isBasicKind'> & {
    type: Record<string, SubscriptionPreviewData>
}

export type {CardData, SubscriptionPreview, SubscriptionPreviewData, Invoice, SubscriptionRecurrency, Subscription}