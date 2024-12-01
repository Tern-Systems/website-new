'use client';

import React, {createContext, FC, PropsWithChildren, ReactElement, useContext, useState} from 'react';


type ModalConfig = { hideContent?: boolean; }

type OpenModal = (Component: ReactElement, config?: ModalConfig) => void;

interface IModalContext {
    hideContent: boolean;
    closeModal: () => void;
    openModal: OpenModal;
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [hideContent, setHideContent] = useState(false);
    const [Modal, setModal] = useState<ReactElement | null>(null);

    const handleModalChange = (Component: ReactElement | null, hideContent: boolean) => {
        setModal(Component);
        setHideContent(hideContent);
    }

    const closeModal = () => handleModalChange(null, false);

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) =>
        handleModalChange(ModalElem, config?.hideContent === true);

    return (
        <ModalContext.Provider value={{hideContent, openModal, closeModal}}>
            <div
                hidden={!Modal}
                className={`absolute z-50 w-full h-full flex text-primary font-neo overflow-hidden pointer-events-none`}
            >
                {Modal}
            </div>
            <div className={Modal ? 'brightness-[60%]' : 'brightness-100'}>
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
export type {IModalContext, OpenModal}