import React, {FC, FormEvent, ReactElement} from "react";

import {BaseModal} from "@/app/components/modals";
import {Button, Input} from "@/app/components/form";

import {UserData, useUser} from "@/app/context";
import {useForm} from "@/app/hooks/useForm";


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
        const isAllowedToDelete = formData.confirm === 'DELETE' && formData.email;
        return (
            <form onSubmit={handleAccountDelete}>
                <Input
                    value={formData.email}
                    onChange={setFormValue('email')}
                    classNameWrapper={'flex-col [&]:items-start gap-[0.63rem] mt-[1.9rem]'}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                    classNameLabel={'font-bold'}
                    required
                >
                    Please type your account email.
                </Input>
                <Input
                    value={formData.confirm}
                    onChange={setFormValue('confirm')}
                    classNameWrapper={'flex-col [&]:items-start gap-[0.63rem] mt-[0.96rem]'}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                    classNameLabel={'font-bold'}
                    required
                >
                    To proceed, type “DELETE” in the input field below.
                </Input>
                <Button
                    type={'submit'}
                    disabled={!isAllowedToDelete}
                    icon={isAllowedToDelete ? 'warn' : 'lock'}
                    className={`mt-[1.25rem] text-[0.875rem] h-[2.0625rem] rounded-full font-bold place-self-center w-full
                                ${isAllowedToDelete ? 'bg-[#F42200] text-primary' : 'text-secondary'}`}
                    onClick={() => userCtx.logOut()}
                >
                    {isAllowedToDelete ? 'Permanently Delete My Account' : 'Locked'}
                </Button>
            </form>
        )
    }

    const renderDeleteBlock = () => {
        const isAllowedToDelete = userData.lastLogin - Date.now()

        return (!isAllowedToDelete
                ? (
                    <div className={'flex flex-col place-items-center'}>
                        <span className={'inline-block w-[26.69rem] text-[0.75rem] text-center mt-[1.88rem]'}>
                            You may only delete your account if you have logged in within the last 5 minutes. Please login again,
                            then return here to continue.
                        </span>
                        <Button
                            className={`bg-control2 mt-[1.25rem] px-[1rem] text-[0.875rem] h-[1.44rem] rounded-full font-bold
                                text-form bg-white max-w-[7.88rem]`}
                            onClick={() => userCtx.logOut()}
                        >
                            Restore Login
                        </Button>
                    </div>
                )
                : renderDeleteForm()
        )
    }


    // Elements
    const ListItems: ReactElement[] = LIST.map((item, index) => (
        <li key={item.slice(5) + index}>{item}</li>
    ))

    return (
        <BaseModal title={'Delete Account Confirmation'} className={'w-[34.06rem] leading-[120%]'}>
            <ul className={'list-disc pl-[1rem] flex flex-col gap-y-[1.88rem]'}>{ListItems}</ul>
            {renderDeleteBlock()}
        </BaseModal>
    );
}

export {DeleteAccountConfirmModal}