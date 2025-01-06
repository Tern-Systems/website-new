import {CountryKey, StateKey} from "@/app/static";
import {SubscriptionRecurrency} from "./subscription";

type CardData = {
    type: string;
    cardNumber: string;
    expirationDate: string;
    cvc: string;
    cardholderName: string;
    billingCountry: CountryKey;
    billingAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    state: StateKey;
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
    country: CountryKey;
    state: StateKey;
    status: 'paid' | 'unpaid';
    type: SubscriptionRecurrency;
}

type InvoiceHistory = {
    amount: number;
    name: string;
    startDate: string;
}

type SavedCard  = {
    billingAddress: {
      firstName: string,
      lastName: string,
      country: string,
      address: string,
      city: string,
      zip: string,
      state: string,
    },
    cardType: string,
    expDate: string,
    id: string,
    last4: string,
    preferred: boolean,
}

export type {CardData, Invoice, InvoiceHistory, SavedCard}