'use client';

import React, {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    ReactElement, SetStateAction,
    useContext,
    useEffect,
    useState
} from 'react';
import cn from "classnames";

import {useLayout} from "@/app/context/Layout.context";

import styles from "@/app/common.module.css";


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

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const layoutCtx = useLayout();

    const [config, setConfig] = useState<ModalConfig>({});
    const [Modal, setModal] = useState<ReactElement | null>(null);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape')
                closeModal();
        }

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
        //eslint-disable-next-line
    }, [Modal])

    const handleModalChange = (Component: ReactElement | null, config: ModalConfig) => {
        setModal(Component);
        setConfig({...config, doFading: config.doFading ?? true});
    }

    const closeModal = () => {
        handleModalChange(null, {});
    }

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) =>
        handleModalChange(ModalElem, config ?? {});

    return (
        <ModalContext.Provider
            value={{
                isOpened: Modal !== null,
                hideContent: config.hideContent == true,
                darkenBg: config.darkenBg == true,
                openModal,
                closeModal,
            }}
        >
            <div
                className={cn(
                    `absolute z-50 w-full h-full flex overflow-hidden pointer-events-none font-neo text-primary select-none`,
                    {['hidden']: !Modal}, layoutCtx.isFade && config.doFading ? styles.fadeOut : styles.fadeIn
                )}
            >
                {Modal}
            </div>
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
export type {IModalContext, OpenModal}