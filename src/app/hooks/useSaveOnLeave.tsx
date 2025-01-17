import React, {useEffect} from "react";

import {NavigationState} from "@/app/context/Layout.context";

import {useLayout, useModal} from "@/app/context";

import {SaveChangesModal} from "@/app/ui/modals";
import {useNavigate} from "@/app/hooks/useNavigate";


const useSaveOnLeave = (
    onSave?: () => Promise<boolean>,
    onDontSave?: () => void | Promise<void>
): ((prevent: boolean) => void) => {
    const modalCtx = useModal();
    const [navigate] = useNavigate();

    const layoutCtx = useLayout();
    //eslint-disable-next-line
    const [navigationState, setNavigationState, blockedRoute, setBlockedRoute] = layoutCtx.navigateState;


    const setPreventState = (prevent: boolean) => {
        setNavigationState(prevent ? NavigationState.BLOCKED : NavigationState.FREE);
    }

    useEffect(() => {
        if (navigationState !== NavigationState.TRY_NAVIGATE)
            return;

        const handleNavigation = async () => {
            const navigateBlockedRoute = async () => {
                if (blockedRoute) {
                    await navigate(blockedRoute);
                    setBlockedRoute(null);
                }
            }

            modalCtx.openModal(
                <SaveChangesModal
                    onSave={async () => {
                        const success = await onSave?.();
                        if (success) {
                            setNavigationState(NavigationState.FREE);
                            await navigateBlockedRoute();
                        } else
                            setNavigationState(NavigationState.BLOCKED);
                    }}
                    onDontSave={async () => {
                        onDontSave?.();
                        setNavigationState(NavigationState.FREE);
                        await navigateBlockedRoute();
                    }}
                    onCancel={() => setNavigationState(NavigationState.BLOCKED)}
                />,
                {darkenBg: true}
            );
        }
        handleNavigation();
        //eslint-disable-next-line
    }, [navigationState]);


    useEffect(() => {
        const handle = (event: BeforeUnloadEvent | HashChangeEvent) => {
            if (navigationState === NavigationState.BLOCKED)
                event.preventDefault();
        };

        window.addEventListener('beforeunload', handle);
        window.addEventListener('hashchange', handle);
        return () => {
            window.removeEventListener('beforeunload', handle);
            window.removeEventListener('hashchange', handle);
        }
        //eslint-disable-next-line
    }, [navigationState])

    return setPreventState;
}


export {useSaveOnLeave};
