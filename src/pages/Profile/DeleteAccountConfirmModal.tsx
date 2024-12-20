import React, {FC, FormEvent, ReactElement} from "react";

import {UserData} from "@/app/context/User.context";

import {useForm} from "@/app/hooks";
import {useUser} from "@/app/context";

import {BaseModal} from "@/app/ui/modals";
import {Button, Input} from "@/app/ui/form";


const LIST: string[] = [
    'Account deletion is permanent and cannot be reversed.',
    'Once deleted, access to all Tern products and services, including TernKey, , ARCH, TernKit, and any future offerings, will be permanently revoked.',
    'You will not be able to register a new account using the same email address associated with the deleted account.',
    'Your data will be erased within 30 days, except for a limited subset that may be retained as required or permitted by law.',
]

type FormData = {
    email: string;
    confirm: string;
}

const FORM_DEFAULT: FormData = {
    confirm: '',
    email: '',
}


const INPUT_PROPS = {
    classNameWrapper: 'flex-col [&]:items-start gap-[min(1.3dvw,0.63rem)] mt-[0.96rem]',
    className: 'h-[min(5.9dvw,1.875rem)] w-full px-[min(1.6dvw,0.73rem)] bg-control-gray-l0 border-small b-control4 rounded-smallest',
    classNameLabel: 'font-bold',
    required: true,
}


interface Props {
    userData: UserData;
}

const DeleteAccountConfirmModal: FC<Props> = (props: Props) => {
    const {userData} = props;

    const userCtx = useUser();
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleAccountDelete = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // TODO delete account + logoff
        } catch (error: unknown) {
        }
    }

    const renderDeleteForm = () => {
        const isAllowedToDelete = formData.confirm === 'DELETE' && formData.email === userCtx.userData?.email;
        return (
            <form onSubmit={handleAccountDelete}>
                <Input
                    value={formData.email}
                    onChange={setFormValue('email')}
                    {...INPUT_PROPS}
                >
                    Please type your account email.
                </Input>
                <Input
                    value={formData.confirm}
                    onChange={setFormValue('confirm')}
                    {...INPUT_PROPS}
                >
                    To proceed, type “DELETE” in the input field below.
                </Input>
                <Button
                    type={'submit'}
                    disabled={!isAllowedToDelete}
                    icon={isAllowedToDelete ? 'warn' : 'lock'}
                    className={`mt-[min(2.7dvw,1.25rem)] text-small h-[min(5.9dvw,2.1rem)] rounded-full font-bold place-self-center w-full
                                ${isAllowedToDelete ? 'bg-control-red' : 'text-secondary'}`}
                    onClick={() => userCtx.removeSession()}
                >
                    {isAllowedToDelete ? 'Permanently Delete My Account' : 'Locked'}
                </Button>
            </form>
        )
    }

    const renderDeleteBlock = () => {
        const isAllowedToDelete = Date.now() - userData.lastLogin < 300_000; // 5 mins

        return (!isAllowedToDelete
                ? (
                    <div className={'flex flex-col place-items-center'}>
                        <span className={'inline-block w-[80%] text-note text-center mt-[min(4dvw,1.88rem)]'}>
                            You may only delete your account if you have logged in within the last 5 minutes. Please login again,
                            then return here to continue.
                        </span>
                        <Button
                            className={`bg-control-white mt-[min(2.7dvw,1.25rem)] px-[min(3dvw,1rem)] text-small
                                        h-[min(4.3dvw,1.45rem)] rounded-full font-bold text-gray`}
                            onClick={() => userCtx.removeSession()}
                        >
                            Restore Login
                        </Button>
                    </div>
                )
                : renderDeleteForm()
        );
    }


    // Elements
    const ListItems: ReactElement[] = LIST.map((item, idx) => (
        <li key={item.slice(5) + idx}>{item}</li>
    ))

    return (
        <BaseModal title={'Delete Account Confirmation'} className={'w-[min(90dvw,34rem)] leading-[120%]'}>
            <ul className={'list-disc pl-[min(3dvw,1rem)] flex flex-col gap-y-[min(2.7dvw,1.88rem)] text-[min(2.6dvw,1rem)]'}>{ListItems}</ul>
            {renderDeleteBlock()}
        </BaseModal>
    );
}

export {DeleteAccountConfirmModal}