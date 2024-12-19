'use client';

import React, {createContext, FC, PropsWithChildren, ReactElement, useContext, useEffect, useState} from 'react';

import {useLayout} from "@/app/context/Layout.context";

import styles from "@/app/common.module.css";


type ModalConfig = { hideContent?: boolean; darkenBg?: boolean }

type OpenModal = (Component: ReactElement, config?: ModalConfig) => void;

interface IModalContext {
    hideContent: boolean;
    isOpened: boolean;
    closeModal: () => void;
    openModal: OpenModal;
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [config, setConfig] = useState<ModalConfig>({darkenBg: false, hideContent: false});
    const [Modal, setModal] = useState<ReactElement | null>(null);

    const layoutCtx = useLayout();


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape')
                closeModal();
        }

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        }
        //eslint-disable-next-line
    }, [])

    const handleModalChange = (Component: ReactElement | null, config: ModalConfig) => {
        setModal(Component);
        setConfig(config);
    }

    const closeModal = () => handleModalChange(null, {});

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) =>
        handleModalChange(ModalElem, config ?? {});

    return (
        <ModalContext.Provider
            value={{
                hideContent: config.hideContent == true,
                isOpened: Modal !== null,
                openModal,
                closeModal,
            }}
        >
            <div
                className={config.darkenBg && !config.hideContent ? 'brightness-[60%]' : 'brightness-100'}>
                <div
                    className={`absolute z-50 w-full h-full flex overflow-hidden pointer-events-auto font-neo text-primary
                            ${Modal ? '' : 'hidden'} ${layoutCtx.isFade ? styles.fadeOut : styles.fadeIn}`}
                >
                    {Modal}
                </div>
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