'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { COOKIE_TOKEN_KEY_PREFIX } from '@/app/utils/auth';

import { UserData } from '@/app/contexts/user.context';

import { UserService } from '@/app/services';

import { createCookie } from '@/app/utils';
import { UserContext } from '@/app/contexts';

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean | null>(null);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const setSession = (token: string, userData?: UserData) => {
        if (userData) setUserDataHelper(userData);
        setLoggedState(true);

        document.cookie = createCookie(token);

        setToken(token);
    };
    const removeSession = () => {
        setUserDataHelper(null);
        setLoggedState(false);
        document.cookie = createCookie(null);
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
        const token = document.cookie.split(COOKIE_TOKEN_KEY_PREFIX).pop()?.split(';').shift();
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
