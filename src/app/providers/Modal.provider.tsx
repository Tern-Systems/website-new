'use client';

import { FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';

import { ModalConfig } from '@/app/contexts/modal.context';

import { ModalContext } from '@/app/contexts';

import { useLayout } from '@/app/hooks';

import styles from '@/app/common.module.css';

const ModalProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const layoutCtx = useLayout();

    const [config, setConfig] = useState<ModalConfig>({});
    const [Modal, setModal] = useState<ReactElement | null>(null);
    // Track whether to prevent closing on outside clicks
    const [preventOutsideClose, setPreventOutsideClose] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Still allow Escape to close the modal regardless of preventOutsideClose setting
            if (event.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [Modal]);

    const handleModalChange = (Component: ReactElement | null, config: ModalConfig) => {
        setModal(Component);
        setConfig({ ...config, doFading: config.doFading ?? true });
        // Reset preventOutsideClose when modal changes
        setPreventOutsideClose(false);
    };

    const closeModal = () => {
        handleModalChange(null, {});
    };

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) => handleModalChange(ModalElem, config ?? {});

    // Function to set whether to prevent outside clicks from closing the modal
    const setModalPreventOutsideClose = (value: boolean) => {
        setPreventOutsideClose(value);
    };

    return (
        <ModalContext.Provider
            value={{
                isOpened: Modal !== null,
                hideContent: config.hideContent == true,
                darkenBg: config.darkenBg == true,
                openModal,
                closeModal,
                // Rename function to be more specific about its purpose
                setPreventClose: setModalPreventOutsideClose,
            }}
        >
            {Modal ? (
                <div
                    // Only check preventOutsideClose when clicking the background overlay
                    onClick={() => !preventOutsideClose && closeModal()}
                    className={cn(
                        `absolute pointer-events-none z-50 flex h-full w-full select-none overflow-hidden text-primary`,
                        layoutCtx.isFade && config.doFading ? styles.fadeOut : styles.fadeIn,
                    )}
                >
                    {Modal}
                </div>
            ) : null}
            {props.children}
        </ModalContext.Provider>
    );
};

export { ModalProvider };
