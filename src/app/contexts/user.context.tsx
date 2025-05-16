'use client';

import { createContext } from 'react';

import { Subscription } from '@/app/types/subscription';
import { IndustryKey, JobFunctionKey, SubIndustryKey } from '@/app/static/company';

import { CountryKey, LanguageKey, SalutationKey, StateKey } from '@/app/static';

type AddressType = 'businessAddress' | 'personalAddress';
type Address = {
    line1: string;
    line2: string;
    city: string;
    zip: string;
    state: StateKey;
    country: CountryKey;
    isPrimary: boolean;
};
type UserAddress = Record<AddressType, Address | null>;

type PhoneType = 'mobile' | 'business' | 'personal';
type PhoneBase = {
    number: string;
    isPrimary: boolean;
};
type Phone = PhoneBase | (PhoneBase & { ext: string });
type UserPhone = Record<PhoneType, Phone | null>;

type FullName = {
    salutation: SalutationKey | '';
    firstName: string;
    lastName: string;
    initial?: string;
};

type Company = {
    name: string;
    jobTitle: string;
    jobFunction: JobFunctionKey;
    industry: IndustryKey;
    subIndustry: SubIndustryKey;
};

// User data
interface UserData {
    // Todo (scaling) 2FA for email
    name: FullName;
    ternID: string;
    username: string;
    language: LanguageKey;
    email: string;
    registrationDate: number;
    phones: UserPhone;
    ternKeyPurchased: boolean;
    subscriptions: Subscription[];
    lastLogin: number;
    connectedApps: {
        social: { name: string; link: string }[];
        data: { name: string; link: string }[];
    };
    personalDomain: { link: string; isVerified: boolean } | null;
    address: UserAddress;
    company: Company | null;
    passwordUpdateDate: number;
    photo: string | null;
    verification: {
        phone: boolean;
        email: boolean;
    };
    state2FA: {
        email: string | null;
        phone: string | null;
    };
    twoFA: boolean;
    hasHistory: boolean;
}

interface IUserContext {
    userData: UserData | null;
    isLoggedIn: null | boolean;
    token: string | null;
    setSession: (token: string, data?: UserData) => void;
    removeSession: () => void;
    setupSession: (fetchPlanDetails?: boolean, token?: string) => Promise<UserData | null>;
    is2FAInProgress: boolean;
    set2FAVerificationInProgress: (
        inProgress: boolean,
        tfaData?: {
            email: string;
            phone: string;
            twoFAEmail: string;
        },
    ) => void;
    get2FAInProgressData: () => {
        inProgress: boolean;
        email: string;
        phone: string;
        twoFAEmail: string;
    } | null;
}

const UserContext = createContext<IUserContext | null>(null);

export type { IUserContext, UserData, Address, Phone, UserPhone, FullName, UserAddress, Company };
export { UserContext };
