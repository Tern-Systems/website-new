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
    amount: number;
    name: string;
    startDate: string;
}

export type {CardData, Invoice}