'use client'

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";

import {Subscription} from "@/app/types/subscription";
import {IndustryKey, JobFunctionKey, SubIndustryKey} from "@/app/static/company";

import {CountryKey, LANGUAGE, SALUTATION, StateKey} from "@/app/static";


type UserSubscription = Pick<Subscription, 'subscription' | 'type' | 'recurrency' | 'isBasicKind'>

type AddressType = 'businessAddress' | 'personalAddress';
type Address = {
    line1: string;
    line2: string;
    city: string;
    zip: string;
    state: StateKey;
    country: CountryKey;
    isPrimary: boolean;
}
type UserAddress = Record<AddressType, Address | null>

type PhoneType = 'mobile' | 'business' | 'personal';
type PhoneBase = {
    number: string;
    isPrimary: boolean;
}
type Phone = PhoneBase | PhoneBase & { ext: string; }
type UserPhone = Record<PhoneType, Phone | null>;

type FullName = {
    salutation: keyof typeof SALUTATION | '';
    firstname: string;
    lastname: string;
    initial?: string;
}

type Company = {
    name: string;
    jobTitle: string;
    jobFunction: JobFunctionKey;
    industry: IndustryKey;
    subIndustry: SubIndustryKey;
}

// User data
interface UserData {
    name: FullName;
    ternID: string;
    displayName?: string;
    preferredLanguage: keyof typeof LANGUAGE,
    email: string;
    registrationDate: number;
    phone: UserPhone;
    isEmailVerified: boolean;
    isPurchased: boolean;
    state2FA: {
        email: string | null;
        phone: string | null;
    };
    subscriptions: UserSubscription[];
    lastLogin: number;
    connectedApps: {
        social: { name: string; link: string }[];
        data: { name: string; link: string }[];
    }
    personalDomain: { link: string, isVerified: boolean } | null;
    address: UserAddress;
    company: Company | null;
    passwordUpdateDate: number;
}

const USER_TEMPLATE: UserData = {
    email: 'admin@gmail.com',
    ternID: 'ternID',
    registrationDate: Date.now(),
    name: {
        salutation: 'MR',
        firstname: 'John',
        lastname: 'Doe',
        initial: '',
    },
    displayName: 'Display_Name',
    preferredLanguage: 'en-US',
    passwordUpdateDate: Date.now(),
    phone: {
        mobile: null,
        business: {number: '1234567788', isPrimary: false, ext: '4324'},
        personal: {number: '1984327389', isPrimary: false},
    },
    subscriptions: [
        {
            type: 'pro',
            recurrency: 'monthly',
            isBasicKind: true,
            subscription: 'ternKey',
        }
    ],
    isPurchased: true,
    isEmailVerified: true,
    state2FA: {
        email: null,
        phone: null,
    },
    lastLogin: Date.now(),
    connectedApps: {
        social: [{name: 'Discord', link: 'http://discord.com/'}],
        data: [{name: 'Google Drive', link: 'http://drive.google.com/'}]
    },
    personalDomain: {link: 'http://domain.com', isVerified: true},
    address: {
        businessAddress: {
            line1: '1120 Avenue of the Americas',
            line2: 'FL 4 UNIT 4189',
            state: 'NY',
            zip: '10036',
            city: 'New York',
            country: 'US',
            isPrimary: true,
        },
        personalAddress: null,
    },
    company: {
        name: 'Tern Systems LLC',
        jobTitle: 'President',
        jobFunction: 'C01',
        industry: 'U',
        subIndustry: 'UA',
    }
}

interface IUserContext {
    userData: UserData | null;
    isLoggedIn: boolean;
    token: string | null;
    setSession: (data: UserData, token: string) => void;
    removeSession: () => void;
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean>(false);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setSession = (userData: UserData, token: string) => {
        setUserDataHelper(userData);
        setLoggedState(true);
        setToken(token);
    }
    const removeSession = () => {
        setUserDataHelper(null);
        setLoggedState(false);
    }

    useEffect(() => {
        // TODO
        setSession(USER_TEMPLATE, 'some token');
    }, [])

    return (
        <UserContext.Provider value={{userData, isLoggedIn, setSession, removeSession, token}}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (!context)
        throw new Error('useUser must be used within a UserProvider!');
    return context;
};

export {UserProvider, useUser}
export type {UserData, UserSubscription, Address, Phone, UserPhone, FullName, UserAddress, Company}
