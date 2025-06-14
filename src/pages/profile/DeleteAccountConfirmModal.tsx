'use client';

import { FC, FormEvent, ReactElement } from 'react';

import { UserData } from '@/app/contexts/user.context';

import { useForm, useModal, useUser } from '@/app/hooks';

import { AuthService } from '@/app/services';

import { BaseModal, MessageModal } from '@/app/ui/modals';
import { Button, Input } from '@/app/ui/form';

import { faLock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const LIST: string[] = [
    'Account deletion is permanent and cannot be reversed.',
    'Once deleted, access to all Tern products and services, including Tidal, TernKit, and any future offerings, will be permanently revoked.',
    'You will not be able to register a new account using the same email address associated with the deleted account.',
    'Your data will be erased within 30 days, except for a limited subset that may be retained as required or permitted by law.',
];

type FormData = {
    email: string;
    password: string;
    confirm: string;
};

const FORM_DEFAULT: FormData = {
    confirm: '',
    password: '',
    email: '',
};

const INPUT_PROPS = {
    wrapper: 'flex-col [&]:items-start gap-4xs mt-xxs',
    className: 'h-[min(5.9dvw,1.875rem)] w-full px-3xs bg-gray-l0 border-s b-control4 rounded-xs',
    label: 'font-bold',
    required: true,
};

interface Props {
    userData: UserData;
}

const DeleteAccountConfirmModal: FC<Props> = (props: Props) => {
    const { userData } = props;

    const userCtx = useUser();
    const modalCtx = useModal();
    const [formData, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleAccountDelete = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const { message } = await AuthService.postDeleteAccount(formData.email, formData.confirm);
            modalCtx.openModal(<MessageModal>{message}</MessageModal>);
            userCtx.removeSession();
        } catch (error: unknown) {
            if (typeof error === 'string') modalCtx.openModal(<MessageModal>{error}</MessageModal>);
        }
    };

    const handleRemoveSession = () => userCtx.removeSession();

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
                    type='password'
                    value={formData.password}
                    onChange={setFormValue('password')}
                    wrapper={'flex-col [&]:items-start gap-4xs mt-n'}
                    className={'h-button-l w-full rounded-xs border-s bg-gray-l0 px-3xs'}
                    label={'font-bold'}
                    required
                >
                    Please type your account password.
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
                    icon={isAllowedToDelete ? faTriangleExclamation : faLock}
                    className={`mt-xs h-[min(5.9dvw,2.1rem)] w-full place-self-center rounded-full text-20 font-bold ${isAllowedToDelete ? 'bg-red' : 'text-secondary'}`}
                >
                    {isAllowedToDelete ? 'Permanently Delete My Account' : 'Locked'}
                </Button>
            </form>
        );
    };

    const renderDeleteBlock = () => {
        const isAllowedToDelete = Date.now() - userData.lastLogin < 300_000; // 5 mins

        return !isAllowedToDelete ? (
            <div className={'flex flex-col place-items-center'}>
                <span className={'mt-[min(4dvw,--p-n)] inline-block w-[80%] text-center text-16'}>
                    You may only delete your account if you have logged in within the last 5 minutes. Please login
                    again, then return here to continue.
                </span>
                <Button
                    className={`h-button-n mt-xs rounded-full bg-white px-[min(3dvw,1rem)] text-20 font-bold text-gray`}
                    onClick={handleRemoveSession}
                >
                    Restore Login
                </Button>
            </div>
        ) : (
            renderDeleteForm()
        );
    };

    // Elements
    const ListItems: ReactElement[] = LIST.map((item, idx) => <li key={item.slice(5) + idx}>{item}</li>);

    return (
        <BaseModal
            title={'Delete Account Confirmation'}
            className={'w-[min(90dvw,34rem)] leading-[120%]'}
        >
            <ul className={'flex list-disc flex-col gap-y-[min(2.7dvw,--p-n)] pl-[min(3dvw,1rem)]'}>{ListItems}</ul>
            {renderDeleteBlock()}
        </BaseModal>
    );
};

export { DeleteAccountConfirmModal };
