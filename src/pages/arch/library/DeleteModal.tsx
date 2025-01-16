import React, {Dispatch, FC, SetStateAction} from "react";

import {ARCode} from "@/app/types/arcode";

import {ARCHService} from "@/app/services";

import {useModal, useUser} from "@/app/context";

import {BaseModal, MessageModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";


interface Props {
    adCode: Pick<ARCode, 'name' | 'mediaId'>;
    updateList: Dispatch<SetStateAction<boolean>>;
}

const DeleteModal: FC<Props> = (props: Props) => {
    const {adCode, updateList} = props;
    const userCtx = useUser();

    const modalCtx = useModal();

    const handleDelete = async () => {
        if (!userCtx.userData)
            return;
        try {
            await ARCHService.deleteQr(userCtx.userData.email, adCode.mediaId);
            modalCtx.openModal(<MessageModal>QR code was deleted</MessageModal>);
            updateList(true);
        } catch (error: unknown) {
            if (typeof error === 'string')
                modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    }

    return (
        <BaseModal
            title={'Delete AR Code?'}
            className={'text-center w-[30.3rem]'}
            classNameContent={'flex flex-col items-center mx-auto leading-[1.2]  lg:w-[90%]'}
        >
            <p>
                This will delete <span className={'font-bold'}>{adCode.name}</span> from your library.
                Are you sure you want to proceed with this action?
            </p>
            <span className={'flex gap-[0.62rem] font-bold mt-[--p-content-xs] text-small'}>
                <Button
                    className={'text-red border-control-red border-small px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => handleDelete()}
                >
                    Delete
                </Button>
                <Button
                    className={'bg-control-gray-l0 px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    )
}

export {DeleteModal}