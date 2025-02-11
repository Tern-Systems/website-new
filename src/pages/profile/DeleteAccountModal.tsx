import React, {FC} from "react";

import {UserData} from "@/app/context/User.context";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import {DeleteAccountConfirmModal} from "./DeleteAccountConfirmModal";


const BTN_CN = 'h-h-button-n px-xxs rounded-full';


interface Props {
    userData: UserData | null;
}

const DeleteAccountModal: FC<Props> = (props: Props) => {
    const {userData} = props;

    const modalCtx = useModal();

    if (!userData)
        return null;

    return (
        <BaseModal title={'Account Offboarding'} className={'w-[min(90dvw,34rem)] text-center leading-[120%]'}>
            <span>
                You are about to delete your Tern account associated with&nbsp;
                <span className={'font-bold'}>{userData.email}</span>.
                Are you sure you want to proceed with this action?
            </span>
            <span className={'flex gap-4xs mt-xs justify-center'}>
                <Button
                    className={`text-red border-red border-s ${BTN_CN}`}
                    onClick={() =>
                        modalCtx.openModal(<DeleteAccountConfirmModal userData={userData}/>, {darkenBg: true})}
                >
                    Continue
                </Button>
                <Button
                    className={`bg-gray-l0 ${BTN_CN}`}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
}

export {DeleteAccountModal}