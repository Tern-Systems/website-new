'use client'

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Subscription} from "@/app/static/types";


type UserSubscription = Pick<Subscription, 'subscription' | 'type' | 'recurrency' | 'isBasicKind'>

interface UserData {
    email: string;
    telephone: string;
    isEmailVerified: boolean;
    isPurchased: boolean;
    isActivated2FA: boolean;
    subscriptions: UserSubscription[];
    lastLogin: number,
}

const USER_TEMPLATE: UserData = {
    email: 'admin@gmail.com',
    telephone: '1234567788',
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
    isActivated2FA: false,
    lastLogin: Date.now(),
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
export type {UserData, UserSubscription}
