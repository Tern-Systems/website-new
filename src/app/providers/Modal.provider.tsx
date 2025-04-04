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

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [Modal]);

    const handleModalChange = (Component: ReactElement | null, config: ModalConfig) => {
        setModal(Component);
        setConfig({ ...config, doFading: config.doFading ?? true });
    };

    const closeModal = () => {
        handleModalChange(null, {});
    };

    const openModal = (ModalElem: ReactElement, config?: ModalConfig) => handleModalChange(ModalElem, config ?? {});

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
            {Modal ? (
                <div
                    onClick={() => closeModal()}
                    className={cn(
                        `absolute z-50 flex h-full w-full select-none overflow-hidden text-primary`,
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
