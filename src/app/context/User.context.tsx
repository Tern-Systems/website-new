'use client'

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";

type PlanType = 'standard' | 'pro' | null;

interface UserData {
    email: string;
    planType: PlanType;
}

interface IUserContext {
    userData: UserData | null;
    isLoggedIn: boolean;
    setUserData: (data: UserData) => void;
    removeUserData: () => void;
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean>(false);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);

    const setUserData = (userData: UserData) => {
        setUserDataHelper(userData);
        setLoggedState(true);
    }
    const removeUserData = () => {
        setUserDataHelper(null);
        setLoggedState(false);
    }

    useEffect(() => {
        // TODO
    }, [])

    return (
        <UserContext.Provider value={{userData, isLoggedIn, setUserData, removeUserData}}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (!context)
        throw new Error('useUser must be used within a ModalProvider!');
    return context;
};

export {UserProvider, useUser}
export type {IUserContext}