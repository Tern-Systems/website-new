import React, {FC} from "react";

import {UserData} from "@/app/context/User.context";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button} from "@/app/ui/form";

import {DeleteAccountConfirmModal} from "./DeleteAccountConfirmModal";


const BTN_CN = 'h-[min(4.3dvw,1.45rem)] px-[min(2.4dvw,1rem)] rounded-full';


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
            <span className={'flex gap-[min(1.3dvw,0.63rem)] mt-[min(2.7dvw,1.25rem)] justify-center'}>
                <Button
                    className={`text-red border-control-red border-small ${BTN_CN}`}
                    onClick={() =>
                        modalCtx.openModal(<DeleteAccountConfirmModal userData={userData}/>, {darkenBg: true})}
                >
                    Continue
                </Button>
                <Button
                    className={`bg-control-gray-l0 ${BTN_CN}`}
                    onClick={() => modalCtx.closeModal()}
                >
                    Cancel
                </Button>
            </span>
        </BaseModal>
    );
}

export {DeleteAccountModal}