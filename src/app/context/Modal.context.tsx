'use client';

import React, {
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useContext,
    useState
} from 'react';

import styles from "@/app/common.module.css";


type ModalConfig = { hideContent?: boolean; darkenBg?: boolean }

type OpenModal = (Component: ReactElement, config?: ModalConfig) => void;

interface IModalContext {
    hideContent: boolean;
    isOpened: boolean;
    closeModal: () => void;
    openModal: OpenModal;
    setFadeState: Dispatch<SetStateAction<boolean>>;
    isFade: boolean;
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [config, setConfig] = useState<ModalConfig>({darkenBg: false, hideContent: false});
    const [Modal, setModal] = useState<ReactElement | null>(null);
    const [isFade, setFadeState] = useState<boolean>(false);


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
                setFadeState,
                isFade
            }}>
            <div
                hidden={!Modal}
                className={`absolute z-50 w-full h-full flex text-primary font-neo overflow-hidden pointer-events-none
                            ${isFade ? styles.fadeOut : styles.fadeIn}`}
            >
                {Modal}
            </div>
            <div
                className={config.darkenBg && !config.hideContent ? 'brightness-[60%]' : 'brightness-100'}>
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