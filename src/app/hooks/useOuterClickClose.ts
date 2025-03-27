'use client';

import { MutableRefObject, useEffect } from 'react';

const useOuterClickClose = <T extends HTMLElement>(
    ref: MutableRefObject<T | null>,
    openedState: boolean | ((event: MouseEvent) => void),
    setOpened: ((state: false) => void) | (() => void),
) => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const opened = typeof openedState === 'boolean' ? openedState : openedState(event);
            if (opened && !ref.current?.contains(event.target as Node)) setOpened(false);
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, [openedState, setOpened]);
};

export { useOuterClickClose };
