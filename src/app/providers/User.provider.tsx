'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { COOKIE_TOKEN_KEY_PREFIX } from '@/app/utils/auth';

import { UserData } from '@/app/contexts/user.context';

import { UserService } from '@/app/services';

import { createCookie } from '@/app/utils';
import { UserContext } from '@/app/contexts';

// Key for storing 2FA in progress state
const TFA_IN_PROGRESS_KEY = 'auth_2fa_in_progress';

const UserProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isLoggedIn, setLoggedState] = useState<boolean | null>(null);
    const [userData, setUserDataHelper] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const isLoading = useRef(false);
    // Add state to track if 2FA is in progress
    const [is2FAInProgress, set2FAInProgress] = useState(false);

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
        // Clear 2FA in progress flag from session storage
        sessionStorage.removeItem(TFA_IN_PROGRESS_KEY);
        set2FAInProgress(false);
    };

    // Add function to set 2FA in progress state
    const set2FAVerificationInProgress = (
        inProgress: boolean,
        tfaData?: {
            email: string;
            phone: string;
            twoFAEmail: string;
        },
    ) => {
        set2FAInProgress(inProgress);

        if (inProgress && tfaData) {
            // Save 2FA data to session storage
            sessionStorage.setItem(
                TFA_IN_PROGRESS_KEY,
                JSON.stringify({
                    inProgress: true,
                    ...tfaData,
                }),
            );
        } else {
            // Clear 2FA data
            sessionStorage.removeItem(TFA_IN_PROGRESS_KEY);
        }
    };

    // Function to get stored 2FA data if available
    const get2FAInProgressData = () => {
        if (typeof window === 'undefined') return null;

        try {
            const tfaData = sessionStorage.getItem(TFA_IN_PROGRESS_KEY);
            if (tfaData) {
                return JSON.parse(tfaData);
            }
        } catch (error) {
            console.error('Error reading 2FA state:', error);
            sessionStorage.removeItem(TFA_IN_PROGRESS_KEY);
        }

        return null;
    };

    const setupSession = useCallback(
        async (fetchPlanDetails?: boolean, bearer?: string): Promise<UserData | null> => {
            // Prevent multiple simultaneous calls
            if (isLoading.current) {
                console.log('Already loading user data, skipping');
                return userData; // Return current data if already loading
            }

            const tokenFinal = bearer ?? token;
            if (!tokenFinal) {
                setLoggedState(false);
                return null;
            }

            try {
                isLoading.current = true; // Set loading flag
                console.log('Fetching user data...');

                const { payload: user } = await UserService.getUser(tokenFinal, fetchPlanDetails);
                if (!fetchPlanDetails && userData) user.subscriptions = userData?.subscriptions;

                setSession(tokenFinal, user);

                // The 2FA checking is now handled in Auth.tsx
                return user;
            } catch (error: unknown) {
                console.error('Error fetching user data:', error);
                removeSession();
                return null;
            } finally {
                isLoading.current = false; // Reset loading flag
            }
        },
        [token, userData],
    );

    useEffect(() => {
        const tokenFromCookie = document.cookie.split(COOKIE_TOKEN_KEY_PREFIX).pop()?.split(';').shift();

        // Only run on first mount or when token changes significantly
        if (tokenFromCookie && tokenFromCookie !== token) {
            console.log('Loading session from cookie');
            setupSession(true, tokenFromCookie);
        } else if (!tokenFromCookie) {
            setLoggedState(false);
        }
    }, [setupSession, token]);

    return (
        <UserContext.Provider
            value={{
                userData,
                isLoggedIn,
                setSession,
                removeSession,
                setupSession,
                token,
                is2FAInProgress,
                set2FAVerificationInProgress,
                get2FAInProgressData,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export { UserProvider };
