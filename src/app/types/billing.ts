import { DeepPartial } from '@/app/types/utils';

import { CountryKey, StateKey } from '@/app/static';
import { SubscriptionRecurrency } from './subscription';

type CardData = DeepPartial<{
    profileId?: string;
    id: string;
    type: string;
    cardNumber: string;
    expirationDate: string;
    cvc: string;
    cardholderName: string;
    country: CountryKey;
    billingAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zip: string;
    state: StateKey;
    nickName: string;
    isPreferred: boolean;
}>;

type Invoice = DeepPartial<{
    id: number;
    startDate: number;
    to: string;
    from: string;
    card: Pick<SavedCard, 'last4' | 'cardType' | 'nickName'>;
    item: { name: string; priceUSD: number };
    subtotalUSD: number;
    totalDue: number;
    taxPercent: number;
    paidUSD: number;
    country: CountryKey;
    state: StateKey;
    status: 'paid' | 'unpaid';
    type: SubscriptionRecurrency;
}>;

type SavedCard = DeepPartial<{
    billingAddress: {
        firstName: string;
        lastName: string;
        country: CountryKey;
        address: string;
        city: string;
        zip: string;
        state: StateKey;
    };
    nickName: string;
    cardType: string;
    expDate: string;
    id: string;
    last4: string;
    preferred: boolean;
}>;

type SavedCardFull = DeepPartial<{
    customerProfileId: string;
    paymentProfileId: string;
    billingAddress: {
        address: string;
        city: string;
        country: string;
        firstName: string;
        lastName: string;
        state: string;
        zip: string;
    };
    cardNumber: string;
    cardType: string;
    expDate: string;
    last4: string;
    nickName: string;
    preferred: boolean;
}>;

export type { CardData, Invoice, SavedCard, SavedCardFull };
