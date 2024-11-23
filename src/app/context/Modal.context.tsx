'use client';

import React, {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from 'react';
import {createRoot, Root} from "react-dom/client";

type CloseModal = { closeModal: () => void; }

interface IModalContext extends CloseModal {
    openModal: (component: FC<CloseModal>) => void;
    isModalVisible: boolean;
}

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
    const openModal = (Component: FC<CloseModal>) => {
        if (ModalRoot === null)
            return;
        ModalRoot.render(<Component closeModal={closeModal}/>);
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
export type {IModalContext}