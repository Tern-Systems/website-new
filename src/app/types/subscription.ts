type SubscriptionRecurrency = 'annual' | 'monthly';
type Subscription = {
    subscription: 'arch' | 'ternKey';
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


export type {SubscriptionPreview, SubscriptionPreviewData, SubscriptionRecurrency, Subscription}