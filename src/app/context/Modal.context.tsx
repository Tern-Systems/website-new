'use client';

import React, {createContext, FC, PropsWithChildren, ReactElement, useContext, useState} from 'react';

import {BaseModal} from "@/app/components/modals/Base";


type ModalConfig = {
    hideContent?: boolean;
    darkenBg?: boolean;
}

interface IModalContext {
    Modal: ReactElement | null;
    hideContent: boolean;
    closeModal: () => void;
    openModal: (Component: ReactElement, config?: ModalConfig) => void;
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [darkenBg, setSimpleModal] = useState(false);
    const [hideContent, setHideContent] = useState(false);
    const [Modal, setModal] = useState<ReactElement | null>(null);

    const handleModalChange = (Component: ReactElement | null, isSimple: boolean, hideContent: boolean) => {
        setModal(Component);
        setSimpleModal(isSimple);
        setHideContent(hideContent);
    }

    const closeModal = () => handleModalChange(null, false, false);

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) =>
        handleModalChange(ModalElem, config?.darkenBg === true, config?.hideContent === true);

    const ModalElem = Modal ? (
        <div className={`absolute z-50 w-full h-full flex text-primary font-neo overflow-hidden`}>
            {Modal}
        </div>
    ) : null;

    return (
        <ModalContext.Provider value={{Modal, hideContent, openModal, closeModal}}>
            {ModalElem}
            <div className={Modal && !darkenBg ? 'brightness-[60%]' : 'brightness-100'}>
                {props.children}
            </div>
        </ModalContext.Provider>
    );
};

const useModal = (): IModalContext => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error('useModal must be used within a ModalProvider!');
    return context;
};

export {ModalProvider, useModal}
export type {IModalContext}