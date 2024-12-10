'use client'

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Subscription} from "@/app/static/types";


type UserSubscription = Pick<Subscription, 'subscription' | 'type' | 'recurrency' | 'isBasicKind'>

type Address = {
    type: 'business' | 'personal';
    line1: string;
    line2: string;
    cityZipState: string;
    country: string;
    isPrimary: boolean;
}
type Phone = {
    type: 'mobile' | 'business' | 'personal',
    number: string;
    ext?: string;
    isPrimary: boolean;
}

interface UserData {
    name: string;
    ternID: string;
    displayName: string;
    email: string;
    phones: Phone[];
    isEmailVerified: boolean;
    isPurchased: boolean;
    state2FA: {
        email: string | null;
        phone: string | null;
    };
    subscriptions: UserSubscription[];
    lastLogin: number;
    connectedSocialMedia: string[];
    connectedDataStorage: string[];
    personalDomain: { link: string, isVerified: boolean } | null;
    addresses: Address[];
    company: {
        name: string;
        jobTitle: string;
        jobFunction: string;
        industry: string;
        subIndustry: string;
    };
    passwordUpdateDate: number;
}

const USER_TEMPLATE: UserData = {
    email: 'admin@gmail.com',
    ternID: 'ternID',
    name: 'John Doe',
    displayName: 'Display_Name',
    passwordUpdateDate: Date.now(),
    phones: [
        {type: 'mobile', number: '1234567788', isPrimary: true},
        {type: 'business', number: '1234567788', isPrimary: false, ext: '4324'},
        {type: 'personal', number: '1234567788', isPrimary: false},
    ],
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
        phone: '123456782',
    },
    lastLogin: Date.now(),
    connectedSocialMedia: ['Discord'],
    connectedDataStorage: ['Google Drive'],
    personalDomain: {link: 'http://domain.com', isVerified: false},
    addresses: [
        {
            type: 'business',
            line1: '1120 Avenue of the Americas',
            line2: 'FL 4 UNIT 4189',
            cityZipState: 'New York, New York 10036',
            country: 'United States of America',
            isPrimary: true,
        },
        {
            type: 'personal',
            line1: '542 Spring Hill Road Skillman',
            line2: '',
            cityZipState: 'New Jersey 08558',
            country: 'United States of America',
            isPrimary: false,
        },
    ],
    company: {
        name: 'Tern Systems LLC',
        jobTitle: 'President',
        jobFunction: 'Chief Executive Officer - CEO',
        industry: 'Energy & Utilities',
        subIndustry: 'Electric',
    }
}

interface IUserContext {
    userData: UserData | null;
    isLoggedIn: boolean;
    setUserData: (data: UserData) => void;
    logOut: () => void;
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean>(false);
    const [userData, setUserDataHelper] = useState<UserData | null>(USER_TEMPLATE);

    const setUserData = (userData: UserData) => {
        setUserDataHelper(userData);
        setLoggedState(true);
    }
    const logOut = () => {
        setUserDataHelper(null);
        setLoggedState(false);
    }

    useEffect(() => {
        // TODO
    }, [])

    return (
        <UserContext.Provider value={{userData, isLoggedIn, setUserData, logOut}}>
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
export type {UserData, UserSubscription, Address, Phone}
