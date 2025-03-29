'use client';

import { createContext, ReactElement } from 'react';

type ModalConfig = { hideContent?: boolean; darkenBg?: boolean; doFading?: boolean };

type OpenModal = (Component: ReactElement, config?: ModalConfig) => void;

interface IModalContext {
    hideContent: boolean;
    darkenBg: boolean;
    isOpened: boolean;
    closeModal: () => void;
    openModal: OpenModal;
}

const ModalContext = createContext<IModalContext | null>(null);

export type { IModalContext, OpenModal, ModalConfig };
export { ModalContext };
