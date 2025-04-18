import { Route } from '@/app/static';
import { DeepPartial } from '@/app/types/utils';

type SubscriptionRecurrency = 'annual' | 'monthly';
type PlanName = 'Tidal' | 'trial';
type PlanType = 'Basic' | 'Pro';

type SubscriptionBase = DeepPartial<{
    subscription: PlanName;
    recurrency: SubscriptionRecurrency;
    priceUSD: number;
    type: PlanType;
    basicKind: boolean;
}>;

type Subscription = DeepPartial<
    SubscriptionBase & {
        tax: {
            amount: number;
            rate: number;
        };
        totalUSD: number;
        renewDate: number;
    }
>;

type SubscriptionPreviewData = DeepPartial<{
    priceUSD: Record<SubscriptionRecurrency, number>;
    benefits: string[];
}>;

type SubscriptionPreview = DeepPartial<
    Pick<SubscriptionBase, 'subscription' | 'basicKind'> & {
        type: Record<string, SubscriptionPreviewData>;
        route: Route;
    }
>;

export type {
    PlanName,
    PlanType,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency,
    SubscriptionBase,
    Subscription,
};
