import React, {useEffect, useState} from "react";

import {useModal} from "@/app/context";

import {SaveChangesModal} from "@/app/ui/modals";


const useSaveOnLeave = (onSave: () => Promise<void>, onDontSave?: () => Promise<void>) => {
    const modalCtx = useModal();
    const [shouldPrevent, setPreventState] = useState(true);

    useEffect(() => {
        const handle = (event: BeforeUnloadEvent | HashChangeEvent) => {
            const middleware = (handler: (() => Promise<void>) | undefined) => {
                return async () => {
                    setPreventState(false);
                    handler?.();
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
    }, [onSave, onDontSave, shouldPrevent, modalCtx]);
}


export {useSaveOnLeave};
