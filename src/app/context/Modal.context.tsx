'use client';

import React, {createContext, FC, PropsWithChildren, ReactElement, useContext, useState} from 'react';

import {BaseModal} from "@/app/components/modals/Base";


type ModalConfig = {
    isSimple?: boolean;
    hideContent?: boolean;
    title?: string;
}

interface IModalContext {
    Modal: ReactElement | null;
    hideContent: boolean;
    closeModal: () => void;
    openModal: (Component: ReactElement | string, config?: ModalConfig) => void;
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isSimpleModal, setSimpleModal] = useState(false);
    const [hideContent, setHideContent] = useState(false);
    const [Modal, setModal] = useState<ReactElement | null>(null);

    const handleModalChange = (Component: ReactElement | null, isSimple: boolean, hideContent: boolean) => {
        setModal(Component);
        setSimpleModal(isSimple);
        setHideContent(hideContent);
    }

    const closeModal = () => handleModalChange(null, false, false);

    const openModal = (Component: ReactElement | string, config?: ModalConfig) => {
        const ModalElem = (
            <BaseModal
                simple={config?.isSimple === true}
                title={config?.title}
                onClick={() => closeModal()}
            >
                {Component}
            </BaseModal>
        );
        handleModalChange(ModalElem, config?.isSimple === true, config?.hideContent === true);
    }

    const ModalElem = Modal ? (
        <div className={`absolute z-50 w-full h-full content-center text-primary font-neo overflow-hidden`}>
            {Modal}
        </div>
    ) : null;

    return (
        <ModalContext.Provider value={{Modal, hideContent, openModal, closeModal}}>
            {ModalElem}
            <div className={Modal && !isSimpleModal ? 'brightness-[60%]' : 'brightness-100'}>
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