'use client';

import { FC } from 'react';

import { UserData } from '@/app/contexts/user.context';

import { useModal } from '@/app/hooks';

import { BaseModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

import { DeleteAccountConfirmModal } from './DeleteAccountConfirmModal';

const BTN_CN = 'h-button-n px-xxs rounded-full';

interface Props {
    userData: UserData | null;
}

const DeleteAccountModal: FC<Props> = (props: Props) => {
    const { userData } = props;

    const modalCtx = useModal();

    if (!userData) return null;

    // Event Handlers
    const handleOpenModal = () =>
        modalCtx.openModal(<DeleteAccountConfirmModal userData={userData} />, { darkenBg: true });

    const handleCloseModal = () => modalCtx.closeModal();

    return (
        <BaseModal
            title={'Account Offboarding'}
            className={'w-[min(90dvw,34rem)] text-center leading-[120%]'}
        >
            <span>
                You are about to delete your Tern account associated with&nbsp;
                <span className={'font-bold'}>{userData.email}</span>. Are you sure you want to proceed with this
                action?
            </span>
            <span className={'mt-xs flex justify-center gap-4xs'}>
                <Button
                    className={`border-s border-red text-red ${BTN_CN}`}
                    onClick={handleOpenModal}
                >
                    Continue
                </Button>
                <Button
                    className={`bg-gray-l0 ${BTN_CN}`}
                    onClick={handleCloseModal}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
};

export { DeleteAccountModal };
