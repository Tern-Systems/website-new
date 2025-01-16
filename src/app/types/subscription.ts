import {Route} from "@/app/static";


type SubscriptionRecurrency = 'annual' | 'monthly';
type PlanName = 'ARCH'  | 'TernKey' | 'trial';
type PlanType = 'Basic' | 'Standard' | 'Pro';

type SubscriptionBase = {
    subscription: PlanName;
    recurrency: SubscriptionRecurrency;
    priceUSD: number;
    type: PlanType;
    isBasicKind: boolean;
}

type Subscription = SubscriptionBase & {
    tax: number;
    renewDate: number;
}

type SubscriptionPreviewData = {
    priceUSD: Record<SubscriptionRecurrency, number>;
    benefits: string[];
}

type SubscriptionPreview = Pick<SubscriptionBase, 'subscription' | 'isBasicKind'> & {
    type: Record<string, SubscriptionPreviewData>;
    route: Route;
}


export type {
    PlanName,
    PlanType,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency,
    SubscriptionBase,
    Subscription
};
