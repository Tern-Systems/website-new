import React, {FC} from "react";


import {useModal, UserData} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import {DeleteAccountConfirmModal} from "./DeleteAccountConfirmModal";


interface Props {
    userData: UserData | null;
}

const DeleteAccountModal: FC<Props> = (props: Props) => {
    const {userData} = props;

    const modalCtx = useModal();

    if (!userData)
        return <></>

    return (
        <BaseModal title={'Account Offboarding'} className={'w-[34.06rem] text-center leading-[120%]'}>
            <span>
                You are about to delete your Tern account associated with&nbsp;
                <span className={'font-bold'}>{userData.email}</span>.
                Are you sure you want to proceed with this action?
            </span>
            <span className={'flex gap-[0.62rem] mt-[1.25rem] justify-center'}>
                <Button
                    className={'text-[#F42200] border-[#F42200] border-small px-[1rem] h-[1.43rem] rounded-full'}
                    onClick={() => modalCtx.openModal(<DeleteAccountConfirmModal userData={userData}/>)}
                >
                    Continue
                </Button>
                <Button
                    className={'bg-control2 px-[1rem] text-[0.875rem] h-[1.44rem] rounded-full font-bold'}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
}

export {DeleteAccountModal}