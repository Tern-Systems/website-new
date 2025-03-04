'use client';

import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

import { Subscription } from '@/app/types/subscription';
import { IndustryKey, JobFunctionKey, SubIndustryKey } from '@/app/static/company';

import { CountryKey, LanguageKey, SalutationKey, StateKey } from '@/app/static';

import { UserService } from '@/app/services';

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
    setupSession: (fetchPlanDetails?: boolean, token?: string) => Promise<void>;
}

const COOKIE_TOKEN_KEY_NAME = 'bearer-token=';
const COOKIE_TOKEN_EXPIRE_S = 900; // 15 mins

const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean | null>(null);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setSession = (token: string, userData?: UserData) => {
        if (userData) setUserDataHelper(userData);
        setLoggedState(true);

        document.cookie = `${COOKIE_TOKEN_KEY_NAME}${token}; path=/; max-age=${COOKIE_TOKEN_EXPIRE_S}; secure; SameSite=Strict`;

        setToken(token);
        localStorage.setItem('token', token);
    };
    const removeSession = () => {
        setUserDataHelper(null);
        setLoggedState(false);
        localStorage.removeItem('token');
    };

    const setupSession = useCallback(
        async (fetchPlanDetails?: boolean, bearer?: string) => {
            const tokenFinal = bearer ?? token;
            if (!tokenFinal) return;

            try {
                const { payload: user } = await UserService.getUser(tokenFinal, fetchPlanDetails);
                if (!fetchPlanDetails && userData) user.subscriptions = userData?.subscriptions;
                setSession(tokenFinal, user);
            } catch (error: unknown) {
                setLoggedState(false);
            }
        },
        [token],
    );

    useEffect(() => {
        const token = document.cookie.split(COOKIE_TOKEN_KEY_NAME).pop();
        if (token) setupSession(true, token);
        else setLoggedState(false);
    }, [setupSession]);

    return (
        <UserContext.Provider
            value={{
                userData,
                isLoggedIn,
                setSession,
                removeSession,
                setupSession,
                token,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider!');
    return context;
};

export { UserProvider, useUser };
export type { UserData, Address, Phone, UserPhone, FullName, UserAddress, Company };
