'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { UserData } from '@/app/contexts/user.context';

import { UserService } from '@/app/services';

import { UserContext } from '@/app/contexts';

const COOKIE_TOKEN_KEY_NAME = 'bearer-token=';
const COOKIE_TOKEN_EXPIRE_S = 900; // 15 mins

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
            } catch (_: unknown) {
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

export { UserProvider };
