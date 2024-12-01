import {PlanRecurrency, PlanType} from "@/app/context";

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


type Plan = Record<NonNullable<PlanType>, {
    icon: string;
    priceUSD: Record<PlanRecurrency, number>;
    benefits: string[];
}>


export type {CardData, Plan}