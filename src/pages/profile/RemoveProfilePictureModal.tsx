import React, { FC } from 'react';

import { UserService } from '@/app/services';

import { useModal, useUser } from '@/app/context';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button } from '@/app/ui/form';

const BTN_CN = 'px-[min(2.7dvw,1rem)] h-h-button-n rounded-full';

interface Props {
    onRemove: () => void;
}

const RemoveProfilePictureModal: FC<Props> = (props: Props) => {
    const { onRemove } = props;

    const modalCtx = useModal();
    const { userData, fetchUserData } = useUser();

    const handleRemove = async () => {
        if (!userData) return;
        try {
            const { message } = await UserService.postRemoveProfilePicture(userData.email);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            await fetchUserData(false);
            onRemove();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    return (
        <BaseModal
            title={'Remove Profile Picture'}
            className={'w-[min(90dvw,34rem)] text-center leading-[120%]'}
        >
            <span>
                This will remove File Name as your profile picture. To proceed with this action please click the red
                remove button below.
            </span>
            <span className={'mt-xs flex justify-center gap-4xs'}>
                <Button
                    onClick={() => handleRemove()}
                    className={`border-s border-red text-red ${BTN_CN}`}
                >
                    Remove
                </Button>
                <Button
                    onClick={() => modalCtx.closeModal()}
                    className={`bg-gray-l0 ${BTN_CN}`}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
};

export { RemoveProfilePictureModal };
