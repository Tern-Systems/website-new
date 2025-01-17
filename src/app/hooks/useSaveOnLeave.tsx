import React, {useEffect, useState} from "react";

import {useModal, useUser} from "@/app/context";

import {SaveChangesModal} from "@/app/ui/modals";


const useSaveOnLeave = (onSave?: () => Promise<void>, onDontSave?: () => void | Promise<void>) => {
    const modalCtx = useModal();
    const {isLoggedIn} = useUser();

    const [shouldPrevent, setPreventState] = useState(false);

    useEffect(() => {
        if (!isLoggedIn)
            return;

        const handle = (event: BeforeUnloadEvent | HashChangeEvent) => {
            const middleware = (handler: (() => void | Promise<void>) | undefined) => {
                return async () => {
                    setPreventState(false);
                    await handler?.();
                };
            }

            if (shouldPrevent) {
                event.preventDefault();
                modalCtx.openModal(
                    <SaveChangesModal onSave={middleware(onSave)} onDontSave={middleware(onDontSave)}/>,
                    {darkenBg: true}
                );
            }
        };

        window.addEventListener('beforeunload', handle);
        window.addEventListener('hashchange', handle);
        return () => {
            window.removeEventListener('beforeunload', handle);
            window.removeEventListener('hashchange', handle);
        }
    }, [onSave, onDontSave, shouldPrevent, modalCtx, isLoggedIn])

    return setPreventState;
}


export {useSaveOnLeave};
