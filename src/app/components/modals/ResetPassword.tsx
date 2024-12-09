import React, {FC, FormEvent, ReactElement, useState} from "react";
import axios from "axios";
import Image from "next/image";

import {SignUpData} from "@/app/services/auth.service";

import {useModal} from "@/app/context";
import {useForm} from "@/app/hooks/useForm";

import {BaseModal} from "@/app/components/modals";

import {Button, Input} from "@/app/components/form";

import SVG_INSIGNIA from '@/assets/images/insignia-logo.png'
import SVG_EYE from '@/assets/images/icons/eye.svg'


type FormData = Pick<SignUpData, 'email' | 'password' | 'passwordConfirm'>;

const FORM_DEFAULT: FormData = {email: '', password: '', passwordConfirm: ''};

interface Props {
    isEmailAction: boolean;
}

const ResetPasswordModal: FC<Props> = (props: Props): ReactElement => {
    const {isEmailAction} = props;

    const modalCtx = useModal();

    const [warningMsg, setWarningMsg] = useState<string | null>(null);

    const [formValue, setFormValue] = useForm<FormData>(FORM_DEFAULT);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const EmailSentModal: FC = () => (
            <BaseModal
                title={'Email Sent'}
                className={'w-[30.3125rem] border-control4 border-small text-center'}
            >
                <Image src={SVG_INSIGNIA} alt={'insignia'}
                       className={'mb-[1.25rem] w-[10.42rem] h-[9rem] place-self-center'}/>
                <span>To reset your password, please click the link provided in the email sent to your registered email address.</span>
            </BaseModal>
        );

        try {
            // TODO
            if (isEmailAction) {

                modalCtx.openModal(<EmailSentModal/>);
            } else if (formValue.password !== formValue.passwordConfirm)
                setWarningMsg("Passwords don't match");
            else
                modalCtx.closeModal();
        } catch (error: unknown) {
            let message: string = 'Unknown error';
            if (axios.isAxiosError(error))
                message = error.cause?.message ?? message;
            else if (typeof error === 'string')
                message = error;
            modalCtx.openModal(<BaseModal isSimple className={'place-self-center mx-auto'}>{message}</BaseModal>);
        }
    }

    const Controls = isEmailAction
        ? (
            <Input
                name={'email'}
                placeholder={'Email'}
                value={formValue.email}
                onChange={setFormValue('email')}
                classNameWrapper={'flex-col [&]:items-start'}
                className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                required
            />
        )
        : (
            <>

                <Input
                    type={"password"}
                    name={'password'}
                    placeholder={'Password'}
                    value={formValue.password}
                    onChange={setFormValue('password')}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                    required
                />
                <Input
                    type={"password"}
                    name={'password-repeat'}
                    placeholder={'Confirm Password'}
                    value={formValue.passwordConfirm}
                    onChange={setFormValue('passwordConfirm')}
                    className={'h-[1.875rem] w-full px-[0.73rem] bg-control2 border-small b-control4 placeholder:text-primary rounded-[0.375rem]'}
                    icons={[SVG_EYE]}
                    required={!isEmailAction}
                />
            </>
        );

    return (
        <BaseModal
            isSimple
            className={`place-self-center mx-auto relative [&]:bg-control border-small border-control`}
            classNameContent={'py-[1.5rem] pl-[1.7rem] pr-0'}
        >
            <div className={'flex flex-col items-center w-[26.18rem]'}>
                <Image src={SVG_INSIGNIA} alt={'insignia'} className={'my-[1.25rem] w-[10.42rem] h-[9rem]'}/>
                <span className={'mb-[1.88rem] font-oxygen text-[1.6875rem]'}>Tern</span>
            </div>
            <form
                className={'flex flex-col'}
                onSubmit={handleFormSubmit}
            >
                <fieldset className={'flex flex-col gap-[0.94rem]'}>
                    <legend className={'mb-[0.63rem]'}>
                        Please {isEmailAction ? 'enter email to reset your password' : 'create your new password'}
                    </legend>
                    {Controls}
                </fieldset>
                {warningMsg && <span className={'my-[0.63rem] text-center'}>{warningMsg}</span>}
                <Button className={`py-[0.92rem] mt-[1.56rem] text-[1.125rem] font-bold rounded-full
                                    w-[18.93rem] place-self-center bg-white text-form`}>
                    Reset Password
                </Button>
            </form>
        </BaseModal>
    )
}


export {ResetPasswordModal}