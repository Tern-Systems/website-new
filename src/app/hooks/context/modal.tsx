'use client';

import { useContext } from 'react';

import { IModalContext, ModalContext } from '@/app/contexts/modal.context';
import { ModalProvider } from '@/app/providers';

const useModal = (): IModalContext => {
    const context = useContext(ModalContext);
    if (!context) throw new Error(`${useModal.name} must be used within a ${ModalProvider.name}!`);
    return context;
};

export { useModal };
