import { Route } from '@/app/static';
import { DeepPartial } from '@/app/types/utils';

enum RecurrencyEnum {
    monthly = 1,
    annual = 12,
}

type SubscriptionRecurrency = 'annual' | 'monthly' | 'quarterly';
type PlanType = 'Basic' | 'Pro';

type SubscriptionBase = DeepPartial<{
    subscription: string;
    recurrency: SubscriptionRecurrency;
    priceUSD: number;
    type?: PlanType;
    basicKind?: boolean;
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
    priceUSD: Partial<Record<SubscriptionRecurrency, number>>;
    benefits: string[];
}>;

type SubscriptionPreview = DeepPartial<
    Pick<SubscriptionBase, 'subscription' | 'basicKind'> & {
        type: Record<string, SubscriptionPreviewData>;
        route: Route;
    }
>;

export { RecurrencyEnum };
export type {
    PlanType,
    SubscriptionPreview,
    SubscriptionPreviewData,
    SubscriptionRecurrency,
    SubscriptionBase,
    Subscription,
};
