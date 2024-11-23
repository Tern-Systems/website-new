'use client';

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from 'react';
import {createRoot, Root} from "react-dom/client";
import {IUserContext} from "@/app/context/User.context";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";


type ModalCustomProps = {
    userCtx?: IUserContext;
    router?: AppRouterInstance;
}

interface IModalContext {
    isModalVisible: boolean;
    closeModal: () => void;
    openModal: (component: FC<ModalProps>, props?: ModalCustomProps) => void;
}

type ModalProps = ModalCustomProps & Pick<IModalContext, 'openModal' | 'closeModal'>;

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [ModalRoot, setModalRoot] = useState<Root | null>(null);

    const closeModal = () => {
        if (ModalRoot === null)
            return;
        ModalRoot.render(null);
        setModalVisibility(false);
    }
    const openModal = (Component: FC<ModalProps>, props?: ModalCustomProps) => {
        if (ModalRoot === null)
            return;
        ModalRoot.render(<Component {...props} closeModal={closeModal} openModal={openModal}/>);
        setModalVisibility(true);
    }

    useEffect(() => {
        const ModalRootElem = document.getElementById('modal-portal');
        if (ModalRootElem !== null)
            setModalRoot(createRoot(ModalRootElem));
    }, [])

    return (
        <ModalContext.Provider value={{isModalVisible, openModal, closeModal}}>
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