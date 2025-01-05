'use client'

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";

import {Subscription} from "@/app/types/subscription";
import {IndustryKey, JobFunctionKey, SubIndustryKey} from "@/app/static/company";

import {CountryKey, LANGUAGE, SALUTATION, StateKey} from "@/app/static";
import {UserService} from "@/app/services";


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
interface UserData { // Todo (scaling) 2FA for email
    name: FullName;
    ternID: string;
    username: string;
    preferredLanguage: keyof typeof LANGUAGE,
    email: string;
    registrationDate: number;
    phones: UserPhone;
    ternKeyPurchased: boolean;
    archPurchased: boolean,
    subscriptions: UserSubscription[];
    lastLogin: number;
    connectedApps: {
        social: { name: string; link: string }[];
        data: { name: string; link: string }[];
    };
    personalDomain: { link: string, isVerified: boolean } | null;
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
    isLoggedIn: boolean;
    token: string | null;
    setSession: (data: UserData, token: string) => void;
    removeSession: () => void;
}

const FALLBACK_USER: UserData = {
    email: '',
    ternID: '',
    registrationDate: 0,
    hasHistory: false,
    photo: null,
    twoFA: false,
    name: {
        salutation: '',
        firstname: '',
        lastname: '',
        initial: '',
    },
    username: '',
    preferredLanguage: 'en-US',
    passwordUpdateDate: 0,
    phones: {
        mobile: null,
        business: null,
        personal: null,
    },
    subscriptions: [],
    ternKeyPurchased: false,
    archPurchased: false,
    verification: {
        phone: false,
        email: false
    },
    state2FA: {
        phone: null,
        email: null,
    },
    lastLogin: 0,
    connectedApps: {
        social: [],
        data: []
    },
    personalDomain: {link: '', isVerified: false},
    address: {
        businessAddress: {
            line1: '',
            line2: '',
            state: '',
            zip: '',
            city: '',
            country: '',
            isPrimary: false,
        },
        personalAddress: {
            line1: '',
            line2: '',
            city: '',
            zip: '',
            state: '',
            country: '',
            isPrimary: false
        },
    },
    company: {
        name: '',
        jobTitle: '',
        jobFunction: 'C01',
        industry: 'U',
        subIndustry: 'UA',
    }
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState(true);
    const [userData, setUserDataHelper] = useState<UserData | null>(FALLBACK_USER);
    const [token, setToken] = useState<string | null>(null);

    const setSession = (userData: UserData, token: string) => {
        setUserDataHelper(userData);
        setLoggedState(true);
        setToken(token);
        localStorage.setItem('token', token);
    }
    const removeSession = () => {
        setUserDataHelper(null);
        setLoggedState(false);
        localStorage.removeItem('token');
    }

    useEffect(() => {
        const fetchUserData = async (token: string) => {
            try {
                const {payload: user} = await UserService.getUser(token);
                setSession(user, token);
            } catch (error: unknown) {
            }
        }

        const token = localStorage.getItem('token');
        if (token)
            fetchUserData(token);
    }, []);

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
