import React, { useEffect } from 'react';

import { NavigationState } from '@/app/context/Layout.context';

import { useLayout, useModal } from '@/app/context';

import { SaveChangesModal } from '@/app/ui/modals';
import { useNavigate } from '@/app/hooks/useNavigate';

type Args = {
    editId?: string;
    parentEditId?: string | null;
    onSave?: () => Promise<boolean>;
    onDontSave?: () => void | Promise<void>;
    checkSave?: () => boolean;
};

const useSaveOnLeave = (args: Args): ((prevent: boolean) => void) => {
    const { editId, parentEditId, onSave, onDontSave, checkSave } = args;

    const modalCtx = useModal();
    const [navigate] = useNavigate();

    const layoutCtx = useLayout();
    //eslint-disable-next-line
    const [navigationState, setNavigationState, blockedRoute, setBlockedRoute] = layoutCtx.navigateState;

    const setPreventState = (prevent: boolean) =>
        setNavigationState(prevent ? NavigationState.BLOCKED : NavigationState.FREE);

    useEffect(() => {
        if (navigationState !== NavigationState.TRY_NAVIGATE || editId !== parentEditId) return;

        const navigateBlockedRoute = async () => {
            if (blockedRoute) {
                await navigate(blockedRoute);
                setBlockedRoute(null);
            }
        };

        modalCtx.openModal(
            <SaveChangesModal
                key={editId}
                onSave={async () => {
                    if (checkSave?.()) return;
                    const success = await onSave?.();
                    if (success) {
                        setPreventState(false);
                        await navigateBlockedRoute();
                    } else setPreventState(true);
                }}
                onDontSave={async () => {
                    onDontSave?.();
                    setPreventState(false);
                    await navigateBlockedRoute();
                }}
                onCancel={() => setPreventState(true)}
            />,
            { darkenBg: true },
        );
        //eslint-disable-next-line
    }, [navigationState, editId, parentEditId]);

    useEffect(() => {
        const handle = (event: BeforeUnloadEvent | HashChangeEvent) => {
            if (navigationState === NavigationState.BLOCKED) event.preventDefault();
        };

        window.addEventListener('beforeunload', handle);
        window.addEventListener('hashchange', handle);
        return () => {
            window.removeEventListener('beforeunload', handle);
            window.removeEventListener('hashchange', handle);
        };
        //eslint-disable-next-line
    }, [navigationState])

    return setPreventState;
};

export { useSaveOnLeave };
