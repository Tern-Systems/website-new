import {Route} from "@/app/static";


type SubscriptionRecurrency = 'annual' | 'monthly';
type PlanName = 'ARCH' | 'dot' | 'TernKey' | 'trial';
type PlanType = 'Basic' | 'Standard' | 'Pro';

type Subscription = {
    subscription: PlanName;
    recurrency?: SubscriptionRecurrency;
    priceUSD: number;
    type: PlanType;
    isBasicKind: boolean;
}

type SubscriptionPreviewData = {
    icon: string;
    priceUSD: Record<SubscriptionRecurrency, number>;
    benefits: string[];
}

type SubscriptionPreview = Pick<Subscription, 'subscription' | 'isBasicKind'> & {
    type: Record<string, SubscriptionPreviewData>;
    route: Route;
}


export type {PlanName, PlanType, SubscriptionPreview, SubscriptionPreviewData, SubscriptionRecurrency, Subscription}