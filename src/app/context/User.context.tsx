"use client";

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState,} from "react";

import {Subscription} from "@/app/types/subscription";
import {IndustryKey, JobFunctionKey, SubIndustryKey,} from "@/app/static/company";

import {CountryKey, StateKey} from "@/app/static";
import {UserService} from "@/app/services";
import {LanguageKey, SalutationKey} from "@/app/static/misc";

type AddressType = "businessAddress" | "personalAddress";
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

type PhoneType = "mobile" | "business" | "personal";
type PhoneBase = {
    number: string;
    isPrimary: boolean;
};
type Phone = PhoneBase | (PhoneBase & { ext: string });
type UserPhone = Record<PhoneType, Phone | null>;

type FullName = {
    salutation: SalutationKey | "";
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
    archPurchased: boolean;
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
    setSession: (data: UserData, token: string) => void;
    removeSession: () => void;
}


const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean | null>(null);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setSession = (userData: UserData, token: string) => {
        setUserDataHelper(userData);
        setLoggedState(true);
        setToken(token);
        localStorage.setItem("token", token);
    };
    const removeSession = () => {
        setUserDataHelper(null);
        setLoggedState(false);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        const fetchUserData = async (token: string) => {
            try {
                const {payload: user} = await UserService.getUser(token);
                setSession(user, token);
            } catch (error: unknown) {
                setLoggedState(false);
            }
        };

        const token = localStorage.getItem("token");
        if (token) fetchUserData(token);
        else setLoggedState(false);
    }, []);

    return (
        <UserContext.Provider
            value={{userData, isLoggedIn, setSession, removeSession, token}}
        >
            {props.children}
        </UserContext.Provider>
    );
};

const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider!");
    return context;
};

export {UserProvider, useUser};
export type {
    UserData,
    Address,
    Phone,
    UserPhone,
    FullName,
    UserAddress,
    Company,
};
