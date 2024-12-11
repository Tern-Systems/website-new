// Payment
import {STATE} from "@/app/static/constants";

// Utils
type NonNullableKeys<T extends object> = { [P in keyof T]: NonNullable<T[P]> }
type KeysOfUnion<T> = T extends T ? keyof T : never;


// Billing
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
    to: string;
    from: string;
    card: Pick<CardData, 'cardNumber' | 'type' | 'nickName'>;
    item: { name: string, priceUSD: number };
    subtotalUSD: number;
    totalDue: number;
    taxPercent: number;
    paidUSD: number;
    state: keyof typeof STATE;
    status: 'paid' | 'unpaid';
    type: SubscriptionRecurrency;
}

// Subscription
type SubscriptionRecurrency = 'annual' | 'monthly';
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

export type {NonNullableKeys, KeysOfUnion}
export type {CardData, SubscriptionPreview, SubscriptionPreviewData, Invoice, SubscriptionRecurrency, Subscription}