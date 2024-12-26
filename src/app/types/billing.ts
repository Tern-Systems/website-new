import {CountryKey, StateKey} from "@/app/static";

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

export type {CardData, Invoice, SavedCard}