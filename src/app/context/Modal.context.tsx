'use client';

import React, {createContext, FC, PropsWithChildren, ReactElement, useContext, useEffect, useState} from 'react';
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {createRoot, Root} from "react-dom/client";

import {IUserContext} from "@/app/context/User.context";


type ModalCustomProps = {
    userCtx?: IUserContext;
    router?: AppRouterInstance;
}

type ModalConfig = {
    props?: ModalCustomProps,
    isAbsolute?: boolean,
    isDarkBg?: boolean
}

interface IModalContext {
    Modal: ReactElement | null;
    isDarkBg: boolean;
    closeModal: (isAbsolute: boolean) => void;
    openModal: (component: FC<ModalProps>, config?: ModalConfig) => void;
}

type ModalProps = ModalCustomProps & Pick<IModalContext, 'openModal' | 'closeModal'>;

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [Modal, setModal] = useState<ReactElement | null>(null);
    const [ModalRoot, setModalRoot] = useState<Root | null>(null);
    const [isDarkBg, setDarkBgState] = useState(false);

    const closeModal = (isAbsolute: boolean) => {
        if (!isAbsolute)
            setModal(null);
        else if (ModalRoot !== null) {
            ModalRoot.render(null);
            setDarkBgState(false);
        }
    }
    const openModal = (Component: FC<ModalProps>, config?: ModalConfig) => {
        const ModalElem = <Component {...config?.props} closeModal={closeModal} openModal={openModal}/>;

        if (!config?.isAbsolute)
            setModal(ModalElem);
        else if (ModalRoot !== null) {
            ModalRoot.render(ModalElem);
            setDarkBgState(config?.isDarkBg ?? false);
        }
    }

    useEffect(() => {
        const ModalRootElem = document.getElementById('modal-portal');
        if (ModalRootElem !== null)
            setModalRoot(createRoot(ModalRootElem));
    }, [])

    return (
        <ModalContext.Provider value={{Modal, isDarkBg, openModal, closeModal}}>
            {props.children}
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
export type {IModalContext, ModalProps}